import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useParams, Link } from "react-router-dom"
import { Save, FileSpreadsheet, Trash, ChevronDown, ChevronUp, ArrowLeft, PenTool } from "lucide-react"
import essayEvaluationImage from "@/assets/essay-evaluation-hero.jpg"

const EssayEvaluationDetail = () => {
  const { essayId } = useParams()
  const [candidateId, setCandidateId] = useState("")
  const [courseDetails, setCourseDetails] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)

  const questions = [
    {
      id: 1,
      stem: "Briefly describe the purpose and construction of the rib cage.",
      keyAnswer: "Study 1, pp.11-12 – Verifying Facts—Importance of Visual Evidence – Any TEN (10) points required.",
      markerNotes: "Key points are underlined. Marks to be awarded if the student adequately addresses the key points. Allow marks for other valid points provided by the student.",
      keyPoints: [
        "Value of visual evidence: Photographs and videos provide objective evidence that helps determine negligence or refresh memories.",
        "Injuries: Photographs of injuries (e.g., scars) offer insights into impact on claimant's appearance.",
        "Size reference in photography: Use rulers or reference points to show size clearly; lighting improves visibility.",
        "Recording surveillance: Modern tech records claimant activities for verification.",
        "Video surveillance: Detailed investigations may require multiple recordings over time.",
        "Gather facts: Essential for laying a foundation for admissibility of surveillance.",
        "Hire a professional: Use experts for surveillance, photography, or accident reconstruction when needed.",
        "Photography records: Note date, time, place, and photographer details; mount and describe photographs.",
        "Digital recordings: Maintain strict handling records to prevent tampering claims.",
        "Admissibility: Depends on photographer's experience and equipment quality."
      ],
      maxScore: 10,
      reference: "Study 1 - Investigating Bodily Injury Claims, pp.11-12",
      answer: ""
    }
  ]

  const totalQuestions = questions.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 px-6 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <PenTool className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-gray-900">Essay Evaluation Detail</span>
                <span className="text-xs text-gray-500">Evaluate candidate responses and review evaluations</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/essay-evaluation">
              <Button variant="ghost" size="sm" className="text-gray-600">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Essays
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto space-y-8">
          <Tabs defaultValue="evaluate" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="evaluate">Evaluate Candidate</TabsTrigger>
              <TabsTrigger value="review">Review Evaluation</TabsTrigger>
            </TabsList>
            
            <TabsContent value="evaluate" className="space-y-6">
              {/* Header Section */}
              <Card className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3">
                    <img 
                      src={essayEvaluationImage}
                      alt="Essay Evaluation"
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  </div>
                  <div className="md:w-2/3">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Enter Candidate ID for Evaluation</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="candidateId">Candidate ID *</Label>
                        <Input 
                          id="candidateId"
                          value={candidateId}
                          onChange={(e) => setCandidateId(e.target.value)}
                          placeholder="Enter candidate ID"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="courseDetails">Course Details</Label>
                        <Input 
                          id="courseDetails"
                          value={courseDetails}
                          onChange={(e) => setCourseDetails(e.target.value)}
                          placeholder="Enter course details"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Summary Section */}
              <Card className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Summary</h3>
                    <p className="text-gray-600">Total Questions: <span className="font-semibold text-gray-900">{totalQuestions}</span></p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Evaluate Essay
                    </Button>
                    <Button variant="outline">
                      <Save className="h-4 w-4 mr-2" />
                      Save Response
                    </Button>
                    <Button variant="outline">
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Export to Excel
                    </Button>
                    <Button variant="outline">
                      <Trash className="h-4 w-4 mr-2" />
                      Clear All
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setIsExpanded(!isExpanded)}
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="h-4 w-4 mr-2" />
                          Collapse
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4 mr-2" />
                          Expand
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Questions Section */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Questions</h3>
                <Accordion type="single" collapsible className="w-full">
                  {questions.map((question) => (
                    <AccordionItem key={question.id} value={`question-${question.id}`}>
                      <AccordionTrigger className="text-left">
                        <div className="flex flex-col items-start">
                          <div className="font-medium">Question ID: {question.id}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            Question Stem: {question.stem}
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Key Answer:</h4>
                            <p className="text-sm text-gray-700">{question.keyAnswer}</p>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Marker Notes:</h4>
                            <p className="text-sm text-gray-700">{question.markerNotes}</p>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Key Points:</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                              {question.keyPoints.map((point, index) => (
                                <li key={index}>{point}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="flex gap-4 text-sm text-gray-600">
                            <span><strong>Max Score:</strong> {question.maxScore}</span>
                            <span><strong>Reference:</strong> {question.reference}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`answer-${question.id}`}>Answer Response:</Label>
                          <Textarea 
                            id={`answer-${question.id}`}
                            placeholder="Enter candidate's answer response..."
                            className="min-h-[100px]"
                            value={question.answer}
                          />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Card>
            </TabsContent>
            
            <TabsContent value="review" className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Review Evaluation</h2>
                <p className="text-gray-600">Review evaluation functionality will be implemented here.</p>
              </Card>
            </TabsContent>
          </Tabs>
      </div>
    </div>
  )
}

export default EssayEvaluationDetail