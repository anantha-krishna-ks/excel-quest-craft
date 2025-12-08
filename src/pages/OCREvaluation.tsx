import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { ArrowLeft, ScanLine, Sparkles, Upload, FolderOpen, RotateCcw, Eye, CheckCircle, Clock, AlertCircle, Loader2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface CandidateData {
  id: string
  candidateName: string
  phase1: "completed" | "in-progress" | "pending" | "error"
  phase2: "completed" | "in-progress" | "pending" | "error"
  phase3: "completed" | "in-progress" | "pending" | "error"
}

const OCREvaluation = () => {
  const [isUploading, setIsUploading] = useState(false)
  const [hasUploaded, setHasUploaded] = useState(false)
  const [folderName, setFolderName] = useState("")
  const [candidates, setCandidates] = useState<CandidateData[]>([])
  const [previewCandidate, setPreviewCandidate] = useState<CandidateData | null>(null)

  const handleFolderUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)

    // Simulate folder processing
    setTimeout(() => {
      // Extract folder name from the first file's path
      const firstFilePath = files[0].webkitRelativePath
      const extractedFolderName = firstFilePath.split('/')[0]
      setFolderName(extractedFolderName)

      // Generate mock candidate data from files
      const candidateNames = new Set<string>()
      Array.from(files).forEach(file => {
        // Extract candidate name from filename (assuming format: CandidateName_paper.pdf)
        const fileName = file.name.replace(/\.[^/.]+$/, "")
        const namePart = fileName.split('_')[0] || fileName
        if (namePart) candidateNames.add(namePart)
      })

      // If no valid names extracted, generate mock data
      const mockCandidates: CandidateData[] = candidateNames.size > 0 
        ? Array.from(candidateNames).slice(0, 125).map((name, index) => ({
            id: `candidate-${index + 1}`,
            candidateName: name,
            phase1: getRandomStatus(),
            phase2: getRandomStatus(),
            phase3: getRandomStatus(),
          }))
        : Array.from({ length: Math.min(files.length, 125) }, (_, index) => ({
            id: `candidate-${index + 1}`,
            candidateName: `Candidate ${String(index + 1).padStart(3, '0')}`,
            phase1: getRandomStatus(),
            phase2: getRandomStatus(),
            phase3: getRandomStatus(),
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "in-progress":
        return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
      case "pending":
        return <Clock className="w-5 h-5 text-amber-500" />
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return <span className="text-green-600 font-medium">Completed</span>
      case "in-progress":
        return <span className="text-blue-600 font-medium">In Progress</span>
      case "pending":
        return <span className="text-amber-500 font-medium">Pending</span>
      case "error":
        return <span className="text-red-500 font-medium">Error</span>
      default:
        return <span className="text-gray-400">Unknown</span>
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
            <div className="flex items-center gap-2 px-3 py-1.5 bg-teal-50 rounded-lg border border-teal-200">
              <Sparkles className="h-4 w-4 text-teal-600" />
              <span className="text-sm font-medium text-teal-600">
                {candidates.length} Candidates
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
          <Card className="border-2 border-teal-100 bg-gradient-to-br from-teal-50 to-teal-100">
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
            <Card className="border-2 border-slate-100 bg-gradient-to-br from-white to-slate-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-slate-500 text-white rounded-lg">
                    <ScanLine className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-semibold text-slate-700">Evaluation Results</h2>
                </div>

                <div className="overflow-x-auto bg-white rounded-lg border border-slate-200 shadow-sm">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50 border-b border-slate-200 hover:bg-slate-50">
                        <TableHead className="font-semibold text-slate-700 py-4">Candidate Name</TableHead>
                        <TableHead className="font-semibold text-slate-700 py-4 text-center">Phase 1</TableHead>
                        <TableHead className="font-semibold text-slate-700 py-4 text-center">Phase 2</TableHead>
                        <TableHead className="font-semibold text-slate-700 py-4 text-center">Phase 3</TableHead>
                        <TableHead className="font-semibold text-slate-700 py-4 text-center">Preview</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {candidates.map((candidate) => (
                        <TableRow 
                          key={candidate.id} 
                          className="border-b border-slate-100 last:border-b-0"
                        >
                          <TableCell className="font-medium text-slate-900 py-4">
                            {candidate.candidateName}
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex items-center justify-center gap-2">
                              {getStatusIcon(candidate.phase1)}
                              {getStatusLabel(candidate.phase1)}
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex items-center justify-center gap-2">
                              {getStatusIcon(candidate.phase2)}
                              {getStatusLabel(candidate.phase2)}
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex items-center justify-center gap-2">
                              {getStatusIcon(candidate.phase3)}
                              {getStatusLabel(candidate.phase3)}
                            </div>
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
                  <p className="text-sm text-gray-500 mb-2">Phase 1</p>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(previewCandidate.phase1)}
                    {getStatusLabel(previewCandidate.phase1)}
                  </div>
                </div>
                <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                  <p className="text-sm text-gray-500 mb-2">Phase 2</p>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(previewCandidate.phase2)}
                    {getStatusLabel(previewCandidate.phase2)}
                  </div>
                </div>
                <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                  <p className="text-sm text-gray-500 mb-2">Phase 3</p>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(previewCandidate.phase3)}
                    {getStatusLabel(previewCandidate.phase3)}
                  </div>
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
    </div>
  )
}

export default OCREvaluation
