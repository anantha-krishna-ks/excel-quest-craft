import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { ArrowLeft, ScanLine, Sparkles, Upload, FolderOpen, RotateCcw, Eye, CheckCircle, Clock, AlertCircle, Loader2, User, FileText, Building, MapPin, X, Edit2, ChevronLeft, ChevronRight, Image, Award, Target, ListChecks, AlertTriangle, MessageSquare } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

interface AnswerSheetPage {
  pageNumber: number
  imageUrl: string
}

interface SegmentImage {
  id: number
  imageUrl: string
  label: string
}

interface EvaluationData {
  questionTitle: string
  maxScore: number
  extractedInfo: string
  keypoints: string[]
  evaluationScore: number
  missing: string[]
  rational: string
}

interface CandidateData {
  id: string
  candidateName: string
  registrationName: string
  centreName: string
  centreAddress: string
  phase1: "completed" | "in-progress" | "pending" | "error"
  phase2: "completed" | "in-progress" | "pending" | "error"
  phase3: "completed" | "in-progress" | "pending" | "error"
  segmentData?: string
  ocrData?: string
  answerSheets?: AnswerSheetPage[]
  segmentImages?: SegmentImage[]
  evaluationData?: EvaluationData
}

const StatusBadge = ({ 
  status, 
  clickable = false, 
  onClick 
}: { 
  status: string
  clickable?: boolean
  onClick?: () => void
}) => {
  const config = {
    completed: {
      icon: CheckCircle,
      label: "Completed",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200"
    },
    "in-progress": {
      icon: Loader2,
      label: "In Progress",
      className: "bg-blue-50 text-blue-700 border-blue-200",
      animate: true
    },
    pending: {
      icon: Clock,
      label: "Pending",
      className: "bg-amber-50 text-amber-700 border-amber-200"
    },
    error: {
      icon: AlertCircle,
      label: "Error",
      className: "bg-red-50 text-red-700 border-red-200"
    },
    approved: {
      icon: CheckCircle,
      label: "Approved",
      className: "bg-teal-50 text-teal-700 border-teal-200"
    }
  }[status] || {
    icon: Clock,
    label: "Unknown",
    className: "bg-gray-50 text-gray-500 border-gray-200"
  }

  const Icon = config.icon

  return (
    <button
      type="button"
      onClick={clickable ? onClick : undefined}
      disabled={!clickable}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${config.className} ${
        clickable ? 'cursor-pointer hover:ring-2 hover:ring-teal-300 transition-all' : 'cursor-default'
      }`}
    >
      <Icon className={`w-3.5 h-3.5 ${config.animate ? 'animate-spin' : ''}`} />
      {config.label}
    </button>
  )
}

const OCREvaluation = () => {
  const [isUploading, setIsUploading] = useState(false)
  const [hasUploaded, setHasUploaded] = useState(false)
  const [folderName, setFolderName] = useState("")
  const [fileCount, setFileCount] = useState(0)
  const [totalFileSize, setTotalFileSize] = useState(0)
  const [candidates, setCandidates] = useState<CandidateData[]>([])
  const [previewCandidate, setPreviewCandidate] = useState<CandidateData | null>(null)
  const [detailCandidate, setDetailCandidate] = useState<CandidateData | null>(null)
  const [ocrReviewCandidate, setOcrReviewCandidate] = useState<CandidateData | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedSegmentData, setEditedSegmentData] = useState("")
  const [editedOcrData, setEditedOcrData] = useState("")
  const [phase1ReviewCandidate, setPhase1ReviewCandidate] = useState<CandidateData | null>(null)
  const [fromPageInput, setFromPageInput] = useState("")
  const [toPageInput, setToPageInput] = useState("")
  const [answerSheets, setAnswerSheets] = useState<AnswerSheetPage[]>([])
  const [evaluationReviewCandidate, setEvaluationReviewCandidate] = useState<CandidateData | null>(null)
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0)
  const [ocrActiveQuestionIndex, setOcrActiveQuestionIndex] = useState(0)
  const [evalActiveQuestionIndex, setEvalActiveQuestionIndex] = useState(0)

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Mock questions list for Phase 1 review
  const mockQuestionsList = [
    { id: 1, text: "Explain the process of photosynthesis in plants and describe the role of chlorophyll in this process.", maxScore: 10, pages: 3 },
    { id: 2, text: "Define the term 'ecosystem' and describe the different components of an ecosystem with suitable examples.", maxScore: 8, pages: 2 },
    { id: 3, text: "What is cellular respiration? Explain the difference between aerobic and anaerobic respiration.", maxScore: 10, pages: 3 },
    { id: 4, text: "Describe the structure of DNA and explain how genetic information is transferred from one generation to another.", maxScore: 12, pages: 4 },
    { id: 5, text: "Explain the water cycle and its importance in maintaining ecological balance.", maxScore: 6, pages: 2 },
  ]

  // Mock evaluation data
  const generateMockEvaluationData = (): EvaluationData => ({
    questionTitle: "Explain the process of photosynthesis in plants and describe the role of chlorophyll in this process.",
    maxScore: 10,
    extractedInfo: "The student has explained that photosynthesis is a process where plants convert carbon dioxide and water into glucose and oxygen using sunlight. The answer mentions that this process takes place in the leaves and involves the green pigment called chlorophyll which captures light energy.",
    keypoints: [
      "Definition of photosynthesis correctly stated",
      "Reactants (CO₂ and H₂O) and products (glucose and O₂) identified",
      "Role of sunlight as energy source mentioned",
      "Chlorophyll identified as the light-absorbing pigment",
      "Location of photosynthesis in chloroplasts mentioned"
    ],
    evaluationScore: 7,
    missing: [
      "Light-dependent and light-independent reactions not explained",
      "Chemical equation not provided",
      "Stomata's role in gas exchange not mentioned"
    ],
    rational: "The student demonstrates a good foundational understanding of photosynthesis. The answer correctly identifies the basic components and process of photosynthesis. However, the response lacks depth in explaining the detailed mechanisms such as the two stages of photosynthesis (light-dependent and light-independent reactions). The role of chlorophyll is mentioned but could be elaborated further to include how it absorbs specific wavelengths of light. Overall, a competent answer that meets most basic requirements but misses some advanced concepts expected at this level."
  })

  // Mock answer sheet images
  const generateMockAnswerSheets = (): AnswerSheetPage[] => {
    return [
      { pageNumber: 1, imageUrl: "/lovable-uploads/a13547e7-af5f-49b0-bb15-9b344d6cd72e.png" },
      { pageNumber: 2, imageUrl: "/lovable-uploads/b401ff6b-c99f-41b0-8578-92b80ce62cd0.png" },
      { pageNumber: 3, imageUrl: "/lovable-uploads/b5b0f5a8-9552-4635-8c44-d5e6f994179c.png" },
    ]
  }

  // Mock segment images (handwritten answer segments)
  const generateMockSegmentImages = (): SegmentImage[] => {
    return [
      { id: 1, imageUrl: "/lovable-uploads/a13547e7-af5f-49b0-bb15-9b344d6cd72e.png", label: "Section A - Q1-10" },
      { id: 2, imageUrl: "/lovable-uploads/b401ff6b-c99f-41b0-8578-92b80ce62cd0.png", label: "Section B - Q11-20" },
      { id: 3, imageUrl: "/lovable-uploads/b5b0f5a8-9552-4635-8c44-d5e6f994179c.png", label: "Section C - Q21-30" },
    ]
  }

  const handleFolderUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)

    // Calculate total file size
    const totalSize = Array.from(files).reduce((acc, file) => acc + file.size, 0)

    setTimeout(() => {
      const firstFilePath = files[0].webkitRelativePath
      const extractedFolderName = firstFilePath.split('/')[0]
      setFolderName(extractedFolderName)
      setFileCount(files.length)
      setTotalFileSize(totalSize)

      const candidateNames = new Set<string>()
      Array.from(files).forEach(file => {
        const fileName = file.name.replace(/\.[^/.]+$/, "")
        const namePart = fileName.split('_')[0] || fileName
        if (namePart) candidateNames.add(namePart)
      })

      const centres = ["Delhi Centre", "Mumbai Centre", "Bangalore Centre", "Chennai Centre", "Kolkata Centre"]
      const addresses = [
        "123, Connaught Place, New Delhi - 110001",
        "456, Bandra West, Mumbai - 400050",
        "789, MG Road, Bangalore - 560001",
        "321, Anna Nagar, Chennai - 600040",
        "654, Park Street, Kolkata - 700016"
      ]
      
      const mockCandidates: CandidateData[] = candidateNames.size > 0 
        ? Array.from(candidateNames).slice(0, 125).map((name, index) => ({
            id: `candidate-${index + 1}`,
            candidateName: name,
            registrationName: `REG${String(index + 1).padStart(6, '0')}`,
            centreName: centres[index % centres.length],
            centreAddress: addresses[index % addresses.length],
            phase1: getRandomStatus(),
            phase2: getRandomStatus(),
            phase3: getRandomStatus(),
            segmentData: `Section A: Question 1-10\nSection B: Question 11-20\nSection C: Question 21-30\nTotal Segments: 30\nDetected Boundaries: 28/30`,
            ocrData: `Extracted Text Preview:\n\nQ1. What is the capital of India?\nA) Mumbai B) Delhi C) Chennai D) Kolkata\n\nQ2. Which river is longest in India?\nA) Ganga B) Yamuna C) Godavari D) Brahmaputra\n\nConfidence Score: 94.5%\nCharacter Recognition Rate: 98.2%`,
            segmentImages: generateMockSegmentImages(),
            evaluationData: generateMockEvaluationData(),
          }))
        : Array.from({ length: Math.min(files.length, 125) }, (_, index) => ({
            id: `candidate-${index + 1}`,
            candidateName: `Candidate ${String(index + 1).padStart(3, '0')}`,
            registrationName: `REG${String(index + 1).padStart(6, '0')}`,
            centreName: centres[index % centres.length],
            centreAddress: addresses[index % addresses.length],
            phase1: getRandomStatus(),
            phase2: getRandomStatus(),
            phase3: getRandomStatus(),
            segmentData: `Section A: Question 1-10\nSection B: Question 11-20\nSection C: Question 21-30\nTotal Segments: 30\nDetected Boundaries: 28/30`,
            ocrData: `Extracted Text Preview:\n\nQ1. What is the capital of India?\nA) Mumbai B) Delhi C) Chennai D) Kolkata\n\nQ2. Which river is longest in India?\nA) Ganga B) Yamuna C) Godavari D) Brahmaputra\n\nConfidence Score: 94.5%\nCharacter Recognition Rate: 98.2%`,
            segmentImages: generateMockSegmentImages(),
            evaluationData: generateMockEvaluationData(),
          }))

      setCandidates(mockCandidates)
      setHasUploaded(true)
      setIsUploading(false)
      toast.success(`Successfully uploaded ${files.length} files from "${extractedFolderName}"`)
    }, 2000)
  }

  const getRandomStatus = (): "completed" | "in-progress" | "pending" | "error" => {
    const statuses: ("completed" | "in-progress" | "pending" | "error")[] = ["completed", "in-progress", "pending", "error"]
    const weights = [0.6, 0.15, 0.15, 0.1]
    const random = Math.random()
    let cumulative = 0
    for (let i = 0; i < weights.length; i++) {
      cumulative += weights[i]
      if (random < cumulative) return statuses[i]
    }
    return "pending"
  }

  const handleReupload = () => {
    setHasUploaded(false)
    setCandidates([])
    setFolderName("")
    setFileCount(0)
    setTotalFileSize(0)
    toast.info("Ready to upload a new folder")
  }

  const handleOpenOcrReview = (candidate: CandidateData) => {
    setOcrReviewCandidate(candidate)
    setEditedSegmentData(candidate.segmentData || "")
    setEditedOcrData(candidate.ocrData || "")
    setIsEditing(false)
  }

  const handleOpenPhase1Review = (candidate: CandidateData) => {
    setPhase1ReviewCandidate(candidate)
    const sheets = candidate.answerSheets || generateMockAnswerSheets()
    setAnswerSheets(sheets)
    setFromPageInput("")
    setToPageInput("")
  }

  const handleRepositionPages = () => {
    const fromPage = parseInt(fromPageInput)
    const toPage = parseInt(toPageInput)
    
    if (!fromPage || fromPage < 1 || fromPage > answerSheets.length) {
      toast.error(`Please enter a valid "From" page number (1-${answerSheets.length})`)
      return
    }
    if (!toPage || toPage < 1 || toPage > answerSheets.length) {
      toast.error(`Please enter a valid "To" page number (1-${answerSheets.length})`)
      return
    }
    if (fromPage === toPage) {
      toast.error("From and To page numbers must be different")
      return
    }
    
    const newSheets = [...answerSheets]
    const [removed] = newSheets.splice(fromPage - 1, 1)
    newSheets.splice(toPage - 1, 0, removed)
    
    // Update page numbers
    const updatedSheets = newSheets.map((sheet, idx) => ({
      ...sheet,
      pageNumber: idx + 1
    }))
    
    setAnswerSheets(updatedSheets)
    setFromPageInput("")
    setToPageInput("")
    toast.success(`Page ${fromPage} repositioned to position ${toPage}`)
  }

  const handleReorderPage = (fromIndex: number, toPosition: number) => {
    if (toPosition < 1 || toPosition > answerSheets.length) {
      toast.error(`Invalid position. Please enter a number between 1 and ${answerSheets.length}`)
      return
    }
    
    const newSheets = [...answerSheets]
    const [removed] = newSheets.splice(fromIndex, 1)
    newSheets.splice(toPosition - 1, 0, removed)
    
    // Update page numbers
    const reorderedSheets = newSheets.map((sheet, index) => ({
      ...sheet,
      pageNumber: index + 1
    }))
    
    setAnswerSheets(reorderedSheets)
    toast.success(`Page moved to position ${toPosition}`)
  }

  const handlePhase1Approve = () => {
    if (phase1ReviewCandidate) {
      setCandidates(prev => prev.map(c => {
        if (c.id === phase1ReviewCandidate.id) {
          return {
            ...c,
            phase1: "approved" as any,
            answerSheets: answerSheets
          }
        }
        return c
      }))
      toast.success(`Phase 1 approved for ${phase1ReviewCandidate.candidateName}`)
      setPhase1ReviewCandidate(null)
      setAnswerSheets([])
    }
  }

  const handleUpdate = () => {
    setIsEditing(true)
  }

  const handleSaveEdits = () => {
    if (ocrReviewCandidate) {
      setCandidates(prev => prev.map(c => {
        if (c.id === ocrReviewCandidate.id) {
          return {
            ...c,
            segmentData: editedSegmentData,
            ocrData: editedOcrData
          }
        }
        return c
      }))
      toast.success(`Changes saved for ${ocrReviewCandidate.candidateName}`)
      setIsEditing(false)
    }
  }

  const handleCancelEdits = () => {
    if (ocrReviewCandidate) {
      setEditedSegmentData(ocrReviewCandidate.segmentData || "")
      setEditedOcrData(ocrReviewCandidate.ocrData || "")
    }
    setIsEditing(false)
    toast.info("Changes discarded")
  }

  const handleApprove = () => {
    if (ocrReviewCandidate) {
      setCandidates(prev => prev.map(c => {
        if (c.id === ocrReviewCandidate.id) {
          return {
            ...c,
            phase2: "approved" as any,
            segmentData: editedSegmentData,
            ocrData: editedOcrData
          }
        }
        return c
      }))
      toast.success(`Phase 2 approved for ${ocrReviewCandidate.candidateName}`)
      setOcrReviewCandidate(null)
      setIsEditing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sticky top-0 z-50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-lg flex items-center justify-center shrink-0">
              <ScanLine className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-semibold text-gray-900">OCR Evaluation</h1>
              <p className="text-xs text-gray-500 hidden sm:block">AI-powered OCR accuracy assessment</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-purple-50 rounded-full border border-purple-200">
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-500" />
              <span className="text-xs sm:text-sm font-medium text-purple-600">
                4,651 Tokens
              </span>
            </div>
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="text-gray-600 px-2 sm:px-3">
                <ArrowLeft className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Back to Dashboard</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          {/* Upload Section */}
          <Card className="border-2 border-teal-100 bg-teal-50">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-4">
                <div className="p-1.5 sm:p-2 bg-teal-600 text-white rounded-lg shrink-0">
                  <FolderOpen className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <h2 className="text-lg sm:text-2xl font-semibold text-teal-800">Upload Assessment Folder</h2>
              </div>

              {!hasUploaded ? (
                <div className="space-y-4">
                  <p className="text-xs sm:text-sm text-gray-600">
                    Upload a folder containing candidate papers (supports up to 125 papers).
                  </p>
                  
                  <div className="flex flex-col items-center justify-center p-6 sm:p-8 border-2 border-dashed border-teal-300 rounded-lg bg-white/50">
                    <input
                      type="file"
                      id="folder-upload"
                      // @ts-ignore - webkitdirectory is a valid attribute
                      webkitdirectory=""
                      multiple
                      onChange={handleFolderUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                    <label
                      htmlFor="folder-upload"
                      className="flex flex-col items-center cursor-pointer"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-teal-600 mb-3 animate-spin" />
                          <span className="text-sm sm:text-base font-medium text-teal-700 text-center">Processing files...</span>
                          <span className="text-xs sm:text-sm text-gray-500 mt-1 text-center">Please wait while we analyze your documents</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-teal-600 mb-3" />
                          <span className="text-sm sm:text-base font-medium text-teal-700 text-center">Click to select a folder</span>
                          <span className="text-xs sm:text-sm text-gray-500 mt-1 text-center">Or drag and drop your assessment folder here</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/70 rounded-lg p-3 sm:p-4 border border-teal-200">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 sm:p-2 bg-teal-100 rounded-lg shrink-0">
                      <FolderOpen className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{folderName}</p>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                        <span>{candidates.length} papers</span>
                        <span className="text-gray-300">•</span>
                        <span>{fileCount} files</span>
                        <span className="text-gray-300">•</span>
                        <span className="font-medium text-teal-600">{formatFileSize(totalFileSize)}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={handleReupload}
                    variant="outline"
                    size="sm"
                    className="border-teal-300 text-teal-700 hover:bg-teal-50 shrink-0"
                  >
                    <RotateCcw className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Re-upload Folder</span>
                    <span className="sm:hidden">Re-upload</span>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Table */}
          {hasUploaded && candidates.length > 0 && (
            <Card className="border-2 border-slate-100 bg-white">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-4">
                  <div className="p-1.5 sm:p-2 bg-slate-500 text-white rounded-lg shrink-0">
                    <ScanLine className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <h2 className="text-lg sm:text-2xl font-semibold text-slate-700">Evaluation Results</h2>
                </div>

                <div className="overflow-x-auto bg-white rounded-lg border border-slate-200 -mx-4 sm:mx-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50 border-b border-slate-200 hover:bg-slate-50">
                        <TableHead className="font-semibold text-slate-700 py-3 sm:py-4 w-12 sm:w-16 text-xs sm:text-sm">Sl. No</TableHead>
                        <TableHead className="font-semibold text-slate-700 py-3 sm:py-4 text-xs sm:text-sm">Candidate Name</TableHead>
                        <TableHead className="font-semibold text-slate-700 py-3 sm:py-4 text-center text-xs sm:text-sm whitespace-nowrap">Segmentation</TableHead>
                        <TableHead className="font-semibold text-slate-700 py-3 sm:py-4 text-center text-xs sm:text-sm">OCR</TableHead>
                        <TableHead className="font-semibold text-slate-700 py-3 sm:py-4 text-center text-xs sm:text-sm">Evaluation</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {candidates.map((candidate, index) => (
                        <TableRow 
                          key={candidate.id} 
                          className="border-b border-slate-100 last:border-b-0"
                        >
                          <TableCell className="text-slate-600 py-3 sm:py-4 text-xs sm:text-sm">
                            {index + 1}
                          </TableCell>
                          <TableCell className="py-3 sm:py-4">
                            <button
                              onClick={() => setDetailCandidate(candidate)}
                              className="font-medium text-teal-700 hover:text-teal-800 hover:underline cursor-pointer text-left text-xs sm:text-sm"
                            >
                              {candidate.candidateName}
                            </button>
                          </TableCell>
                          <TableCell className="py-3 sm:py-4 text-center">
                            <StatusBadge 
                              status={candidate.phase1}
                              clickable={candidate.phase1 === "completed"}
                              onClick={() => handleOpenPhase1Review(candidate)}
                            />
                          </TableCell>
                          <TableCell className="py-3 sm:py-4 text-center">
                            <StatusBadge 
                              status={candidate.phase2} 
                              clickable={candidate.phase2 === "completed"}
                              onClick={() => handleOpenOcrReview(candidate)}
                            />
                          </TableCell>
                          <TableCell className="py-3 sm:py-4 text-center">
                            <StatusBadge 
                              status={candidate.phase3}
                              clickable={candidate.phase3 === "completed"}
                              onClick={() => setEvaluationReviewCandidate(candidate)}
                            />
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

      {/* Preview Dialog */}
      <Dialog open={!!previewCandidate} onOpenChange={() => setPreviewCandidate(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ScanLine className="w-5 h-5 text-teal-600" />
              Candidate Preview: {previewCandidate?.candidateName}
            </DialogTitle>
          </DialogHeader>
          
          {previewCandidate && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                  <p className="text-sm text-gray-500 mb-2">Segmentation Indexing</p>
                  <StatusBadge status={previewCandidate.phase1} />
                </div>
                <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                  <p className="text-sm text-gray-500 mb-2">OCR</p>
                  <StatusBadge status={previewCandidate.phase2} />
                </div>
                <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                  <p className="text-sm text-gray-500 mb-2">Evaluation</p>
                  <StatusBadge status={previewCandidate.phase3} />
                </div>
              </div>
              
              <div className="p-4 rounded-lg border border-slate-200 bg-white">
                <p className="text-sm text-gray-500 mb-2">OCR Analysis Summary</p>
                <p className="text-sm text-gray-700">
                  Detailed OCR analysis and accuracy metrics for this candidate will be displayed here once processing is complete.
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Candidate Detail Dialog */}
      <Dialog open={!!detailCandidate} onOpenChange={() => setDetailCandidate(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-teal-700">
              <User className="w-5 h-5" />
              Candidate Details
            </DialogTitle>
          </DialogHeader>
          
          {detailCandidate && (
            <div className="space-y-4 py-2">
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <User className="w-5 h-5 text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Name</p>
                    <p className="font-medium text-gray-900">{detailCandidate.candidateName}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <FileText className="w-5 h-5 text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Registration Name</p>
                    <p className="font-medium text-gray-900">{detailCandidate.registrationName}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <Building className="w-5 h-5 text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Centre Name</p>
                    <p className="font-medium text-gray-900">{detailCandidate.centreName}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <MapPin className="w-5 h-5 text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Centre Address</p>
                    <p className="font-medium text-gray-900">{detailCandidate.centreAddress}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* OCR Review Dialog */}
      <Dialog open={!!ocrReviewCandidate} onOpenChange={() => { setOcrReviewCandidate(null); setIsEditing(false); setOcrActiveQuestionIndex(0); }}>
        <DialogContent className="max-w-[95vw] w-full h-[95vh] max-h-[95vh] p-0 overflow-hidden [&>button]:hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 sm:p-4 border-b border-slate-200 bg-white">
            <DialogTitle className="flex items-center gap-2 text-slate-800 text-sm sm:text-base">
              <ScanLine className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" />
              <span className="truncate">OCR Review - {ocrReviewCandidate?.candidateName}</span>
            </DialogTitle>
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              {isEditing ? (
                <>
                  <Button
                    onClick={handleSaveEdits}
                    size="sm"
                    className="px-3 sm:px-6 text-xs sm:text-sm bg-teal-600 hover:bg-teal-700 text-white font-medium"
                  >
                    Save
                  </Button>
                  <Button
                    onClick={handleCancelEdits}
                    size="sm"
                    variant="outline"
                    className="px-3 sm:px-6 text-xs sm:text-sm border-slate-300 text-slate-700 hover:bg-slate-50 font-medium"
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={handleUpdate}
                    size="sm"
                    variant="outline"
                    className="px-3 sm:px-6 text-xs sm:text-sm border-slate-300 text-slate-700 hover:bg-slate-50 font-medium"
                  >
                    <Edit2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Update
                  </Button>
                  <Button
                    onClick={handleApprove}
                    size="sm"
                    className="px-3 sm:px-6 text-xs sm:text-sm bg-teal-600 hover:bg-teal-700 text-white font-medium"
                  >
                    Approve
                  </Button>
                </>
              )}
              <button 
                onClick={() => { setOcrReviewCandidate(null); setIsEditing(false); setOcrActiveQuestionIndex(0); }}
                className="p-1.5 rounded-md hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
          </div>
          
          {ocrReviewCandidate && (
            <div className="flex flex-col md:flex-row h-[calc(95vh-70px)]">
              {/* Left Sidebar: Question List */}
              <div className="w-full md:w-72 h-32 md:h-auto border-b md:border-b-0 md:border-r border-slate-200 bg-slate-50 flex flex-col shrink-0">
                <div className="px-4 py-3 border-b border-slate-200 bg-white">
                  <h4 className="text-sm font-semibold text-slate-700">Questions</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{mockQuestionsList.length} questions</p>
                </div>
                <ScrollArea className="flex-1">
                  <div className="p-2 space-y-1">
                    {mockQuestionsList.map((question, index) => (
                      <button
                        key={question.id}
                        onClick={() => setOcrActiveQuestionIndex(index)}
                        className={`w-full text-left px-3 py-3 rounded-lg transition-all ${
                          ocrActiveQuestionIndex === index
                            ? 'bg-teal-600 text-white shadow-sm'
                            : 'bg-white text-slate-700 border border-slate-200 hover:border-teal-300'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span className={`flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold shrink-0 ${
                            ocrActiveQuestionIndex === index
                              ? 'bg-white/20 text-white'
                              : 'bg-teal-100 text-teal-700'
                          }`}>
                            {question.id}
                          </span>
                          <p className={`text-xs leading-relaxed line-clamp-2 ${
                            ocrActiveQuestionIndex === index ? 'text-white/90' : 'text-slate-600'
                          }`}>
                            {question.text}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Right Content: Active Question Details */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <ScrollArea className="flex-1 bg-slate-50">
                  {/* Active Question Card */}
                  <div className="px-6 py-4 bg-gradient-to-r from-teal-50 to-slate-50">
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-teal-100">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-teal-600 text-white shrink-0">
                        <span className="text-sm font-bold">Q{mockQuestionsList[ocrActiveQuestionIndex]?.id}</span>
                      </div>
                      <div className="flex-1 space-y-2">
                        <p className="text-sm text-slate-800 leading-relaxed font-medium">
                          {mockQuestionsList[ocrActiveQuestionIndex]?.text}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Target className="w-3.5 h-3.5 text-teal-600" />
                            Max Score: <span className="font-semibold text-teal-700">{mockQuestionsList[ocrActiveQuestionIndex]?.maxScore}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Two Column Cards */}
                  <div className="px-6 py-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {/* Segment Card - with images */}
                    <div className="rounded-xl border border-slate-200 bg-indigo-50/50 overflow-hidden">
                      <div className="p-4 border-b border-slate-200 bg-white">
                        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                          <Image className="w-4 h-4 text-indigo-600" />
                          Segment
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">Handwritten answer sheet segments</p>
                      </div>
                      <div className="p-4 space-y-4">
                        {/* Segment Images */}
                        <div className="space-y-3">
                          {(ocrReviewCandidate.segmentImages || generateMockSegmentImages()).map((segment) => (
                            <div key={segment.id} className="rounded-lg border border-slate-200 bg-white overflow-hidden">
                              <div className="px-3 py-2 bg-slate-50 border-b border-slate-200">
                                <span className="text-xs font-medium text-slate-600">{segment.label}</span>
                              </div>
                              <div className="p-2">
                                <img 
                                  src={segment.imageUrl} 
                                  alt={segment.label}
                                  className="w-full h-32 object-cover rounded"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement
                                    target.src = "/placeholder.svg"
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Segment Text Data */}
                        <div className="mt-4 pt-4 border-t border-slate-200">
                          <p className="text-xs font-medium text-slate-600 mb-2">Segment Data</p>
                          {isEditing ? (
                            <Textarea
                              value={editedSegmentData}
                              onChange={(e) => setEditedSegmentData(e.target.value)}
                              className="min-h-[120px] text-sm font-mono bg-white border-slate-300 resize-none"
                              placeholder="Enter segment data..."
                            />
                          ) : (
                            <pre className="text-sm text-slate-700 whitespace-pre-wrap font-mono leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                              {ocrReviewCandidate.segmentData}
                            </pre>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* OCR Card */}
                    <div className="rounded-xl border border-slate-200 bg-indigo-50/50 overflow-hidden">
                      <div className="p-4 border-b border-slate-200 bg-white">
                        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-indigo-600" />
                          OCR
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">Extracted text from segments</p>
                      </div>
                      <div className="p-4">
                        {isEditing ? (
                          <Textarea
                            value={editedOcrData}
                            onChange={(e) => setEditedOcrData(e.target.value)}
                            className="min-h-[400px] text-sm font-mono bg-white border-slate-300 resize-none"
                            placeholder="Enter OCR data..."
                          />
                        ) : (
                          <pre className="text-sm text-slate-700 whitespace-pre-wrap font-mono leading-relaxed bg-white p-4 rounded-lg border border-slate-200 min-h-[400px]">
                            {ocrReviewCandidate.ocrData}
                          </pre>
                        )}
                      </div>
                    </div>
                  </div>
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Phase 1 Answer Sheets Review Dialog */}
      <Dialog open={!!phase1ReviewCandidate} onOpenChange={() => { setPhase1ReviewCandidate(null); setAnswerSheets([]); setActiveQuestionIndex(0); }}>
        <DialogContent className="max-w-[95vw] w-full h-[95vh] max-h-[95vh] p-0 overflow-hidden [&>button]:hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 sm:p-4 border-b border-slate-200 bg-white">
            <DialogTitle className="flex items-center gap-2 text-slate-800 text-sm sm:text-base">
              <Image className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" />
              <span className="truncate">Segmentation Indexing - {phase1ReviewCandidate?.candidateName}</span>
            </DialogTitle>
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              <Button
                onClick={handlePhase1Approve}
                size="sm"
                className="px-3 sm:px-6 text-xs sm:text-sm bg-teal-600 hover:bg-teal-700 text-white font-medium"
              >
                Approve
              </Button>
              <button 
                onClick={() => { setPhase1ReviewCandidate(null); setAnswerSheets([]); setActiveQuestionIndex(0); }}
                className="p-1.5 rounded-md hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
          </div>
          
          {phase1ReviewCandidate && (
            <div className="flex flex-col md:flex-row h-[calc(95vh-70px)]">
              {/* Left Sidebar: Question List */}
              <div className="w-full md:w-72 h-32 md:h-auto border-b md:border-b-0 md:border-r border-slate-200 bg-slate-50 flex flex-col shrink-0">
                <div className="px-4 py-3 border-b border-slate-200 bg-white">
                  <h4 className="text-sm font-semibold text-slate-700">Questions</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{mockQuestionsList.length} questions</p>
                </div>
                <ScrollArea className="flex-1">
                  <div className="p-2 space-y-1">
                    {mockQuestionsList.map((question, index) => (
                      <button
                        key={question.id}
                        onClick={() => setActiveQuestionIndex(index)}
                        className={`w-full text-left px-3 py-3 rounded-lg transition-all ${
                          activeQuestionIndex === index
                            ? 'bg-teal-600 text-white shadow-sm'
                            : 'bg-white text-slate-700 border border-slate-200 hover:border-teal-300'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span className={`flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold shrink-0 ${
                            activeQuestionIndex === index
                              ? 'bg-white/20 text-white'
                              : 'bg-teal-100 text-teal-700'
                          }`}>
                            {question.id}
                          </span>
                          <p className={`text-xs leading-relaxed line-clamp-2 ${
                            activeQuestionIndex === index ? 'text-white/90' : 'text-slate-600'
                          }`}>
                            {question.text}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Right Content: Active Question Details */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <ScrollArea className="flex-1 bg-slate-50">
                  {/* Header with Candidate Info & Controls */}
                  <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-teal-50 to-slate-50">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2 sm:gap-4">
                        <h3 className="text-sm sm:text-lg font-semibold text-slate-800 truncate">{phase1ReviewCandidate.candidateName}</h3>
                        <span className="text-xs sm:text-sm text-slate-500 bg-white/70 px-2 py-0.5 rounded shrink-0">
                          {phase1ReviewCandidate.registrationName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                        <div className="flex items-center gap-1 sm:gap-2 bg-white rounded-lg border border-slate-200 px-2 sm:px-3 py-1 sm:py-1.5">
                          <span className="text-xs font-medium text-slate-500">From</span>
                          <Input
                            type="number"
                            placeholder="#"
                            value={fromPageInput}
                            onChange={(e) => setFromPageInput(e.target.value)}
                            className="w-10 sm:w-14 h-6 sm:h-7 text-xs sm:text-sm border-slate-300 text-center"
                            min={1}
                            max={answerSheets.length}
                          />
                          <span className="text-xs font-medium text-slate-500">To</span>
                          <Input
                            type="number"
                            placeholder="#"
                            value={toPageInput}
                            onChange={(e) => setToPageInput(e.target.value)}
                            className="w-10 sm:w-14 h-6 sm:h-7 text-xs sm:text-sm border-slate-300 text-center"
                            min={1}
                            max={answerSheets.length}
                          />
                          <Button
                            onClick={handleRepositionPages}
                            size="sm"
                            className="h-6 sm:h-7 px-2 sm:px-3 bg-teal-600 hover:bg-teal-700 text-white text-xs"
                          >
                            Reposition
                          </Button>
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-slate-600 bg-white/70 px-2 py-0.5 rounded">
                          {answerSheets.length} pages
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Active Question Card */}
                  <div className="px-6 py-4 bg-white">
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-teal-50 to-slate-50 border border-teal-100">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-teal-600 text-white shrink-0">
                        <span className="text-sm font-bold">Q{mockQuestionsList[activeQuestionIndex]?.id}</span>
                      </div>
                      <div className="flex-1 space-y-2">
                        <p className="text-sm text-slate-800 leading-relaxed font-medium">
                          {mockQuestionsList[activeQuestionIndex]?.text}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Target className="w-3.5 h-3.5 text-teal-600" />
                            Max Score: <span className="font-semibold text-teal-700">{mockQuestionsList[activeQuestionIndex]?.maxScore}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5 text-slate-400" />
                            Pages: <span className="font-semibold text-slate-700">{mockQuestionsList[activeQuestionIndex]?.pages}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Answer Sheets Grid */}
                  <div className="px-4 sm:px-6 py-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      {answerSheets.map((sheet, index) => (
                        <div 
                          key={sheet.pageNumber}
                          id={`answer-sheet-${sheet.pageNumber}`}
                          className="rounded-xl border border-slate-200 bg-white overflow-hidden"
                        >
                          <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
                            <span className="text-sm font-medium text-slate-700">
                              Page {sheet.pageNumber}
                            </span>
                          </div>
                          <div className="p-3 bg-gray-100">
                            <div className="relative bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
                              <img 
                                src={sheet.imageUrl} 
                                alt={`Answer sheet page ${sheet.pageNumber}`}
                                className="w-full h-auto object-contain"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.src = "/placeholder.svg"
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Evaluation Review Dialog */}
      <Dialog open={!!evaluationReviewCandidate} onOpenChange={() => { setEvaluationReviewCandidate(null); setEvalActiveQuestionIndex(0); }}>
        <DialogContent className="max-w-[95vw] w-full h-[95vh] max-h-[95vh] p-0 overflow-hidden [&>button]:hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 sm:p-4 border-b border-slate-200 bg-white">
            <DialogTitle className="flex items-center gap-2 text-slate-800 text-sm sm:text-base">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" />
              <span className="truncate">Evaluation Review - {evaluationReviewCandidate?.candidateName}</span>
            </DialogTitle>
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              <Button
                onClick={() => {
                  setCandidates(prev => prev.map(c => {
                    if (c.id === evaluationReviewCandidate?.id) {
                      return { ...c, phase3: "approved" as any }
                    }
                    return c
                  }))
                  toast.success(`Evaluation approved for ${evaluationReviewCandidate?.candidateName}`)
                  setEvaluationReviewCandidate(null)
                  setEvalActiveQuestionIndex(0)
                }}
                size="sm"
                className="px-3 sm:px-6 text-xs sm:text-sm bg-teal-600 hover:bg-teal-700 text-white font-medium"
              >
                Approve
              </Button>
              <button 
                onClick={() => { setEvaluationReviewCandidate(null); setEvalActiveQuestionIndex(0); }}
                className="p-1.5 rounded-md hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
          </div>
          
          {evaluationReviewCandidate && (
            <div className="flex flex-col md:flex-row h-[calc(95vh-70px)]">
              {/* Left Sidebar: Question List */}
              <div className="w-full md:w-72 h-32 md:h-auto border-b md:border-b-0 md:border-r border-slate-200 bg-slate-50 flex flex-col shrink-0">
                <div className="px-4 py-3 border-b border-slate-200 bg-white">
                  <h4 className="text-sm font-semibold text-slate-700">Questions</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{mockQuestionsList.length} questions</p>
                </div>
                <ScrollArea className="flex-1">
                  <div className="p-2 space-y-1">
                    {mockQuestionsList.map((question, index) => (
                      <button
                        key={question.id}
                        onClick={() => setEvalActiveQuestionIndex(index)}
                        className={`w-full text-left px-3 py-3 rounded-lg transition-all ${
                          evalActiveQuestionIndex === index
                            ? 'bg-teal-600 text-white shadow-sm'
                            : 'bg-white text-slate-700 border border-slate-200 hover:border-teal-300'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span className={`flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold shrink-0 ${
                            evalActiveQuestionIndex === index
                              ? 'bg-white/20 text-white'
                              : 'bg-teal-100 text-teal-700'
                          }`}>
                            {question.id}
                          </span>
                          <p className={`text-xs leading-relaxed line-clamp-2 ${
                            evalActiveQuestionIndex === index ? 'text-white/90' : 'text-slate-600'
                          }`}>
                            {question.text}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Right Content: Active Question Details */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {(() => {
                  const evalData = evaluationReviewCandidate.evaluationData || generateMockEvaluationData()
                  const activeQuestion = mockQuestionsList[evalActiveQuestionIndex]
                  return (
                    <ScrollArea className="flex-1 bg-slate-50">
                      {/* Active Question Card */}
                      <div className="px-6 py-4 bg-gradient-to-r from-teal-50 to-slate-50">
                        <div className="flex items-start justify-between gap-6 p-4 rounded-xl bg-white border border-teal-100">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-teal-600 text-white shrink-0">
                              <span className="text-sm font-bold">Q{activeQuestion?.id}</span>
                            </div>
                            <div className="space-y-1 flex-1">
                              <p className="text-sm text-slate-800 leading-relaxed font-medium">
                                {activeQuestion?.text}
                              </p>
                            </div>
                          </div>
                          <div className="shrink-0 text-right">
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Max Score</p>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-50 border border-teal-200">
                              <Target className="w-4 h-4 text-teal-600" />
                              <span className="text-2xl font-bold text-teal-700">{activeQuestion?.maxScore}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Evaluation Details */}
                      <div className="px-4 sm:px-6 py-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                          {/* Left Column */}
                          <div className="space-y-5">
                            {/* Extracted Info */}
                            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                              <div className="px-4 py-3 bg-indigo-50 border-b border-slate-200 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-indigo-600" />
                                <h3 className="text-sm font-semibold text-slate-800">Extracted Info</h3>
                              </div>
                              <div className="p-4">
                                <p className="text-sm text-slate-600 leading-relaxed">
                                  {evalData.extractedInfo}
                                </p>
                              </div>
                            </div>

                            {/* Keypoints */}
                            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                              <div className="px-4 py-3 bg-emerald-50 border-b border-slate-200 flex items-center gap-2">
                                <ListChecks className="w-4 h-4 text-emerald-600" />
                                <h3 className="text-sm font-semibold text-slate-800">Keypoints</h3>
                              </div>
                              <div className="p-4">
                                <ul className="space-y-2">
                                  {evalData.keypoints.map((point, index) => (
                                    <li key={index} className="flex items-start gap-3 text-sm text-slate-600">
                                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                      <span>{point}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            {/* Evaluation Score */}
                            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                              <div className="px-4 py-3 bg-teal-50 border-b border-slate-200 flex items-center gap-2">
                                <Award className="w-4 h-4 text-teal-600" />
                                <h3 className="text-sm font-semibold text-slate-800">Evaluation Score</h3>
                              </div>
                              <div className="p-5 flex items-center justify-center">
                                <div className="flex items-baseline gap-2">
                                  <span className="text-5xl font-bold text-teal-600">{evalData.evaluationScore}</span>
                                  <span className="text-xl text-slate-400">/</span>
                                  <span className="text-2xl font-medium text-slate-500">{activeQuestion?.maxScore}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Right Column */}
                          <div className="space-y-5">
                            {/* Missing */}
                            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                              <div className="px-4 py-3 bg-amber-50 border-b border-slate-200 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-amber-600" />
                                <h3 className="text-sm font-semibold text-slate-800">Missing</h3>
                              </div>
                              <div className="p-4">
                                <ul className="space-y-2">
                                  {evalData.missing.map((item, index) => (
                                    <li key={index} className="flex items-start gap-3 text-sm text-slate-600">
                                      <X className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            {/* Rational */}
                            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                              <div className="px-4 py-3 bg-purple-50 border-b border-slate-200 flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-purple-600" />
                                <h3 className="text-sm font-semibold text-slate-800">Rational</h3>
                              </div>
                              <div className="p-4">
                                <p className="text-sm text-slate-600 leading-relaxed">
                                  {evalData.rational}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </ScrollArea>
                  )
                })()}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default OCREvaluation
