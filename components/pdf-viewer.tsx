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

interface PdfViewerProps {
  pdfUrl: string | null
  className?: string
  onError?: (error: Error) => void
  onLoad?: () => void
}

export default function PdfViewer({ pdfUrl, className = "", onError, onLoad }: PdfViewerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { toast } = useToast()

  // Simulate PDF loading
  useEffect(() => {
    if (!pdfUrl) {
      setIsLoading(false)
      setHasError(true)
      onError?.(new Error("No PDF URL provided"))
      return
    }

    setIsLoading(true)
    setHasError(false)

    // Simulate loading delay
    const timer = setTimeout(() => {
      try {
        // For demo purposes, we'll simulate a successful load
        setIsLoading(false)
        setTotalPages(5) // Simulate a 5-page document
        renderPdfPage()
        onLoad?.()
      } catch (error) {
        setIsLoading(false)
        setHasError(true)
        onError?.(error instanceof Error ? error : new Error("Failed to load PDF"))
        toast({
          title: "Error loading PDF",
          description: "There was a problem loading the document. Please try again.",
          variant: "destructive",
        })
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [pdfUrl, onError, onLoad, toast])

  // Simulate rendering a PDF page
  const renderPdfPage = () => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = 800
    canvas.height = 1100

    // Clear canvas
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw page content (simulated)
    ctx.fillStyle = "#f0f0f0"
    ctx.fillRect(50, 50, 700, 100) // Header

    // Draw text lines
    ctx.fillStyle = "#e0e0e0"
    for (let i = 0; i < 15; i++) {
      const width = Math.random() * 300 + 300
      ctx.fillRect(50, 200 + i * 40, width, 20)
    }

    // Draw page number
    ctx.fillStyle = "#000000"
    ctx.font = "12px Arial"
    ctx.fillText(`Page ${currentPage} of ${totalPages}`, canvas.width - 100, canvas.height - 20)
  }

  // Update rendering when page, zoom or rotation changes
  useEffect(() => {
    if (!isLoading && !hasError) {
      renderPdfPage()
    }
  }, [currentPage, zoom, rotation, isLoading, hasError])

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5))
  }

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  const handleDownload = () => {
    if (!pdfUrl) return

    toast({
      title: "Download started",
      description: "Your PDF is being downloaded.",
    })

    // In a real implementation, we would use the actual PDF URL
    const link = document.createElement("a")
    link.href = pdfUrl
    link.download = "document.pdf"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handlePrint = () => {
    toast({
      title: "Preparing to print",
      description: "Opening print dialog...",
    })
    // In a real implementation, we would use the PDF.js print functionality
  }

  const handleRetry = () => {
    setIsLoading(true)
    setHasError(false)
    setCurrentPage(1)

    // Simulate retry with delay
    setTimeout(() => {
      setIsLoading(false)
      renderPdfPage()
      toast({
        title: "PDF loaded",
        description: "The document has been successfully loaded.",
      })
    }, 1500)
  }

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-0">
        {/* PDF Viewer Toolbar */}
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
              onClick={handleRotate}
              disabled={isLoading || hasError}
            >
              <RotateCw className="h-4 w-4" />
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

        {/* PDF Viewer Content */}
        <div
          className="relative overflow-auto p-4 bg-gray-100 dark:bg-gray-900 min-h-[600px] flex justify-center"
          ref={containerRef}
        >
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-3">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                <p className="text-sm font-medium">Loading PDF document...</p>
              </div>
            </div>
          ) : hasError ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-3 max-w-xs">
                <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
                <div className="space-y-2">
                  <p className="font-medium">Failed to load PDF</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    There was a problem loading this PDF. It may be corrupted or in an unsupported format.
                  </p>
                  <Button onClick={handleRetry} size="sm" className="mt-2">
                    <RotateCw className="h-4 w-4 mr-2" />
                    Retry
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                transformOrigin: "center",
                transition: "transform 0.3s ease",
              }}
              className="bg-white shadow-lg"
            >
              <canvas ref={canvasRef} className="block" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
