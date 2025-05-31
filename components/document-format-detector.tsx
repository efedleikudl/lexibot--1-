"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import DocumentViewer from "@/components/document-viewer"
import PdfViewer from "@/components/pdf-viewer"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DocumentFormatDetectorProps {
  documentUrl: string | null
  fileName?: string
  className?: string
}

export default function DocumentFormatDetector({
  documentUrl,
  fileName = "",
  className = "",
}: DocumentFormatDetectorProps) {
  const [documentType, setDocumentType] = useState<"pdf" | "docx" | "txt" | "unknown" | null>(null)
  const [isDetecting, setIsDetecting] = useState(true)
  const [hasError, setHasError] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (!documentUrl) {
      setDocumentType(null)
      setIsDetecting(false)
      setHasError(true)
      return
    }

    setIsDetecting(true)
    setHasError(false)

    // Detect document type based on file extension or MIME type
    const detectDocumentType = () => {
      try {
        if (fileName.toLowerCase().endsWith(".pdf") || documentUrl.toLowerCase().includes(".pdf")) {
          setDocumentType("pdf")
        } else if (
          fileName.toLowerCase().endsWith(".docx") ||
          fileName.toLowerCase().endsWith(".doc") ||
          documentUrl.toLowerCase().includes(".doc")
        ) {
          setDocumentType("docx")
        } else if (fileName.toLowerCase().endsWith(".txt") || documentUrl.toLowerCase().includes(".txt")) {
          setDocumentType("txt")
        } else {
          // Try to detect by examining the first few bytes (in a real implementation)
          // For now, default to PDF for demo purposes
          setDocumentType("pdf")
        }
      } catch (error) {
        console.error("Error detecting document type:", error)
        setHasError(true)
        setDocumentType("unknown")
        toast({
          title: "Format detection failed",
          description: "Could not determine the document format. Please try a different file.",
          variant: "destructive",
        })
      } finally {
        setIsDetecting(false)
      }
    }

    // Simulate detection delay
    const timer = setTimeout(detectDocumentType, 1000)
    return () => clearTimeout(timer)
  }, [documentUrl, fileName, toast])

  const handleRetry = () => {
    setIsDetecting(true)
    setHasError(false)

    // Simulate retry
    setTimeout(() => {
      setDocumentType("pdf") // Default to PDF for demo
      setIsDetecting(false)
    }, 1500)
  }

  if (isDetecting) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center p-12">
          <div className="text-center space-y-3">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="font-medium">Detecting document format...</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Please wait while we analyze your document</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (hasError || !documentType) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center p-12">
          <div className="text-center space-y-3 max-w-xs">
            <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
            <div className="space-y-2">
              <p className="font-medium">Document format not supported</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                We couldn't determine the format of this document or the format is not supported.
              </p>
              <Button onClick={handleRetry} size="sm" className="mt-2">
                Try Again
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Render the appropriate viewer based on document type
  switch (documentType) {
    case "pdf":
      return <PdfViewer pdfUrl={documentUrl} className={className} />
    case "docx":
    case "txt":
    default:
      return <DocumentViewer documentUrl={documentUrl} documentType={documentType} className={className} />
  }
}
