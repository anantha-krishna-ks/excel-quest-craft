import { useState } from "react"
import { Link } from "react-router-dom"
import { 
  ArrowLeft, 
  Download, 
  Upload, 
  Filter,
  FileText,
  Database,
  CheckCircle,
  Sparkles,
  BarChart3,
  Target,
  Trash2,
  Eye,
  Settings
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ProfileDropdown } from "@/components/ProfileDropdown"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/hooks/use-toast"

const ItemMetadata = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [customMetadata1, setCustomMetadata1] = useState("")
  const [customMetadata2, setCustomMetadata2] = useState("")
  const [customMetadata3, setCustomMetadata3] = useState("")
  const [showResults, setShowResults] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

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

  const validateFile = (file: File) => {
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls') && !file.name.endsWith('.csv')) {
      toast({
        title: "Invalid File Format",
        description: "Please upload .xlsx, .xls, or .csv files only",
        variant: "destructive",
      })
      return false
    }
    return true
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && validateFile(file)) {
      setUploadedFile(file)
      toast({
        title: "File uploaded successfully",
        description: `${file.name} has been uploaded and validated.`
      })
    }
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(false)
    const file = event.dataTransfer.files[0]
    if (file && validateFile(file)) {
      setUploadedFile(file)
      toast({
        title: "File uploaded successfully",
        description: `${file.name} has been uploaded and validated.`
      })
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(false)
  }

  const handleRemoveFile = () => {
    setUploadedFile(null)
    const fileInput = document.getElementById('file-upload') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
    toast({
      title: "File Removed",
      description: "File has been removed successfully"
    })
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

    if (!customMetadata1 || customMetadata1 === "Select metadata" || 
        !customMetadata2 || customMetadata2 === "Select metadata" ||
        !customMetadata3 || customMetadata3 === "Select metadata") {
      toast({
        title: "Missing metadata selection",
        description: "Please select all three metadata types.",
        variant: "destructive"
      })
      return
    }

    setIsProcessing(true)
    
    // Simulate processing time
    setTimeout(() => {
      setIsProcessing(false)
      setShowResults(true)
      toast({
        title: "Analysis complete",
        description: "Metadata has been generated successfully."
      })
    }, 2500)
  }

  // Sample results data
  const resultsData = [
    {
      id: 1,
      question: "What is the sum of 5 + 3?",
      metadata1: customMetadata1 === "Grade Level" ? "Grade 3" : "Basic Addition",
      metadata2: customMetadata2 === "Topic" ? "Mathematics" : "Knowledge",
      metadata3: customMetadata3 === "Bloom's Taxonomy Level" ? "Knowledge" : "Addition"
    },
    {
      id: 2,
      question: "Identify the noun in this sentence: 'The dog runs fast.'",
      metadata1: customMetadata1 === "Grade Level" ? "Grade 4" : "Grammar",
      metadata2: customMetadata2 === "Topic" ? "English" : "Comprehension",
      metadata3: customMetadata3 === "Bloom's Taxonomy Level" ? "Comprehension" : "Grammar"
    },
    {
      id: 3,
      question: "What is the capital of France?",
      metadata1: customMetadata1 === "Grade Level" ? "Grade 5" : "Geography",
      metadata2: customMetadata2 === "Topic" ? "Social Studies" : "Knowledge",
      metadata3: customMetadata3 === "Bloom's Taxonomy Level" ? "Knowledge" : "Geography"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">IM</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Item Metadata</h1>
              <p className="text-sm text-gray-500">AI-Powered Metadata Extraction</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">2,847 Tokens</span>
            </div>
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Step 1: Download Template */}
          <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-blue-800">
                <div className="p-2 bg-blue-600 text-white rounded-lg">
                  <Download className="h-5 w-5" />
                </div>
                Step 1: Download Standard Template
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-700 mb-4">
                Download our standard template to ensure your data is formatted correctly for optimal metadata generation.
              </p>
              <Button 
                onClick={handleDownloadTemplate} 
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Template (.CSV)
              </Button>
            </CardContent>
          </Card>

          {/* Step 2: Upload File */}
          <Card className="border-2 border-green-100 bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-green-800">
                <div className="p-2 bg-green-600 text-white rounded-lg">
                  <Upload className="h-5 w-5" />
                </div>
                Step 2: Upload Your Completed File
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-700 mb-4">
                Upload your completed template with item details. Supported formats: .CSV, .XLSX, .XLS
              </p>
              
              <div 
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                  isDragOver 
                    ? 'border-green-400 bg-green-50' 
                    : uploadedFile 
                      ? 'border-green-300 bg-green-50' 
                      : 'border-gray-300 hover:border-green-400'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                {uploadedFile ? (
                  <div className="space-y-4">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
                    <div>
                      <p className="text-lg font-semibold text-green-800">{uploadedFile.name}</p>
                      <p className="text-sm text-green-600">File uploaded successfully</p>
                    </div>
                    <div className="flex gap-3 justify-center">
                      <Button 
                        onClick={handleRemoveFile}
                        variant="outline" 
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove File
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-gray-700">
                        Drag and drop your file here, or click to browse
                      </p>
                      <p className="text-sm text-gray-500">
                        Supports .CSV, .XLSX, .XLS files up to 10MB
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="file-upload" className="sr-only">Upload file</Label>
                      <Input
                        id="file-upload"
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleFileUpload}
                        className="max-w-xs mx-auto cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Step 3: Configure Metadata */}
          {uploadedFile && (
            <Card className="border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-purple-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-purple-800">
                  <div className="p-2 bg-purple-600 text-white rounded-lg">
                    <Settings className="h-5 w-5" />
                  </div>
                  Step 3: Configure Metadata Generation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="custom-metadata-1" className="text-sm font-medium text-purple-800">
                      Custom Metadata 1 <span className="text-red-500">*</span>
                    </Label>
                    <Select value={customMetadata1} onValueChange={setCustomMetadata1}>
                      <SelectTrigger className="bg-white border-purple-200">
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
                    <Label htmlFor="custom-metadata-2" className="text-sm font-medium text-purple-800">
                      Custom Metadata 2 <span className="text-red-500">*</span>
                    </Label>
                    <Select value={customMetadata2} onValueChange={setCustomMetadata2}>
                      <SelectTrigger className="bg-white border-purple-200">
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
                    <Label htmlFor="custom-metadata-3" className="text-sm font-medium text-purple-800">
                      Custom Metadata 3 <span className="text-red-500">*</span>
                    </Label>
                    <Select value={customMetadata3} onValueChange={setCustomMetadata3}>
                      <SelectTrigger className="bg-white border-purple-200">
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

                {isProcessing ? (
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="animate-spin">
                          <Sparkles className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-blue-800">Processing your items...</p>
                          <p className="text-sm text-blue-600">AI is analyzing and generating metadata</p>
                          <Progress value={75} className="w-full mt-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Button 
                    onClick={handleFilterAndGenerate} 
                    size="lg" 
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    disabled={!customMetadata1 || !customMetadata2 || !customMetadata3 || 
                             customMetadata1 === "Select metadata" || 
                             customMetadata2 === "Select metadata" || 
                             customMetadata3 === "Select metadata"}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Generate Metadata Analysis
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 4: Results */}
          {showResults && (
            <Card className="border-2 border-orange-100 bg-gradient-to-br from-orange-50 to-orange-100">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-orange-800">
                    <div className="p-2 bg-orange-600 text-white rounded-lg">
                      <BarChart3 className="h-5 w-5" />
                    </div>
                    Generated Metadata Results
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="border-orange-200 hover:bg-orange-100">
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white rounded-lg border border-orange-200">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-orange-100">
                        <TableHead className="w-16 font-semibold">Sl. No.</TableHead>
                        <TableHead className="font-semibold">Question</TableHead>
                        <TableHead className="font-semibold">
                          {customMetadata1 || "Metadata 1"}
                        </TableHead>
                        <TableHead className="font-semibold">
                          {customMetadata2 || "Metadata 2"}
                        </TableHead>
                        <TableHead className="font-semibold">
                          {customMetadata3 || "Metadata 3"}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {resultsData.map((item) => (
                        <TableRow key={item.id} className="hover:bg-orange-50">
                          <TableCell className="font-medium">{item.id}</TableCell>
                          <TableCell className="max-w-md text-sm">{item.question}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                              {item.metadata1}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              {item.metadata2}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                              {item.metadata3}
                            </Badge>
                          </TableCell>
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
  )
}

export default ItemMetadata