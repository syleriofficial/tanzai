import { useState } from 'react'

export default function App() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])

  const sendMessage = async () => {
    if (!message) return

    const userMessage = {
      role: 'user',
      content: message
    }

    setMessages(prev => [...prev, userMessage])

    const response = await fetch(
      'https://engine.syleri.com/api/chat',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message
        })
      }
    )

    const data = await response.json()

    setMessages(prev => [
      ...prev,
      {
        role: 'assistant',
        content: data.reply
      }
    ])

    setMessage('')
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <h1>Tanzai AI</h1>
      </aside>

      <main className="chat-area">
        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className="msg">
              {msg.content}
            </div>
          ))}
        </div>

        <div className="input-box">
          <input
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Message Tanzai AI"
          />

          <button onClick={sendMessage}>
            Send
          </button>
        </div>
      </main>
    </div>
  )
}
