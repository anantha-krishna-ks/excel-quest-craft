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
      <div className="p-6 max-w-6xl mx-auto space-y-8">
        {/* Page Title */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 rounded-full text-sm font-semibold shadow-sm border border-purple-200/50">
            <PenTool className="w-4 h-4" />
            Zero Shot Essay Assessment
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-purple-700 to-blue-700 bg-clip-text text-transparent leading-tight">
            Essay Evaluation - Zero Shot
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Evaluate essays using AI with custom rubrics, without needing predefined books or training data
          </p>
        </div>

        {/* Essay Section */}
        <Card className="border-2 border-purple-100 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-purple-50/30">
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-md">
                <PenTool className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Essay Content</h2>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                Essay Question
              </label>
              <Input
                placeholder="Enter your essay topic or question..."
                value={essayQuestion}
                onChange={(e) => setEssayQuestion(e.target.value)}
                className="w-full border-purple-200 focus:border-purple-400 focus:ring-purple-400/20 text-base"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                  Essay Answer
                </label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAnswer}
                  className="text-gray-500 hover:text-purple-700 hover:bg-purple-50"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear Answer
                </Button>
              </div>
              <Textarea
                placeholder="Start writing your essay here..."
                value={essayAnswer}
                onChange={(e) => setEssayAnswer(e.target.value)}
                className="w-full min-h-[220px] resize-y border-purple-200 focus:border-purple-400 focus:ring-purple-400/20 text-base"
              />
            </div>
          </CardContent>
        </Card>

        {/* Rubrics Section */}
        <Card className="border-2 border-blue-100 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-blue-50/30">
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Evaluation Rubrics</h2>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                Add Rubric Keywords
              </label>
              <div className="flex gap-3">
                <Input
                  placeholder="Add a rubric keyword and press Enter..."
                  value={rubricInput}
                  onChange={(e) => setRubricInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 border-blue-200 focus:border-blue-400 focus:ring-blue-400/20 text-base"
                />
                <Button
                  onClick={handleAddRubric}
                  className="px-5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Add
                </Button>
              </div>
            </div>

            {rubrics.length > 0 && (
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  Current Rubrics ({rubrics.length})
                </label>
                <div className="flex flex-wrap gap-2.5 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                  {rubrics.map((rubric, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="px-4 py-2.5 text-sm font-medium bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 hover:from-blue-200 hover:to-blue-300 border border-blue-300/50 shadow-sm flex items-center gap-2 transition-all duration-200"
                    >
                      {rubric}
                      <button
                        onClick={() => handleRemoveRubric(rubric)}
                        className="hover:text-blue-900 hover:bg-blue-300/50 rounded-full p-0.5 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-center py-4">
          <Button
            onClick={handleSubmitEvaluation}
            disabled={isEvaluating}
            className="px-10 py-7 text-lg font-semibold bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 hover:from-purple-700 hover:via-purple-800 hover:to-blue-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl"
          >
            {isEvaluating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Evaluating Your Essay...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Submit for AI Evaluation
              </>
            )}
          </Button>
        </div>

        {/* Evaluation Results */}
        {hasEvaluated && evaluationResults && (
          <div className="space-y-8 animate-fade-in">
            {/* Overall Score Card */}
            <Card className="border-2 border-green-100 shadow-xl bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Overall Score</h2>
                    <p className="text-gray-600">Average across all rubrics</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-2xl">
                        <div className="text-center">
                          <div className="text-5xl font-bold text-white">{evaluationResults.overallScore}</div>
                          <div className="text-xl text-green-50 font-medium">/10</div>
                        </div>
                      </div>
                      <div className="absolute -top-2 -right-2 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                        <Sparkles className="w-6 h-6 text-yellow-800" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Rationale Section */}
            <Card className="border-2 border-purple-100 shadow-xl bg-gradient-to-br from-white to-purple-50/20">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-md">
                    <PenTool className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Detailed Rationale</h2>
                </div>
                
                <div className="space-y-6">
                  {evaluationResults.rationale.map((item, index) => {
                    const scoreNum = parseInt(item.score.split('/')[0])
                    const maxScore = parseInt(item.score.split('/')[1])
                    const percentage = (scoreNum / maxScore) * 100
                    
                    let scoreColor = 'from-red-500 to-orange-500'
                    let bgColor = 'from-red-50 to-orange-50'
                    let borderColor = 'border-red-200'
                    let badgeColor = 'bg-red-100 text-red-700'
                    
                    if (percentage >= 80) {
                      scoreColor = 'from-green-500 to-emerald-600'
                      bgColor = 'from-green-50 to-emerald-50'
                      borderColor = 'border-green-200'
                      badgeColor = 'bg-green-100 text-green-700'
                    } else if (percentage >= 60) {
                      scoreColor = 'from-blue-500 to-indigo-600'
                      bgColor = 'from-blue-50 to-indigo-50'
                      borderColor = 'border-blue-200'
                      badgeColor = 'bg-blue-100 text-blue-700'
                    }
                    
                    return (
                      <div 
                        key={index}
                        className={`p-6 rounded-xl bg-gradient-to-br ${bgColor} border-2 ${borderColor} shadow-md hover:shadow-lg transition-all duration-300`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <Badge className={`${badgeColor} font-semibold text-sm px-3 py-1 mb-3`}>
                              {item.rubric}
                            </Badge>
                            <p className="text-gray-700 leading-relaxed">{item.explanation}</p>
                          </div>
                          <div className={`ml-6 px-6 py-3 rounded-xl bg-gradient-to-br ${scoreColor} shadow-lg`}>
                            <div className="text-center">
                              <div className="text-3xl font-bold text-white">{scoreNum}</div>
                              <div className="text-sm text-white/90 font-medium">/{maxScore}</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span className="font-medium">Score Progress</span>
                            <span className="font-semibold">{percentage.toFixed(0)}%</span>
                          </div>
                          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                            <div 
                              className={`h-full bg-gradient-to-r ${scoreColor} transition-all duration-500 rounded-full shadow-sm`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Summary Statistics */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-2 border-blue-100 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-700">Rubrics Evaluated</h3>
                  </div>
                  <p className="text-4xl font-bold text-blue-600">{evaluationResults.rationale.length}</p>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-purple-100 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-purple-50 to-pink-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                      <PenTool className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-700">Highest Score</h3>
                  </div>
                  <p className="text-4xl font-bold text-purple-600">
                    {Math.max(...evaluationResults.rationale.map(r => parseInt(r.score.split('/')[0])))}/10
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-emerald-100 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-emerald-50 to-teal-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-700">Average Score</h3>
                  </div>
                  <p className="text-4xl font-bold text-emerald-600">{evaluationResults.overallScore}/10</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EssayEvaluationZeroShot
