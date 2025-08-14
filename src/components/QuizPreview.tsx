import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Eye, 
  Edit3, 
  Download, 
  Save, 
  FileText, 
  Users, 
  CheckCircle, 
  Book,
  Target,
  Hash
} from "lucide-react";

interface Question {
  id: number;
  elo: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface QuizData {
  name: string;
  grade: string;
  subject: string;
  chapter: string;
  elos: string[];
  questionCount: string;
  questions: Question[];
}

interface QuizPreviewProps {
  quiz: QuizData;
  onEdit: () => void;
  onSave: () => void;
}

export const QuizPreview = ({ quiz, onEdit, onSave }: QuizPreviewProps) => {
  const [activeTab, setActiveTab] = useState("preview");
  const [editingQuestion, setEditingQuestion] = useState<number | null>(null);

  const groupedQuestions = quiz.questions.reduce((acc, question) => {
    if (!acc[question.elo]) {
      acc[question.elo] = [];
    }
    acc[question.elo].push(question);
    return acc;
  }, {} as Record<string, Question[]>);

  const handleExport = (format: 'pdf' | 'docx', includeAnswers: boolean) => {
    // Simulate export functionality
    console.log(`Exporting as ${format} ${includeAnswers ? 'with' : 'without'} answers`);
  };

  return (
    <div className="space-y-6">
      {/* Quiz Header */}
      <div className="text-center space-y-4 animate-fade-in">
        <div className="flex items-center justify-center mb-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-success to-success/80 shadow-elegant">
            <CheckCircle className="h-8 w-8 text-success-foreground" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-foreground">Quiz Generated Successfully!</h1>
        <p className="text-xl text-muted-foreground">
          Review, edit, and manage your AI-generated quiz
        </p>
      </div>

      {/* Quiz Info Card */}
      <Card className="hero-card animate-slide-up">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Book className="h-5 w-5 text-primary" />
              <span>{quiz.name}</span>
            </span>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={onEdit}>
                <Edit3 className="mr-2 h-4 w-4" />
                Edit Quiz
              </Button>
              <Button className="hero-button" onClick={onSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Quiz
              </Button>
            </div>
          </CardTitle>
          <CardDescription className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-primary" />
              <span>{quiz.grade}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Book className="h-4 w-4 text-primary" />
              <span>{quiz.subject}</span>
            </div>
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-primary" />
              <span>{quiz.chapter}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Hash className="h-4 w-4 text-primary" />
              <span>{quiz.questions.length} Questions</span>
            </div>
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Quiz Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="preview" className="flex items-center space-x-2">
            <Eye className="h-4 w-4" />
            <span>Preview</span>
          </TabsTrigger>
          <TabsTrigger value="student" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Student View</span>
          </TabsTrigger>
          <TabsTrigger value="export" className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="space-y-6">
          {/* ELOs */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-primary" />
                <span>Learning Outcomes Covered</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {quiz.elos.map((elo) => (
                  <Badge key={elo} variant="secondary" className="bg-primary-light text-primary">
                    {elo}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Questions by ELO */}
          <div className="space-y-6">
            {Object.entries(groupedQuestions).map(([elo, questions]) => (
              <Card key={elo} className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg text-primary">{elo}</CardTitle>
                  <CardDescription>{questions.length} question(s)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {questions.map((question, index) => (
                    <div key={question.id} className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-lg mb-3">
                            {index + 1}. {question.question}
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                            {question.options.map((option, optIndex) => (
                              <div
                                key={optIndex}
                                className={`p-3 rounded-lg border transition-colors text-black ${
                                  optIndex === question.correct
                                    ? 'bg-success/10 border-success font-medium'
                                    : 'bg-secondary/50 border-border'
                                }`}
                              >
                                <span className="font-medium mr-2">
                                  {String.fromCharCode(65 + optIndex)}.
                                </span>
                                {option}
                                {optIndex === question.correct && (
                                  <CheckCircle className="inline-block ml-2 h-4 w-4 text-success" />
                                )}
                              </div>
                            ))}
                          </div>
                          <div className="bg-info/10 border border-info/20 rounded-lg p-4">
                            <h5 className="font-medium text-info mb-2">Explanation:</h5>
                            <p className="text-sm text-muted-foreground">{question.explanation}</p>
                          </div>
                        </div>
                      </div>
                      {index < questions.length - 1 && <Separator />}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="student" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Student View</CardTitle>
              <CardDescription>
                This is how the quiz will appear to your students (answers hidden)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {quiz.questions.map((question, index) => (
                <div key={question.id} className="space-y-4">
                  <h4 className="font-medium text-lg">
                    {index + 1}. {question.question}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {question.options.map((option, optIndex) => (
                      <div
                        key={optIndex}
                        className="p-3 rounded-lg border border-border bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
                      >
                        <span className="font-medium mr-2">
                          {String.fromCharCode(65 + optIndex)}.
                        </span>
                        {option}
                      </div>
                    ))}
                  </div>
                  {index < quiz.questions.length - 1 && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Export Options</CardTitle>
              <CardDescription>
                Download your quiz in different formats for printing or sharing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* PDF Export */}
                <div className="space-y-4">
                  <h4 className="font-medium text-lg">PDF Format</h4>
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => handleExport('pdf', false)}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Student Version (Questions Only)
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => handleExport('pdf', true)}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Teacher Version (With Answers)
                    </Button>
                  </div>
                </div>

                {/* Word Export */}
                <div className="space-y-4">
                  <h4 className="font-medium text-lg">Word Format</h4>
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => handleExport('docx', false)}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Student Version (Questions Only)
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => handleExport('docx', true)}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Teacher Version (With Answers)
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};