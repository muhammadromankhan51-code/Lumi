'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { Send, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hello! I'm Lumi, your AI Digital Pharmacist. I'm here to help you with your medications, answer health questions, and provide medication reminders. How can I help you today?",
      timestamp: new Date(),
    },
  ])

  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Mock API call - replace with actual API when Gemini is connected
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: `Thank you for your message: "${userMessage.content}". This is a demo response. When connected to Gemini API, I'll provide AI-powered responses about your medications and health.`,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, assistantMessage])
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      console.error('[v0] Chat error:', error)
      setIsLoading(false)
    }
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-56">
        <Header />
        <main className="mt-16 p-8 bg-background min-h-[calc(100vh-64px)] flex flex-col">
          <div className="max-w-4xl mx-auto w-full flex flex-col h-full">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">AI Chat Assistant</h1>
              <p className="text-muted-foreground mb-8">Chat with Lumi about your medications and health</p>
            </div>

            {/* Chat Container */}
            <div className="bg-white rounded-xl border border-border flex-1 flex flex-col mb-6">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-md px-4 py-3 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-primary text-primary-foreground rounded-br-none'
                          : 'bg-muted text-foreground rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted text-foreground px-4 py-3 rounded-lg rounded-bl-none">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 bg-foreground rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-foreground rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-foreground rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-border p-6">
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Ask me about your medications..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        handleSendMessage()
                      }
                    }}
                    disabled={isLoading}
                    className="flex-1 border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground bg-background disabled:opacity-50"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || !input.trim()}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Tip:</span> You can ask me about medication interactions,
                side effects, dosages, and general health questions!
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
