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
      <div className="p-6 max-w-5xl mx-auto space-y-8">
        {/* Page Title */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
            <PenTool className="w-4 h-4" />
            Zero Shot Essay Assessment
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-blue-800 bg-clip-text text-transparent">
            Essay Evaluation - Zero Shot
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Evaluate essays using AI with custom rubrics, without needing predefined books or training data
          </p>
        </div>

        {/* Essay Section */}
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-6 space-y-4">
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
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear Answer
                </Button>
              </div>
              <Textarea
                placeholder="Start writing your essay here..."
                value={essayAnswer}
                onChange={(e) => setEssayAnswer(e.target.value)}
                className="w-full min-h-[200px] resize-y"
              />
            </div>
          </CardContent>
        </Card>

        {/* Rubrics Section */}
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Rubric Keywords
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a rubric keyword and press Enter..."
                  value={rubricInput}
                  onChange={(e) => setRubricInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button
                  onClick={handleAddRubric}
                  variant="outline"
                  size="sm"
                  className="px-4"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>

            {rubrics.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Current Rubrics
                </label>
                <div className="flex flex-wrap gap-2">
                  {rubrics.map((rubric, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="px-3 py-2 text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center gap-2"
                    >
                      {rubric}
                      <button
                        onClick={() => handleRemoveRubric(rubric)}
                        className="hover:text-blue-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleSubmitEvaluation}
            disabled={isEvaluating}
            className="px-8 py-6 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {isEvaluating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Evaluating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Submit for Evaluation
              </>
            )}
          </Button>
        </div>

        {/* Evaluation Results */}
        {hasEvaluated && evaluationResults && (
          <div className="space-y-6 animate-fade-in">
            {/* Rationale Section */}
            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Rationale</h2>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-semibold">Rubric</TableHead>
                        <TableHead className="font-semibold">Score</TableHead>
                        <TableHead className="font-semibold">Explanation</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {evaluationResults.rationale.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.rubric}</TableCell>
                          <TableCell className="font-semibold text-blue-600">{item.score}</TableCell>
                          <TableCell className="text-gray-600">{item.explanation}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Evaluation Results Summary */}
            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Evaluation Results</h2>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-semibold">Criteria</TableHead>
                        <TableHead className="font-semibold text-right">Score</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {evaluationResults.rationale.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.rubric}</TableCell>
                          <TableCell className="text-right font-semibold text-blue-600">{item.score}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-blue-50 font-bold">
                        <TableCell>Overall Average Score</TableCell>
                        <TableCell className="text-right text-blue-700">{evaluationResults.overallScore}/10</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default EssayEvaluationZeroShot
