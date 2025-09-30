import { useState } from "react"
import { Link } from "react-router-dom"
import { 
  ArrowLeft, 
  MessageSquare, 
  BookOpen,
  List,
  FileText,
  Lightbulb,
  Send,
  Sparkles,
  Download,
  Loader2,
  Bot,
  User
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface Chapter {
  id: number
  title: string
  pages: string
}

const DocChatNCERT = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I'm your NCERT textbook assistant. Ask me anything about the book, or use the tabs to generate chapter lists, summaries, questions, or lesson plans." }
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null)
  const [summary, setSummary] = useState("")
  const [questions, setQuestions] = useState<string[]>([])
  const [lessonPlan, setLessonPlan] = useState("")

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = inputMessage.trim()
    setMessages(prev => [...prev, { role: "user", content: userMessage }])
    setInputMessage("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = `I understand your question about "${userMessage}". Based on the NCERT textbook, here's a comprehensive answer that covers the key concepts and provides relevant examples from the chapters.`
      setMessages(prev => [...prev, { role: "assistant", content: aiResponse }])
      setIsLoading(false)
    }, 1500)
  }

  const handleGenerateChapterList = async () => {
    setIsLoading(true)
    
    setTimeout(() => {
      const mockChapters: Chapter[] = [
        { id: 1, title: "The Living World", pages: "1-15" },
        { id: 2, title: "Biological Classification", pages: "16-35" },
        { id: 3, title: "Plant Kingdom", pages: "36-58" },
        { id: 4, title: "Animal Kingdom", pages: "59-85" },
        { id: 5, title: "Morphology of Flowering Plants", pages: "86-112" },
        { id: 6, title: "Anatomy of Flowering Plants", pages: "113-138" },
        { id: 7, title: "Structural Organization in Animals", pages: "139-165" },
        { id: 8, title: "Cell: The Unit of Life", pages: "166-195" }
      ]
      
      setChapters(mockChapters)
      setIsLoading(false)
      toast({
        title: "Chapter List Generated",
        description: `Successfully extracted ${mockChapters.length} chapters from the NCERT textbook.`
      })
    }, 2000)
  }

  const handleSummarizeChapter = async (chapterId: number) => {
    setSelectedChapter(chapterId)
    setIsLoading(true)
    
    setTimeout(() => {
      const chapter = chapters.find(c => c.id === chapterId)
      setSummary(`Summary of "${chapter?.title}":

This chapter introduces fundamental concepts about ${chapter?.title.toLowerCase()}. It begins with defining key terminology and explores the historical development of our understanding in this area.

Key Points:
• Definition and scope of the topic
• Historical perspectives and major contributors
• Classification systems and methodology
• Practical applications and examples
• Contemporary relevance and importance

The chapter concludes with exercises designed to reinforce understanding of these critical biological concepts.`)
      
      setIsLoading(false)
      toast({
        title: "Summary Generated",
        description: `Successfully summarized ${chapter?.title}`
      })
    }, 2000)
  }

  const handleGenerateQuestions = async () => {
    setIsLoading(true)
    
    setTimeout(() => {
      const mockQuestions = [
        "1. What are the defining characteristics of living organisms?",
        "2. Explain the biological classification system with examples.",
        "3. Compare and contrast the plant and animal kingdoms.",
        "4. Describe the morphology of a typical flowering plant.",
        "5. What is the importance of anatomical studies in biology?",
        "6. How do cells function as the basic unit of life?",
        "7. Discuss the structural organization in different animal phyla.",
        "8. What role does taxonomy play in biological classification?"
      ]
      
      setQuestions(mockQuestions)
      setIsLoading(false)
      toast({
        title: "Questions Generated",
        description: `Created ${mockQuestions.length} practice questions from the textbook.`
      })
    }, 2000)
  }

  const handleGenerateLessonPlan = async () => {
    setIsLoading(true)
    
    setTimeout(() => {
      setLessonPlan(`Lesson Plan: Introduction to Biology (NCERT Class 11)

Duration: 60 minutes
Grade Level: Class 11
Subject: Biology

Learning Objectives:
• Students will understand the basic concepts of living organisms
• Students will be able to identify different classification systems
• Students will apply their knowledge to real-world examples

Materials Needed:
• NCERT Biology Textbook
• Chart papers and markers
• Projector for presentations
• Sample specimens (if available)

Lesson Structure:

Introduction (10 minutes):
- Begin with a thought-provoking question about life
- Discuss students' prior knowledge
- Present learning objectives

Main Content (35 minutes):
- Direct instruction on key concepts (15 mins)
- Group activity: Classification exercise (10 mins)
- Discussion and Q&A (10 mins)

Assessment (10 minutes):
- Quick formative assessment through questions
- Exit ticket with key concept review

Homework:
- Read next chapter and prepare questions
- Complete exercise problems from textbook

Extension Activities:
- Research project on local biodiversity
- Create a classification chart for organisms`)
      
      setIsLoading(false)
      toast({
        title: "Lesson Plan Generated",
        description: "Successfully created a comprehensive lesson plan."
      })
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Doc Chat - NCERT</h1>
              <p className="text-sm text-gray-500">Interactive AI-powered textbook assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-lg border border-purple-200">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-600">3,241 Tokens</span>
            </div>
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="hover:bg-accent hover:text-accent-foreground">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="chat" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8 bg-gray-100 p-2 rounded-xl shadow-sm border gap-2 h-16">
              <TabsTrigger 
                value="chat" 
                className="rounded-lg h-full font-medium transition-all data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md text-gray-600 hover:text-gray-800 hover:bg-gray-200"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </TabsTrigger>
              <TabsTrigger 
                value="chapters"
                className="rounded-lg h-full font-medium transition-all data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md text-gray-600 hover:text-gray-800 hover:bg-gray-200"
              >
                <List className="h-4 w-4 mr-2" />
                Chapters
              </TabsTrigger>
              <TabsTrigger 
                value="summary"
                className="rounded-lg h-full font-medium transition-all data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:shadow-md text-gray-600 hover:text-gray-800 hover:bg-gray-200"
              >
                <FileText className="h-4 w-4 mr-2" />
                Summary
              </TabsTrigger>
              <TabsTrigger 
                value="questions"
                className="rounded-lg h-full font-medium transition-all data-[state=active]:bg-orange-600 data-[state=active]:text-white data-[state=active]:shadow-md text-gray-600 hover:text-gray-800 hover:bg-gray-200"
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                Questions
              </TabsTrigger>
              <TabsTrigger 
                value="lesson"
                className="rounded-lg h-full font-medium transition-all data-[state=active]:bg-pink-600 data-[state=active]:text-white data-[state=active]:shadow-md text-gray-600 hover:text-gray-800 hover:bg-gray-200"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Lesson Plan
              </TabsTrigger>
            </TabsList>

            {/* Chat Tab */}
            <TabsContent value="chat" className="space-y-4">
              <Card className="border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-purple-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-purple-800">
                    <div className="p-2 bg-purple-600 text-white rounded-lg">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    Chat with NCERT Textbook
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ScrollArea className="h-[500px] w-full rounded-lg border bg-white p-4">
                    <div className="space-y-4">
                      {messages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          {message.role === "assistant" && (
                            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                              <Bot className="h-4 w-4 text-white" />
                            </div>
                          )}
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              message.role === "user"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-900"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                          </div>
                          {message.role === "user" && (
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                              <User className="h-4 w-4 text-white" />
                            </div>
                          )}
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex gap-3 justify-start">
                          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                            <Bot className="h-4 w-4 text-white" />
                          </div>
                          <div className="bg-gray-100 rounded-lg p-3">
                            <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ask anything about the NCERT textbook..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleSendMessage} 
                      disabled={isLoading || !inputMessage.trim()}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Chapters Tab */}
            <TabsContent value="chapters" className="space-y-4">
              <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-blue-100">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-blue-800">
                      <div className="p-2 bg-blue-600 text-white rounded-lg">
                        <List className="h-5 w-5" />
                      </div>
                      Chapter List Generation
                    </div>
                    {chapters.length > 0 && (
                      <Button variant="outline" size="sm" className="border-blue-200 hover:bg-blue-100">
                        <Download className="h-4 w-4 mr-2" />
                        Export List
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-blue-700">
                    Generate a comprehensive list of all chapters from the NCERT textbook with page numbers and organize them for easy navigation.
                  </p>
                  
                  {chapters.length === 0 ? (
                    <Button 
                      onClick={handleGenerateChapterList}
                      disabled={isLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Generate Chapter List
                        </>
                      )}
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      {chapters.map((chapter) => (
                        <Card key={chapter.id} className="bg-white border border-blue-200 hover:border-blue-400 transition-colors">
                          <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Badge className="bg-blue-600 text-white">{chapter.id}</Badge>
                              <div>
                                <h3 className="font-semibold text-gray-900">{chapter.title}</h3>
                                <p className="text-sm text-gray-600">Pages {chapter.pages}</p>
                              </div>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleSummarizeChapter(chapter.id)}
                              className="border-blue-200 hover:bg-blue-50"
                            >
                              View Summary
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Summary Tab */}
            <TabsContent value="summary" className="space-y-4">
              <Card className="border-2 border-green-100 bg-gradient-to-br from-green-50 to-green-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-green-800">
                    <div className="p-2 bg-green-600 text-white rounded-lg">
                      <FileText className="h-5 w-5" />
                    </div>
                    Chapter Summarization
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-green-700">
                    {chapters.length === 0 
                      ? "Please generate the chapter list first to access chapter summaries."
                      : "Select a chapter from the Chapters tab to view its AI-generated summary."}
                  </p>
                  
                  {summary ? (
                    <Card className="bg-white border border-green-200">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {chapters.find(c => c.id === selectedChapter)?.title}
                          </h3>
                          <Button variant="outline" size="sm" className="border-green-200 hover:bg-green-50">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                          </Button>
                        </div>
                        <Textarea 
                          value={summary}
                          readOnly
                          className="min-h-[400px] font-mono text-sm"
                        />
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-green-300">
                      <FileText className="h-12 w-12 text-green-400 mx-auto mb-3" />
                      <p className="text-gray-600">No summary generated yet</p>
                      <p className="text-sm text-gray-500">Select a chapter to generate its summary</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Questions Tab */}
            <TabsContent value="questions" className="space-y-4">
              <Card className="border-2 border-orange-100 bg-gradient-to-br from-orange-50 to-orange-100">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-orange-800">
                      <div className="p-2 bg-orange-600 text-white rounded-lg">
                        <Lightbulb className="h-5 w-5" />
                      </div>
                      Question Generation
                    </div>
                    {questions.length > 0 && (
                      <Button variant="outline" size="sm" className="border-orange-200 hover:bg-orange-100">
                        <Download className="h-4 w-4 mr-2" />
                        Export Questions
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-orange-700">
                    Generate practice questions from the NCERT textbook to help students prepare and assess their understanding.
                  </p>
                  
                  {questions.length === 0 ? (
                    <Button 
                      onClick={handleGenerateQuestions}
                      disabled={isLoading}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Generate Questions
                        </>
                      )}
                    </Button>
                  ) : (
                    <Card className="bg-white border border-orange-200">
                      <CardContent className="p-6 space-y-3">
                        {questions.map((question, index) => (
                          <div 
                            key={index} 
                            className="p-4 bg-orange-50 rounded-lg border border-orange-200 hover:border-orange-400 transition-colors"
                          >
                            <p className="text-gray-900">{question}</p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Lesson Plan Tab */}
            <TabsContent value="lesson" className="space-y-4">
              <Card className="border-2 border-pink-100 bg-gradient-to-br from-pink-50 to-pink-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-pink-800">
                    <div className="p-2 bg-pink-600 text-white rounded-lg">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    Lesson Plan Generation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-pink-700">
                    Create comprehensive lesson plans based on the NCERT textbook content, complete with learning objectives, activities, and assessment strategies.
                  </p>
                  
                  {!lessonPlan ? (
                    <Button 
                      onClick={handleGenerateLessonPlan}
                      disabled={isLoading}
                      className="w-full bg-pink-600 hover:bg-pink-700 text-white"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Generate Lesson Plan
                        </>
                      )}
                    </Button>
                  ) : (
                    <Card className="bg-white border border-pink-200">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">Generated Lesson Plan</h3>
                          <Button variant="outline" size="sm" className="border-pink-200 hover:bg-pink-50">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                          </Button>
                        </div>
                        <Textarea 
                          value={lessonPlan}
                          readOnly
                          className="min-h-[500px] font-mono text-sm"
                        />
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

export default DocChatNCERT
