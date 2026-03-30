function getRelevantChunks(runbookText, incidentText, maxChunks = 5) {
  if (!runbookText) return '';

  // Split runbook into chunks by section
  const chunks = runbookText
    .split(/\n{2,}/)
    .map(c => c.trim())
    .filter(c => c.length > 80);

  // Score each chunk by keyword overlap with incident
  const incidentWords = incidentText.toLowerCase().split(/\W+/).filter(w => w.length > 3);

  const scored = chunks.map(chunk => {
    const chunkLower = chunk.toLowerCase();
    const score = incidentWords.reduce((acc, word) => {
      return acc + (chunkLower.includes(word) ? 1 : 0);
    }, 0);
    return { chunk, score };
  });

  // Return top chunks
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, maxChunks)
    .filter(c => c.score > 0)
    .map(c => c.chunk)
    .join('\n\n');
}

export async function generateComms(incident, apiKey) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: 'claude-opus-4-5',
      max_tokens: 1500,
      messages: [
        {
          role: 'user',
          content: `You are an expert incident communications manager at a large financial services firm.

An incident has been logged with the following details:
- Title: ${incident.title}
- Severity: ${incident.severity}
- Affected System: ${incident.system || 'Unspecified'}
- Description: ${incident.description}

Generate THREE stakeholder communications for this incident. Format your response exactly like this:

## 🛠 Technical Team
[2-3 sentences. Technical detail, current status, what engineers should know and do]

## 👔 Senior Leadership
[2-3 sentences. Business impact focused, no jargon, what decisions may be needed]

## 🌐 External Clients
[2-3 sentences. Professional, calm, no internal details, what they need to know and expect]`
        }
      ]
    })
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return data.content[0].text;
}

export async function chatWithRunbook(incident, messages, apiKey, runbookText = '') {
  const relevantChunks = getRelevantChunks(
    runbookText,
    `${incident.title} ${incident.system} ${incident.description}`
  );

  const runbookContext = relevantChunks
    ? `\n\nRELEVANT RUNBOOK SECTIONS (retrieved for this incident):\n---\n${relevantChunks}\n---\nUse these specific procedures in your guidance where applicable.`
    : '';

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: 'claude-opus-4-5',
      max_tokens: 1000,
      system: `You are an expert incident response engineer at a large financial services firm.
You are guiding a responder through resolving an active incident step by step.
Always be concise, structured, and actionable. Use numbered steps when giving instructions.
Never guess — if you need more information, ask one focused question.
When runbook sections are provided, reference them specifically and cite the step numbers.

Active Incident Context:
- Title: ${incident.title}
- Severity: ${incident.severity}
- Affected System: ${incident.system || 'Unspecified'}
- Description: ${incident.description}${runbookContext}`,
      messages: messages
    })
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return data.content[0].text;
}
export async function generateReport(incident, chatHistory, apiKey) {
  const chatSummary = chatHistory
    .filter(m => m.role === 'assistant')
    .map(m => m.content)
    .join('\n\n');

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: 'claude-opus-4-5',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: `You are a senior incident response engineer writing a formal Post-Incident Review (PIR) for a financial services firm.

Incident Details:
- Title: ${incident.title}
- Severity: ${incident.severity}
- Affected System: ${incident.system || 'Unspecified'}
- Description: ${incident.description}
- Start Time: ${incident.startTime}
- End Time: ${new Date().toLocaleTimeString()}

Response Actions Taken (from runbook assistant chat):
${chatSummary || 'No runbook guidance was recorded.'}

Write a formal Post-Incident Review using exactly this structure:

## 📋 Incident Summary
[2-3 sentences. What happened, what was affected, severity and duration]

## 🔍 Root Cause Analysis
[2-3 sentences. Most likely root cause based on the incident details and response actions]

## 💥 Business Impact
[2-3 sentences. Customer impact, financial exposure, regulatory considerations]

## 🛠 Response Timeline
[Bullet list of key response actions taken, in chronological order, based on the chat history]

## ✅ Action Items
[5 concrete action items to prevent recurrence, each with an owner role e.g. "Platform Engineering", "Vendor Management"]

## 📊 Metrics
- Detection Time: [estimate based on context]
- Response Time: [time from ${incident.startTime} to now]
- Severity: ${incident.severity}
- Systems Affected: ${incident.system || 'Unspecified'}`
        }
      ]
    })
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return data.content[0].text;
}