"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, type File, X, CheckCircle, AlertCircle, Loader2, Plus } from "lucide-react"

interface EnhancedFileUploaderProps {
  onUpload: (file: File) => void
  onFileSelect?: (file: File) => void
  className?: string
  compact?: boolean
}

interface UploadedFile {
  file: File
  id: string
  progress: number
  status: "uploading" | "processing" | "completed" | "error"
  preview?: string
}

export default function EnhancedFileUploader({
  onUpload,
  onFileSelect,
  className = "",
  compact = false,
}: EnhancedFileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const supportedFormats = [
    { ext: ".pdf", type: "application/pdf", icon: "📄", color: "text-red-600" },
    {
      ext: ".docx",
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      icon: "📝",
      color: "text-blue-600",
    },
    { ext: ".doc", type: "application/msword", icon: "📝", color: "text-blue-600" },
  ]

  const validateFile = useCallback(
    (file: File): boolean => {
      const maxSize = 10 * 1024 * 1024 // 10MB
      const supportedTypes = supportedFormats.map((f) => f.type)

      if (!supportedTypes.includes(file.type)) {
        toast({
          title: "Unsupported file type",
          description: "Please upload a PDF or Word document (.pdf, .doc, .docx)",
          variant: "destructive",
        })
        return false
      }

      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 10MB.",
          variant: "destructive",
        })
        return false
      }

      return true
    },
    [toast],
  )

  const processFile = useCallback(
    async (file: File) => {
      if (!validateFile(file)) return

      const fileId = Date.now().toString()
      const newFile: UploadedFile = {
        file,
        id: fileId,
        progress: 0,
        status: "uploading",
      }

      setUploadedFiles((prev) => [...prev, newFile])
      onFileSelect?.(file)

      // Simulate upload progress
      const uploadInterval = setInterval(() => {
        setUploadedFiles((prev) =>
          prev.map((f) => {
            if (f.id === fileId && f.progress < 100) {
              const newProgress = Math.min(f.progress + Math.random() * 30, 100)
              return { ...f, progress: newProgress }
            }
            return f
          }),
        )
      }, 200)

      // Simulate upload completion
      setTimeout(() => {
        clearInterval(uploadInterval)
        setUploadedFiles((prev) =>
          prev.map((f) => (f.id === fileId ? { ...f, progress: 100, status: "processing" } : f)),
        )

        // Simulate processing
        setTimeout(() => {
          setUploadedFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, status: "completed" } : f)))

          onUpload(file)

          toast({
            title: "Upload successful",
            description: `${file.name} has been uploaded and processed.`,
          })
        }, 1500)
      }, 2000)
    },
    [validateFile, onUpload, onFileSelect, toast],
  )

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0]
        processFile(file)
      }
    },
    [processFile],
  )

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0]
        processFile(file)
      }
    },
    [processFile],
  )

  const removeFile = useCallback((fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId))
  }, [])

  const getFileIcon = (fileName: string) => {
    const ext = fileName.toLowerCase()
    if (ext.includes(".pdf")) return { icon: "📄", color: "text-red-600" }
    if (ext.includes(".doc")) return { icon: "📝", color: "text-blue-600" }
    return { icon: "📄", color: "text-gray-600" }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "uploading":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      case "processing":
        return <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  if (compact) {
    return (
      <div className={className}>
        <Button onClick={() => fileInputRef.current?.click()} className="w-full h-12 button-primary rounded-xl">
          <Plus className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.doc,.docx" />
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Upload Zone */}
      <div
        className={`file-upload-zone ${isDragging ? "dragover" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.doc,.docx" />

        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-navy to-bronze dark:from-bronze dark:to-amber-500 flex items-center justify-center mb-4">
            <Upload className="h-8 w-8 text-white" />
          </div>

          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            {isDragging ? "Drop your file here" : "Upload Legal Document"}
          </h3>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Drag and drop your file here, or click to browse
          </p>

          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {supportedFormats.map((format) => (
              <Badge key={format.ext} variant="outline" className="text-xs">
                <span className="mr-1">{format.icon}</span>
                {format.ext.toUpperCase()}
              </Badge>
            ))}
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400">Maximum file size: 10MB</p>
        </div>
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Uploaded Files ({uploadedFiles.length})
          </h4>

          {uploadedFiles.map((uploadedFile) => {
            const { icon, color } = getFileIcon(uploadedFile.file.name)

            return (
              <Card key={uploadedFile.id} className="glass-effect border-0">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className={`text-2xl ${color}`}>{icon}</div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                          {uploadedFile.file.name}
                        </h5>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(uploadedFile.status)}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => removeFile(uploadedFile.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                        <span>{(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB</span>
                        <span className="capitalize">{uploadedFile.status}</span>
                      </div>

                      {uploadedFile.status === "uploading" && (
                        <div className="space-y-1">
                          <Progress value={uploadedFile.progress} className="h-2" />
                          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span>Uploading...</span>
                            <span>{Math.round(uploadedFile.progress)}%</span>
                          </div>
                        </div>
                      )}

                      {uploadedFile.status === "processing" && (
                        <div className="flex items-center space-x-2 text-xs text-yellow-600 dark:text-yellow-400">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          <span>Processing document...</span>
                        </div>
                      )}

                      {uploadedFile.status === "completed" && (
                        <div className="flex items-center space-x-2 text-xs text-green-600 dark:text-green-400">
                          <CheckCircle className="h-3 w-3" />
                          <span>Ready for analysis</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
