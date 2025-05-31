"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { Upload, File, FileText, Image, X } from "lucide-react"

interface DocumentUploaderProps {
  onUpload: (file: File) => void
}

export default function DocumentUploader({ onUpload }: DocumentUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      validateAndSetFile(file)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      validateAndSetFile(file)
    }
  }

  const validateAndSetFile = (file: File) => {
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
    ]

    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, Word document, or image file.",
        variant: "destructive",
      })
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive",
      })
      return
    }

    setSelectedFile(file)
  }

  const handleUpload = () => {
    if (!selectedFile) return

    setIsUploading(true)

    // Simulate upload progress
    let progress = 0
    const interval = setInterval(() => {
      progress += 5
      setUploadProgress(progress)

      if (progress >= 100) {
        clearInterval(interval)
        setIsUploading(false)
        onUpload(selectedFile)
      }
    }, 100)
  }

  const getFileIcon = () => {
    if (!selectedFile) return <Upload className="h-12 w-12 text-gray-400" />

    const fileType = selectedFile.type

    if (fileType.includes("pdf")) {
      return <File className="h-12 w-12 text-red-500" />
    } else if (fileType.includes("word") || fileType.includes("document")) {
      return <FileText className="h-12 w-12 text-blue-500" />
    } else if (fileType.includes("image")) {
      return <Image className="h-12 w-12 text-green-500" />
    }

    return <File className="h-12 w-12 text-gray-400" />
  }

  const removeFile = () => {
    setSelectedFile(null)
    setUploadProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-6">
      <div
        className={`upload-area ${isDragging ? "border-primary bg-primary/5" : ""} ${selectedFile ? "bg-gray-50 dark:bg-gray-800/50" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !selectedFile && fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        />

        <div className="flex flex-col items-center justify-center">
          {getFileIcon()}

          {selectedFile ? (
            <div className="mt-4 text-center">
              <div className="flex items-center justify-center">
                <span className="font-medium truncate max-w-[200px]">{selectedFile.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2 h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile()
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          ) : (
            <>
              <h3 className="mt-4 text-lg font-medium">Drag and drop your file here</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Supports PDF, Word documents, and images</p>
              <Button className="mt-4" size="sm">
                Browse Files
              </Button>
            </>
          )}
        </div>
      </div>

      {selectedFile && (
        <div className="space-y-4">
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          <Button className="w-full" onClick={handleUpload} disabled={isUploading}>
            {isUploading ? "Uploading..." : "Upload Document"}
          </Button>
        </div>
      )}
    </div>
  )
}
