import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { ArrowLeft, Eye, Search, FileQuestion, Hash, CheckCircle2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const CheckSimilarity = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const selectedQuestion = location.state?.question
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false)
  const [previewQuestion, setPreviewQuestion] = useState<any>(null)
  const [filterType, setFilterType] = useState("all")

  // Sample similar questions data
  const similarQuestions = [
    {
      id: 1,
      identifier: "IG_V2025_C43_LO307_MC_L4_EN_ID4825",
      question: "Within the context of accounting and finance functions in a large organisation, internal audit and external audit often address different objectives during their assessments. How do the roles of internal and external audit differ when reviewing the effectiveness of a company's internal control systems?",
      score: 74
    },
    {
      id: 2,
      identifier: "IG_V2025_C43_LO304_MC_L1_EN_ID4816",
      question: "An organisation is reviewing its annual accounting process to ensure compliance and accurate reporting for its owners. Which function is critical in transforming raw financial data into reports that reflect the company's performance each financial year?",
      score: 48
    },
    {
      id: 3,
      identifier: "IG_V2025_C43_LO303_MC_L1_EN_ID4815",
      question: "A company aims to monitor its procedures and performance to ensure operational effectiveness using appropriate organisational functions. Which role does accounting play in helping the company to achieve this goal?",
      score: 49
    },
    {
      id: 4,
      identifier: "IG_V2025_C43_LO302_MC_L2_EN_ID4814",
      question: "Managers in an organisation use various kinds of data to review internal processes and evaluate financial health for decision-making purposes. Which accounting function primarily focuses on providing detailed reports for internal management use?",
      score: 42
    },
    {
      id: 5,
      identifier: "IG_V2025_C43_LO301_MC_L3_EN_ID4813",
      question: "In a business environment, different stakeholders require financial information for various purposes. How does the target audience differ between management accounting and financial accounting?",
      score: 38
    }
  ]

  const handlePreview = (question: any) => {
    setPreviewQuestion(question)
    setIsPreviewDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">AL</span>
              </div>
              <img 
                src="/lovable-uploads/b5b0f5a8-9552-4635-8c44-d5e6f994179c.png" 
                alt="AI-Levate" 
                className="h-5 w-auto"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">Check Similarity</h1>

        {/* Selected Question Details */}
        <Card className="overflow-hidden bg-card border shadow-sm mb-6 animate-fade-in">
          {/* Compact Header */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-5 py-3 border-b">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <FileQuestion className="w-4 h-4 text-primary-foreground" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Question Details</h2>
            </div>
          </div>
          
          <div className="p-6 space-y-5">
            {/* Question ID Badge */}
            <div className="animate-scale-in">
              <div className="flex items-center gap-2 mb-2">
                <Hash className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Question ID</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-md">
                <span className="font-mono text-sm font-medium text-primary">
                  {selectedQuestion?.identifier || "C20_V2024_S11_L00_MC_L2_EN_ID2426"}
                </span>
              </div>
            </div>

            {/* Question Text */}
            <div className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-muted-foreground">Question</span>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-50/50 to-blue-50/50 rounded-md border border-purple-100">
                <p className="text-sm text-foreground leading-relaxed">
                  {selectedQuestion?.text || "What characteristic of pure risk makes it more acceptable for insurers to cover compared to speculative risk?"}
                </p>
              </div>
            </div>

            {/* Options */}
            <div className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-muted-foreground">Answer Options</span>
              </div>
              <div className="space-y-2.5">
                {selectedQuestion?.options ? (
                  selectedQuestion.options.map((option: any) => (
                    <div 
                      key={option.id} 
                      className="flex gap-3 p-3 bg-card rounded-md border border-border"
                    >
                      <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-primary to-blue-600 rounded flex items-center justify-center">
                        <span className="font-bold text-white text-sm">{option.id}</span>
                      </div>
                      <span className="text-sm text-foreground leading-relaxed flex-1">{option.text}</span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex gap-3 p-3 bg-card rounded-md border border-border">
                      <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-primary to-blue-600 rounded flex items-center justify-center">
                        <span className="font-bold text-white text-sm">A</span>
                      </div>
                      <span className="text-sm text-foreground leading-relaxed flex-1">Pure risk only involves potential loss or no loss, making it predictable</span>
                    </div>
                    <div className="flex gap-3 p-3 bg-card rounded-md border border-border">
                      <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-primary to-blue-600 rounded flex items-center justify-center">
                        <span className="font-bold text-white text-sm">B</span>
                      </div>
                      <span className="text-sm text-foreground leading-relaxed flex-1">Pure risk offers the possibility of gain</span>
                    </div>
                    <div className="flex gap-3 p-3 bg-card rounded-md border border-border">
                      <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-primary to-blue-600 rounded flex items-center justify-center">
                        <span className="font-bold text-white text-sm">C</span>
                      </div>
                      <span className="text-sm text-foreground leading-relaxed flex-1">Speculative risk is more measurable</span>
                    </div>
                    <div className="flex gap-3 p-3 bg-card rounded-md border border-border">
                      <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-primary to-blue-600 rounded flex items-center justify-center">
                        <span className="font-bold text-white text-sm">D</span>
                      </div>
                      <span className="text-sm text-foreground leading-relaxed flex-1">Pure risk always results in loss</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Filter Section */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Similar Questions</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Filter by:</span>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="stem">Stem and Option</SelectItem>
                <SelectItem value="high-score">High Score (&gt;60)</SelectItem>
                <SelectItem value="medium-score">Medium Score (40-60)</SelectItem>
                <SelectItem value="low-score">Low Score (&lt;40)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Similar Questions Table */}
        <Card className="bg-card border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold text-foreground">Sl No</TableHead>
                <TableHead className="font-semibold text-foreground">Question Identifier</TableHead>
                <TableHead className="font-semibold text-foreground w-[50%]">Question</TableHead>
                <TableHead className="font-semibold text-foreground text-center">Score</TableHead>
                <TableHead className="font-semibold text-foreground text-center">Preview</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {similarQuestions.map((question) => (
                <TableRow key={question.id}>
                  <TableCell className="text-foreground">{question.id}</TableCell>
                  <TableCell className="text-foreground font-mono text-sm">{question.identifier}</TableCell>
                  <TableCell className="text-foreground">{question.question}</TableCell>
                  <TableCell className="text-center">
                    <span className={`font-semibold ${
                      question.score >= 60 ? 'text-green-600' : 
                      question.score >= 40 ? 'text-orange-600' : 
                      'text-red-600'
                    }`}>
                      {question.score}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePreview(question)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Preview Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Question Preview</DialogTitle>
          </DialogHeader>
          
          {previewQuestion && (
            <div className="space-y-4">
              <div>
                <span className="text-sm font-medium text-muted-foreground">Question ID:</span>
                <p className="text-foreground mt-1 font-mono">{previewQuestion.identifier}</p>
              </div>

              <div>
                <span className="text-sm font-medium text-muted-foreground">Question:</span>
                <p className="text-foreground mt-2">{previewQuestion.question}</p>
              </div>

              <div>
                <span className="text-sm font-medium text-muted-foreground">Similarity Score:</span>
                <p className={`text-2xl font-bold mt-1 ${
                  previewQuestion.score >= 60 ? 'text-green-600' : 
                  previewQuestion.score >= 40 ? 'text-orange-600' : 
                  'text-red-600'
                }`}>
                  {previewQuestion.score}%
                </p>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={() => setIsPreviewDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CheckSimilarity
