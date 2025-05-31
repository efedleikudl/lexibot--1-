"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/lib/language-context"
import LanguageSelector from "@/components/language-selector"
import {
  Calendar,
  Users,
  AlertTriangle,
  FileText,
  Languages,
  RefreshCw,
  Copy,
  Download,
  Sparkles,
  AlertCircle,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { ReactNode } from "react"

interface LegalElement {
  id: string
  type: "clause" | "date" | "party" | "penalty"
  text: string
  startIndex: number
  endIndex: number
  tooltip: string
}

interface EnhancedDocumentPreviewProps {
  documentId: string | null
  onElementClick: (elementId: string) => void
}

export default function EnhancedDocumentPreview({ documentId, onElementClick }: EnhancedDocumentPreviewProps) {
  const [hoveredElement, setHoveredElement] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("original")
  const [translatedContent, setTranslatedContent] = useState<string>("")
  const [isTranslating, setIsTranslating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [documentContent, setDocumentContent] = useState<string>("")
  const previewRef = useRef<HTMLDivElement>(null)
  const { currentLanguage, translate } = useLanguage()
  const { toast } = useToast()

  // Mock document content with legal elements
  const mockDocumentContent = `RENTAL AGREEMENT

This Rental Agreement ("Agreement") is entered into on March 15, 2024, between John Smith ("Landlord") and Jane Doe ("Tenant") for the property located at 123 Main Street, Anytown, ST 12345.

TERMS AND CONDITIONS

1. LEASE TERM: The lease term shall commence on April 1, 2024, and shall continue for a period of twelve (12) months, ending on March 31, 2025.

2. RENT: Tenant agrees to pay monthly rent of $1,500.00, due on the first day of each month. Late payment fee of $50.00 will be charged for payments received after the 5th day of the month.

3. SECURITY DEPOSIT: Tenant shall pay a security deposit of $1,500.00 prior to occupancy. This deposit will be returned within 30 days of lease termination, less any deductions for damages.

4. TERMINATION: Either party may terminate this agreement with 30 days written notice. Early termination by Tenant will result in forfeiture of security deposit and payment of early termination fee of $500.00.

5. MAINTENANCE: Landlord is responsible for major repairs and maintenance. Tenant is responsible for routine maintenance and minor repairs under $100.00.

6. PETS: No pets are allowed without prior written consent from Landlord. Unauthorized pets will result in immediate lease termination and additional cleaning fee of $300.00.`

  const legalElements: LegalElement[] = [
    {
      id: "date1",
      type: "date",
      text: "March 15, 2024",
      startIndex: 85,
      endIndex: 99,
      tooltip: "Contract execution date",
    },
    {
      id: "party1",
      type: "party",
      text: "John Smith",
      startIndex: 109,
      endIndex: 119,
      tooltip: "Landlord party",
    },
    {
      id: "party2",
      type: "party",
      text: "Jane Doe",
      startIndex: 138,
      endIndex: 146,
      tooltip: "Tenant party",
    },
    {
      id: "date2",
      type: "date",
      text: "April 1, 2024",
      startIndex: 295,
      endIndex: 308,
      tooltip: "Lease commencement date",
    },
    {
      id: "date3",
      type: "date",
      text: "March 31, 2025",
      startIndex: 378,
      endIndex: 392,
      tooltip: "Lease termination date",
    },
    {
      id: "penalty1",
      type: "penalty",
      text: "Late payment fee of $50.00",
      startIndex: 495,
      endIndex: 521,
      tooltip: "Late payment penalty",
    },
    {
      id: "penalty2",
      type: "penalty",
      text: "early termination fee of $500.00",
      startIndex: 890,
      endIndex: 924,
      tooltip: "Early termination penalty",
    },
    {
      id: "penalty3",
      type: "penalty",
      text: "additional cleaning fee of $300.00",
      startIndex: 1350,
      endIndex: 1384,
      tooltip: "Pet violation penalty",
    },
  ]

  // Mock document data mapping
  const documentDataMap: Record<string, string> = {
    doc1: mockDocumentContent,
    doc2: "This employment contract outlines the terms of employment...",
    doc3: "These terms of service govern the use of our platform...",
    "new-doc": "This is the content of your newly uploaded document...",
  }

  // Load document content when documentId changes
  useEffect(() => {
    if (!documentId) {
      setDocumentContent("")
      setIsLoading(false)
      return
    }

    const loadDocument = async () => {
      setIsLoading(true)
      setHasError(false)

      try {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Get document content from our mapping
        const content = documentDataMap[documentId]

        if (!content) {
          throw new Error("Document content not found")
        }

        setDocumentContent(content)
        setIsLoading(false)
      } catch (error) {
        console.error("Error loading document:", error)
        setHasError(true)
        setIsLoading(false)
        toast({
          title: "Error loading document",
          description: "There was a problem loading the document preview. Please try again.",
          variant: "destructive",
        })
      }
    }

    loadDocument()
  }, [documentId, toast])

  // Handle translation when language changes
  useEffect(() => {
    if (currentLanguage.code !== "en" && documentContent && activeTab === "translated") {
      handleTranslateDocument()
    }
  }, [currentLanguage, activeTab, documentContent])

  const handleTranslateDocument = async () => {
    if (currentLanguage.code === "en") {
      setTranslatedContent(documentContent)
      return
    }

    setIsTranslating(true)
    try {
      const sections = documentContent.split("\n\n")
      const translatedSections = await Promise.all(sections.map((section) => translate(section)))
      setTranslatedContent(translatedSections.join("\n\n"))

      toast({
        title: "Translation Complete",
        description: `Document translated to ${currentLanguage.nativeName}`,
      })
    } catch (error) {
      toast({
        title: "Translation Error",
        description: "Failed to translate document. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsTranslating(false)
    }
  }

  const handleRetryLoading = () => {
    if (documentId) {
      setIsLoading(true)
      setHasError(false)

      // Simulate retry with delay
      setTimeout(() => {
        const content = documentDataMap[documentId]
        if (content) {
          setDocumentContent(content)
          setIsLoading(false)
          toast({
            title: "Document loaded successfully",
            description: "The document preview is now available.",
          })
        } else {
          setHasError(true)
          setIsLoading(false)
          toast({
            title: "Error loading document",
            description: "There was a problem loading the document preview. Please try again.",
            variant: "destructive",
          })
        }
      }, 1500)
    }
  }

  const handleCopyText = async () => {
    const textToCopy = activeTab === "translated" ? translatedContent : documentContent
    try {
      await navigator.clipboard.writeText(textToCopy)
      toast({
        title: "Copied to clipboard",
        description: "Document text has been copied to your clipboard.",
      })
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy text to clipboard.",
        variant: "destructive",
      })
    }
  }

  const handleDownloadDocument = () => {
    const textToDownload = activeTab === "translated" ? translatedContent : documentContent
    const blob = new Blob([textToDownload], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `document_${activeTab}_${currentLanguage.code}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Download started",
      description: "Document is being downloaded.",
    })
  }

  const getElementIcon = (type: string) => {
    switch (type) {
      case "date":
        return <Calendar className="h-3 w-3" />
      case "party":
        return <Users className="h-3 w-3" />
      case "penalty":
        return <AlertTriangle className="h-3 w-3" />
      case "clause":
        return <FileText className="h-3 w-3" />
      default:
        return null
    }
  }

  const getElementColor = (type: string) => {
    switch (type) {
      case "date":
        return "bg-emerald-100/80 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700/50 hover:bg-emerald-200/80 dark:hover:bg-emerald-800/40"
      case "party":
        return "bg-violet-100/80 text-violet-800 border-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-700/50 hover:bg-violet-200/80 dark:hover:bg-violet-800/40"
      case "penalty":
        return "bg-rose-100/80 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-700/50 hover:bg-rose-200/80 dark:hover:bg-rose-800/40"
      case "clause":
        return "bg-sky-100/80 text-sky-800 border-sky-200 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-700/50 hover:bg-sky-200/80 dark:hover:bg-sky-800/40"
      default:
        return "bg-gray-100/80 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-700/50"
    }
  }

  const renderDocumentWithHighlights = (content: string) => {
    if (activeTab === "translated" || !content) {
      return (
        <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-gray-800 dark:text-gray-200">
          {content}
        </div>
      )
    }

    let lastIndex = 0
    const elements: ReactNode[] = []
    const sortedElements = [...legalElements].sort((a, b) => a.startIndex - b.startIndex)

    sortedElements.forEach((element, index) => {
      if (element.startIndex > lastIndex) {
        elements.push(
          <span key={`text-${index}`} className="text-gray-800 dark:text-gray-200">
            {content.slice(lastIndex, element.startIndex)}
          </span>,
        )
      }

      elements.push(
        <span
          key={element.id}
          className={`legal-highlight ${element.type} inline-block px-3 py-1.5 rounded-lg mx-1 cursor-pointer transition-all duration-300 hover:shadow-lg ${getElementColor(element.type)} backdrop-blur-sm border`}
          onClick={() => onElementClick(element.id)}
          onMouseEnter={() => setHoveredElement(element.id)}
          onMouseLeave={() => setHoveredElement(null)}
          title={element.tooltip}
        >
          <span className="flex items-center gap-1.5 font-medium">
            {getElementIcon(element.type)}
            {element.text}
          </span>
          {hoveredElement === element.id && (
            <div className="absolute z-20 bg-gray-900/95 dark:bg-gray-100/95 text-white dark:text-gray-900 text-xs rounded-lg px-3 py-2 mt-2 whitespace-nowrap shadow-xl backdrop-blur-sm border border-white/10 dark:border-gray-900/10">
              <div className="flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                {element.tooltip}
              </div>
            </div>
          )}
        </span>,
      )

      lastIndex = element.endIndex
    })

    if (lastIndex < content.length) {
      elements.push(
        <span key="text-end" className="text-gray-800 dark:text-gray-200">
          {content.slice(lastIndex)}
        </span>,
      )
    }

    return <div className="text-sm leading-relaxed font-mono relative">{elements}</div>
  }

  if (!documentId) {
    return (
      <Card className="h-full glass-effect hover-lift border-0 shadow-xl">
        <CardHeader className="text-center pb-8">
          <CardTitle className="font-serif text-xl dark:text-bronze">Document Preview</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[calc(100%-8rem)]">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center">
              <FileText className="h-10 w-10 text-gray-400 dark:text-gray-500" />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-900 dark:text-gray-100">No Document Selected</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                Upload a document to see the preview and translation features
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full glass-effect hover-lift border-0 shadow-xl subtle-pattern" ref={previewRef}>
      <CardHeader className="pb-4 border-b dark:border-white/10">
        <div className="flex items-center justify-between">
          <CardTitle className="font-serif text-xl dark:text-bronze flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Document Preview
          </CardTitle>
          <div className="flex items-center space-x-2">
            <LanguageSelector variant="compact" />
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyText}
              className="h-8 px-3 rounded-lg border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-300"
              disabled={isLoading || hasError || !documentContent}
            >
              <Copy className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadDocument}
              className="h-8 px-3 rounded-lg border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-300"
              disabled={isLoading || hasError || !documentContent}
            >
              <Download className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <Badge
            variant="outline"
            className="text-emerald-700 border-emerald-300 dark:text-emerald-300 dark:border-emerald-700/50 bg-emerald-50/50 dark:bg-emerald-900/20"
          >
            <Calendar className="h-3 w-3 mr-1" />
            Dates
          </Badge>
          <Badge
            variant="outline"
            className="text-violet-700 border-violet-300 dark:text-violet-300 dark:border-violet-700/50 bg-violet-50/50 dark:bg-violet-900/20"
          >
            <Users className="h-3 w-3 mr-1" />
            Parties
          </Badge>
          <Badge
            variant="outline"
            className="text-rose-700 border-rose-300 dark:text-rose-300 dark:border-rose-700/50 bg-rose-50/50 dark:bg-rose-900/20"
          >
            <AlertTriangle className="h-3 w-3 mr-1" />
            Penalties
          </Badge>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100/50 dark:bg-white/5 rounded-xl p-1">
            <TabsTrigger
              value="original"
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-white/10 transition-all duration-300"
              disabled={isLoading || hasError}
            >
              <FileText className="h-4 w-4" />
              Original
            </TabsTrigger>
            <TabsTrigger
              value="translated"
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-white/10 transition-all duration-300"
              disabled={isLoading || hasError || currentLanguage.code === "en"}
            >
              <Languages className="h-4 w-4" />
              {currentLanguage.nativeName}
              {isTranslating && <RefreshCw className="h-3 w-3 animate-spin" />}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent className="h-[calc(100%-14rem)] p-0">
        <Tabs value={activeTab} className="h-full">
          <TabsContent value="original" className="h-full mt-0 p-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 mx-auto bg-gradient-to-r from-navy to-bronze rounded-full flex items-center justify-center">
                    <RefreshCw className="h-6 w-6 animate-spin text-white" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Loading document...</p>
                    <p className="text-xs text-muted-foreground">Please wait while we prepare your document</p>
                  </div>
                </div>
              </div>
            ) : hasError ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-4 max-w-xs">
                  <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                    <AlertCircle className="h-8 w-8 text-red-500" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-medium">Document Preview Error</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      We couldn't load the document preview. This could be due to network issues or an unsupported file
                      format.
                    </p>
                    <Button onClick={handleRetryLoading} className="mt-2">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Retry
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <ScrollArea className="h-full pr-4">{renderDocumentWithHighlights(documentContent)}</ScrollArea>
            )}
          </TabsContent>

          <TabsContent value="translated" className="h-full mt-0 p-6">
            <ScrollArea className="h-full pr-4">
              {isTranslating ? (
                <div className="flex items-center justify-center h-32">
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 mx-auto bg-gradient-to-r from-bronze to-amber-500 rounded-full flex items-center justify-center">
                      <RefreshCw className="h-6 w-6 animate-spin text-white" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Translating document...</p>
                      <p className="text-xs text-muted-foreground">Converting to {currentLanguage.nativeName}</p>
                    </div>
                  </div>
                </div>
              ) : (
                renderDocumentWithHighlights(translatedContent || documentContent)
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
