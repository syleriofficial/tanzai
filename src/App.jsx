import { useState } from 'react'

const ENGINE_URL = 'https://engine.syleri.com/api/chat'

export default function App() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Welcome to Tanzai AI Global Workspace 🚀\nPowered by Syleri Engine.'
    }
  ])
  const [loading, setLoading] = useState(false)

  async function sendMessage() {
    const text = message.trim()
    if (!text || loading) return

    const userMessage = { role: 'user', content: text }
    const nextMessages = [...messages, userMessage]

    setMessages(nextMessages)
    setMessage('')
    setLoading(true)

    try {
      const response = await fetch(ENGINE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          messages: nextMessages.map(m => ({
            role: m.role === 'assistant' ? 'assistant' : 'user',
            content: m.content
          }))
        })
      })

      const data = await response.json()

      setMessages([
        ...nextMessages,
        {
          role: 'assistant',
          content: data.reply || 'No response from Syleri Engine.'
        }
      ])
    } catch (error) {
      setMessages([
        ...nextMessages,
        {
          role: 'assistant',
          content: 'Tanzai AI could not connect to Syleri Engine.'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <h1>Tanzai AI</h1>
        <p>Powered by Syleri Engine</p>

        <button className="newChat" onClick={() => setMessages([])}>
          + New Chat
        </button>

        <div className="sideItem">Startup Strategy</div>
        <div className="sideItem">Research Mode</div>
        <div className="sideItem">Global Workspace</div>
        <div className="sideItem">Syleri API</div>

        <div className="brandBox">
          Company: Syleri<br />
          Engine: Syleri Engine<br />
          Product: Tanzai AI<br />
          Platform: Syleri API
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <span>⚡ Syleri Engine Active</span>
          <span>🧠 Think Mode</span>
          <span>🌍 Global Workspace</span>
          <div className="avatar">S</div>
        </header>

        <section className="messages">
          {messages.map((msg, index) => (
            <div key={index} className={msg.role === 'user' ? 'userMsg' : 'aiMsg'}>
              {msg.role !== 'user' && (
                <div className="aiHeader">
                  <div className="logo">T</div>
                  <div>
                    <strong>Tanzai AI</strong>
                    <p>Powered by Syleri Engine</p>
                  </div>
                </div>
              )}
              <div className="text">{msg.content}</div>
            </div>
          ))}

          {loading && <div className="aiMsg">Syleri Engine is thinking...</div>}
        </section>

        <div className="composer">
          <button>+</button>
          <input
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') sendMessage() }}
            placeholder="Message Tanzai AI..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </main>
    </div>
  )
}
