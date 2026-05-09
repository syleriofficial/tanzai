export const runtime = "nodejs";

export async function POST(req) {
  try {
    const { messages = [] } = await req.json();
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return Response.json({
        reply: "Syleri Engine demo mode is active. Add OPENROUTER_API_KEY in Cloud Run environment variables to enable live AI responses."
      });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://tanzaiai.com",
        "X-Title": "Tanzai AI"
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || "deepseek/deepseek-chat-v3-0324:free",
        messages: [
          {
            role: "system",
            content: "You are Tanzai AI, an AI assistant powered by Syleri Engine and built by Syleri. Be helpful, clear, concise, and friendly."
          },
          ...messages.map((m) => ({
            role: m.role === "assistant" ? "assistant" : "user",
            content: String(m.content || "")
          }))
        ]
      })
    });

    if (!response.ok) {
      const text = await response.text();
      return Response.json({
        reply: "Syleri Engine could not connect to the AI model. Check OPENROUTER_API_KEY/model/logs. Error: " + text.slice(0, 250)
      });
    }

    const data = await response.json();
    return Response.json({
      reply: data?.choices?.[0]?.message?.content || "Syleri Engine returned an empty response."
    });
  } catch (error) {
    return Response.json({ reply: "Syleri Engine error: " + error.message });
  }
}
