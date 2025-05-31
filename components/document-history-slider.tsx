"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { X, FileText, Calendar, MessageSquare, Clock, Search, Filter, Download, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

interface DocumentHistoryItem {
  id: string
  name: string
  uploadDate: string
  lastAccessed: string
  size: string
  type: "pdf" | "docx" | "txt"
  status: "processed" | "processing" | "error"
  chatCount: number
  summary: string
  tags: string[]
}

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

interface DocumentHistorySliderProps {
  isOpen: boolean
  onClose: () => void
  onDocumentSelect: (documentId: string) => void
  activeDocumentId?: string | null
}

export default function DocumentHistorySlider({
  isOpen,
  onClose,
  onDocumentSelect,
  activeDocumentId,
}: DocumentHistorySliderProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDocument, setSelectedDocument] = useState<DocumentHistoryItem | null>(null)
  const [showChatHistory, setShowChatHistory] = useState(false)
  const { toast } = useToast()

  // Mock document history data
  const [documents] = useState<DocumentHistoryItem[]>([
    {
      id: "doc1",
      name: "Rental Agreement - Main St.pdf",
      uploadDate: "2024-01-15",
      lastAccessed: "2024-01-20",
      size: "2.4 MB",
      type: "pdf",
      status: "processed",
      chatCount: 12,
      summary: "Residential rental agreement with standard terms, security deposit requirements, and pet restrictions.",
      tags: ["rental", "residential", "lease"],
    },
    {
      id: "doc2",
      name: "Employment Contract - TechCorp.docx",
      uploadDate: "2024-01-10",
      lastAccessed: "2024-01-18",
      size: "1.8 MB",
      type: "docx",
      status: "processed",
      chatCount: 8,
      summary:
        "Software engineer employment contract with competitive salary, benefits, and intellectual property clauses.",
      tags: ["employment", "tech", "contract"],
    },
    {
      id: "doc3",
      name: "Terms of Service - Platform.pdf",
      uploadDate: "2024-01-05",
      lastAccessed: "2024-01-15",
      size: "3.2 MB",
      type: "pdf",
      status: "processed",
      chatCount: 15,
      summary:
        "Comprehensive terms of service for digital platform with user rights, data privacy, and liability limitations.",
      tags: ["terms", "service", "platform"],
    },
    {
      id: "doc4",
      name: "NDA - Consulting Project.pdf",
      uploadDate: "2024-01-02",
      lastAccessed: "2024-01-12",
      size: "1.1 MB",
      type: "pdf",
      status: "processing",
      chatCount: 5,
      summary: "Non-disclosure agreement for consulting engagement with confidentiality and non-compete provisions.",
      tags: ["nda", "consulting", "confidential"],
    },
  ])

  // Mock chat history data
  const mockChatHistory: ChatMessage[] = [
    {
      id: "1",
      role: "user",
      content: "What are the key terms of this rental agreement?",
      timestamp: "2024-01-20 10:30",
    },
    {
      id: "2",
      role: "assistant",
      content:
        "The key terms include: 12-month lease starting April 1, 2024, monthly rent of $1,500, security deposit of $1,500, and strict no-pet policy with penalties for violations.",
      timestamp: "2024-01-20 10:31",
    },
    {
      id: "3",
      role: "user",
      content: "What happens if I need to terminate early?",
      timestamp: "2024-01-20 10:35",
    },
    {
      id: "4",
      role: "assistant",
      content:
        "Early termination requires 30 days written notice and results in forfeiture of your security deposit plus an additional $500 early termination fee.",
      timestamp: "2024-01-20 10:36",
    },
  ]

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return "📄"
      case "docx":
        return "📝"
      case "txt":
        return "📋"
      default:
        return "📄"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "processing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
    }
  }

  const handleDocumentClick = (doc: DocumentHistoryItem) => {
    if (doc.status === "processed") {
      onDocumentSelect(doc.id)
      setSelectedDocument(doc)
      toast({
        title: "Document loaded",
        description: `${doc.name} is now active in the preview.`,
      })
    }
  }

  const handleViewChatHistory = (doc: DocumentHistoryItem) => {
    setSelectedDocument(doc)
    setShowChatHistory(true)
  }

  const handleDeleteDocument = (doc: DocumentHistoryItem) => {
    toast({
      title: "Document deleted",
      description: `${doc.name} has been removed from your history.`,
      variant: "destructive",
    })
  }

  const handleDownloadDocument = (doc: DocumentHistoryItem) => {
    toast({
      title: "Download started",
      description: `Downloading ${doc.name}...`,
    })
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
      setShowChatHistory(false)
      setSelectedDocument(null)
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 backdrop-overlay z-40" onClick={onClose} />

      {/* Slider */}
      <div
        className={`fixed right-0 top-0 h-full w-96 bg-white dark:bg-card border-l border-gray-200 dark:border-gray-800 z-50 shadow-2xl ${isOpen ? "slide-in-right" : "slide-out-right"}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-navy to-bronze dark:from-bronze dark:to-amber-500 rounded-lg flex items-center justify-center">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-serif font-semibold text-gray-900 dark:text-gray-100">Document History</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">{documents.length} documents</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-9 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="h-7 px-3">
                <Filter className="h-3 w-3 mr-1" />
                All
              </Button>
              <Button variant="outline" size="sm" className="h-7 px-3">
                Recent
              </Button>
            </div>
          </div>

          {/* Document List or Chat History */}
          <div className="flex-1 overflow-hidden">
            {showChatHistory && selectedDocument ? (
              <div className="h-full flex flex-col">
                {/* Chat History Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">Chat History</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{selectedDocument.name}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setShowChatHistory(false)} className="h-8 px-3">
                      Back
                    </Button>
                  </div>
                </div>

                {/* Chat Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {mockChatHistory.map((message) => (
                      <div key={message.id} className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback
                              className={`text-xs ${
                                message.role === "user" ? "bg-navy text-white" : "bg-bronze text-white"
                              }`}
                            >
                              {message.role === "user" ? "U" : "AI"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{message.timestamp}</span>
                        </div>
                        <div
                          className={`p-3 rounded-lg text-sm ${
                            message.role === "user"
                              ? "bg-navy text-white ml-8"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                          }`}
                        >
                          {message.content}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            ) : (
              <ScrollArea className="h-full">
                <div className="p-4 space-y-3">
                  {filteredDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer hover:shadow-md ${
                        activeDocumentId === doc.id
                          ? "border-bronze bg-bronze/5 dark:bg-bronze/10"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      } ${doc.status !== "processed" ? "opacity-60" : ""}`}
                      onClick={() => handleDocumentClick(doc)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start space-x-3 flex-1 min-w-0">
                          <div className="text-2xl">{getFileIcon(doc.type)}</div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                              {doc.name}
                            </h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className={`text-xs ${getStatusColor(doc.status)}`}>
                                {doc.status}
                              </Badge>
                              <span className="text-xs text-gray-500 dark:text-gray-400">{doc.size}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{doc.summary}</p>

                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="h-3 w-3" />
                          <span>{doc.chatCount} chats</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {doc.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs px-2 py-0">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <Separator className="my-3" />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="h-3 w-3" />
                          <span>Last: {new Date(doc.lastAccessed).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleViewChatHistory(doc)
                            }}
                            disabled={doc.chatCount === 0}
                          >
                            <MessageSquare className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDownloadDocument(doc)
                            }}
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-red-500 hover:text-red-600"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteDocument(doc)
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredDocuments.length === 0 && (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No documents found</h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        {searchQuery
                          ? "Try adjusting your search terms."
                          : "Upload your first document to get started."}
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
