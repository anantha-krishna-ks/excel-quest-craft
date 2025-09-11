import { useState } from "react"
import { Link } from "react-router-dom"
import { 
  ArrowLeft, 
  Download, 
  Upload, 
  Filter,
  FileText,
  Database,
  CheckCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AppSidebar } from "@/components/AppSidebar"
import { ProfileDropdown } from "@/components/ProfileDropdown"
import { toast } from "@/hooks/use-toast"

const ItemMetadata = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [selectedMetadata, setSelectedMetadata] = useState("")
  const [customMetadata1, setCustomMetadata1] = useState("")
  const [customMetadata2, setCustomMetadata2] = useState("")
  const [customMetadata3, setCustomMetadata3] = useState("")
  const [showResults, setShowResults] = useState(false)

  const metadataOptions = [
    "Select metadata",
    "Grade Level",
    "Topic", 
    "Learning Objective",
    "Bloom's Taxonomy Level",
    "Competency",
    "Misconception",
    "Marks"
  ]

  // Filter out selected values from other dropdowns
  const getAvailableOptions = (excludeValues: string[]) => {
    return metadataOptions.filter(option => 
      option === "Select metadata" || !excludeValues.includes(option)
    )
  }

  const customMetadata1Options = getAvailableOptions([customMetadata2, customMetadata3])
  const customMetadata2Options = getAvailableOptions([customMetadata1, customMetadata3])
  const customMetadata3Options = getAvailableOptions([customMetadata1, customMetadata2])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      toast({
        title: "File uploaded successfully",
        description: `${file.name} has been uploaded.`
      })
    }
  }

  const handleDownloadTemplate = () => {
    // Create a simple CSV template
    const template = "Question,Answer,Grade,Topic\n\"Sample Question\",\"Sample Answer\",\"Grade 5\",\"Mathematics\""
    const blob = new Blob([template], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'item-metadata-template.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    
    toast({
      title: "Template downloaded",
      description: "Please fill in your item details and upload the completed file."
    })
  }

  const handleFilterAndGenerate = () => {
    if (!uploadedFile) {
      toast({
        title: "No file uploaded",
        description: "Please upload a completed template file first.",
        variant: "destructive"
      })
      return
    }

    if (!selectedMetadata || selectedMetadata === "Select metadata") {
      toast({
        title: "No metadata selected",
        description: "Please select at least the main metadata type.",
        variant: "destructive"
      })
      return
    }

    setShowResults(true)
    toast({
      title: "Analysis complete",
      description: "Metadata has been generated successfully."
    })
  }

  // Sample results data
  const resultsData = [
    {
      id: 1,
      question: "What is the sum of 5 + 3?",
      metadata1: selectedMetadata === "Grade Level" ? "Grade 3" : "Basic Addition",
      metadata2: customMetadata1 === "Topic" ? "Mathematics" : customMetadata1 || "-",
      metadata3: customMetadata2 === "Bloom's Taxonomy Level" ? "Knowledge" : customMetadata2 || "-"
    },
    {
      id: 2,
      question: "Identify the noun in this sentence: 'The dog runs fast.'",
      metadata1: selectedMetadata === "Grade Level" ? "Grade 4" : "Grammar",
      metadata2: customMetadata1 === "Topic" ? "English" : customMetadata1 || "-",
      metadata3: customMetadata2 === "Bloom's Taxonomy Level" ? "Comprehension" : customMetadata2 || "-"
    },
    {
      id: 3,
      question: "What is the capital of France?",
      metadata1: selectedMetadata === "Grade Level" ? "Grade 5" : "Geography",
      metadata2: customMetadata1 === "Topic" ? "Social Studies" : customMetadata1 || "-",
      metadata3: customMetadata2 === "Bloom's Taxonomy Level" ? "Knowledge" : customMetadata2 || "-"
    }
  ]

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Database className="h-6 w-6 text-blue-600" />
                <h1 className="text-2xl font-semibold text-gray-900">Item Metadata Generator</h1>
              </div>
            </div>
            <ProfileDropdown />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Step 1: Download Template */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-sm">1</span>
                  Download Standard Template
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Download the standard template and enter your item details as specified.
                </p>
                <Button onClick={handleDownloadTemplate} className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download Template
                </Button>
              </CardContent>
            </Card>

            {/* Step 2: Upload File */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-sm">2</span>
                  Import Completed File
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Upload the completed template file with your item details.
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Label htmlFor="file-upload" className="sr-only">Upload file</Label>
                    <Input
                      id="file-upload"
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileUpload}
                      className="cursor-pointer"
                    />
                  </div>
                  {uploadedFile && (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm">{uploadedFile.name}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Step 3: Select Metadata */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-sm">3</span>
                  Select Metadata to Generate
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="main-metadata">Primary Metadata</Label>
                  <Select value={selectedMetadata} onValueChange={setSelectedMetadata}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select metadata type" />
                    </SelectTrigger>
                    <SelectContent>
                      {metadataOptions.map((option) => (
                        <SelectItem key={option} value={option} disabled={option === "Select metadata"}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="custom-metadata-1">Custom Metadata 1</Label>
                    <Select value={customMetadata1} onValueChange={setCustomMetadata1}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select metadata" />
                      </SelectTrigger>
                      <SelectContent>
                        {customMetadata1Options.map((option) => (
                          <SelectItem key={option} value={option} disabled={option === "Select metadata"}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="custom-metadata-2">Custom Metadata 2</Label>
                    <Select value={customMetadata2} onValueChange={setCustomMetadata2}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select metadata" />
                      </SelectTrigger>
                      <SelectContent>
                        {customMetadata2Options.map((option) => (
                          <SelectItem key={option} value={option} disabled={option === "Select metadata"}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="custom-metadata-3">Custom Metadata 3</Label>
                    <Select value={customMetadata3} onValueChange={setCustomMetadata3}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select metadata" />
                      </SelectTrigger>
                      <SelectContent>
                        {customMetadata3Options.map((option) => (
                          <SelectItem key={option} value={option} disabled={option === "Select metadata"}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={handleFilterAndGenerate} className="w-full flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filter and Generate
                </Button>
              </CardContent>
            </Card>

            {/* Results Table */}
            {showResults && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Generated Metadata Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-16">Sl. No.</TableHead>
                          <TableHead>Question</TableHead>
                          <TableHead>
                            {selectedMetadata || "Metadata 1"}
                          </TableHead>
                          <TableHead>
                            {customMetadata1 || "Metadata 2"}
                          </TableHead>
                          <TableHead>
                            {customMetadata2 || "Metadata 3"}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {resultsData.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.id}</TableCell>
                            <TableCell className="max-w-md">{item.question}</TableCell>
                            <TableCell>{item.metadata1}</TableCell>
                            <TableCell>{item.metadata2}</TableCell>
                            <TableCell>{item.metadata3}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default ItemMetadata