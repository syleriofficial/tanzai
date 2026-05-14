
async function sendMessage(){

  const input = document.getElementById("message");
  const chat = document.getElementById("chat");

  const text = input.value;

  if(!text) return;

  chat.innerHTML += `
    <div class="message user">
      ${text}
    </div>
  `;

  input.value = "";

  const res = await fetch("https://engine.syleri.com/api/chat", {
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({
      message:text
    })
  });

  const data = await res.json();

  chat.innerHTML += `
    <div class="message bot">
      ${data.reply}
    </div>
  `;
}
