async function sendMessage() {

  const input = document.getElementById("message");
  const chat = document.getElementById("chat");

  const text = input.value.trim();

  if (!text) return;

  chat.innerHTML += `
    <div class="message user">
      ${text}
    </div>
  `;

  input.value = "";

  try {

    const res = await fetch("https://engine.syleri.com/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: text
      })
    });

    const data = await res.json();

    chat.innerHTML += `
      <div class="message bot">
        ${data.reply || "No response"}
      </div>
    `;

  } catch (err) {

    chat.innerHTML += `
      <div class="message bot">
        Engine connection error
      </div>
    `;

  }

  chat.scrollTop = chat.scrollHeight;
}
