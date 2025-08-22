import { useState, useRef } from "react"
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
  BarChart3,
  Target,
  Headphones,
  Waves,
  Radio,
  Sparkles,
  Download,
  X,
  Pause,
  Square
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProfileDropdown } from "@/components/ProfileDropdown"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"

const SpeechEvaluation = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("")
  const [selectedText, setSelectedText] = useState("")
  const [customText, setCustomText] = useState("")
  const [attemptCount, setAttemptCount] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioLevel, setAudioLevel] = useState(0)
  const [showResultDetail, setShowResultDetail] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackTime, setPlaybackTime] = useState(0)
  const recordingInterval = useRef<NodeJS.Timeout | null>(null)
  const audioLevelInterval = useRef<NodeJS.Timeout | null>(null)
  const playbackInterval = useRef<NodeJS.Timeout | null>(null)

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
      setIsPaused(false)
      setAttemptCount(prev => prev + 1)
      setRecordingTime(0)
      
      // Recording timer
      recordingInterval.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 49) { // Stop at 5 seconds (50 * 100ms = 5000ms)
            stopRecording()
            return 50
          }
          return prev + 1
        })
      }, 100)
      
      // Audio level animation
      audioLevelInterval.current = setInterval(() => {
        setAudioLevel(Math.random() * 100)
      }, 100)
    }
  }

  const pauseRecording = () => {
    setIsPaused(true)
    if (recordingInterval.current) {
      clearInterval(recordingInterval.current)
      recordingInterval.current = null
    }
    if (audioLevelInterval.current) {
      clearInterval(audioLevelInterval.current)
      audioLevelInterval.current = null
    }
  }

  const resumeRecording = () => {
    setIsPaused(false)
    
    // Resume recording timer
    recordingInterval.current = setInterval(() => {
      setRecordingTime(prev => {
        if (prev >= 49) {
          stopRecording()
          return 50
        }
        return prev + 1
      })
    }, 100)
    
    // Resume audio level animation
    audioLevelInterval.current = setInterval(() => {
      setAudioLevel(Math.random() * 100)
    }, 100)
  }

  const stopRecording = () => {
    setIsRecording(false)
    setIsPaused(false)
    setRecordingTime(0)
    setAudioLevel(0)
    
    if (recordingInterval.current) {
      clearInterval(recordingInterval.current)
      recordingInterval.current = null
    }
    
    if (audioLevelInterval.current) {
      clearInterval(audioLevelInterval.current)
      audioLevelInterval.current = null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 px-6 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
                <Headphones className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-gray-900">Speech Evaluation</span>
                <span className="text-xs text-gray-500">AI-Powered Speech Analysis</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 rounded-lg border border-indigo-200">
              <div className="w-4 h-4 bg-indigo-600 rounded-full flex items-center justify-center">
                <Mic className="w-2 h-2 text-white" />
              </div>
              <span className="text-sm text-indigo-700 font-medium">Ready to Analyze</span>
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
      <div className="p-6 max-w-7xl mx-auto space-y-8">
        {/* Page Title */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
            <Headphones className="w-4 h-4" />
            Speech Analysis Platform
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent">
            Speech Evaluation System
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Analyze pronunciation, fluency, and speaking skills with AI-powered speech evaluation
          </p>
        </div>

        {/* Enhanced Tabs */}
        <Card className="border-gray-200 shadow-xl bg-white/90 backdrop-blur-sm">
          <Tabs defaultValue="reading" className="w-full">
            <div className="bg-gradient-to-r from-indigo-100 via-purple-100 to-indigo-100 border-b border-indigo-300/70 px-8 pt-8 pb-4">
              <TabsList className="grid w-full grid-cols-2 bg-white/80 backdrop-blur-sm border-2 border-indigo-300 shadow-2xl h-20 rounded-xl p-2">
                <TabsTrigger 
                  value="reading" 
                  className="relative flex items-center justify-center gap-3 text-gray-800 font-bold text-base transition-all duration-500 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-800 data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:scale-105 data-[state=active]:z-10 hover:bg-indigo-100 hover:scale-102 rounded-lg mx-1 h-full px-4 py-2"
                >
                  <FileText className="w-5 h-5" />
                  <span className="font-bold">Reading</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="speaking" 
                  className="relative flex items-center justify-center gap-3 text-gray-800 font-bold text-base transition-all duration-500 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-800 data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:scale-105 data-[state=active]:z-10 hover:bg-purple-100 hover:scale-102 rounded-lg mx-1 h-full px-4 py-2"
                >
                  <Mic className="w-5 h-5" />
                  <span className="font-bold">Speaking</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="reading" className="p-6 space-y-6">
              {/* Step 1: Choose Language */}
              <Card className="bg-white/90 backdrop-blur-sm border border-gray-200/60 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      1
                    </div>
                    <span className="text-lg font-semibold text-gray-900">Choose a Language</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                      <SelectTrigger className="w-64 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                        <SelectValue placeholder="Select Language" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200">
                        {languages.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value} className="hover:bg-indigo-50">
                            {lang.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button 
                      disabled={!selectedLanguage}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium px-6 shadow-lg disabled:opacity-50"
                    >
                      Submit
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Step 2: Select or Enter Text */}
              {selectedLanguage && (
                <Card className="bg-white/90 backdrop-blur-sm border border-gray-200/60 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg">
                        2
                      </div>
                      <span className="text-lg font-semibold text-gray-900">Select or Enter Text</span>
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-2">
                      Pick one of the sample texts below or type your own. This text will be used for the Speaking activity.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-gray-800">Sample Texts</h4>
                      <div className="space-y-2">
                        {sampleTexts.map((text, index) => (
                          <div 
                            key={index}
                            className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                              selectedText === text 
                                ? "border-indigo-500 bg-indigo-50/50 shadow-md" 
                                : "border-gray-200 hover:border-indigo-300"
                            }`}
                            onClick={() => handleTextSelect(text)}
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-sm font-medium text-gray-500 mt-0.5">
                                {index + 1}.
                              </span>
                              <span className="text-sm text-gray-700 leading-relaxed">{text}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h4 className="font-semibold text-sm mb-3 text-gray-800">Or Enter Your Own Text</h4>
                      <div className="space-y-3">
                        <Textarea
                          placeholder="Enter your own text here..."
                          value={customText}
                          onChange={(e) => setCustomText(e.target.value)}
                          className="min-h-20 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 resize-none"
                        />
                        <Button 
                          onClick={handleCustomTextConfirm}
                          disabled={!customText.trim()}
                          variant="outline"
                          className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 disabled:opacity-50"
                        >
                          Confirm Text
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Enhanced Record or Upload Audio */}
              {selectedText && (
                <Card className="bg-white/90 backdrop-blur-sm border border-gray-200/60 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg">
                        3
                      </div>
                      <span className="text-lg font-semibold text-gray-900">Record or Upload Audio</span>
                    </CardTitle>
                    <div className="flex items-center gap-4 mt-3">
                      <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                        <Clock className="w-3 h-3 mr-1" />
                        Attempts: {attemptCount}/5
                      </Badge>
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        <Target className="w-3 h-3 mr-1" />
                        Max 5 seconds each
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Enhanced Option A: Record Audio */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            A
                          </div>
                          <h4 className="font-semibold text-gray-800">Record Audio</h4>
                        </div>
                        
                        <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-6">
                          <ul className="text-sm text-gray-600 space-y-2 mb-6">
                            <li className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                              Click to start recording with smart controls
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                              Use pause/resume for better control
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                              Recording stops automatically after 5 seconds
                            </li>
                          </ul>
                          
                          <div className="flex flex-col items-center gap-6">
                            {/* Enhanced Recording Controls */}
                            <div className="relative">
                              <div className={`absolute -inset-4 rounded-full transition-all duration-1000 ${
                                isRecording && !isPaused
                                  ? "bg-gradient-to-r from-blue-400/30 to-emerald-400/30 animate-pulse" 
                                  : "bg-transparent"
                              }`}></div>
                              <Button
                                size="lg"
                                onClick={startRecording}
                                disabled={attemptCount >= 5 || isRecording}
                                className={`relative w-20 h-20 rounded-full transition-all duration-500 border-4 ${
                                  isRecording 
                                    ? "bg-gradient-to-br from-blue-500 to-emerald-500 border-blue-300 shadow-lg" 
                                    : "bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 border-emerald-300 shadow-lg hover:scale-105"
                                } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                              >
                                <Mic className="h-8 w-8 text-white" />
                              </Button>
                            </div>

                            {/* Recording Controls */}
                            {isRecording && (
                              <div className="flex items-center gap-3">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={isPaused ? resumeRecording : pauseRecording}
                                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                                >
                                  {isPaused ? (
                                    <>
                                      <Play className="h-4 w-4 mr-1" />
                                      Resume
                                    </>
                                  ) : (
                                    <>
                                      <Pause className="h-4 w-4 mr-1" />
                                      Pause
                                    </>
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={stopRecording}
                                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                                >
                                  <Square className="h-4 w-4 mr-1" />
                                  Stop
                                </Button>
                              </div>
                            )}

                            {/* Recording Status */}
                            <div className="text-center space-y-2">
                              <span className={`text-sm font-medium transition-colors duration-200 ${
                                isRecording 
                                  ? isPaused ? "text-amber-600" : "text-blue-600"
                                  : "text-gray-700"
                              }`}>
                                {isRecording 
                                  ? isPaused ? "Recording Paused" : "Recording..." 
                                  : "Ready to Record"
                                }
                              </span>
                              
                              {isRecording && (
                                <div className="flex flex-col items-center gap-2">
                                  <Progress 
                                    value={(recordingTime / 50) * 100} 
                                    className="w-32 h-2 bg-blue-100"
                                  />
                                  <span className="text-xs text-blue-600 font-mono">
                                    {isPaused ? "Paused" : `${Math.max(0, 5 - Math.floor(recordingTime / 10))}s remaining`}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Calmer Audio Visualization */}
                            {isRecording && !isPaused && (
                              <div className="flex items-center justify-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <div
                                    key={i}
                                    className="w-2 bg-gradient-to-t from-blue-400 to-emerald-400 rounded-full transition-all duration-300"
                                    style={{
                                      height: `${8 + Math.sin((Date.now() / 200) + i) * 6}px`,
                                      opacity: 0.7 + Math.sin((Date.now() / 300) + i) * 0.3
                                    }}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Option B: Upload Audio */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            B
                          </div>
                          <h4 className="font-semibold text-gray-800">Upload Audio File</h4>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                          <ul className="text-sm text-gray-600 space-y-2 mb-6">
                            <li className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              Drag & drop audio files or click to browse
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              Supported formats: .mp3, .wav, .m4a
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              Maximum duration: 5 seconds
                            </li>
                          </ul>

                          <div className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer group">
                            <div className="flex flex-col items-center gap-4">
                              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center group-hover:from-blue-200 group-hover:to-indigo-200 transition-all">
                                <Upload className="h-8 w-8 text-blue-600 group-hover:scale-110 transition-transform" />
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-800">Drop audio files here</p>
                                <p className="text-xs text-gray-500">or click to browse your computer</p>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
                              >
                                <Upload className="w-4 h-4 mr-2" />
                                Browse Files
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Enhanced Attempts & Results */}
              <Card className="bg-white/90 backdrop-blur-sm border border-gray-200/60 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <BarChart3 className="h-6 w-6 text-indigo-600" />
                    <span className="text-lg font-semibold text-gray-900">Attempts & Results</span>
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-2">
                    Track your speech evaluation attempts and view detailed analysis results
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100">
                          <TableHead className="font-semibold text-gray-700">Question Text</TableHead>
                          <TableHead className="font-semibold text-gray-700">Language</TableHead>
                          <TableHead className="font-semibold text-gray-700">Created Date</TableHead>
                          <TableHead className="font-semibold text-gray-700">Status</TableHead>
                          <TableHead className="font-semibold text-gray-700">Result</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {attempts.map((attempt) => (
                          <TableRow key={attempt.id} className="hover:bg-indigo-50/30 transition-colors">
                            <TableCell className="max-w-md">
                              <div className="truncate text-indigo-700 font-medium" title={attempt.text}>
                                {attempt.text}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="border-gray-200 text-gray-700">
                                {attempt.language}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-gray-600 text-sm">{attempt.createdDate}</TableCell>
                            <TableCell>
                              <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200 flex items-center gap-1 w-fit">
                                <CheckCircle className="h-3 w-3" />
                                {attempt.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
                                onClick={() => setShowResultDetail(true)}
                              >
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

              {/* Assessment Result - Inline Below Attempts Table */}
              {showResultDetail && (
                <Card className="bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/20 border border-indigo-200 shadow-2xl">
                  <CardHeader className="border-b border-indigo-200 bg-gradient-to-r from-indigo-100 via-purple-100 to-blue-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
                          <BarChart3 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-700 to-purple-800 bg-clip-text text-transparent">
                            Assessment Result
                          </CardTitle>
                          <p className="text-sm text-gray-600 mt-1">Detailed analysis of your speech performance</p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setShowResultDetail(false)}
                        className="text-gray-500 hover:text-gray-700 hover:bg-white/50"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8 space-y-8">
                    {/* Audio Player with Enhanced Transcript */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-indigo-100 shadow-lg">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                            <Headphones className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-900">Audio Analysis</h3>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (isPlaying) {
                                setIsPlaying(false)
                                if (playbackInterval.current) {
                                  clearInterval(playbackInterval.current)
                                }
                              } else {
                                setIsPlaying(true)
                                setPlaybackTime(0)
                                playbackInterval.current = setInterval(() => {
                                  setPlaybackTime(prev => {
                                    if (prev >= 50) {
                                      setIsPlaying(false)
                                      return 0
                                    }
                                    return prev + 1
                                  })
                                }, 100)
                              }
                            }}
                            className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                          >
                            {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                            {isPlaying ? "Pause" : "Play"}
                          </Button>
                          <span className="text-sm text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded">00:00</span>
                          <Progress 
                            value={(playbackTime / 50) * 100} 
                            className="w-40 h-2"
                          />
                          <span className="text-sm text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded">00:05</span>
                          <Button variant="outline" size="sm" className="border-gray-200 text-gray-600 hover:bg-gray-50">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Enhanced Transcript with highlighting */}
                      <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border-2 border-dashed border-gray-200">
                        <div className="flex items-center gap-2 mb-4">
                          <Volume2 className="w-5 h-5 text-indigo-600" />
                          <span className="font-semibold text-gray-800">Speech Transcript</span>
                        </div>
                        <p className="text-lg leading-relaxed">
                          <span className="text-gray-900 px-1 py-0.5 rounded bg-green-100">We </span>
                          <span className="text-gray-900 px-1 py-0.5 rounded bg-green-100">had </span>
                          <span className="text-gray-900 px-1 py-0.5 rounded bg-green-100">a </span>
                          <span className="text-gray-900 px-1 py-0.5 rounded bg-green-100">great </span>
                          <span className="text-gray-900 px-1 py-0.5 rounded bg-green-100">time </span>
                          <span className="text-gray-900 px-1 py-0.5 rounded bg-green-100">taking </span>
                          <span className="text-gray-900 px-1 py-0.5 rounded bg-green-100">a </span>
                          <span className="text-gray-900 px-1 py-0.5 rounded bg-green-100">long </span>
                          <span className="text-gray-900 px-1 py-0.5 rounded bg-green-100">walk </span>
                          <span className="text-gray-900 px-1 py-0.5 rounded bg-green-100">outside </span>
                          <span className="text-gray-900 px-1 py-0.5 rounded bg-green-100">in </span>
                          <span className="text-gray-900 px-1 py-0.5 rounded bg-green-100">the </span>
                          <span className="bg-yellow-200 text-gray-900 px-1 py-0.5 rounded border-l-4 border-yellow-500">morning</span>
                        </p>
                      </div>
                    </div>

                    {/* Enhanced Two Column Layout */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                      {/* Types of Errors - Enhanced */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-md">
                            <Target className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-900">Error Analysis</h3>
                        </div>
                        <div className="space-y-4">
                          {[
                            { type: "Mispronunciations", count: 1, color: "bg-orange-100 text-orange-800 border-orange-300", bgColor: "bg-orange-50" },
                            { type: "Omissions", count: 0, color: "bg-gray-100 text-gray-600 border-gray-200", bgColor: "bg-gray-50" },
                            { type: "Insertions", count: 0, color: "bg-gray-100 text-gray-600 border-gray-200", bgColor: "bg-gray-50" },
                            { type: "Unexpected break", count: 0, color: "bg-gray-100 text-gray-600 border-gray-200", bgColor: "bg-gray-50" },
                            { type: "Missing break", count: 0, color: "bg-gray-100 text-gray-600 border-gray-200", bgColor: "bg-gray-50" },
                            { type: "Monotone", count: 0, color: "bg-gray-100 text-gray-600 border-gray-200", bgColor: "bg-gray-50" }
                          ].map((error, index) => (
                            <div key={index} className={`flex items-center justify-between p-4 ${error.bgColor} border-2 border-gray-200 rounded-xl hover:shadow-md transition-all`}>
                              <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${error.count > 0 ? 'bg-orange-500' : 'bg-gray-400'}`}></div>
                                <span className="font-medium text-gray-800">{error.type}</span>
                              </div>
                              <Badge className={`${error.color} font-bold text-base px-3 py-1`}>
                                {error.count}
                              </Badge>
                            </div>
                          ))}
                        </div>

                        {/* Enhanced Pronunciation Score Circle */}
                        <div className="bg-white/90 backdrop-blur-sm border-2 border-green-200 rounded-2xl p-8 shadow-lg">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
                              <CheckCircle className="w-5 h-5 text-white" />
                            </div>
                            <h4 className="text-xl font-bold text-gray-900">Pronunciation Score</h4>
                          </div>
                          <div className="flex items-center justify-center mb-6">
                            <div className="relative w-40 h-40">
                              <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 120 120">
                                <circle
                                  cx="60"
                                  cy="60"
                                  r="50"
                                  fill="none"
                                  stroke="#e5e7eb"
                                  strokeWidth="10"
                                />
                                <circle
                                  cx="60"
                                  cy="60"
                                  r="50"
                                  fill="none"
                                  stroke="url(#gradient)"
                                  strokeWidth="10"
                                  strokeDasharray={314}
                                  strokeDashoffset={314 - (314 * 93) / 100}
                                  strokeLinecap="round"
                                  className="transition-all duration-2000 ease-out"
                                />
                                <defs>
                                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#10b981" />
                                    <stop offset="100%" stopColor="#059669" />
                                  </linearGradient>
                                </defs>
                              </svg>
                              <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl font-bold text-gray-900">93%</span>
                                <span className="text-sm text-gray-600 font-medium">Overall Score</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-center gap-8 text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 bg-red-500 rounded-full shadow-sm"></div>
                              <span className="text-gray-700 font-medium">0 – 59</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 bg-yellow-500 rounded-full shadow-sm"></div>
                              <span className="text-gray-700 font-medium">60 – 79</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 bg-green-500 rounded-full shadow-sm"></div>
                              <span className="text-gray-700 font-medium">80 – 100</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Score Breakdown */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                            <Sparkles className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-900">Performance Breakdown</h3>
                        </div>
                        <div className="space-y-8">
                          {[
                            { label: "Accuracy Score", score: 92, maxScore: 100, color: "from-green-500 to-emerald-600", bgColor: "bg-green-50", textColor: "text-green-700" },
                            { label: "Fluency Score", score: 100, maxScore: 100, color: "from-blue-500 to-indigo-600", bgColor: "bg-blue-50", textColor: "text-blue-700" },
                            { label: "Completeness Score", score: 92, maxScore: 100, color: "from-purple-500 to-violet-600", bgColor: "bg-purple-50", textColor: "text-purple-700" },
                            { label: "Prosody Score", score: 89.6, maxScore: 100, color: "from-orange-500 to-red-600", bgColor: "bg-orange-50", textColor: "text-orange-700" }
                          ].map((item, index) => (
                            <div key={index} className={`${item.bgColor} border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all`}>
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  <div className={`w-3 h-3 bg-gradient-to-r ${item.color} rounded-full shadow-sm`}></div>
                                  <span className="font-bold text-gray-800 text-lg">{item.label}</span>
                                </div>
                                <span className={`font-bold text-xl ${item.textColor} bg-white px-3 py-1 rounded-lg shadow-sm`}>
                                  {item.score}/{item.maxScore}
                                </span>
                              </div>
                              <div className="w-full bg-white/80 rounded-full h-4 shadow-inner">
                                <div 
                                  className={`h-4 rounded-full bg-gradient-to-r ${item.color} transition-all duration-2000 ease-out shadow-sm`}
                                  style={{ width: `${(item.score / item.maxScore) * 100}%` }}
                                ></div>
                              </div>
                              <div className="mt-3 text-right">
                                <span className={`text-sm font-medium ${item.textColor}`}>
                                  {((item.score / item.maxScore) * 100).toFixed(1)}% Complete
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="speaking" className="p-6">
              <Card className="bg-white/90 backdrop-blur-sm border border-gray-200/60 shadow-xl">
                <CardContent className="p-12 text-center">
                  <div className="space-y-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto shadow-lg">
                      <Mic className="h-10 w-10 text-purple-600" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold text-gray-900">Speaking Feature</h3>
                      <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
                        Advanced speaking evaluation functionality will be available soon. This feature will provide comprehensive speech analysis and real-time feedback.
                      </p>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200">
                        Coming Soon
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}

export default SpeechEvaluation