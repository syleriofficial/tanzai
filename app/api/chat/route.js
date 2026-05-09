export const runtime = 'nodejs';

export async function POST(req) {
  try {
    const { messages = [] } = await req.json();
    const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API;
    if (!apiKey) {
      return Response.json({ error: 'OPENROUTER_API_KEY missing. Cloud Run Variables me API key set karo.' }, { status: 200 });
    }

    const cleanMessages = messages.slice(-12).map(m => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: String(m.content || '').slice(0, 4000)
    }));

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://tanzaiai.com',
        'X-Title': 'Tanzai AI'
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are Tanzai AI, a helpful assistant. Reply clearly in the user language. If user writes Hindi/Hinglish, reply in Hindi/Hinglish.' },
          ...cleanMessages
        ]
      })
    });

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || data?.error?.message || 'AI response nahi mila.';
    return Response.json({ reply });
  } catch (error) {
    return Response.json({ error: 'Chat API error: ' + error.message }, { status: 200 });
  }
}
