"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Download, RefreshCw } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "@/components/ui/chart"

interface VisualSummaryProps {
  documentId: string | null
}

export default function VisualSummary({ documentId }: VisualSummaryProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("flowchart")
  const { toast } = useToast()

  useEffect(() => {
    // Simulate loading visual summaries
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, []) // Removed unnecessary dependency: documentId

  const handleDownload = (type: string) => {
    toast({
      title: "Download started",
      description: `Downloading ${type} as PDF.`,
    })
  }

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Visuals refreshed",
        description: "Visual summaries have been regenerated.",
      })
    }, 2000)
  }

  // Mock data for charts
  const barChartData = [
    {
      name: "Section 1",
      wordCount: 250,
      complexity: 65,
    },
    {
      name: "Section 2",
      wordCount: 180,
      complexity: 45,
    },
    {
      name: "Section 3",
      wordCount: 300,
      complexity: 80,
    },
    {
      name: "Section 4",
      wordCount: 220,
      complexity: 60,
    },
    {
      name: "Section 5",
      wordCount: 150,
      complexity: 40,
    },
  ]

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="flowchart">Flowchart</TabsTrigger>
            <TabsTrigger value="infographic">Infographic</TabsTrigger>
            <TabsTrigger value="chart">Chart</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex space-x-2 ml-4">
          <Button variant="outline" size="icon" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => handleDownload(activeTab)}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Generating visual summary...</p>
            </div>
          </div>
        ) : (
          <TabsContent value="flowchart" className="h-full">
            <Card className="h-full">
              <CardContent className="p-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 h-full">
                  <img
                    src="/placeholder.svg?height=400&width=600"
                    alt="Legal Document Flowchart"
                    className="w-full h-auto object-contain"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="infographic" className="h-full">
          <Card className="h-full">
            <CardContent className="p-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 h-full">
                <img
                  src="/placeholder.svg?height=400&width=600"
                  alt="Legal Document Infographic"
                  className="w-full h-auto object-contain"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chart" className="h-full">
          <Card className="h-full">
            <CardContent className="p-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 h-full">
                <h3 className="text-lg font-medium mb-4">Document Complexity Analysis</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="wordCount" name="Word Count" fill="#3b82f6" />
                    <Bar dataKey="complexity" name="Complexity Score" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-6">
                  <h4 className="text-md font-medium mb-2">Key Insights:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Section 3 has the highest complexity score (80) and word count (300).</li>
                    <li>Section 5 is the simplest section with a complexity score of 40.</li>
                    <li>The average complexity score across all sections is 58.</li>
                    <li>Sections with higher word counts tend to have higher complexity scores.</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </div>
    </div>
  )
}
