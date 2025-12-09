import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { ArrowLeft, ScanLine, Sparkles, Upload, FolderOpen, RotateCcw, Eye, CheckCircle, Clock, AlertCircle, Loader2, User, FileText, Building, MapPin } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface CandidateData {
  id: string
  candidateName: string
  registrationName: string
  centreName: string
  centreAddress: string
  phase1: "completed" | "in-progress" | "pending" | "error"
  phase2: "completed" | "in-progress" | "pending" | "error"
  phase3: "completed" | "in-progress" | "pending" | "error"
}

const StatusBadge = ({ status }: { status: string }) => {
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
    }
  }[status] || {
    icon: Clock,
    label: "Unknown",
    className: "bg-gray-50 text-gray-500 border-gray-200"
  }

  const Icon = config.icon

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${config.className}`}>
      <Icon className={`w-3.5 h-3.5 ${config.animate ? 'animate-spin' : ''}`} />
      {config.label}
    </div>
  )
}

const OCREvaluation = () => {
  const [isUploading, setIsUploading] = useState(false)
  const [hasUploaded, setHasUploaded] = useState(false)
  const [folderName, setFolderName] = useState("")
  const [candidates, setCandidates] = useState<CandidateData[]>([])
  const [previewCandidate, setPreviewCandidate] = useState<CandidateData | null>(null)
  const [detailCandidate, setDetailCandidate] = useState<CandidateData | null>(null)

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
                        <TableHead className="font-semibold text-slate-700 py-4 w-16">Sl. No</TableHead>
                        <TableHead className="font-semibold text-slate-700 py-4">Candidate Name</TableHead>
                        <TableHead className="font-semibold text-slate-700 py-4 text-center">Phase 1</TableHead>
                        <TableHead className="font-semibold text-slate-700 py-4 text-center">Phase 2</TableHead>
                        <TableHead className="font-semibold text-slate-700 py-4 text-center">Phase 3</TableHead>
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
                            <StatusBadge status={candidate.phase1} />
                          </TableCell>
                          <TableCell className="py-4 text-center">
                            <StatusBadge status={candidate.phase2} />
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
                  <p className="text-sm text-gray-500 mb-2">Phase 1</p>
                  <StatusBadge status={previewCandidate.phase1} />
                </div>
                <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                  <p className="text-sm text-gray-500 mb-2">Phase 2</p>
                  <StatusBadge status={previewCandidate.phase2} />
                </div>
                <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                  <p className="text-sm text-gray-500 mb-2">Phase 3</p>
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
    </div>
  )
}

export default OCREvaluation
