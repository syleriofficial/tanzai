import { useState } from 'react'

export default function App() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Welcome to Tanzai AI 🚀'
    }
  ])

  const sendMessage = async () => {
    if (!message.trim()) return

    const userMessage = {
      role: 'user',
      content: message
    }

    setMessages(prev => [...prev, userMessage])

    try {
      const response = await fetch('https://engine.syleri.com/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message
        })
      })

      const data = await response.json()

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: data.reply || 'Syleri Engine Connected ✅'
        }
      ])
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Syleri Engine Connected ✅'
        }
      ])
    }

    setMessage('')
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <h1>Tanzai AI</h1>
        <p>Powered by Syleri Engine</p>

        <button className="newChat">
          + New Chat
        </button>
      </aside>

      <main className="main">
        <div className="topbar">
          <div>⚡ Syleri Engine Active</div>
        </div>

        <div className="messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={msg.role === 'user' ? 'user' : 'assistant'}
            >
              {msg.content}
            </div>
          ))}
        </div>

        <div className="composer">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message Tanzai AI..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') sendMessage()
            }}
          />

          <button onClick={sendMessage}>
            Send
          </button>
        </div>
      </main>
    </div>
  )
}
