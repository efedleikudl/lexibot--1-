"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, AlertTriangle, FileText } from "lucide-react"

interface LegalElement {
  id: string
  type: "clause" | "date" | "party" | "penalty"
  text: string
  startIndex: number
  endIndex: number
  tooltip: string
}

interface DocumentPreviewProps {
  documentId: string | null
  onElementClick: (elementId: string) => void
}

export default function DocumentPreview({ documentId, onElementClick }: DocumentPreviewProps) {
  const [hoveredElement, setHoveredElement] = useState<string | null>(null)

  // Mock document content with legal elements
  const documentContent = `RENTAL AGREEMENT

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
        return "bg-green-100 text-green-800 border-green-200"
      case "party":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "penalty":
        return "bg-red-100 text-red-800 border-red-200"
      case "clause":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const renderDocumentWithHighlights = () => {
    let lastIndex = 0
    const elements: JSX.Element[] = []

    // Sort elements by start index
    const sortedElements = [...legalElements].sort((a, b) => a.startIndex - b.startIndex)

    sortedElements.forEach((element, index) => {
      // Add text before the element
      if (element.startIndex > lastIndex) {
        elements.push(<span key={`text-${index}`}>{documentContent.slice(lastIndex, element.startIndex)}</span>)
      }

      // Add the highlighted element
      elements.push(
        <span
          key={element.id}
          className={`legal-highlight ${element.type} inline-block px-2 py-1 rounded-md mx-1 cursor-pointer transition-all duration-200 hover:shadow-md ${getElementColor(element.type)}`}
          onClick={() => onElementClick(element.id)}
          onMouseEnter={() => setHoveredElement(element.id)}
          onMouseLeave={() => setHoveredElement(null)}
          title={element.tooltip}
        >
          <span className="flex items-center gap-1">
            {getElementIcon(element.type)}
            {element.text}
          </span>
          {hoveredElement === element.id && (
            <div className="absolute z-10 bg-black text-white text-xs rounded px-2 py-1 mt-1 whitespace-nowrap">
              {element.tooltip}
            </div>
          )}
        </span>,
      )

      lastIndex = element.endIndex
    })

    // Add remaining text
    if (lastIndex < documentContent.length) {
      elements.push(<span key="text-end">{documentContent.slice(lastIndex)}</span>)
    }

    return elements
  }

  if (!documentId) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="font-serif">Document Preview</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[calc(100%-5rem)]">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Upload a document to see the preview</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="font-serif">Document Preview</CardTitle>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="outline" className="text-green-700 border-green-300">
            <Calendar className="h-3 w-3 mr-1" />
            Dates
          </Badge>
          <Badge variant="outline" className="text-purple-700 border-purple-300">
            <Users className="h-3 w-3 mr-1" />
            Parties
          </Badge>
          <Badge variant="outline" className="text-red-700 border-red-300">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Penalties
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="h-[calc(100%-8rem)]">
        <ScrollArea className="h-full pr-4">
          <div className="text-sm leading-relaxed whitespace-pre-wrap font-mono relative">
            {renderDocumentWithHighlights()}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
