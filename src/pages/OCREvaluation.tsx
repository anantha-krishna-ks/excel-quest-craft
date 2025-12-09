import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { ArrowLeft, ScanLine, Sparkles, Upload, FolderOpen, RotateCcw, Eye, CheckCircle, Clock, AlertCircle, Loader2, User, FileText, Building, MapPin, X, Edit2, ChevronLeft, ChevronRight, Image } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

interface AnswerSheetPage {
  questionNumber: number
  fromPage: number
  toPage: number
  imageUrl: string
}

interface SegmentImage {
  id: number
  imageUrl: string
  label: string
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
  const [candidates, setCandidates] = useState<CandidateData[]>([])
  const [previewCandidate, setPreviewCandidate] = useState<CandidateData | null>(null)
  const [detailCandidate, setDetailCandidate] = useState<CandidateData | null>(null)
  const [ocrReviewCandidate, setOcrReviewCandidate] = useState<CandidateData | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedSegmentData, setEditedSegmentData] = useState("")
  const [editedOcrData, setEditedOcrData] = useState("")
  const [phase1ReviewCandidate, setPhase1ReviewCandidate] = useState<CandidateData | null>(null)
  const [pageNumberInput, setPageNumberInput] = useState("")
  const [answerSheets, setAnswerSheets] = useState<AnswerSheetPage[]>([])

  // Mock answer sheet images
  const generateMockAnswerSheets = (): AnswerSheetPage[] => {
    return [
      { questionNumber: 1, fromPage: 1, toPage: 2, imageUrl: "/lovable-uploads/a13547e7-af5f-49b0-bb15-9b344d6cd72e.png" },
      { questionNumber: 2, fromPage: 3, toPage: 4, imageUrl: "/lovable-uploads/b401ff6b-c99f-41b0-8578-92b80ce62cd0.png" },
      { questionNumber: 3, fromPage: 5, toPage: 6, imageUrl: "/lovable-uploads/b5b0f5a8-9552-4635-8c44-d5e6f994179c.png" },
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

    setTimeout(() => {
      const firstFilePath = files[0].webkitRelativePath
      const extractedFolderName = firstFilePath.split('/')[0]
      setFolderName(extractedFolderName)

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
    setPageNumberInput("")
  }

  const handleGoToPage = () => {
    const pageNum = parseInt(pageNumberInput)
    if (pageNum && pageNum >= 1 && pageNum <= answerSheets.length) {
      const element = document.getElementById(`answer-sheet-${pageNum}`)
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      toast.success(`Navigated to page ${pageNum}`)
    } else {
      toast.error(`Please enter a valid page number (1-${answerSheets.length})`)
    }
  }

  const handleReorderPage = (fromIndex: number, toPosition: number) => {
    if (toPosition < 1 || toPosition > answerSheets.length) {
      toast.error(`Invalid position. Please enter a number between 1 and ${answerSheets.length}`)
      return
    }
    
    const newSheets = [...answerSheets]
    const [removed] = newSheets.splice(fromIndex, 1)
    newSheets.splice(toPosition - 1, 0, removed)
    
    // Update question numbers
    const reorderedSheets = newSheets.map((sheet, index) => ({
      ...sheet,
      questionNumber: index + 1
    }))
    
    setAnswerSheets(reorderedSheets)
    toast.success(`Question moved to position ${toPosition}`)
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
      <header className="bg-white border-b border-gray-200 px-6 py-3 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-lg flex items-center justify-center">
              <ScanLine className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">OCR Evaluation</h1>
              <p className="text-xs text-gray-500">AI-powered OCR accuracy assessment</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-full border border-purple-200">
              <Sparkles className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium text-purple-600">
                4,651 Tokens
              </span>
            </div>
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="text-gray-600">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Upload Section */}
          <Card className="border-2 border-teal-100 bg-teal-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-teal-600 text-white rounded-lg">
                  <FolderOpen className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-semibold text-teal-800">Upload Assessment Folder</h2>
              </div>

              {!hasUploaded ? (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Upload a folder containing candidate papers (supports up to 125 papers).
                  </p>
                  
                  <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-teal-300 rounded-lg bg-white/50">
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
                          <Loader2 className="w-12 h-12 text-teal-600 mb-3 animate-spin" />
                          <span className="text-base font-medium text-teal-700">Processing files...</span>
                          <span className="text-sm text-gray-500 mt-1">Please wait while we analyze your documents</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-12 h-12 text-teal-600 mb-3" />
                          <span className="text-base font-medium text-teal-700">Click to select a folder</span>
                          <span className="text-sm text-gray-500 mt-1">Or drag and drop your assessment folder here</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-white/70 rounded-lg p-4 border border-teal-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-100 rounded-lg">
                      <FolderOpen className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{folderName}</p>
                      <p className="text-sm text-gray-500">{candidates.length} candidate papers uploaded</p>
                    </div>
                  </div>
                  <Button
                    onClick={handleReupload}
                    variant="outline"
                    className="border-teal-300 text-teal-700 hover:bg-teal-50"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Re-upload Folder
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Table */}
          {hasUploaded && candidates.length > 0 && (
            <Card className="border-2 border-slate-100 bg-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-slate-500 text-white rounded-lg">
                    <ScanLine className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-semibold text-slate-700">Evaluation Results</h2>
                </div>

                <div className="overflow-x-auto bg-white rounded-lg border border-slate-200">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50 border-b border-slate-200 hover:bg-slate-50">
                        <TableHead className="font-semibold text-slate-700 py-4 w-16">Sl. No</TableHead>
                        <TableHead className="font-semibold text-slate-700 py-4">Candidate Name</TableHead>
                        <TableHead className="font-semibold text-slate-700 py-4 text-center">Segmentation Indexing</TableHead>
                        <TableHead className="font-semibold text-slate-700 py-4 text-center">OCR</TableHead>
                        <TableHead className="font-semibold text-slate-700 py-4 text-center">Evaluation</TableHead>
                        <TableHead className="font-semibold text-slate-700 py-4 text-center">Preview</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {candidates.map((candidate, index) => (
                        <TableRow 
                          key={candidate.id} 
                          className="border-b border-slate-100 last:border-b-0"
                        >
                          <TableCell className="text-slate-600 py-4">
                            {index + 1}
                          </TableCell>
                          <TableCell className="py-4">
                            <button
                              onClick={() => setDetailCandidate(candidate)}
                              className="font-medium text-teal-700 hover:text-teal-800 hover:underline cursor-pointer text-left"
                            >
                              {candidate.candidateName}
                            </button>
                          </TableCell>
                          <TableCell className="py-4 text-center">
                            <StatusBadge 
                              status={candidate.phase1}
                              clickable={candidate.phase1 === "completed"}
                              onClick={() => handleOpenPhase1Review(candidate)}
                            />
                          </TableCell>
                          <TableCell className="py-4 text-center">
                            <StatusBadge 
                              status={candidate.phase2} 
                              clickable={candidate.phase2 === "completed"}
                              onClick={() => handleOpenOcrReview(candidate)}
                            />
                          </TableCell>
                          <TableCell className="py-4 text-center">
                            <StatusBadge status={candidate.phase3} />
                          </TableCell>
                          <TableCell className="py-4 text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setPreviewCandidate(candidate)}
                              className="text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Preview
                            </Button>
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
      <Dialog open={!!ocrReviewCandidate} onOpenChange={() => { setOcrReviewCandidate(null); setIsEditing(false); }}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden max-h-[90vh] [&>button]:hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-white">
            <DialogTitle className="flex items-center gap-2 text-slate-800">
              <ScanLine className="w-5 h-5 text-teal-600" />
              OCR - {ocrReviewCandidate?.candidateName}
            </DialogTitle>
            <button 
              onClick={() => { setOcrReviewCandidate(null); setIsEditing(false); }}
              className="p-1 rounded-md hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
          
          {ocrReviewCandidate && (
            <ScrollArea className="max-h-[calc(90vh-80px)]">
              <div className="p-6 space-y-6">
                {/* Two Column Cards */}
                <div className="grid grid-cols-2 gap-6">
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

                {/* Action Buttons */}
                <div className="flex items-center justify-center gap-4 pt-4 border-t border-slate-200">
                  {isEditing ? (
                    <>
                      <Button
                        onClick={handleSaveEdits}
                        className="px-8 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium"
                      >
                        Save Changes
                      </Button>
                      <Button
                        onClick={handleCancelEdits}
                        variant="outline"
                        className="px-8 py-2 border-slate-300 text-slate-700 hover:bg-slate-50 font-medium"
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={handleUpdate}
                        variant="outline"
                        className="px-8 py-2 border-slate-300 text-slate-700 hover:bg-slate-50 font-medium"
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Update
                      </Button>
                      <Button
                        onClick={handleApprove}
                        className="px-8 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium"
                      >
                        Approve
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      {/* Phase 1 Answer Sheets Review Dialog */}
      <Dialog open={!!phase1ReviewCandidate} onOpenChange={() => { setPhase1ReviewCandidate(null); setAnswerSheets([]); }}>
        <DialogContent className="max-w-[95vw] w-full h-[95vh] p-0 overflow-hidden [&>button]:hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-white">
            <DialogTitle className="flex items-center gap-2 text-slate-800">
              <Image className="w-5 h-5 text-teal-600" />
              Segmentation Indexing Review - {phase1ReviewCandidate?.candidateName}
            </DialogTitle>
            <div className="flex items-center gap-4">
              <Button
                onClick={handlePhase1Approve}
                size="sm"
                className="px-6 bg-teal-600 hover:bg-teal-700 text-white font-medium"
              >
                Approve
              </Button>
              <Button
                onClick={() => { setPhase1ReviewCandidate(null); setAnswerSheets([]); }}
                size="sm"
                variant="outline"
                className="px-6 border-slate-300 text-slate-700 hover:bg-slate-50 font-medium"
              >
                Cancel
              </Button>
              <button 
                onClick={() => { setPhase1ReviewCandidate(null); setAnswerSheets([]); }}
                className="p-1.5 rounded-md hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
          </div>
          
          {phase1ReviewCandidate && (
            <div className="flex flex-col h-[calc(95vh-70px)]">
              {/* Candidate Name Header */}
              <div className="px-6 py-3 bg-gradient-to-r from-teal-50 to-slate-50 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">{phase1ReviewCandidate.candidateName}</h3>
                    <p className="text-sm text-slate-500">Registration: {phase1ReviewCandidate.registrationName}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="Page #"
                        value={pageNumberInput}
                        onChange={(e) => setPageNumberInput(e.target.value)}
                        className="w-24 h-9 text-sm border-slate-300"
                        min={1}
                        max={answerSheets.length}
                      />
                      <Button
                        onClick={handleGoToPage}
                        size="sm"
                        className="bg-teal-600 hover:bg-teal-700 text-white"
                      >
                        Go to Page
                      </Button>
                    </div>
                    <span className="text-sm text-slate-500">
                      {answerSheets.length} pages
                    </span>
                  </div>
                </div>
              </div>

              {/* Answer Sheets Grid */}
              <ScrollArea className="flex-1 px-6 py-4">
                <div className="grid grid-cols-2 gap-6">
                  {answerSheets.map((sheet, index) => (
                    <div 
                      key={sheet.questionNumber}
                      id={`answer-sheet-${sheet.questionNumber}`}
                      className="rounded-xl border border-slate-200 bg-white overflow-hidden"
                    >
                      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
                        <span className="text-sm font-semibold text-teal-700">
                          Q{sheet.questionNumber}
                        </span>
                        <span className="text-sm text-slate-600">
                          Page {sheet.fromPage} - {sheet.toPage}
                        </span>
                      </div>
                      <div className="p-3 bg-gray-100">
                        <div className="relative bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
                          <img 
                            src={sheet.imageUrl} 
                            alt={`Answer sheet Q${sheet.questionNumber}`}
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
              </ScrollArea>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default OCREvaluation
