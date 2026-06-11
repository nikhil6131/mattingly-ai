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

    const SYSTEM_PROMPT = `You are Mattingly AI warehouse analytics assistant for Hackathon 2026.
Total Revenue: $7,216,893.77. Net Profit: $4,646,881.27. Net Margin: 64.39%.
Critical customers: Bravo FMCG (17.28%), Charlie Medical (28.37%), Delta Manufacturing (27.84%).
Star customers: Echo Imports (84.57%), Alpha Retail (79.27%).
At Risk Revenue: $417,935. Cost Leakage: $1.34M. Total Orders: 3,055,341.
Labour Hours: Dispatch 14068, Pick 12157, Receipt 5238, Rework 4635, Returns 4606.
Be concise, cite exact numbers, give actionable insights.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        max_tokens: 1000,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages
        ]
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'No response received.';

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
