"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import {
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Plus,
  Cloud,
  Link,
  Sparkles,
  Shield,
  Zap,
  Download,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface UploadedFile {
  file: File
  id: string
  progress: number
  status: "uploading" | "processing" | "completed" | "error"
  preview?: string
  errorMessage?: string
}

interface EnhancedUploadWindowProps {
  onUpload: (file: File) => void
  onFileSelect?: (file: File) => void
  onClose?: () => void
  className?: string
  maxFiles?: number
  showAdvancedOptions?: boolean
}

export default function EnhancedUploadWindow({
  onUpload,
  onFileSelect,
  onClose,
  className = "",
  maxFiles = 5,
  showAdvancedOptions = true,
}: EnhancedUploadWindowProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [activeTab, setActiveTab] = useState("upload")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const supportedFormats = [
    { ext: ".pdf", type: "application/pdf", icon: "📄", color: "text-red-600", maxSize: "10MB" },
    {
      ext: ".docx",
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      icon: "📝",
      color: "text-blue-600",
      maxSize: "10MB",
    },
    { ext: ".doc", type: "application/msword", icon: "📝", color: "text-blue-600", maxSize: "10MB" },
    { ext: ".txt", type: "text/plain", icon: "📋", color: "text-gray-600", maxSize: "5MB" },
    { ext: ".jpg", type: "image/jpeg", icon: "🖼️", color: "text-green-600", maxSize: "5MB" },
    { ext: ".png", type: "image/png", icon: "🖼️", color: "text-green-600", maxSize: "5MB" },
  ]

  const validateFile = useCallback(
    (file: File): { isValid: boolean; error?: string } => {
      const maxSize = 10 * 1024 * 1024 // 10MB
      const supportedTypes = supportedFormats.map((f) => f.type)

      if (!supportedTypes.includes(file.type)) {
        return {
          isValid: false,
          error: "Unsupported file type. Please upload a PDF, Word document, or image file.",
        }
      }

      if (file.size > maxSize) {
        return {
          isValid: false,
          error: "File too large. Please upload a file smaller than 10MB.",
        }
      }

      if (uploadedFiles.length >= maxFiles) {
        return {
          isValid: false,
          error: `Maximum ${maxFiles} files allowed. Please remove a file before adding another.`,
        }
      }

      return { isValid: true }
    },
    [uploadedFiles.length, maxFiles],
  )

  const processFile = useCallback(
    async (file: File) => {
      const validation = validateFile(file)
      if (!validation.isValid) {
        toast({
          title: "Upload failed",
          description: validation.error,
          variant: "destructive",
        })
        return
      }

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
              const newProgress = Math.min(f.progress + Math.random() * 25, 100)
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
            description: `${file.name} has been uploaded and processed successfully.`,
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

      const files = Array.from(e.dataTransfer.files)
      files.forEach((file) => processFile(file))
    },
    [processFile],
  )

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const files = Array.from(e.target.files)
        files.forEach((file) => processFile(file))
      }
    },
    [processFile],
  )

  const removeFile = useCallback((fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId))
  }, [])

  const retryFile = useCallback(
    (fileId: string) => {
      const file = uploadedFiles.find((f) => f.id === fileId)
      if (file) {
        setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId))
        processFile(file.file)
      }
    },
    [uploadedFiles, processFile],
  )

  const getFileIcon = (fileName: string) => {
    const ext = fileName.toLowerCase()
    const format = supportedFormats.find((f) => ext.includes(f.ext.slice(1)))
    return format ? { icon: format.icon, color: format.color } : { icon: "📄", color: "text-gray-600" }
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

  return (
    <Card className={`w-full max-w-4xl mx-auto glass-effect border-0 shadow-2xl ${className}`}>
      <CardHeader className="text-center pb-6 border-b dark:border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-navy to-bronze dark:from-bronze dark:to-amber-500 rounded-xl flex items-center justify-center">
              <Upload className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <CardTitle className="text-2xl font-serif">Upload Legal Document</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Upload your documents for AI-powered legal analysis
              </p>
            </div>
          </div>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Only one tab: Upload Files */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-1 mb-6 bg-gray-100/50 dark:bg-white/5 rounded-xl p-1">
            <TabsTrigger
              value="upload"
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-white/10"
            >
              <Upload className="h-4 w-4" />
              Upload Files
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            {/* Upload Zone */}
            <div
              className={`upload-zone ${isDragging ? "dragover" : ""} ${uploadedFiles.length > 0 ? "compact" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                multiple
              />

              <div className="flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-navy/10 to-bronze/10 dark:from-bronze/20 dark:to-amber-500/20 flex items-center justify-center mb-4">
                  <Upload className="h-8 w-8 text-navy dark:text-bronze" />
                </div>

                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  {isDragging ? "Drop your files here" : "Drag and drop your files"}
                </h3>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">or click to browse from your computer</p>

                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {supportedFormats.slice(0, 4).map((format) => (
                    <Badge key={format.ext} variant="outline" className="text-xs">
                      <span className="mr-1">{format.icon}</span>
                      {format.ext.toUpperCase()}
                    </Badge>
                  ))}
                  <Badge variant="outline" className="text-xs">
                    +2 more
                  </Badge>
                </div>

                <Button className="bg-navy hover:bg-navy/90 dark:bg-bronze dark:hover:bg-bronze/90 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Choose Files
                </Button>
              </div>
            </div>

            {/* File Format Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <Shield className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Secure Upload</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">End-to-end encrypted</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <Zap className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Fast Processing</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">AI analysis in seconds</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <Sparkles className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm font-medium">Smart Analysis</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Legal insights powered by AI</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-4 mt-6 pt-6 border-t dark:border-white/10">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Uploaded Files ({uploadedFiles.length}/{maxFiles})
              </h4>
              {uploadedFiles.some((f) => f.status === "completed") && (
                <Button
                  size="sm"
                  onClick={() => {
                    const completedFiles = uploadedFiles.filter((f) => f.status === "completed")
                    if (completedFiles.length > 0) {
                      onUpload(completedFiles[0].file)
                    }
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Continue with Analysis
                </Button>
              )}
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto">
              {uploadedFiles.map((uploadedFile) => {
                const { icon, color } = getFileIcon(uploadedFile.file.name)

                return (
                  <Card
                    key={uploadedFile.id}
                    className="p-4 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                  >
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

                        {uploadedFile.status === "error" && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-xs text-red-600 dark:text-red-400">
                              <AlertCircle className="h-3 w-3" />
                              <span>{uploadedFile.errorMessage || "Upload failed"}</span>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => retryFile(uploadedFile.id)}
                              className="h-6 text-xs"
                            >
                              Retry
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
