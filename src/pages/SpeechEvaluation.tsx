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
  X
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

  const stopRecording = () => {
    setIsRecording(false)
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
                              Click the microphone to start recording
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                              Speak clearly when the mic glows red
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                              Recording stops automatically after 5 seconds
                            </li>
                          </ul>
                          
                          <div className="flex flex-col items-center gap-6">
                            {/* Enhanced Recording Button with Animations */}
                            <div className="relative">
                              <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
                                isRecording 
                                  ? "bg-red-400 animate-ping opacity-75" 
                                  : "bg-transparent"
                              }`}></div>
                              <Button
                                size="lg"
                                onClick={isRecording ? stopRecording : startRecording}
                                disabled={attemptCount >= 5}
                                className={`relative w-24 h-24 rounded-full transition-all duration-300 border-4 ${
                                  isRecording 
                                    ? "bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 border-red-300 shadow-2xl transform scale-105" 
                                    : "bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 border-emerald-300 shadow-xl hover:scale-105"
                                } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                              >
                                {isRecording ? (
                                  <StopCircle className="h-10 w-10 text-white animate-pulse" />
                                ) : (
                                  <Mic className="h-10 w-10 text-white" />
                                )}
                              </Button>
                            </div>

                            {/* Recording Status */}
                            <div className="text-center space-y-2">
                              <span className={`text-sm font-medium transition-colors duration-200 ${
                                isRecording ? "text-red-600" : "text-gray-700"
                              }`}>
                                {isRecording ? "Recording..." : "Click to Record"}
                              </span>
                              
                              {isRecording && (
                                <div className="flex flex-col items-center gap-2">
                                  <Progress 
                                    value={(recordingTime / 50) * 100} 
                                    className="w-32 h-2 bg-red-100"
                                  />
                                  <span className="text-xs text-red-600 font-mono">
                                    Auto-stop in {Math.max(0, 5 - Math.floor(recordingTime / 10))}s
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Audio Visualization */}
                            {isRecording && (
                              <div className="flex items-center gap-1">
                                {[...Array(7)].map((_, i) => (
                                  <div
                                    key={i}
                                    className="w-1 bg-red-500 rounded-full animate-pulse"
                                    style={{
                                      height: `${Math.random() * 20 + 5}px`,
                                      animationDelay: `${i * 0.1}s`
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

              {/* Assessment Result Modal */}
              {showResultDetail && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                  <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
                    <CardHeader className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl font-semibold text-gray-900">Assessment Result</CardTitle>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setShowResultDetail(false)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X className="w-5 h-5" />
                        </Button>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="self-end border-blue-200 text-blue-700 hover:bg-blue-50"
                      >
                        Hide Result
                      </Button>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      {/* Audio Player with Transcript */}
                      <div className="bg-gray-50 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-gray-900">Audio Analysis</h3>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
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
                              className="text-gray-600 hover:text-gray-900"
                            >
                              <Play className="w-4 h-4" />
                            </Button>
                            <span className="text-sm text-gray-600 font-mono">00:00</span>
                            <Progress 
                              value={(playbackTime / 50) * 100} 
                              className="w-32 h-2 bg-gray-200"
                            />
                            <span className="text-sm text-gray-600 font-mono">00:05</span>
                            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {/* Transcript with highlighting */}
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <p className="text-sm leading-relaxed">
                            <span className="text-gray-900">We </span>
                            <span className="text-gray-900">had </span>
                            <span className="text-gray-900">a </span>
                            <span className="text-gray-900">great </span>
                            <span className="text-gray-900">time </span>
                            <span className="text-gray-900">taking </span>
                            <span className="text-gray-900">a </span>
                            <span className="text-gray-900">long </span>
                            <span className="text-gray-900">walk </span>
                            <span className="text-gray-900">outside </span>
                            <span className="text-gray-900">in </span>
                            <span className="text-gray-900">the </span>
                            <span className="bg-yellow-200 text-gray-900 px-1 rounded">morning</span>
                          </p>
                        </div>
                      </div>

                      {/* Two Column Layout */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Types of Errors */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900">Types of Errors</h3>
                          <div className="space-y-3">
                            {[
                              { type: "Mispronunciations", count: 1, color: "bg-orange-100 text-orange-800 border-orange-200" },
                              { type: "Omissions", count: 0, color: "bg-gray-100 text-gray-600 border-gray-200" },
                              { type: "Insertions", count: 0, color: "bg-gray-100 text-gray-600 border-gray-200" },
                              { type: "Unexpected break", count: 0, color: "bg-gray-100 text-gray-600 border-gray-200" },
                              { type: "Missing break", count: 0, color: "bg-gray-100 text-gray-600 border-gray-200" },
                              { type: "Monotone", count: 0, color: "bg-gray-100 text-gray-600 border-gray-200" }
                            ].map((error, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                                <span className="text-sm font-medium text-gray-700">{error.type}</span>
                                <Badge className={`${error.color} font-medium`}>
                                  {error.count}
                                </Badge>
                              </div>
                            ))}
                          </div>

                          {/* Pronunciation Score Circle */}
                          <div className="mt-6 bg-white border border-gray-200 rounded-lg p-6">
                            <h4 className="text-base font-semibold text-gray-900 mb-4">Pronunciation score</h4>
                            <div className="flex items-center justify-center">
                              <div className="relative w-32 h-32">
                                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                                  <circle
                                    cx="60"
                                    cy="60"
                                    r="50"
                                    fill="none"
                                    stroke="#e5e7eb"
                                    strokeWidth="8"
                                  />
                                  <circle
                                    cx="60"
                                    cy="60"
                                    r="50"
                                    fill="none"
                                    stroke="#10b981"
                                    strokeWidth="8"
                                    strokeDasharray={314}
                                    strokeDashoffset={314 - (314 * 93) / 100}
                                    strokeLinecap="round"
                                    className="transition-all duration-1000 ease-out"
                                  />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                  <span className="text-2xl font-bold text-gray-900">93%</span>
                                  <span className="text-xs text-gray-600">Overall Score</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-center gap-6 mt-4 text-xs">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-red-500 rounded"></div>
                                <span className="text-gray-600">0 – 59</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                                <span className="text-gray-600">60 – 79</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-green-500 rounded"></div>
                                <span className="text-gray-600">80 – 100</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Score Breakdown */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900">Score breakdown</h3>
                          <div className="space-y-6">
                            {[
                              { label: "Accuracy score", score: 92, maxScore: 100, color: "bg-green-500" },
                              { label: "Fluency score", score: 100, maxScore: 100, color: "bg-green-500" },
                              { label: "Completeness score", score: 92, maxScore: 100, color: "bg-green-500" },
                              { label: "Prosody score", score: 89.6, maxScore: 100, color: "bg-green-500" }
                            ].map((item, index) => (
                              <div key={index} className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="font-medium text-gray-700">{item.label}</span>
                                  <span className="font-semibold text-gray-900">{item.score}/{item.maxScore}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                  <div 
                                    className={`h-3 rounded-full transition-all duration-1000 ease-out ${item.color}`}
                                    style={{ width: `${(item.score / item.maxScore) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
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