import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useParams, Link } from "react-router-dom"
import { Save, FileSpreadsheet, Trash, ChevronDown, ChevronUp, ArrowLeft, PenTool, FileText } from "lucide-react"
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
            <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200">
              <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                <PenTool className="w-2 h-2 text-white" />
              </div>
              <span className="text-sm text-blue-700 font-medium">Ready to Evaluate</span>
            </div>
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
        {/* Page Title */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            <PenTool className="w-4 h-4" />
            Essay Assessment Platform
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
            Essay Evaluation System
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Evaluate candidate responses with AI-powered analysis and comprehensive feedback
          </p>
        </div>

        {/* Enhanced Tabs */}
        <Card className="border-gray-200 shadow-xl bg-white/90 backdrop-blur-sm">
          <Tabs defaultValue="evaluate" className="w-full">
            <div className="bg-gradient-to-r from-blue-100 via-purple-100 to-blue-100 border-b border-blue-300/70 px-8 pt-8 pb-4">
              <TabsList className="grid w-full grid-cols-2 bg-white/80 backdrop-blur-sm border-2 border-blue-300 shadow-2xl h-20 rounded-xl p-2">
                <TabsTrigger 
                  value="evaluate" 
                  className="relative flex items-center justify-center gap-3 text-gray-800 font-bold text-base transition-all duration-500 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-800 data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:scale-105 data-[state=active]:z-10 hover:bg-blue-100 hover:scale-102 rounded-lg mx-1 h-full px-4 py-2"
                >
                  <PenTool className="w-5 h-5" />
                  <span className="font-bold">Evaluate Candidate</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="review" 
                  className="relative flex items-center justify-center gap-3 text-gray-800 font-bold text-base transition-all duration-500 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-800 data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:scale-105 data-[state=active]:z-10 hover:bg-purple-100 hover:scale-102 rounded-lg mx-1 h-full px-4 py-2"
                >
                  <FileText className="w-5 h-5" />
                  <span className="font-bold">Review Evaluation</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="evaluate" className="p-6 space-y-6">
              {/* Candidate Input Section */}
              <Card className="bg-white/90 backdrop-blur-sm border border-gray-200/60 shadow-xl">
                <div className="p-8">
                  <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-1/3">
                      <div className="relative">
                        <img 
                          src={essayEvaluationImage}
                          alt="Essay Evaluation"
                          className="w-full h-48 object-cover rounded-xl shadow-lg"
                        />
                        <div className="absolute top-4 left-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                          <PenTool className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                    </div>
                    <div className="lg:w-2/3 space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Enter Candidate Information</h2>
                        <p className="text-gray-600">Provide candidate details to begin the evaluation process</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="candidateId" className="text-sm font-semibold text-gray-700">Candidate ID *</Label>
                          <Input 
                            id="candidateId"
                            value={candidateId}
                            onChange={(e) => setCandidateId(e.target.value)}
                            placeholder="Enter candidate ID"
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="courseDetails" className="text-sm font-semibold text-gray-700">Course Details</Label>
                          <Input 
                            id="courseDetails"
                            value={courseDetails}
                            onChange={(e) => setCourseDetails(e.target.value)}
                            placeholder="Enter course details"
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Summary and Actions Section */}
              <Card className="bg-white/90 backdrop-blur-sm border border-gray-200/60 shadow-xl">
                <div className="p-8">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">Evaluation Summary</h3>
                          <p className="text-gray-600">Total Questions: <span className="font-semibold text-gray-900">{totalQuestions}</span></p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium px-6 shadow-lg">
                        <PenTool className="h-4 w-4 mr-2" />
                        Evaluate Essay
                      </Button>
                      <Button variant="outline" className="border-gray-300 hover:bg-gray-50">
                        <Save className="h-4 w-4 mr-2" />
                        Save Response
                      </Button>
                      <Button variant="outline" className="border-gray-300 hover:bg-gray-50">
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        Export to Excel
                      </Button>
                      <Button variant="outline" className="border-gray-300 hover:bg-gray-50">
                        <Trash className="h-4 w-4 mr-2" />
                        Clear All
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="border-gray-300 hover:bg-gray-50"
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
                </div>
              </Card>

              {/* Questions Section */}
              <Card className="bg-white/90 backdrop-blur-sm border border-gray-200/60 shadow-xl">
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Questions</h3>
                      <p className="text-gray-600">Review and evaluate candidate responses</p>
                    </div>
                  </div>
                  <Accordion type="single" collapsible className="w-full space-y-4">
                    {questions.map((question) => (
                      <AccordionItem key={question.id} value={`question-${question.id}`} className="border border-gray-200 rounded-lg px-6 py-2">
                        <AccordionTrigger className="text-left hover:no-underline">
                          <div className="flex flex-col items-start w-full">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                {question.id}
                              </div>
                              <span className="font-semibold text-gray-900">Question ID: {question.id}</span>
                            </div>
                            <div className="text-sm text-gray-600 leading-relaxed">
                              <span className="font-medium">Question Stem:</span> {question.stem}
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-6 pt-4">
                          <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 p-6 rounded-xl border border-gray-200 space-y-4">
                            <div>
                              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <span className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center text-white text-xs font-bold">K</span>
                                Key Answer:
                              </h4>
                              <p className="text-sm text-gray-700 bg-white p-3 rounded-lg border border-blue-200">{question.keyAnswer}</p>
                            </div>
                            
                            <div>
                              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <span className="w-6 h-6 bg-green-600 rounded-md flex items-center justify-center text-white text-xs font-bold">M</span>
                                Marker Notes:
                              </h4>
                              <p className="text-sm text-gray-700 bg-white p-3 rounded-lg border border-green-200">{question.markerNotes}</p>
                            </div>

                            <div>
                              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <span className="w-6 h-6 bg-purple-600 rounded-md flex items-center justify-center text-white text-xs font-bold">P</span>
                                Key Points:
                              </h4>
                              <div className="bg-white p-4 rounded-lg border border-purple-200">
                                <ul className="space-y-2 text-sm text-gray-700">
                                  {question.keyPoints.map((point, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                      <span className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-xs font-bold mt-0.5 flex-shrink-0">
                                        {index + 1}
                                      </span>
                                      <span className="leading-relaxed">{point}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-6 text-sm">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-orange-600">Max Score:</span>
                                <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-md font-medium">{question.maxScore}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-indigo-600">Reference:</span>
                                <span className="text-indigo-700 font-medium">{question.reference}</span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <Label htmlFor={`answer-${question.id}`} className="text-sm font-bold text-gray-900 flex items-center gap-2">
                              <span className="w-6 h-6 bg-gray-600 rounded-md flex items-center justify-center text-white text-xs font-bold">A</span>
                              Answer Response:
                            </Label>
                            <Textarea 
                              id={`answer-${question.id}`}
                              placeholder="Enter candidate's answer response..."
                              className="min-h-[120px] border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
                              value={question.answer}
                            />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="review" className="p-6 space-y-6">
              <Card className="bg-white/90 backdrop-blur-sm border border-gray-200/60 shadow-xl">
                <div className="p-8 text-center space-y-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Evaluation</h2>
                    <p className="text-gray-600">Review and analyze completed evaluations with detailed feedback and scoring</p>
                  </div>
                  <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                    <p className="text-blue-800 font-medium">Review evaluation functionality will be implemented here.</p>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}

export default EssayEvaluationDetail