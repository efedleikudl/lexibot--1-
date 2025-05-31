"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertCircle,
  Download,
  Printer,
  ZoomIn,
  ZoomOut,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react"

interface DocumentViewerProps {
  documentUrl: string | null
  documentType?: "pdf" | "docx" | "txt"
  className?: string
}

export default function DocumentViewer({ documentUrl, documentType = "pdf", className = "" }: DocumentViewerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [zoom, setZoom] = useState(1)
  const viewerRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Simulate document loading
  useEffect(() => {
    if (!documentUrl) {
      setIsLoading(false)
      setHasError(true)
      return
    }

    setIsLoading(true)
    setHasError(false)

    // Simulate loading delay
    const timer = setTimeout(() => {
      // For demo purposes, we'll simulate a successful load
      setIsLoading(false)
      setTotalPages(5) // Simulate a 5-page document
    }, 2000)

    return () => clearTimeout(timer)
  }, [documentUrl])

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleDownload = () => {
    toast({
      title: "Download started",
      description: "Your document is being downloaded.",
    })
  }

  const handlePrint = () => {
    toast({
      title: "Preparing to print",
      description: "Opening print dialog...",
    })
  }

  const handleRetry = () => {
    setIsLoading(true)
    setHasError(false)

    // Simulate retry with delay
    setTimeout(() => {
      setIsLoading(false)
      setTotalPages(5)
      toast({
        title: "Document loaded",
        description: "The document has been successfully loaded.",
      })
    }, 1500)
  }

  // Render placeholder content for PDF
  const renderPdfPlaceholder = () => {
    return (
      <div
        className="w-full h-[500px] bg-white dark:bg-gray-800 rounded-lg shadow-inner overflow-hidden"
        style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}
      >
        {/* Simulate PDF page with some content */}
        <div className="p-8 h-full">
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
          </div>
          <div className="mt-8 space-y-6">
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          </div>
          <div className="absolute bottom-4 right-4 text-sm text-gray-400">
            Page {currentPage} of {totalPages}
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-0">
        {/* Document Viewer Toolbar */}
        <div className="flex items-center justify-between p-2 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handlePrevPage}
              disabled={isLoading || hasError || currentPage <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {!isLoading && !hasError && (
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleNextPage}
              disabled={isLoading || hasError || currentPage >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleZoomOut}
              disabled={isLoading || hasError || zoom <= 0.5}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            {!isLoading && !hasError && <span className="text-sm w-12 text-center">{Math.round(zoom * 100)}%</span>}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleZoomIn}
              disabled={isLoading || hasError || zoom >= 3}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleDownload}
              disabled={isLoading || hasError}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handlePrint}
              disabled={isLoading || hasError}
            >
              <Printer className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Document Viewer Content */}
        <div className="relative overflow-auto p-4 bg-gray-100 dark:bg-gray-900 min-h-[500px]" ref={viewerRef}>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-3">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                <p className="text-sm font-medium">Loading document...</p>
              </div>
            </div>
          ) : hasError ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-3 max-w-xs">
                <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
                <div className="space-y-2">
                  <p className="font-medium">Failed to load document</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    There was a problem loading this document. It may be corrupted or in an unsupported format.
                  </p>
                  <Button onClick={handleRetry} size="sm" className="mt-2">
                    <RotateCw className="h-4 w-4 mr-2" />
                    Retry
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">{documentType === "pdf" && renderPdfPlaceholder()}</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
