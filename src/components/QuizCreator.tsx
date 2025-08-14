import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Wand2, BookOpen, Users, Target, Hash } from "lucide-react";

interface QuizCreatorProps {
  onCreateQuiz: (quizData: any) => void;
}

export const QuizCreator = ({ onCreateQuiz }: QuizCreatorProps) => {
  const [quizName, setQuizName] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [selectedELOs, setSelectedELOs] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const grades = ["Grade 9", "Grade 10"];
  const subjects = ["Mathematics", "Science", "English", "Social Studies", "Hindi"];
  const chapters = {
    "Mathematics": ["Algebra", "Geometry", "Statistics", "Trigonometry"],
    "Science": ["Physics", "Chemistry", "Biology", "Environmental Science"],
    "English": ["Grammar", "Literature", "Writing Skills", "Reading Comprehension"],
    "Social Studies": ["History", "Geography", "Civics", "Economics"],
    "Hindi": ["व्याकरण", "साहित्य", "लेखन कौशल", "गद्य"]
  };
  
  const elos = [
    "Understand basic concepts and definitions",
    "Apply formulas and solve problems",
    "Analyze data and draw conclusions",
    "Evaluate different approaches and methods",
    "Create solutions for real-world scenarios",
    "Remember key facts and information"
  ];

  const questionCountOptions = [
    { value: "5", label: "Create quiz with 5 questions" },
    { value: "10", label: "Create quiz with 10 questions" },
    { value: "12", label: "Create quiz with 12 questions" },
    { value: "per-elo", label: "Create 3 questions per selected ELO" }
  ];

  const handleELOToggle = (elo: string) => {
    setSelectedELOs(prev => 
      prev.includes(elo) 
        ? prev.filter(e => e !== elo)
        : [...prev, elo]
    );
  };

  const handleGenerateQuiz = async () => {
    if (!quizName || !selectedGrade || !selectedSubject || !selectedChapter || selectedELOs.length === 0 || !questionCount) {
      return;
    }

    setIsGenerating(true);
    
    // Simulate quiz generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockQuiz = {
      name: quizName,
      grade: selectedGrade,
      subject: selectedSubject,
      chapter: selectedChapter,
      elos: selectedELOs,
      questionCount,
      questions: generateMockQuestions(selectedELOs, questionCount)
    };

    onCreateQuiz(mockQuiz);
    setIsGenerating(false);
  };

  const generateMockQuestions = (elos: string[], count: string) => {
    const questions = [];
    const numQuestions = count === "per-elo" ? elos.length * 3 : parseInt(count);
    
    for (let i = 0; i < numQuestions; i++) {
      questions.push({
        id: i + 1,
        elo: elos[i % elos.length],
        question: `Sample question ${i + 1} related to ${selectedChapter}?`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correct: 0,
        explanation: "This is the correct answer because it demonstrates the key concept..."
      });
    }
    
    return questions;
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4 animate-fade-in">
        <div className="flex items-center justify-center mb-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-primary to-primary-hover shadow-elegant">
            <Wand2 className="h-8 w-8 text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-foreground">Create New Quiz</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Generate AI-powered quizzes aligned with your curriculum and learning outcomes
        </p>
      </div>

      <Card className="hero-card animate-slide-up max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span>Quiz Configuration</span>
          </CardTitle>
          <CardDescription>
            Configure your quiz settings and select learning outcomes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Quiz Name */}
          <div className="space-y-2">
            <Label htmlFor="quiz-name" className="text-base font-medium">Quiz Name</Label>
            <Input
              id="quiz-name"
              placeholder="Enter quiz name (e.g., Algebra Chapter 1 Assessment)"
              value={quizName}
              onChange={(e) => setQuizName(e.target.value)}
              className="elegant-input"
            />
          </div>

          {/* Grade and Subject Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-base font-medium flex items-center space-x-2">
                <Users className="h-4 w-4 text-primary" />
                <span>Grade</span>
              </Label>
              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger className="elegant-input">
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  {grades.map((grade) => (
                    <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-base font-medium flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <span>Subject</span>
              </Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="elegant-input">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Chapter Selection */}
          <div className="space-y-2">
            <Label className="text-base font-medium">Chapter</Label>
            <Select 
              value={selectedChapter} 
              onValueChange={setSelectedChapter}
              disabled={!selectedSubject}
            >
              <SelectTrigger className="elegant-input">
                <SelectValue placeholder="Select chapter" />
              </SelectTrigger>
              <SelectContent>
                {selectedSubject && chapters[selectedSubject as keyof typeof chapters]?.map((chapter) => (
                  <SelectItem key={chapter} value={chapter}>{chapter}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* ELO Selection */}
          <div className="space-y-4">
            <Label className="text-base font-medium flex items-center space-x-2">
              <Target className="h-4 w-4 text-primary" />
              <span>Expected Learning Outcomes (ELOs)</span>
            </Label>
            <p className="text-sm text-muted-foreground">
              Select one or more learning outcomes that your quiz should cover
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {elos.map((elo) => (
                <div key={elo} className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-secondary/50 transition-colors">
                  <Checkbox
                    id={elo}
                    checked={selectedELOs.includes(elo)}
                    onCheckedChange={() => handleELOToggle(elo)}
                  />
                  <Label htmlFor={elo} className="text-sm cursor-pointer flex-1">
                    {elo}
                  </Label>
                </div>
              ))}
            </div>
            {selectedELOs.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedELOs.map((elo) => (
                  <Badge key={elo} variant="secondary" className="bg-primary-light text-primary">
                    {elo}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Question Count */}
          <div className="space-y-2">
            <Label className="text-base font-medium flex items-center space-x-2">
              <Hash className="h-4 w-4 text-primary" />
              <span>Question Count</span>
            </Label>
            <Select value={questionCount} onValueChange={setQuestionCount}>
              <SelectTrigger className="elegant-input">
                <SelectValue placeholder="Select question count" />
              </SelectTrigger>
              <SelectContent>
                {questionCountOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Generate Button */}
          <div className="pt-6">
            <Button 
              onClick={handleGenerateQuiz}
              disabled={!quizName || !selectedGrade || !selectedSubject || !selectedChapter || selectedELOs.length === 0 || !questionCount || isGenerating}
              className="hero-button w-full md:w-auto"
            >
              {isGenerating ? (
                <>
                  <Wand2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Quiz...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Quiz
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};