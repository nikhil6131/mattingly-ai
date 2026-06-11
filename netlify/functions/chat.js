exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  try {
    const { messages } = JSON.parse(event.body);

    const SYSTEM_PROMPT = `You are an expert warehouse analytics AI assistant for Mattingly Hackathon 2026.
Total Revenue: $7,216,893.77. Net Profit: $4,646,881.27. Net Margin: 64.39%.
Critical customers: Bravo FMCG (17.28%), Charlie Medical (28.37%), Delta Manufacturing (27.84%).
Star customers: Echo Imports (84.57%), Alpha Retail (79.27%).
At Risk Revenue: $417,935. Cost Leakage: $1.34M. Total Orders: 3,055,341.
Be concise, cite exact numbers, give actionable insights.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: messages
      })
    });

    const data = await response.json();
    const reply = data.content?.[0]?.text || 'No response received.';

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ reply })
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message })
    };
  }
};
