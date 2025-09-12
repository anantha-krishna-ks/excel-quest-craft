import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <PenTool className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Essay Evaluation Detail</h1>
              <p className="text-sm text-gray-500">Evaluate candidate responses and review evaluations</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/essay-evaluation">
              <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Essays
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          <Tabs defaultValue="evaluate" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="evaluate">Evaluate Candidate</TabsTrigger>
              <TabsTrigger value="review">Review Evaluation</TabsTrigger>
            </TabsList>
            
            <TabsContent value="evaluate" className="space-y-8">
              {/* Step 1: Candidate Information */}
              <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-blue-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-blue-800">
                    <div className="p-2 bg-blue-600 text-white rounded-lg">
                      <PenTool className="h-5 w-5" />
                    </div>
                    Step 1: Enter Candidate Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3">
                      <img 
                        src={essayEvaluationImage}
                        alt="Essay Evaluation"
                        className="w-full h-40 object-cover rounded-lg"
                      />
                    </div>
                    <div className="md:w-2/3 space-y-4">
                      <p className="text-blue-700 mb-4">
                        Enter the candidate ID and course details to begin the evaluation process.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="candidateId" className="text-blue-800">Candidate ID *</Label>
                          <Input 
                            id="candidateId"
                            value={candidateId}
                            onChange={(e) => setCandidateId(e.target.value)}
                            placeholder="Enter candidate ID"
                            className="bg-white border-blue-200"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="courseDetails" className="text-blue-800">Course Details</Label>
                          <Input 
                            id="courseDetails"
                            value={courseDetails}
                            onChange={(e) => setCourseDetails(e.target.value)}
                            placeholder="Enter course details"
                            className="bg-white border-blue-200"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Step 2: Evaluation Actions */}
              <Card className="border-2 border-green-100 bg-gradient-to-br from-green-50 to-green-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-green-800">
                    <div className="p-2 bg-green-600 text-white rounded-lg">
                      <Save className="h-5 w-5" />
                    </div>
                    Evaluation Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <p className="text-green-700 mb-2">
                        Total Questions: <span className="font-semibold text-green-800">{totalQuestions}</span>
                      </p>
                      <p className="text-sm text-green-600">
                        Use the actions below to manage your evaluation process.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button className="bg-green-600 hover:bg-green-700 text-white">
                        Evaluate Essay
                      </Button>
                      <Button variant="outline" className="border-green-200 hover:bg-green-50">
                        <Save className="h-4 w-4 mr-2" />
                        Save Response
                      </Button>
                      <Button variant="outline" className="border-green-200 hover:bg-green-50">
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        Export to Excel
                      </Button>
                      <Button variant="outline" className="border-green-200 hover:bg-green-50">
                        <Trash className="h-4 w-4 mr-2" />
                        Clear All
                      </Button>
                      <Button 
                        variant="outline"
                        className="border-green-200 hover:bg-green-50"
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
                </CardContent>
              </Card>

              {/* Step 3: Questions */}
              <Card className="border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-purple-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-purple-800">
                    <div className="p-2 bg-purple-600 text-white rounded-lg">
                      <FileSpreadsheet className="h-5 w-5" />
                    </div>
                    Step 2: Evaluate Questions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-purple-700 mb-6">
                    Review each question and provide candidate responses for evaluation.
                  </p>
                  <Accordion type="single" collapsible className="w-full space-y-4">
                    {questions.map((question) => (
                      <AccordionItem key={question.id} value={`question-${question.id}`} className="border border-purple-200 rounded-lg bg-white">
                        <AccordionTrigger className="text-left px-4 hover:no-underline">
                          <div className="flex flex-col items-start">
                            <div className="font-medium text-purple-800">Question ID: {question.id}</div>
                            <div className="text-sm text-purple-600 mt-1">
                              Question Stem: {question.stem}
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4 space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor={`answer-${question.id}`} className="text-purple-800 font-medium">
                              Answer Response:
                            </Label>
                            <Textarea 
                              id={`answer-${question.id}`}
                              placeholder="Enter candidate's answer response..."
                              className="min-h-[100px] bg-white border-purple-200"
                              value={question.answer}
                            />
                          </div>
                          
                          <div className="bg-purple-50 p-4 rounded-lg space-y-3 border border-purple-100">
                            <div>
                              <h4 className="font-semibold text-purple-900 mb-2">Key Answer:</h4>
                              <p className="text-sm text-purple-800">{question.keyAnswer}</p>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-purple-900 mb-2">Marker Notes:</h4>
                              <p className="text-sm text-purple-800">{question.markerNotes}</p>
                            </div>

                            <div>
                              <h4 className="font-semibold text-purple-900 mb-2">Key Points:</h4>
                              <ul className="list-disc list-inside space-y-1 text-sm text-purple-800">
                                {question.keyPoints.map((point, index) => (
                                  <li key={index}>{point}</li>
                                ))}
                              </ul>
                            </div>

                            <div className="flex gap-4 text-sm text-purple-700 pt-2 border-t border-purple-200">
                              <span><strong>Max Score:</strong> {question.maxScore}</span>
                              <span><strong>Reference:</strong> {question.reference}</span>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="review" className="space-y-8">
              <Card className="border-2 border-orange-100 bg-gradient-to-br from-orange-50 to-orange-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-orange-800">
                    <div className="p-2 bg-orange-600 text-white rounded-lg">
                      <FileSpreadsheet className="h-5 w-5" />
                    </div>
                    Review Evaluation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-orange-700">Review evaluation functionality will be implemented here.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

export default EssayEvaluationDetail