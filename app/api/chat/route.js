export async function POST(req) {
  try {
    const body = await req.json();
    const engineUrl = process.env.SYLERI_ENGINE_URL || "https://engine.syleri.com/api/chat";

    const response = await fetch(engineUrl, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ messages: body.messages || [] })
    });

    const data = await response.json();

    return Response.json({
      success: data.success ?? true,
      engine: "Syleri Engine",
      reply: data.reply || "Syleri Engine returned empty response."
    });
  } catch (error) {
    return Response.json({
      success: false,
      engine: "Syleri Engine",
      reply: "Tanzai AI could not connect to Syleri Engine: " + error.message
    });
  }
}
