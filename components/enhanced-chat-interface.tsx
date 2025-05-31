"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, Download, CheckCircle, AlertCircle, Clock, FileText } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

interface EnhancedChatInterfaceProps {
  documentId: string | null
  highlightedElement?: string | null
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  relatedElement?: string
}

const suggestedQuestions = [
  "What are my obligations in this contract?",
  "Are there hidden penalties?",
  "What is the termination rule here?",
  "Is this legally enforceable?",
  "What happens if I break this agreement?",
]

export default function EnhancedChatInterface({ documentId, highlightedElement }: EnhancedChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm Civitas AI, your legal assistant. I can help you understand this document in plain language. Ask me anything!",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [activeTab, setActiveTab] = useState("summary")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Mock document data
  const documentData = {
    doc1: "This is a rental agreement between landlord and tenant...",
    doc2: "This employment contract outlines the terms of employment...",
    doc3: "These terms of service govern the use of our platform...",
    "new-doc": "This is the content of your newly uploaded document...",
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (highlightedElement) {
      // Simulate AI response for highlighted element
      handleElementClick(highlightedElement)
    }
  }, [highlightedElement])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleElementClick = async (elementId: string) => {
    const elementQuestions: Record<string, string> = {
      date1: "What is the significance of the March 15, 2024 date?",
      date2: "When does the lease start?",
      date3: "When does the lease end?",
      party1: "Who is the landlord in this agreement?",
      party2: "Who is the tenant in this agreement?",
      penalty1: "What is the late payment fee?",
      penalty2: "What happens if I terminate early?",
      penalty3: "What are the pet-related penalties?",
    }

    const question = elementQuestions[elementId]
    if (question) {
      await handleSendMessage(question, elementId)
    }
  }

  const handleSendMessage = async (messageText?: string, relatedElement?: string) => {
    const text = messageText || input
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
      relatedElement,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const docContent = documentId ? (documentData as any)[documentId] || "" : ""

      const { text: aiResponse } = await generateText({
        model: openai("gpt-4o"),
        prompt: text,
        system: `You are Civitas AI, a legal assistant that explains legal documents in plain language. 
                Here is the document content: ${docContent}
                Provide clear, concise explanations. Use analogies when helpful. Be conversational but professional.`,
      })

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
        relatedElement,
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate response. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    handleSendMessage(question)
  }

  const handleExportPDF = () => {
    toast({
      title: "PDF Export Started",
      description: "Your legal checklist is being prepared for download.",
    })
    // Simulate PDF generation
    setTimeout(() => {
      toast({
        title: "PDF Ready",
        description: "Your legal checklist has been downloaded.",
      })
    }, 2000)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Suggested Questions */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quick Questions:</h3>
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((question, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="text-xs h-8 hover:bg-navy hover:text-white transition-colors"
              onClick={() => handleSuggestedQuestion(question)}
            >
              {question}
            </Button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto mb-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <Avatar className={`h-8 w-8 ${message.role === "user" ? "ml-2" : "mr-2"}`}>
                  {message.role === "assistant" ? (
                    <>
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Civitas AI" />
                      <AvatarFallback className="bg-bronze text-white">CA</AvatarFallback>
                    </>
                  ) : (
                    <>
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                      <AvatarFallback className="bg-navy text-white">U</AvatarFallback>
                    </>
                  )}
                </Avatar>
                <div
                  className={`rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-navy text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  <div className="mt-1 text-xs opacity-70 flex items-center gap-2">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {message.relatedElement && (
                      <Badge variant="secondary" className="text-xs">
                        Related to document element
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarFallback className="bg-bronze text-white">CA</AvatarFallback>
                </Avatar>
                <div className="rounded-lg p-3 bg-gray-100 dark:bg-gray-800">
                  <div className="flex space-x-2">
                    <div
                      className="h-2 w-2 rounded-full bg-bronze animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="h-2 w-2 rounded-full bg-bronze animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                    <div
                      className="h-2 w-2 rounded-full bg-bronze animate-bounce"
                      style={{ animationDelay: "600ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Chat Input */}
      <div className="border-t pt-4">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSendMessage()
          }}
          className="flex space-x-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about this document..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="bg-navy hover:bg-navy/90">
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>

      {/* Analysis Tabs */}
      <div className="mt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="summary">Plain Summary</TabsTrigger>
            <TabsTrigger value="visual">Visual Guide</TabsTrigger>
            <TabsTrigger value="checklist">Legal Checklist</TabsTrigger>
          </TabsList>

          <TabsContent value="summary">
            <Card>
              <CardContent className="p-4">
                <h4 className="font-serif font-medium mb-3">Document Summary</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  This is a standard residential rental agreement between John Smith (landlord) and Jane Doe (tenant).
                  The lease runs for 12 months starting April 1, 2024, with monthly rent of $1,500. Key points include a
                  $50 late fee, $1,500 security deposit, and strict no-pet policy with penalties for violations.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="visual">
            <Card>
              <CardContent className="p-4">
                <h4 className="font-serif font-medium mb-3">Responsibility Flowchart</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Sign Lease & Pay Deposits</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Security deposit: $1,500</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Monthly Rent Payment</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">$1,500 due by 1st of each month</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Maintain Property</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Handle minor repairs under $100</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="checklist">
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-serif font-medium">Legal Action Items</h4>
                  <Button onClick={handleExportPDF} size="sm" className="bg-bronze hover:bg-bronze/90">
                    <Download className="h-4 w-4 mr-2" />
                    Download as PDF
                  </Button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 border rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Review lease terms thoroughly</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Understand all obligations and penalties
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 border rounded-lg">
                    <Clock className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Prepare security deposit</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">$1,500 required before move-in</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 border rounded-lg">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Set up automatic rent payment</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Avoid $50 late fees</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 border rounded-lg">
                    <FileText className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Document property condition</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Take photos before move-in</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
