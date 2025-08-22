import { useState } from "react"
import { Link } from "react-router-dom"
import { 
  ArrowLeft, 
  Mic,
  Upload,
  Play,
  StopCircle,
  Volume2,
  Bell,
  Settings,
  FileText,
  Clock,
  CheckCircle,
  Eye,
  BarChart3
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProfileDropdown } from "@/components/ProfileDropdown"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const SpeechEvaluation = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("")
  const [selectedText, setSelectedText] = useState("")
  const [customText, setCustomText] = useState("")
  const [attemptCount, setAttemptCount] = useState(0)
  const [isRecording, setIsRecording] = useState(false)

  const languages = [
    { value: "english-india", label: "English (India)" },
    { value: "english-us", label: "English (US)" },
    { value: "english-uk", label: "English (UK)" },
    { value: "hindi", label: "Hindi" },
    { value: "bengali", label: "Bengali" },
    { value: "tamil", label: "Tamil" }
  ]

  const sampleTexts = [
    "We had a great time taking a long walk outside in the morning.",
    "It took me a long time to learn where he came from.",
    "Question the plausibility of one explanation.",
    "The quick brown fox jumps over the lazy dog."
  ]

  const attempts = [
    {
      id: 1,
      text: "We had a great time taking a long walk outside in the morning.",
      language: "English (India)",
      createdDate: "22 Jan 2025 – 14:53",
      status: "Completed",
      result: "Show Result"
    }
  ]

  const handleTextSelect = (text: string) => {
    setSelectedText(text)
    setCustomText("")
  }

  const handleCustomTextConfirm = () => {
    if (customText.trim()) {
      setSelectedText(customText.trim())
    }
  }

  const startRecording = () => {
    if (attemptCount < 5) {
      setIsRecording(true)
      setAttemptCount(prev => prev + 1)
      // Simulate recording for 5 seconds
      setTimeout(() => {
        setIsRecording(false)
      }, 5000)
    }
  }

  const stopRecording = () => {
    setIsRecording(false)
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-muted/10 to-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect border-b border-border/30">
        <div className="flex h-16 items-center gap-4 px-6">
          <div className="flex-1 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/">
                <Button variant="ghost" size="icon" className="hover:scale-110 transition-transform duration-200">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="h-6 w-px bg-border/40" />
              <h1 className="text-xl font-semibold text-foreground">Speech Evaluation</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Welcome Back,</span>
                <span className="font-semibold text-primary">Shivaraj Mi</span>
              </div>
              <Button variant="ghost" size="icon" className="hover:scale-110 transition-transform duration-200">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:scale-110 transition-transform duration-200">
                <Settings className="h-5 w-5" />
              </Button>
              <ProfileDropdown />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="reading" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="reading" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Reading
              </TabsTrigger>
              <TabsTrigger value="speaking" className="flex items-center gap-2">
                <Mic className="h-4 w-4" />
                Speaking
              </TabsTrigger>
            </TabsList>

            <TabsContent value="reading" className="space-y-8">
              {/* Step 1: Choose Language */}
              <Card className="bg-white/90 backdrop-blur-sm border border-border/30 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">1</span>
                    </div>
                    Choose a Language
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                      <SelectTrigger className="w-64">
                        <SelectValue placeholder="Select Language" />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>
                            {lang.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button 
                      disabled={!selectedLanguage}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Submit
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Step 2: Select or Enter Text */}
              {selectedLanguage && (
                <Card className="bg-white/90 backdrop-blur-sm border border-border/30 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">2</span>
                      </div>
                      Select or Enter Text
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Pick one of the sample texts below or type your own. This text will be used for the Speaking activity.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm">Sample Texts</h4>
                      <div className="space-y-2">
                        {sampleTexts.map((text, index) => (
                          <div 
                            key={index}
                            className={`p-3 border rounded-lg cursor-pointer transition-all ${
                              selectedText === text 
                                ? "border-primary bg-primary/5" 
                                : "border-border hover:border-primary/50"
                            }`}
                            onClick={() => handleTextSelect(text)}
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-sm font-medium text-muted-foreground">
                                {index + 1}.
                              </span>
                              <span className="text-sm">{text}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-border pt-6">
                      <h4 className="font-semibold text-sm mb-3">Or Enter Your Own Text</h4>
                      <div className="space-y-3">
                        <Textarea
                          placeholder="Enter your own text here..."
                          value={customText}
                          onChange={(e) => setCustomText(e.target.value)}
                          className="min-h-20"
                        />
                        <Button 
                          onClick={handleCustomTextConfirm}
                          disabled={!customText.trim()}
                          variant="outline"
                        >
                          Confirm Text
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Record or Upload Audio */}
              {selectedText && (
                <Card className="bg-white/90 backdrop-blur-sm border border-border/30 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">3</span>
                      </div>
                      Record or Upload Audio
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      ⏱ You can try up to 5 attempts (each limited to 5 seconds). Current attempts: {attemptCount}/5
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Option A: Record Audio */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-sm">Option A: Record Audio</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Click Record</li>
                          <li>• Start speaking once the mic turns red</li>
                          <li>• Recording will stop automatically after 5 seconds</li>
                        </ul>
                        <div className="flex flex-col items-center gap-4 p-6 border border-dashed border-border rounded-lg">
                          <Button
                            size="lg"
                            onClick={isRecording ? stopRecording : startRecording}
                            disabled={attemptCount >= 5}
                            className={`w-20 h-20 rounded-full ${
                              isRecording 
                                ? "bg-red-500 hover:bg-red-600 animate-pulse" 
                                : "bg-primary hover:bg-primary/90"
                            }`}
                          >
                            {isRecording ? (
                              <StopCircle className="h-8 w-8" />
                            ) : (
                              <Mic className="h-8 w-8" />
                            )}
                          </Button>
                          <span className="text-sm font-medium">
                            {isRecording ? "Recording..." : "Click to Record"}
                          </span>
                          {isRecording && (
                            <div className="text-xs text-muted-foreground">
                              Auto-stop in 5 seconds
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Option B: Upload Audio */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-sm">Option B: Upload Audio</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Drag & drop a file here, or click Browse</li>
                          <li>• Supported formats: .mp3, .wav</li>
                          <li>• Maximum duration: 5 seconds</li>
                        </ul>
                        <div className="flex flex-col items-center gap-4 p-6 border border-dashed border-border rounded-lg hover:border-primary/50 transition-colors cursor-pointer">
                          <Upload className="h-12 w-12 text-muted-foreground" />
                          <div className="text-center">
                            <p className="text-sm font-medium">Drop audio file here</p>
                            <p className="text-xs text-muted-foreground">or click to browse</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Browse Files
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Attempts & Results */}
              <Card className="bg-white/90 backdrop-blur-sm border border-border/30 shadow-xl">
                <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Attempts & Results
                </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead>Question Text</TableHead>
                          <TableHead>Language</TableHead>
                          <TableHead>Created Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Result</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {attempts.map((attempt) => (
                          <TableRow key={attempt.id} className="hover:bg-gray-50">
                            <TableCell className="max-w-md">
                              <div className="truncate text-blue-600" title={attempt.text}>
                                {attempt.text}
                              </div>
                            </TableCell>
                            <TableCell>{attempt.language}</TableCell>
                            <TableCell>{attempt.createdDate}</TableCell>
                            <TableCell>
                              <Badge className="bg-green-100 text-green-700 border-0 flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                {attempt.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
                                <Eye className="h-4 w-4 mr-1" />
                                {attempt.result}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="speaking" className="space-y-8">
              <Card className="bg-white/90 backdrop-blur-sm border border-border/30 shadow-xl">
                <CardContent className="p-12 text-center">
                  <div className="space-y-4">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <Mic className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-2xl font-semibold">Speaking Feature</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Speaking evaluation functionality will be available soon. This feature will provide comprehensive speech analysis and feedback.
                    </p>
                    <Badge variant="secondary" className="mt-4">
                      Coming Soon
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

export default SpeechEvaluation