'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { Send, ImagePlus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useMedications } from '@/context/medications-context'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  image?: string
}

export default function ChatPage() {
  const { medicines } = useMedications()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hello! I'm Lumi, your AI Digital Pharmacist. I'm here to help you with your medications, answer health questions, and provide medication guidance. You can also upload prescription images for analysis. How can I help you today?",
      timestamp: new Date(),
    },
  ])

  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImageFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSendMessage = async () => {
    if (!input.trim() && !selectedImage) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input || (selectedImage ? 'Analyze this prescription image' : ''),
      timestamp: new Date(),
      image: selectedImage || undefined,
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = input
    const currentImage = selectedImage
    const currentImageFile = imageFile
    setInput('')
    setSelectedImage(null)
    setImageFile(null)
    setIsLoading(true)

    try {
      // If there's an image, analyze it via OCR endpoint
      if (currentImage && currentImageFile) {
        const formData = new FormData()
        formData.append('file', currentImageFile)

        const ocrResponse = await fetch('/api/ocr/analyze', {
          method: 'POST',
          body: formData,
        })

        if (ocrResponse.ok) {
          const ocrData = await ocrResponse.json()
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            type: 'assistant',
            content: ocrData.analysis || `**Extracted Text:**\n${ocrData.rawText}\n\n*AI analysis is being processed...*`,
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, assistantMessage])
        } else {
          throw new Error('Failed to analyze image')
        }
      } else {
        // Text-only chat with Gemini
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            message: currentInput,
            medicines: medicines.map(m => ({ name: m.name, dosage: m.dosage, purpose: m.purpose }))
          }),
        })

        if (response.ok) {
          const data = await response.json()
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            type: 'assistant',
            content: data.response,
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, assistantMessage])
        } else {
          throw new Error('Failed to get response')
        }
      }
    } catch (error) {
      console.error('[v0] Chat error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "I apologize, but I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
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
                      {message.image && (
                        <img 
                          src={message.image} 
                          alt="Uploaded prescription" 
                          className="max-w-full rounded-lg mb-2"
                        />
                      )}
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
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

              {/* Image Preview */}
              {selectedImage && (
                <div className="px-6 py-3 border-t border-border">
                  <div className="relative inline-block">
                    <img 
                      src={selectedImage} 
                      alt="Selected prescription" 
                      className="h-20 rounded-lg border border-border"
                    />
                    <button
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="border-t border-border p-6">
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    className="flex-shrink-0"
                  >
                    <ImagePlus className="w-4 h-4" />
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
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
                    disabled={isLoading || (!input.trim() && !selectedImage)}
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
                side effects, dosages, and general health questions. Upload prescription images for AI-powered analysis!
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
