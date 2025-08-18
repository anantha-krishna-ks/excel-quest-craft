import { useState } from "react";
import { ArrowLeft, Upload, Download, FileText, Scan, Trash2, Clock, BarChart3, Target, AlertTriangle, Eye, Search, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface SimilarItem {
  id: string;
  question: string;
  similarity: number;
  type: string;
  status: 'similar' | 'enemy';
}

interface QuestionItem {
  id: string;
  sequenceNumber: number;
  question: string;
  type: string;
  options?: string[];
  correctAnswer?: string;
}

interface QuestionSet {
  id: string;
  name: string;
  itemCount: number;
}

const ItemSimilarity = () => {
  const { toast } = useToast();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [similarItems, setSimilarItems] = useState<SimilarItem[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedQuestionSet, setSelectedQuestionSet] = useState<string>("");
  const [scoreThreshold, setScoreThreshold] = useState<number>(80);
  const [questionItems, setQuestionItems] = useState<QuestionItem[]>([]);
  const [enemyItems, setEnemyItems] = useState<SimilarItem[]>([]);

  // Mock data
  const questionSets: QuestionSet[] = [
    { id: "1", name: "Chemistry - Organic Compounds", itemCount: 45 },
    { id: "2", name: "Physics - Mechanics", itemCount: 32 },
    { id: "3", name: "Mathematics - Algebra", itemCount: 28 },
  ];

  const stats = [
    {
      icon: <Target className="w-5 h-5" />,
      title: "Similar Items Found",
      total: "23",
      subtitle: "Total Matches",
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
      iconBg: "bg-blue-600",
      textColor: "text-blue-600",
      borderColor: "border-blue-200"
    },
    {
      icon: <AlertTriangle className="w-5 h-5" />,
      title: "Enemy Items",
      total: "5",
      subtitle: "Marked as Enemy",
      bgColor: "bg-gradient-to-br from-red-50 to-red-100",
      iconBg: "bg-red-600",
      textColor: "text-red-600",
      borderColor: "border-red-200"
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      title: "Avg Similarity",
      total: "84.2%",
      subtitle: "Match Quality",
      bgColor: "bg-gradient-to-br from-green-50 to-green-100",
      iconBg: "bg-green-600",
      textColor: "text-green-600",
      borderColor: "border-green-200"
    }
  ];

  const validateFile = (file: File) => {
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast({
        title: "Invalid File Format",
        description: "Please upload only .xlsx files",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setSimilarItems([]);
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
    toast({
      title: "File Removed",
      description: "File has been removed successfully",
    });
  };

  const processFile = (file: File) => {
    if (!validateFile(file)) return;
    setUploadedFile(file);
    toast({
      title: "File Uploaded Successfully",
      description: "Ready to analyze for similar items",
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const xlsxFile = files.find(file => 
      file.name.endsWith('.xlsx') || file.name.endsWith('.xls')
    );
    
    if (xlsxFile) {
      processFile(xlsxFile);
    } else {
      toast({
        title: "Invalid File Type",
        description: "Please drop only .xlsx files",
        variant: "destructive",
      });
    }
  };

  const handleAnalyzeSimilarity = async () => {
    if (!uploadedFile) {
      toast({
        title: "No File Uploaded",
        description: "Please upload a file first",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock similar items data
    const mockSimilarItems: SimilarItem[] = [
      {
        id: "1",
        question: "Which functional group is present in an alcohol molecule?",
        similarity: 95.2,
        type: "MCQ",
        status: 'similar'
      },
      {
        id: "2", 
        question: "What is the general formula of an alkane?",
        similarity: 87.8,
        type: "MCQ",
        status: 'similar'
      },
      {
        id: "3",
        question: "Which compound is an example of an aromatic hydrocarbon?",
        similarity: 92.1,
        type: "MCQ",
        status: 'similar'
      },
      {
        id: "4",
        question: "What type of reaction is the conversion of an alcohol to an alkene?",
        similarity: 89.5,
        type: "MCQ",
        status: 'similar'
      },
      {
        id: "5",
        question: "What is the functional group of a ketone?",
        similarity: 76.3,
        type: "MCQ",
        status: 'enemy'
      }
    ];
    
    setSimilarItems(mockSimilarItems);
    
    // Mock processed items data
    const mockQuestionItems: QuestionItem[] = [
      {
        id: "1",
        sequenceNumber: 1,
        question: "Which functional group is present in an alcohol molecule?",
        type: "MCQ",
        options: ["Hydroxyl (-OH)", "Carboxyl (-COOH)", "Amino (-NH2)", "Carbonyl (C=O)"],
        correctAnswer: "Hydroxyl (-OH)"
      },
      {
        id: "2",
        sequenceNumber: 2,
        question: "What is the general formula of an alkane?",
        type: "MCQ", 
        options: ["CnH2n+2", "CnH2n", "CnH2n-2", "CnHn"],
        correctAnswer: "CnH2n+2"
      },
      {
        id: "3",
        sequenceNumber: 3,
        question: "Explain the mechanism of electrophilic addition.",
        type: "Descriptive"
      }
    ];
    
    setQuestionItems(mockQuestionItems);
    setEnemyItems(mockSimilarItems.filter(item => item.status === 'enemy'));
    setIsAnalyzing(false);
    
    toast({
      title: "Analysis Complete",
      description: `Processed ${mockQuestionItems.length} items, found ${mockSimilarItems.length} similar items`,
    });
  };

  const handleDownloadTemplate = () => {
    toast({
      title: "Template Downloaded",
      description: "Standard template has been downloaded",
    });
  };

  const toggleEnemyStatus = (id: string) => {
    setSimilarItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, status: item.status === 'enemy' ? 'similar' : 'enemy' }
        : item
    ));
  };

  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 90) return "text-green-600";
    if (similarity >= 80) return "text-yellow-600";
    return "text-red-600";
  };

  const getSimilarityBg = (similarity: number) => {
    if (similarity >= 90) return "bg-green-100";
    if (similarity >= 80) return "bg-yellow-100";
    return "bg-red-100";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 px-6 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">IS</span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-gray-900">Item Similarity</span>
                <span className="text-xs text-gray-500">AI-Powered Similarity Analysis</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-lg border border-purple-200">
              <div className="w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center">
                <Target className="w-2 h-2 text-white" />
              </div>
              <span className="text-sm text-purple-700 font-medium">4,651 Tokens</span>
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
            <Scan className="w-4 h-4" />
            Analyze Item Similarity
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-blue-800 bg-clip-text text-transparent">
            Item Similarity Analyzer
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage question sets, find similar items, and identify enemy questions
          </p>
        </div>

        {/* Enhanced Tabs */}
        <Card className="border-gray-200 shadow-xl bg-white/90 backdrop-blur-sm">
          <Tabs defaultValue="item-bank" className="w-full">
            <div className="bg-gradient-to-r from-purple-50 via-blue-50 to-purple-50 border-b border-purple-200/50 px-6 pt-6 pb-2">
              <TabsList className="grid w-full grid-cols-3 bg-white/60 backdrop-blur-sm border border-purple-200 shadow-lg h-14">
                <TabsTrigger 
                  value="item-bank" 
                  className="relative flex items-center gap-3 text-gray-700 font-semibold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-700 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-[1.02] hover:bg-purple-50"
                >
                  <FileText className="w-4 h-4" />
                  Item Bank
                </TabsTrigger>
                <TabsTrigger 
                  value="similar-items" 
                  className="relative flex items-center gap-3 text-gray-700 font-semibold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-[1.02] hover:bg-blue-50"
                >
                  <Target className="w-4 h-4" />
                  Similar Items
                </TabsTrigger>
                <TabsTrigger 
                  value="enemy-items" 
                  className="relative flex items-center gap-3 text-gray-700 font-semibold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-[1.02] hover:bg-red-50"
                >
                  <AlertTriangle className="w-4 h-4" />
                  Enemy Items
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Item Bank Tab */}
            <TabsContent value="item-bank" className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Item Bank</h2>
                  <p className="text-gray-600 mt-1">Manage your question sets and upload templates</p>
                </div>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200">
                  <Clock className="w-3 h-3 mr-1" />
                  Tokens: 4,651
                </Badge>
              </div>

              {/* Question Set Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="text-sm font-medium text-gray-700">Select Question Set</label>
                  <Select value={selectedQuestionSet} onValueChange={setSelectedQuestionSet}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a question set" />
                    </SelectTrigger>
                    <SelectContent>
                      {questionSets.map((set) => (
                        <SelectItem key={set.id} value={set.id}>
                          {set.name} ({set.itemCount} items)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-4">
                  <label className="text-sm font-medium text-gray-700">Actions</label>
                  <Button 
                    variant="outline" 
                    className="w-full border-2 border-purple-400 text-purple-700 hover:bg-purple-50"
                    onClick={handleDownloadTemplate}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Template
                  </Button>
                </div>
              </div>

              {/* File Upload */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Upload Question Template</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <Badge variant="outline" className="text-xs">Format: .xlsx only</Badge>
                  <Badge variant="outline" className="text-xs">Limit: 50 Questions</Badge>
                </div>
                
                {!uploadedFile ? (
                  <div 
                    className={`border-2 border-dashed rounded-xl p-12 transition-all duration-300 cursor-pointer ${
                      isDragOver 
                        ? 'border-purple-500 bg-purple-50/50' 
                        : 'border-gray-300 hover:border-purple-400 bg-gray-50/30'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <div className="text-center space-y-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto transition-all duration-300 ${
                        isDragOver 
                          ? 'bg-purple-600' 
                          : 'bg-gray-100 border-2 border-gray-300'
                      }`}>
                        <Upload className={`w-6 h-6 transition-all duration-300 ${
                          isDragOver ? 'text-white' : 'text-gray-500'
                        }`} />
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-md font-semibold text-gray-900">
                          Drop your Excel file here
                        </h4>
                        <p className="text-gray-500 text-sm">
                          or click to browse for files
                        </p>
                      </div>
                      
                      <input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                      />
                      <Button 
                        variant="outline" 
                        className="border-2 border-purple-400 text-purple-700 bg-purple-50 hover:bg-purple-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          document.getElementById('file-upload')?.click();
                        }}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Browse Files
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-green-200 rounded-xl p-8 bg-green-50/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-green-100 border-2 border-green-300 flex items-center justify-center">
                          <FileText className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <h4 className="text-md font-semibold text-gray-900">{uploadedFile.name}</h4>
                          <p className="text-green-600 font-medium text-sm">File uploaded successfully!</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                          onClick={handleAnalyzeSimilarity}
                          disabled={isAnalyzing}
                        >
                          {isAnalyzing ? (
                            <>
                              <Clock className="w-4 h-4 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Scan className="w-4 h-4 mr-2" />
                              Process Items
                            </>
                          )}
                        </Button>
                        <Button 
                          variant="outline" 
                          className="border-2 border-red-400 text-red-600 hover:bg-red-50"
                          onClick={handleRemoveFile}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Processing Progress */}
              {isAnalyzing && (
                <Card className="border-purple-200 animate-fade-in">
                  <div className="p-6 text-center space-y-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto">
                      <Scan className="w-6 h-6 text-purple-600 animate-pulse" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-lg font-semibold text-gray-900">Processing Items...</h4>
                      <p className="text-gray-600">AI is analyzing your questions</p>
                      <Progress value={75} className="w-full max-w-md mx-auto" />
                    </div>
                  </div>
                </Card>
              )}

              {/* Processed Items Table */}
              {questionItems.length > 0 && !isAnalyzing && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Processed Items</h3>
                    <Button variant="outline" className="border-2 border-blue-400 text-blue-700 hover:bg-blue-50">
                      <Download className="w-4 h-4 mr-2" />
                      Export Items
                    </Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">#</TableHead>
                        <TableHead>Question</TableHead>
                        <TableHead className="w-24">Type</TableHead>
                        <TableHead className="w-32">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {questionItems.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.sequenceNumber}</TableCell>
                          <TableCell className="max-w-md">
                            <p className="truncate">{item.question}</p>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{item.type}</Badge>
                          </TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Eye className="w-4 h-4 mr-2" />
                                  Preview
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-2 text-xl">
                                    <Eye className="w-5 h-5 text-purple-600" />
                                    Question Preview
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="space-y-6">
                                  {/* Question Header */}
                                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl border border-purple-200">
                                    <div className="flex items-center gap-3 mb-3">
                                      <Badge className="bg-purple-100 text-purple-800">
                                        Question #{item.sequenceNumber}
                                      </Badge>
                                      <Badge variant="outline" className="border-purple-300 text-purple-700">
                                        {item.type}
                                      </Badge>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg shadow-sm">
                                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Question Statement</h3>
                                      <p className="text-gray-800 leading-relaxed">{item.question}</p>
                                    </div>
                                  </div>

                                  {/* Options Section */}
                                  {item.options && (
                                    <div className="space-y-4">
                                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                                        Answer Options
                                      </h3>
                                      <div className="grid gap-3">
                                        {item.options.map((option, idx) => (
                                          <div 
                                            key={idx} 
                                            className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-200 ${
                                              item.correctAnswer === option 
                                                ? 'bg-green-50 border-2 border-green-300 shadow-md' 
                                                : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                                            }`}
                                          >
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                              item.correctAnswer === option 
                                                ? 'bg-green-500 text-white' 
                                                : 'bg-gray-300 text-gray-700'
                                            }`}>
                                              {String.fromCharCode(65 + idx)}
                                            </div>
                                            <span className="flex-1 text-gray-800">{option}</span>
                                            {item.correctAnswer === option && (
                                              <Badge className="bg-green-500 text-white">
                                                Correct Answer
                                              </Badge>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>

            {/* Similar Items Tab */}
            <TabsContent value="similar-items" className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Similar Items</h2>
                  <p className="text-gray-600 mt-1">Find and analyze similar questions based on score threshold</p>
                </div>
              </div>

              {/* Controls */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Question Set</label>
                  <Select value={selectedQuestionSet} onValueChange={setSelectedQuestionSet}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a question set" />
                    </SelectTrigger>
                    <SelectContent>
                      {questionSets.map((set) => (
                        <SelectItem key={set.id} value={set.id}>
                          {set.name} ({set.itemCount} items)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Score Threshold
                  </label>
                  <div className="relative">
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                      <div className="flex-1">
                        <input
                          type="range"
                          min="50"
                          max="100"
                          value={scoreThreshold}
                          onChange={(e) => setScoreThreshold(Number(e.target.value))}
                          className="w-full h-2 bg-gradient-to-r from-red-300 via-yellow-300 to-green-300 rounded-lg appearance-none cursor-pointer slider"
                          style={{
                            background: `linear-gradient(to right, #fca5a5 0%, #fde047 50%, #86efac 100%)`
                          }}
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>50%</span>
                          <span>75%</span>
                          <span>100%</span>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className={`px-4 py-2 rounded-lg text-lg font-bold text-white ${
                          scoreThreshold >= 90 ? 'bg-green-500' : 
                          scoreThreshold >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}>
                          {scoreThreshold}%
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {scoreThreshold >= 90 ? 'Excellent' : 
                           scoreThreshold >= 75 ? 'Good' : 'Moderate'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Actions</label>
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    disabled={!selectedQuestionSet}
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Find Similar Items
                  </Button>
                </div>
              </div>

              {/* Similar Items Results */}
              {similarItems.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Similar Items Found</h3>
                    <Button variant="outline" className="border-2 border-blue-400 text-blue-700 hover:bg-blue-50">
                      <Download className="w-4 h-4 mr-2" />
                      Export Results
                    </Button>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">#</TableHead>
                        <TableHead>Question</TableHead>
                        <TableHead className="w-24">Type</TableHead>
                        <TableHead className="w-32">Score</TableHead>
                        <TableHead className="w-32">Status</TableHead>
                        <TableHead className="w-32">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {similarItems.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell className="max-w-md">
                            <p className="truncate">{item.question}</p>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{item.type}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getSimilarityBg(item.similarity)}`}>
                                <span className={getSimilarityColor(item.similarity)}>
                                  {item.similarity.toFixed(1)}%
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              className={
                                item.status === 'enemy' 
                                  ? 'bg-red-100 text-red-800 hover:bg-red-100' 
                                  : 'bg-green-100 text-green-800 hover:bg-green-100'
                              }
                            >
                              {item.status === 'enemy' ? 'Enemy' : 'Similar'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2 text-xl">
                                      <Target className="w-5 h-5 text-blue-600" />
                                      Similar Items Analysis
                                    </DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-6">
                                    {/* Original Question */}
                                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border-2 border-blue-200">
                                      <div className="flex items-center gap-2 mb-3">
                                        <Badge className="bg-blue-600 text-white">Original Question</Badge>
                                        <Badge variant="outline" className="border-blue-300">{item.type}</Badge>
                                      </div>
                                      <div className="bg-white p-4 rounded-lg shadow-sm">
                                        <p className="text-gray-900 font-medium">{item.question}</p>
                                      </div>
                                    </div>

                                    {/* Similarity Stats */}
                                    <div className="grid grid-cols-3 gap-4">
                                      <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
                                        <div className="text-2xl font-bold text-green-600">5</div>
                                        <div className="text-sm text-green-700">Similar Items</div>
                                      </div>
                                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
                                        <div className="text-2xl font-bold text-blue-600">{item.similarity.toFixed(1)}%</div>
                                        <div className="text-sm text-blue-700">Avg Similarity</div>
                                      </div>
                                      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 text-center">
                                        <div className="text-2xl font-bold text-purple-600">98.2%</div>
                                        <div className="text-sm text-purple-700">Highest Match</div>
                                      </div>
                                    </div>

                                    {/* Similar Items List */}
                                    <div>
                                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                        Similar Items Found
                                      </h4>
                                      <div className="space-y-4">
                                        {[
                                          { id: 1, question: "Which functional group is present in alcohols?", similarity: 98.2, type: "MCQ" },
                                          { id: 2, question: "Identify the functional group in alcohol compounds", similarity: 95.8, type: "MCQ" },
                                          { id: 3, question: "What functional group characterizes alcohol molecules?", similarity: 93.4, type: "MCQ" },
                                          { id: 4, question: "The functional group found in alcohols is called?", similarity: 91.7, type: "Short Answer" },
                                          { id: 5, question: "Name the functional group present in ethanol", similarity: 89.3, type: "MCQ" }
                                        ].map((similarItem) => (
                                          <div key={similarItem.id} className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-all duration-200 hover:shadow-md">
                                            <div className="flex items-start justify-between mb-3">
                                              <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                  <span className="text-blue-600 font-bold text-sm">{similarItem.id}</span>
                                                </div>
                                                <Badge variant="outline" className="border-gray-300">
                                                  {similarItem.type}
                                                </Badge>
                                              </div>
                                              <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                                                similarItem.similarity >= 95 ? 'bg-green-100 text-green-700' :
                                                similarItem.similarity >= 90 ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-orange-100 text-orange-700'
                                              }`}>
                                                {similarItem.similarity}% Match
                                              </div>
                                            </div>
                                            <div className="bg-gray-50 p-3 rounded-lg">
                                              <p className="text-gray-800">{similarItem.question}</p>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleEnemyStatus(item.id)}
                                className={
                                  item.status === 'enemy'
                                    ? 'border-green-400 text-green-600 hover:bg-green-50'
                                    : 'border-red-400 text-red-600 hover:bg-red-50'
                                }
                              >
                                {item.status === 'enemy' ? 'Mark Similar' : 'Mark Enemy'}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>

            {/* Enemy Items Tab */}
            <TabsContent value="enemy-items" className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Enemy Items</h2>
                  <p className="text-gray-600 mt-1">Manage and export enemy questions</p>
                </div>
                <Button variant="outline" className="border-2 border-red-400 text-red-700 hover:bg-red-50">
                  <Download className="w-4 h-4 mr-2" />
                  Export Enemy Items
                </Button>
              </div>

              {/* Question Set Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Question Set</label>
                  <Select value={selectedQuestionSet} onValueChange={setSelectedQuestionSet}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a question set" />
                    </SelectTrigger>
                    <SelectContent>
                      {questionSets.map((set) => (
                        <SelectItem key={set.id} value={set.id}>
                          {set.name} ({set.itemCount} items)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Actions</label>
                  <Button 
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                    disabled={!selectedQuestionSet}
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Find Enemy Items
                  </Button>
                </div>
              </div>

              {/* Enemy Items Table */}
              {enemyItems.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Enemy Questions ({enemyItems.length})</h3>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">#</TableHead>
                        <TableHead>Question</TableHead>
                        <TableHead className="w-24">Type</TableHead>
                        <TableHead className="w-32">Score</TableHead>
                        <TableHead className="w-32">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {enemyItems.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell className="max-w-md">
                            <p className="truncate">{item.question}</p>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{item.type}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getSimilarityBg(item.similarity)} inline-block`}>
                              <span className={getSimilarityColor(item.similarity)}>
                                {item.similarity.toFixed(1)}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Eye className="w-4 h-4 mr-2" />
                                  View
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Enemy Item Details</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                    <h4 className="font-medium text-red-900 mb-2">Enemy Question</h4>
                                    <p className="text-red-800">{item.question}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-gray-900 mb-2">Details</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <span className="text-sm text-gray-600">Type:</span>
                                        <p className="font-medium">{item.type}</p>
                                      </div>
                                      <div>
                                        <span className="text-sm text-gray-600">Similarity Score:</span>
                                        <p className="font-medium">{item.similarity.toFixed(1)}%</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Enemy Items Found</h3>
                  <p className="text-gray-600">Select a question set and click "Find Enemy Items" to start analysis</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Card>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <div className="w-4 h-4 bg-purple-600 rounded flex items-center justify-center">
              <span className="text-white text-xs">⚡</span>
            </div>
            <span>Powered by advanced AI similarity detection</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemSimilarity;