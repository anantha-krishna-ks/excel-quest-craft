import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Link } from "react-router-dom"
import { ArrowLeft, PenTool, Sparkles, X, Plus, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"

const EssayEvaluationZeroShot = () => {
  const [essayQuestion, setEssayQuestion] = useState("")
  const [essayAnswer, setEssayAnswer] = useState("")
  const [rubricInput, setRubricInput] = useState("")
  const [rubrics, setRubrics] = useState<string[]>([])
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [hasEvaluated, setHasEvaluated] = useState(false)
  const [evaluationResults, setEvaluationResults] = useState<{
    rationale: Array<{ rubric: string; score: string; explanation: string }>;
    overallScore: number;
  } | null>(null)

  const handleAddRubric = () => {
    const trimmed = rubricInput.trim()
    if (trimmed && !rubrics.includes(trimmed)) {
      setRubrics([...rubrics, trimmed])
      setRubricInput("")
    } else if (rubrics.includes(trimmed)) {
      toast.error("This rubric has already been added")
    }
  }

  const handleRemoveRubric = (rubricToRemove: string) => {
    setRubrics(rubrics.filter(r => r !== rubricToRemove))
  }

  const handleClearAnswer = () => {
    setEssayAnswer("")
    toast.success("Essay answer cleared")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddRubric()
    }
  }

  const handleSubmitEvaluation = async () => {
    if (!essayQuestion.trim()) {
      toast.error("Please enter an essay question")
      return
    }
    if (!essayAnswer.trim()) {
      toast.error("Please enter your essay answer")
      return
    }
    if (rubrics.length === 0) {
      toast.error("Please add at least one rubric")
      return
    }

    setIsEvaluating(true)
    
    // Simulate API call - replace with actual API integration
    setTimeout(() => {
      // Mock evaluation results
      const mockResults = {
        rationale: rubrics.map(rubric => ({
          rubric: rubric,
          score: `${Math.floor(Math.random() * 3) + 7}/10`,
          explanation: `The essay demonstrates ${rubric.toLowerCase()} through well-structured arguments and supporting evidence.`
        })),
        overallScore: Math.floor(Math.random() * 2) + 8
      }
      
      setEvaluationResults(mockResults)
      setHasEvaluated(true)
      setIsEvaluating(false)
      toast.success("Evaluation completed successfully!")
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 px-6 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
                <PenTool className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-gray-900">Essay Evaluation - Zero Shot</span>
                <span className="text-xs text-gray-500">AI-powered evaluation without predefined books</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-lg border border-purple-200">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-600">4,651 Tokens</span>
            </div>
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="text-gray-600">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Input Section */}
          <div className="space-y-6">
            {/* Page Title */}
            <div className="space-y-3 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                <PenTool className="w-3 h-3" />
                Zero Shot Assessment
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-blue-800 bg-clip-text text-transparent">
                Essay Evaluation
              </h1>
              <p className="text-sm text-gray-600">
                AI-powered evaluation with custom rubrics
              </p>
            </div>

            {/* Essay Section */}
            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Essay Question
                  </label>
                  <Input
                    placeholder="Enter your essay topic or question..."
                    value={essayQuestion}
                    onChange={(e) => setEssayQuestion(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Essay Answer
                    </label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearAnswer}
                      className="text-gray-500 hover:text-gray-700 h-auto py-1"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Clear
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Start writing your essay here..."
                    value={essayAnswer}
                    onChange={(e) => setEssayAnswer(e.target.value)}
                    className="w-full min-h-[160px] resize-y"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Rubrics Section */}
            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Evaluation Rubrics
                  </label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add rubric keyword (e.g., Clarity, Grammar)..."
                      value={rubricInput}
                      onChange={(e) => setRubricInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleAddRubric}
                      variant="outline"
                      size="sm"
                      className="px-3"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {rubrics.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {rubrics.map((rubric, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="px-3 py-1.5 text-sm bg-gradient-to-r from-blue-50 to-purple-50 text-gray-700 border border-blue-200 hover:border-purple-300 flex items-center gap-2 transition-all"
                      >
                        {rubric}
                        <button
                          onClick={() => handleRemoveRubric(rubric)}
                          className="hover:text-red-600 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button
              onClick={handleSubmitEvaluation}
              disabled={isEvaluating}
              className="w-full py-6 text-base bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isEvaluating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Evaluating Essay...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Submit for Evaluation
                </>
              )}
            </Button>
          </div>

          {/* Right Column - Results Section */}
          <div className="space-y-6">
            {hasEvaluated && evaluationResults ? (
              <div className="space-y-6 animate-fade-in">
                {/* Overall Score Card */}
                <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 via-blue-50 to-white shadow-lg">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-full text-xs font-medium text-purple-700 mb-3">
                      <Sparkles className="w-3 h-3" />
                      Overall Performance
                    </div>
                    <div className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                      {evaluationResults.overallScore}
                      <span className="text-3xl text-gray-400">/10</span>
                    </div>
                    <p className="text-sm text-gray-600">Average Score</p>
                  </CardContent>
                </Card>

                {/* Detailed Rubric Scores */}
                <Card className="border border-gray-200 shadow-sm">
                  <CardContent className="p-5">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-1 h-5 bg-gradient-to-b from-purple-600 to-blue-600 rounded-full"></div>
                      Rubric Breakdown
                    </h2>
                    <div className="space-y-3">
                      {evaluationResults.rationale.map((item, index) => {
                        const scoreValue = parseInt(item.score.split('/')[0])
                        const maxScore = 10
                        const percentage = (scoreValue / maxScore) * 100
                        const color = scoreValue >= 8 ? 'from-green-500 to-emerald-500' : 
                                     scoreValue >= 6 ? 'from-blue-500 to-cyan-500' : 
                                     'from-orange-500 to-red-500'
                        
                        return (
                          <div key={index} className="group p-4 rounded-lg border border-gray-100 hover:border-purple-200 hover:shadow-sm transition-all bg-gradient-to-r from-white to-gray-50">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-semibold text-gray-900">{item.rubric}</span>
                              <span className={`text-lg font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
                                {item.score}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-2 overflow-hidden">
                              <div 
                                className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-500 animate-scale-in`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed">{item.explanation}</p>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className="border border-gray-200 shadow-sm">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600 mb-1">
                        {evaluationResults.rationale.length}
                      </div>
                      <div className="text-xs text-gray-600">Rubrics Evaluated</div>
                    </CardContent>
                  </Card>
                  <Card className="border border-gray-200 shadow-sm">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {evaluationResults.rationale.filter(r => parseInt(r.score) >= 8).length}
                      </div>
                      <div className="text-xs text-gray-600">High Scores (8+)</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Evaluate</h3>
                  <p className="text-sm text-gray-600 max-w-sm mx-auto">
                    Fill in your essay question, write your answer, add rubrics, and submit for AI-powered evaluation
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EssayEvaluationZeroShot
