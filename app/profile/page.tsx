"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/components/ui/use-toast"
import CivitasHeader from "@/components/civitas-header"
import { FileText, Download, Trash2, Eye, Calendar, BarChart3, Crown, Zap } from "lucide-react"

interface Document {
  id: string
  name: string
  uploadDate: string
  size: string
  queries: number
  status: "processed" | "processing" | "error"
}

export default function ProfilePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [documents] = useState<Document[]>([
    {
      id: "1",
      name: "Rental Agreement - Main St.pdf",
      uploadDate: "2024-01-15",
      size: "2.4 MB",
      queries: 12,
      status: "processed",
    },
    {
      id: "2",
      name: "Employment Contract - TechCorp.docx",
      uploadDate: "2024-01-10",
      size: "1.8 MB",
      queries: 8,
      status: "processed",
    },
    {
      id: "3",
      name: "Terms of Service - Platform.pdf",
      uploadDate: "2024-01-05",
      size: "3.2 MB",
      queries: 15,
      status: "processed",
    },
    {
      id: "4",
      name: "NDA - Consulting Project.pdf",
      uploadDate: "2024-01-02",
      size: "1.1 MB",
      queries: 5,
      status: "processing",
    },
  ])

  const currentMonth = new Date().toLocaleString("default", { month: "long", year: "numeric" })
  const totalQueries = documents.reduce((sum, doc) => sum + doc.queries, 0)
  const queryLimit = 100 // Free plan limit
  const usagePercentage = (totalQueries / queryLimit) * 100

  const handleOpenDocument = (docId: string) => {
    toast({
      title: "Opening document",
      description: "Redirecting to document analysis...",
    })
    // In a real app, this would navigate to the dashboard with the selected document
  }

  const handleDeleteDocument = (docId: string, docName: string) => {
    toast({
      title: "Document deleted",
      description: `${docName} has been removed from your account.`,
    })
  }

  const handleExportDocument = (docId: string, docName: string) => {
    toast({
      title: "Export started",
      description: `Preparing ${docName} analysis for download.`,
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "processed":
        return <div className="w-2 h-2 bg-green-500 rounded-full" />
      case "processing":
        return <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
      case "error":
        return <div className="w-2 h-2 bg-red-500 rounded-full" />
      default:
        return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "processed":
        return "Ready"
      case "processing":
        return "Processing"
      case "error":
        return "Error"
      default:
        return "Unknown"
    }
  }

  return (
    <div className="min-h-screen bg-light-gray dark:bg-gray-900">
      <CivitasHeader />

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src="/placeholder.svg?height=80&width=80" alt={user?.name || "User"} />
                  <AvatarFallback className="bg-bronze text-white text-2xl">
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="font-serif">{user?.name || "User"}</CardTitle>
                <CardDescription>{user?.email}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Subscription Plan</span>
                  <Badge variant="outline" className="bg-bronze/10 text-bronze border-bronze">
                    <Crown className="h-3 w-3 mr-1" />
                    Free
                  </Badge>
                </div>
                <Button asChild className="w-full bg-navy hover:bg-navy/90">
                  <a href="/pricing">
                    <Zap className="h-4 w-4 mr-2" />
                    Upgrade to Premium
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Usage Statistics */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="font-serif flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Usage This Month
                </CardTitle>
                <CardDescription>{currentMonth}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>AI Queries Used</span>
                    <span>
                      {totalQueries} / {queryLimit}
                    </span>
                  </div>
                  <Progress value={usagePercentage} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">{queryLimit - totalQueries} queries remaining</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-navy">{documents.length}</p>
                    <p className="text-xs text-gray-500">Documents</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-bronze">{totalQueries}</p>
                    <p className="text-xs text-gray-500">Total Queries</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Document History */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Document History
                </CardTitle>
                <CardDescription>Manage your uploaded legal documents and analysis history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-navy/10 rounded-lg flex items-center justify-center">
                          <FileText className="h-5 w-5 text-navy" />
                        </div>
                        <div>
                          <h4 className="font-medium">{doc.name}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(doc.uploadDate).toLocaleDateString()}
                            </span>
                            <span>{doc.size}</span>
                            <span>{doc.queries} queries</span>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(doc.status)}
                              <span>{getStatusText(doc.status)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenDocument(doc.id)}
                          disabled={doc.status !== "processed"}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Open
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleExportDocument(doc.id, doc.name)}
                          disabled={doc.status !== "processed"}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Export
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteDocument(doc.id, doc.name)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {documents.length === 0 && (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No documents yet</h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        Upload your first legal document to get started with AI analysis.
                      </p>
                      <Button className="bg-navy hover:bg-navy/90">Upload Document</Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
