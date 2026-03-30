const ANTHROPIC_KEY = process.env.REACT_APP_ANTHROPIC_KEY;

export async function generateComms(incident) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_KEY,
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
  return data.content[0].text;
}

export async function chatWithRunbook(incident, messages) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_KEY,
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

Active Incident Context:
- Title: ${incident.title}
- Severity: ${incident.severity}
- Affected System: ${incident.system || 'Unspecified'}
- Description: ${incident.description}`,
      messages: messages
    })
  });

  const data = await response.json();
  return data.content[0].text;
}