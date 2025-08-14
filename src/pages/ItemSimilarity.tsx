import { useState } from "react";
import { ArrowLeft, Upload, Download, FileText, Scan, Trash2, Clock, BarChart3, Target, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface SimilarItem {
  id: string;
  question: string;
  similarity: number;
  type: string;
  status: 'similar' | 'enemy';
}

const ItemSimilarity = () => {
  const { toast } = useToast();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [similarItems, setSimilarItems] = useState<SimilarItem[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

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
    setIsAnalyzing(false);
    
    toast({
      title: "Analysis Complete",
      description: `Found ${mockSimilarItems.length} similar items`,
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
            Upload questions to find similar items and identify potential duplicates or enemy items
          </p>
        </div>

        {/* Statistics Cards */}
        {similarItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
            {stats.map((stat, index) => (
              <Card key={index} className={`p-6 ${stat.bgColor} border ${stat.borderColor} shadow-sm`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-8 h-8 ${stat.iconBg} rounded-lg flex items-center justify-center shadow-sm`}>
                    <div className="text-white">
                      {stat.icon}
                    </div>
                  </div>
                  <span className="font-medium text-gray-700">{stat.title}</span>
                </div>
                
                <div className="space-y-2">
                  <div className={`text-2xl font-bold ${stat.textColor}`}>{stat.total}</div>
                  <div className="text-sm font-medium text-gray-600">{stat.subtitle}</div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Upload Section */}
        <Card className="border-2 border-gray-200">
          <div className="p-8">
            <div className="text-center space-y-6">
              <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200">
                <Clock className="w-3 h-3 mr-1" />
                Remaining Tokens: 4,651
              </Badge>
              
              <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500 gap-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">Format: .xlsx only</Badge>
                  <Badge variant="outline" className="text-xs">Limit: 50 Questions</Badge>
                </div>
                
                <Button 
                  variant="outline" 
                  className="border-2 border-purple-400 text-purple-700 bg-white hover:bg-purple-50 hover:border-purple-500 hover:text-purple-800 transition-all duration-200"
                  onClick={handleDownloadTemplate}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Template
                </Button>
              </div>
              
              {!uploadedFile ? (
                <div 
                  className={`border-2 border-dashed rounded-xl p-16 transition-all duration-300 cursor-pointer ${
                    isDragOver 
                      ? 'border-purple-500 bg-purple-50/50' 
                      : 'border-gray-300 hover:border-purple-400 bg-gray-50/30'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <div className="text-center space-y-6">
                    <div className={`w-16 h-16 rounded-lg flex items-center justify-center mx-auto transition-all duration-300 ${
                      isDragOver 
                        ? 'bg-purple-600' 
                        : 'bg-gray-100 border-2 border-gray-300'
                    }`}>
                      <Upload className={`w-8 h-8 transition-all duration-300 ${
                        isDragOver ? 'text-white' : 'text-gray-500'
                      }`} />
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Drop your Excel file here
                      </h3>
                      <p className="text-gray-500">
                        or click to browse for files
                      </p>
                      <p className="text-sm text-gray-400">
                        Supported formats: XLSX (Max 50 Questions)
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
                      className="border-2 border-purple-400 text-purple-700 bg-purple-50 hover:bg-purple-100 hover:border-purple-500 hover:text-purple-800 transition-all duration-200"
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
                <div className="border-2 border-green-200 rounded-xl p-12 bg-green-50/30">
                  <div className="text-center space-y-6">
                    <div className="w-16 h-16 rounded-lg bg-green-100 border-2 border-green-300 flex items-center justify-center mx-auto">
                      <FileText className="w-8 h-8 text-green-600" />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {uploadedFile.name}
                      </h3>
                      <p className="text-green-600 font-medium">
                        File uploaded successfully!
                      </p>
                    </div>
                    
                    <div className="flex gap-4 justify-center">
                      <Button 
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                        onClick={handleAnalyzeSimilarity}
                        disabled={isAnalyzing}
                      >
                        {isAnalyzing ? (
                          <>
                            <Clock className="w-4 h-4 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Scan className="w-4 h-4 mr-2" />
                            Analyze Similarity
                          </>
                        )}
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="border-2 border-red-400 text-red-600 bg-white hover:bg-red-50 hover:border-red-500 transition-all duration-200"
                        onClick={handleRemoveFile}
                      >
                        Remove File
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Analysis Progress */}
        {isAnalyzing && (
          <Card className="border-purple-200 animate-fade-in">
            <div className="p-8 text-center space-y-6">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto">
                <Scan className="w-8 h-8 text-purple-600 animate-pulse" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-gray-900">Analyzing Similarity...</h3>
                <p className="text-gray-600">AI is processing your questions to find similar items</p>
                <Progress value={75} className="w-full max-w-md mx-auto" />
              </div>
            </div>
          </Card>
        )}

        {/* Similar Items Results */}
        {similarItems.length > 0 && !isAnalyzing && (
          <Card className="border-gray-200 animate-fade-in">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Similar Items Found</h2>
                    <p className="text-gray-600 mt-1">Review and mark items as similar or enemy</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="border-2 border-blue-400 text-blue-700 hover:bg-blue-50"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Results
                  </Button>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">#</TableHead>
                    <TableHead>Question</TableHead>
                    <TableHead className="w-24">Type</TableHead>
                    <TableHead className="w-32">Similarity</TableHead>
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}

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