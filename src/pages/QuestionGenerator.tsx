import { useState } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { 
  ArrowLeft, 
  Sparkles,
  Brain,
  Target,
  Globe,
  Hash,
  MessageSquare,
  ChevronDown,
  Zap,
  Settings2,
  FileText,
  FileSpreadsheet,
  Save,
  Database,
  Clock,
  Eye,
  Edit3,
  Trash2,
  User
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

const formSchema = z.object({
  studyDomain: z.string().min(1, "Study domain is required"),
  taxonomyFramework: z.string().min(1, "Taxonomy framework is required"),
  questionQuantity: z.string().min(1, "Question quantity is required"),
  learningObjectives: z.string().min(1, "Learning objectives is required"),
  questionFormat: z.string().min(1, "Question format is required"),
  pointValue: z.string().min(1, "Point value is required"),
  additionalInstructions: z.string().min(1, "Additional instructions are required"),
})

const QuestionGenerator = () => {
  const { bookCode } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("generate")
  const [generationMode, setGenerationMode] = useState(true) // true for LLM, false for Knowledge Base

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studyDomain: "defining-risk",
      taxonomyFramework: "",
      questionQuantity: "1",
      learningObjectives: "explain-pure-risk", 
      questionFormat: "multiple-choice",
      pointValue: "1",
      additionalInstructions: "",
    },
  })

  const handleGenerateQuestions = (values: z.infer<typeof formSchema>) => {
    // This function only runs if validation passes
    console.log("Form submitted with values:", values)
    navigate("/question-generation-loading")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AL</span>
              </div>
              <img 
                src="/lovable-uploads/b5b0f5a8-9552-4635-8c44-d5e6f994179c.png" 
                alt="AI-Levate" 
                className="h-5 w-auto"
              />
              <span className="text-sm text-gray-500">Cyber Risk</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-600 rounded flex items-center justify-center">
                <span className="text-white text-xs">✦</span>
              </div>
              <span className="text-sm text-purple-600 font-medium">Cyber Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white text-xs">⚡</span>
              </div>
              <span className="text-sm text-blue-600 font-medium">7,762 Tokens</span>
            </div>
            <Link to="/item-generation">
              <Button variant="ghost" size="sm" className="text-gray-600">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Knowledge Base
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-600"
              onClick={() => {
                localStorage.removeItem('authToken')
                localStorage.removeItem('userSession')
                sessionStorage.clear()
                window.location.href = "/"
              }}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto">
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-2 max-w-lg">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setActiveTab("generate")}
                className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  activeTab === "generate"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Sparkles className="h-4 w-4" />
                Generate Questions
              </button>
              <button
                onClick={() => setActiveTab("repository")}
                className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  activeTab === "repository"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <FileText className="h-4 w-4" />
                Question Repository
              </button>
            </div>
          </div>
        </div>

        {activeTab === "generate" && (
          <div className="space-y-6">
            {/* Top Row - Tokens and AI Mode */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Available Tokens */}
              <Card className="p-6 bg-white border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-700">Available Tokens</h3>
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-green-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">7,762</div>
                <div className="text-sm text-green-600 flex items-center gap-1">
                  <span>+250 today</span>
                </div>
              </Card>

              {/* AI Generation Mode */}
              <Card className="p-6 bg-white border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-700">AI Generation Mode</h3>
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Settings2 className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Knowledge Base</span>
                  <Switch 
                    checked={generationMode} 
                    onCheckedChange={setGenerationMode}
                    className="data-[state=checked]:bg-blue-600"
                  />
                  <span className="text-sm font-medium text-blue-600">LLM</span>
                </div>
              </Card>
            </div>

            {/* Main Content Row */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left Column - Source Material */}
              <div className="lg:col-span-1 space-y-6">
                {/* Source Material */}
                <Card className="p-6 bg-white border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">Source Material</h3>
                  <p className="text-xs text-gray-500 mb-4">AI enhanced content</p>
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                    <img 
                      src="/lovable-uploads/a13547e7-af5f-49b0-bb15-9b344d6cd72e.png" 
                      alt="Cyber Risk Management"
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <h4 className="font-medium text-gray-900 text-sm mb-1">Cyber Risk Management</h4>
                    <p className="text-xs text-gray-500">Source material loaded successfully</p>
                  </div>
                </Card>
              </div>

              {/* Right Column - AI Question Generator */}
              <div className="lg:col-span-3">
                <Card className="p-6 bg-white border border-gray-200">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">AI Question Generator</h3>
                      <p className="text-sm text-gray-500">Configure your question generation settings</p>
                    </div>
                  </div>

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleGenerateQuestions)} className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left side form */}
                        <div className="space-y-6">
                          {/* Study Domain */}
                          <FormField
                            control={form.control}
                            name="studyDomain"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  <Target className="w-4 h-4 text-blue-600" />
                                  Study Domain
                                </FormLabel>
                                <FormControl>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger className="w-full bg-white border-gray-200">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="defining-risk">Defining Risk and Cyber</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Taxonomy Framework */}
                          <FormField
                            control={form.control}
                            name="taxonomyFramework"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  <Globe className="w-4 h-4 text-blue-600" />
                                  Taxonomy Framework
                                </FormLabel>
                                <FormControl>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger className="w-full bg-white border-gray-200">
                                      <SelectValue placeholder="Select framework" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="remember">Remember</SelectItem>
                                      <SelectItem value="understand">Understand</SelectItem>
                                      <SelectItem value="apply">Apply</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Question Quantity */}
                          <FormField
                            control={form.control}
                            name="questionQuantity"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  <Hash className="w-4 h-4 text-orange-600" />
                                  Question Quantity
                                </FormLabel>
                                <FormControl>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger className="w-full bg-white border-gray-200">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="1">1</SelectItem>
                                      <SelectItem value="5">5</SelectItem>
                                      <SelectItem value="10">10</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Right side form */}
                        <div className="space-y-6">
                          {/* Learning Objectives */}
                          <FormField
                            control={form.control}
                            name="learningObjectives"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  <Brain className="w-4 h-4 text-purple-600" />
                                  Learning Objectives
                                </FormLabel>
                                <FormControl>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger className="w-full bg-white border-gray-200">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="explain-pure-risk">Explain why pure risk is</SelectItem>
                                      <SelectItem value="define-cyber-risk">Define cyber risk fundamentals</SelectItem>
                                      <SelectItem value="analyze-threats">Analyze security threats</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Question Format */}
                          <FormField
                            control={form.control}
                            name="questionFormat"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-green-600" />
                                  Question Format
                                </FormLabel>
                                <FormControl>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger className="w-full bg-white border-gray-200">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                                      <SelectItem value="written-response">Written Response</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Point Value */}
                          <FormField
                            control={form.control}
                            name="pointValue"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  <span className="w-4 h-4 text-pink-600 text-sm font-bold">★</span>
                                  Point Value
                                </FormLabel>
                                <FormControl>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger className="w-full bg-white border-gray-200">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="1">1</SelectItem>
                                      <SelectItem value="2">2</SelectItem>
                                      <SelectItem value="5">5</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Additional Instructions - Full Width */}
                      <FormField
                        control={form.control}
                        name="additionalInstructions"
                        render={({ field }) => (
                          <FormItem className="mt-6">
                            <FormLabel className="flex items-center gap-2">
                              <MessageSquare className="w-4 h-4 text-purple-600" />
                              Additional Instructions
                            </FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Provide specific instructions for AI question generation..."
                                className="min-h-[100px] bg-white border-gray-200"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Generate Button */}
                      <div className="flex justify-center mt-8">
                        <Button 
                          type="submit"
                          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg"
                        >
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate Questions
                        </Button>
                      </div>
                    </form>
                  </Form>
                </Card>
              </div>
            </div>
          </div>
        )}

        {activeTab === "repository" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border border-gray-200">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">Total Questions</p>
                      <p className="text-2xl font-bold" style={{ color: "#1c398e", fontSize: '1.25rem' }}>
                        1,247
                      </p>
                      <p className="text-xs text-gray-500">+15% this month</p>
                    </div>
                    <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Database className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="border border-gray-200">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">AI Generated</p>
                      <p className="text-2xl font-bold" style={{ color: "#0d542b", fontSize: '1.25rem' }}>
                        892
                      </p>
                      <p className="text-xs text-gray-500">High quality</p>
                    </div>
                    <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-purple-600" />
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="border border-gray-200">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">This Week</p>
                      <p className="text-2xl font-bold" style={{ color: "#59168b", fontSize: '1.25rem' }}>
                        47
                      </p>
                      <p className="text-xs text-gray-500">New questions</p>
                    </div>
                    <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="border border-gray-200">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">Contributors</p>
                      <p className="text-2xl font-bold" style={{ color: "#7e2a0c", fontSize: '1.25rem' }}>
                        12
                      </p>
                      <p className="text-xs text-gray-500">Active authors</p>
                    </div>
                    <div className="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <User className="h-5 w-5 text-orange-600" />
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Filters & Search */}
            <Card className="border border-gray-200">
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Settings2 className="h-4 w-4" />
                    Filters & Search
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Source Type</label>
                      <Select defaultValue="all-sources">
                        <SelectTrigger className="bg-white border-gray-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 shadow-lg">
                          <SelectItem value="all-sources">All Sources</SelectItem>
                          <SelectItem value="book-based">Book Based</SelectItem>
                          <SelectItem value="ai-generated">AI Generated</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Study Area</label>
                      <Select defaultValue="all-areas">
                        <SelectTrigger className="bg-white border-gray-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 shadow-lg">
                          <SelectItem value="all-areas">All Areas</SelectItem>
                          <SelectItem value="cyber-risk">Cyber Risk</SelectItem>
                          <SelectItem value="risk-management">Risk Management</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Question Type</label>
                      <Select defaultValue="all-types">
                        <SelectTrigger className="bg-white border-gray-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 shadow-lg">
                          <SelectItem value="all-types">All Types</SelectItem>
                          <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                          <SelectItem value="true-false">True/False</SelectItem>
                          <SelectItem value="short-answer">Short Answer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Difficulty</label>
                      <Select defaultValue="all-levels">
                        <SelectTrigger className="bg-white border-gray-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 shadow-lg">
                          <SelectItem value="all-levels">All Levels</SelectItem>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Search Questions</label>
                    <div className="relative">
                      <Sparkles className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input 
                        placeholder="Search questions, topics, or content..." 
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Questions Table */}
            <Card className="border border-gray-200">
              <div className="p-0">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">3 Questions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 border-gray-200">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete Selected
                    </Button>
                    <Button variant="outline" size="sm" className="border-gray-200">
                      <FileText className="h-4 w-4 mr-1" />
                      Export to Word
                    </Button>
                    <Button variant="outline" size="sm" className="border-gray-200">
                      <FileSpreadsheet className="h-4 w-4 mr-1" />
                      Export to Excel
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="text-left p-4 text-sm font-medium text-gray-700 w-12">
                          <input type="checkbox" className="rounded border-gray-300" />
                        </th>
                        <th className="text-left p-4 text-sm font-medium text-gray-700 w-16">#</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-700 w-48">Question ID</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-700">Question</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-700">Type</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-700">Topic</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-700">Difficulty</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-700">Created</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-700 w-24">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-4">
                          <input type="checkbox" className="rounded border-gray-300" />
                        </td>
                        <td className="p-4 text-sm font-medium text-gray-900">1</td>
                        <td className="p-4 text-xs font-mono text-gray-600">C20_V2024_S11_L00_MC_L2_EN_ID2426</td>
                        <td className="p-4 text-sm text-gray-900 max-w-md">
                          <p className="truncate">What characteristic of pure risk makes it more acceptable for insurer...</p>
                        </td>
                        <td className="p-4 text-sm text-gray-700">Multiple Choice</td>
                        <td className="p-4 text-sm" style={{ color: "#7e2a0c" }}>Risk Management</td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Medium
                          </span>
                        </td>
                        <td className="p-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            2 hours ago
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-4">
                          <input type="checkbox" className="rounded border-gray-300" />
                        </td>
                        <td className="p-4 text-sm font-medium text-gray-900">2</td>
                        <td className="p-4 text-xs font-mono text-gray-600">C20_V2024_S11_L01_TF_L1_EN_ID2427</td>
                        <td className="p-4 text-sm text-gray-900 max-w-md">
                          <p className="truncate">Pure risk always results in a loss or no loss situation.</p>
                        </td>
                        <td className="p-4 text-sm text-gray-700">True/False</td>
                        <td className="p-4 text-sm" style={{ color: "#7e2a0c" }}>Risk Fundamentals</td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Easy
                          </span>
                        </td>
                        <td className="p-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            1 day ago
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-4">
                          <input type="checkbox" className="rounded border-gray-300" />
                        </td>
                        <td className="p-4 text-sm font-medium text-gray-900">3</td>
                        <td className="p-4 text-xs font-mono text-gray-600">C20_V2024_S11_L02_SA_L3_EN_ID2428</td>
                        <td className="p-4 text-sm text-gray-900 max-w-md">
                          <p className="truncate">Explain the relationship between risk assessment and cybersecurity f...</p>
                        </td>
                        <td className="p-4 text-sm text-gray-700">Short Answer</td>
                        <td className="p-4 text-sm" style={{ color: "#7e2a0c" }}>Cybersecurity</td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Hard
                          </span>
                        </td>
                        <td className="p-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            3 days ago
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          </div>
        )}


        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <div className="w-4 h-4 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white text-xs">⚡</span>
            </div>
            <span>Powered by advanced AI technology</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuestionGenerator