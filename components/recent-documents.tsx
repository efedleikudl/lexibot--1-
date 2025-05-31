import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { File, FileText, Image } from "lucide-react"

interface Document {
  id: string
  name: string
  date: string
}

interface RecentDocumentsProps {
  documents: Document[]
  onSelect: (id: string) => void
  activeDocument: string | null
}

export default function RecentDocuments({ documents, onSelect, activeDocument }: RecentDocumentsProps) {
  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith(".pdf")) {
      return <File className="h-5 w-5 text-red-500" />
    } else if (fileName.endsWith(".doc") || fileName.endsWith(".docx")) {
      return <FileText className="h-5 w-5 text-blue-500" />
    } else if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg") || fileName.endsWith(".png")) {
      return <Image className="h-5 w-5 text-green-500" />
    }
    return <File className="h-5 w-5 text-gray-400" />
  }

  return (
    <ScrollArea className="h-[500px] pr-4">
      <div className="space-y-2">
        {documents.map((doc) => (
          <Button
            key={doc.id}
            variant={activeDocument === doc.id ? "default" : "outline"}
            className="w-full justify-start h-auto py-3"
            onClick={() => onSelect(doc.id)}
          >
            <div className="flex items-start">
              <div className="mr-3 mt-0.5">{getFileIcon(doc.name)}</div>
              <div className="text-left">
                <div className="font-medium">{doc.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{new Date(doc.date).toLocaleDateString()}</div>
              </div>
            </div>
          </Button>
        ))}
      </div>
    </ScrollArea>
  )
}
