"use client"

import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import EnhancedCivitasHeader from "@/components/enhanced-civitas-header"
import EnhancedUploadWindow from "@/components/enhanced-upload-window"
import EnhancedDocumentPreview from "@/components/enhanced-document-preview"
import EnhancedChatInterface from "@/components/enhanced-chat-interface"
import DocumentHistorySlider from "@/components/document-history-slider"
import { History, UploadIcon, FileText, Sparkles, ArrowRight } from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [activeDocument, setActiveDocument] = useState<string | null>(null)
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null)
  const [showUploadWindow, setShowUploadWindow] = useState(true) // Show upload window by default
  const [showHistorySlider, setShowHistorySlider] = useState(false)
  const [documentLoadError, setDocumentLoadError] = useState<string | null>(null)

  const handleDocumentUpload = (file: File) => {
    toast({
      title: "Document uploaded",
      description: `${file.name} has been uploaded and is being processed.`,
    })

    // Simulate document processing
    setTimeout(() => {
      setActiveDocument("new-doc")
      setShowUploadWindow(false) // Hide upload window after successful upload
      toast({
        title: "Document ready",
        description: "Your document has been processed and is ready for analysis.",
      })
    }, 3000)
  }

  const handleFileSelect = (file: File) => {
    toast({
      title: "File selected",
      description: `${file.name} is being uploaded...`,
    })
  }

  const handleElementClick = (elementId: string) => {
    setHighlightedElement(elementId)
    toast({
      title: "Element selected",
      description: "AI is analyzing this legal element for you.",
    })
  }

  const handleDocumentSelect = (documentId: string) => {
    setActiveDocument(documentId)
    setShowUploadWindow(false) // Hide upload window when selecting from history
    setShowHistorySlider(false)
    setDocumentLoadError(null)

    toast({
      title: "Document loaded",
      description: "Your document has been loaded and is ready for analysis.",
    })
  }

  const handleNewDocument = () => {
    setActiveDocument(null)
    setShowUploadWindow(true) // Show upload window for new document
    setHighlightedElement(null)
    setDocumentLoadError(null)
  }

  const handleCloseUploadWindow = () => {
    setShowUploadWindow(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-black dark:via-black dark:to-black animated-gradient">
      <EnhancedCivitasHeader onUploadClick={() => setShowUploadWindow(true)} />

      <main className="container mx-auto px-4 sm:px-6 py-6">
        {/* Welcome Banner - Only show when no document is active */}
        {!activeDocument && !showUploadWindow && (
          <div className="mb-6 p-6 bg-gradient-to-r from-navy/5 to-bronze/5 dark:from-black dark:to-black rounded-2xl border border-gray-200 dark:border-black">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-navy to-bronze dark:from-black dark:to-black rounded-xl flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-serif font-semibold text-gray-900 dark:text-white">
                    Welcome to Civitas AI
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Upload a legal document to start your AI-powered analysis journey.
                  </p>
                </div>
              </div>
              <Button onClick={() => setShowUploadWindow(true)} className="button-primary rounded-xl dark:bg-black dark:text-white dark:hover:bg-gray-900">
                <UploadIcon className="h-4 w-4 mr-2" />
                Upload Document
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Action Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setShowHistorySlider(true)}
              variant="outline"
              className="h-10 px-4 rounded-xl border-gray-200 dark:border-black hover:bg-gray-50 dark:hover:bg-black"
            >
              <History className="h-4 w-4 mr-2" />
              Document History
            </Button>
            <Button
              onClick={handleNewDocument}
              variant="outline"
              className="h-10 px-4 rounded-xl border-gray-200 dark:border-black hover:bg-gray-50 dark:hover:bg-black"
            >
              <UploadIcon className="h-4 w-4 mr-2" />
              New Document
            </Button>
          </div>

          {activeDocument && !documentLoadError && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                Document loaded • Ready for analysis
              </span>
            </div>
          )}
        </div>

        {/* Main Content */}
        {showUploadWindow ? (
          /* Upload Window - Full Screen */
          <div className="flex items-center justify-center min-h-[calc(100vh-16rem)]">
            <EnhancedUploadWindow
              onUpload={handleDocumentUpload}
              onFileSelect={handleFileSelect}
              onClose={handleCloseUploadWindow}
              className="w-full max-w-4xl"
              maxFiles={3}
            />
          </div>
        ) : (
          /* Document Analysis Interface */
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-[calc(100vh-12rem)]">
            {/* Left Panel - Document Preview */}
            <div className="xl:col-span-4 h-full">
              <EnhancedDocumentPreview documentId={activeDocument} onElementClick={handleElementClick} />
            </div>

            {/* Right Panel - Chat Interface */}
            <div className="xl:col-span-8 h-full">
              <div className="glass-effect hover-lift rounded-2xl border-0 shadow-xl h-full p-4 sm:p-6 subtle-pattern dark:bg-black">
                {activeDocument ? (
                  <EnhancedChatInterface documentId={activeDocument} highlightedElement={highlightedElement} />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center space-y-6 max-w-md">
                      <div className="w-24 h-24 mx-auto bg-gradient-to-br from-navy/10 to-bronze/10 dark:from-black dark:to-black rounded-3xl flex items-center justify-center">
                        <FileText className="h-12 w-12 text-gray-400" />
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-2xl font-serif font-semibold text-gray-900 dark:text-white">
                          Ready for Legal Analysis
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                          Upload a legal document to start your AI-powered analysis. Get instant explanations, visual
                          guides, and actionable insights in plain language.
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button
                          onClick={() => setShowUploadWindow(true)}
                          className="button-primary rounded-xl px-6 py-3 dark:bg-black dark:text-white dark:hover:bg-gray-900"
                        >
                          <UploadIcon className="h-4 w-4 mr-2" />
                          Upload Document
                        </Button>
                        <Button
                          onClick={() => setShowHistorySlider(true)}
                          variant="outline"
                          className="rounded-xl border-gray-200 dark:border-black px-6 py-3 dark:bg-black dark:text-white dark:hover:bg-gray-900"
                        >
                          <History className="h-4 w-4 mr-2" />
                          View History
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Document History Slider */}
      <DocumentHistorySlider
        isOpen={showHistorySlider}
        onClose={() => setShowHistorySlider(false)}
        onDocumentSelect={handleDocumentSelect}
        activeDocumentId={activeDocument}
      />
    </div>
  )
}
