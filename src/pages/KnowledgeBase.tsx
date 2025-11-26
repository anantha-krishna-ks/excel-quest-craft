import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Search, FileText, Edit, Eye, MessageSquare, Trash2, ArrowLeft, BookOpen, Plus, Menu } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { ProfileDropdown } from "@/components/ProfileDropdown";

const knowledgeBases = [
  { id: 1, name: "agex", bookName: "agex", type: "Book Level" },
  { id: 2, name: "imageblank1", bookName: "imageblank", type: "Book Level" },
];

const KnowledgeBase = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("ACCA");
  const [typeFilter, setTypeFilter] = useState("All");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [levelType, setLevelType] = useState<"book" | "study">("book");

  const filteredKnowledgeBases = knowledgeBases.filter((kb) =>
    kb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    kb.bookName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="fixed left-0 top-0 h-full w-52 z-40 hidden lg:block">
        <AppSidebar />
      </div>

      {/* Mobile Menu Sheet */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <AppSidebar onNavigate={() => setMobileMenuOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="ml-0 lg:ml-52 min-h-screen flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
          <div className="flex h-16 items-center justify-between px-3 sm:px-6 gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden flex-shrink-0"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs">✦</span>
                </div>
                <span className="text-xs sm:text-sm text-blue-600 font-medium whitespace-nowrap">4,651</span>
              </div>
              
              <ProfileDropdown />
            </div>
          </div>
        </header>

        {/* Page Title Section */}
        <div className="bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 sm:gap-3">
              {isCreating && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsCreating(false)}
                  className="flex-shrink-0"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              )}
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                {isCreating ? "Create New Knowledge Base" : "Knowledge Base System"}
              </h2>
            </div>
            {!isCreating && (
              <Button variant="outline" size="sm" className="text-gray-600 hover:text-gray-900 flex-shrink-0">
                <FileText className="w-4 h-4 mr-2" />
                Knowledge Base Manual
              </Button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {isCreating ? (
              /* Create Form */
              <>
                {/* Level Type Selection Card */}
                <Card className="border-2 border-purple-100 bg-purple-50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-600 text-white rounded-lg">
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <h3 className="text-lg font-semibold text-purple-800">Select Knowledge Base Type</h3>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant={levelType === "book" ? "default" : "outline"}
                          onClick={() => setLevelType("book")}
                          className={levelType === "book" ? "bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-600" : "border-purple-200"}
                        >
                          Book Level
                        </Button>
                        <Button
                          variant={levelType === "study" ? "default" : "outline"}
                          onClick={() => setLevelType("study")}
                          className={levelType === "study" ? "bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-600" : "border-purple-200"}
                        >
                          Study Level
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Basic Information Card */}
                <Card className="border-2 border-blue-100 bg-blue-50">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-blue-600 text-white rounded-lg">
                        <FileText className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-semibold text-blue-800">Basic Information</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-blue-900">
                          Book Name <span className="text-red-500">*</span>
                        </label>
                        <Input 
                          placeholder="Enter Book name" 
                          className="bg-white border-blue-200 focus:border-blue-400 focus:ring-blue-400/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-blue-900">
                          Knowledge Base Name <span className="text-red-500">*</span>
                        </label>
                        <Input 
                          placeholder="Enter knowledge base name" 
                          className="bg-white border-blue-200 focus:border-blue-400 focus:ring-blue-400/20"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Upload Section Card */}
                <Card className="border-2 border-teal-100 bg-teal-50">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-teal-600 text-white rounded-lg">
                        <FileText className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-semibold text-teal-800">File Uploads</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-teal-900">
                          Document Upload <span className="text-red-500">*</span>
                        </label>
                        <div className="bg-white border-2 border-dashed border-teal-200 rounded-lg p-8 text-center space-y-3 hover:border-teal-300 transition-colors">
                          <div className="flex justify-center">
                            <div className="p-3 bg-teal-100 rounded-lg">
                              <FileText className="h-8 w-8 text-teal-600" />
                            </div>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Drag files here or click to select files</p>
                            <p className="text-sm text-gray-600 mt-1">
                              Upload PDF, DOCX, TXT, HTML, CSV, or JSON files up to 30 MB.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-teal-900">Cover Image Upload</label>
                        <div className="bg-white border-2 border-dashed border-teal-200 rounded-lg p-8 text-center space-y-3 hover:border-teal-300 transition-colors">
                          <div className="flex justify-center">
                            <div className="p-3 bg-teal-100 rounded-lg">
                              <FileText className="h-8 w-8 text-teal-600" />
                            </div>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Drag images here or click to select images</p>
                            <p className="text-sm text-gray-600 mt-1">
                              You can upload one image (PNG, JPEG, GIF, WEBP) up to 10 MB.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Processing Settings Card */}
                <Card className="border-2 border-orange-100 bg-orange-50">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-orange-600 text-white rounded-lg">
                        <Search className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-semibold text-orange-800">Processing Settings</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-orange-900 flex items-center gap-1">
                          Retrieval Strategy
                          <span className="text-orange-600 text-xs">ⓘ</span>
                        </label>
                        <Select defaultValue="mmr">
                          <SelectTrigger className="bg-white border-orange-200 focus:border-orange-400 focus:ring-orange-400/20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="mmr">Maximal Marginal Relevance (MMR)</SelectItem>
                            <SelectItem value="similarity">Similarity</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-orange-900 flex items-center gap-1">
                          Number of Reranking Candidates (k)
                          <span className="text-orange-600 text-xs">ⓘ</span>
                        </label>
                        <Input 
                          type="number" 
                          defaultValue="10" 
                          className="bg-white border-orange-200 focus:border-orange-400 focus:ring-orange-400/20"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-orange-900 flex items-center gap-1">
                          Chunk Size
                          <span className="text-orange-600 text-xs">ⓘ</span>
                        </label>
                        <Select defaultValue="1000">
                          <SelectTrigger className="bg-white border-orange-200 focus:border-orange-400 focus:ring-orange-400/20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="500">500 tokens (Smaller chunks)</SelectItem>
                            <SelectItem value="1000">1000 tokens (Larger chunks, more context)</SelectItem>
                            <SelectItem value="1500">1500 tokens (Maximum context)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-orange-900 flex items-center gap-1">
                          Overlap Percentage
                          <span className="text-orange-600 text-xs">ⓘ</span>
                        </label>
                        <Select defaultValue="20">
                          <SelectTrigger className="bg-white border-orange-200 focus:border-orange-400 focus:ring-orange-400/20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="10">10% (Less overlap)</SelectItem>
                            <SelectItem value="20">20% (More context between chunks)</SelectItem>
                            <SelectItem value="30">30% (Maximum overlap)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-orange-900 flex items-center gap-1">
                          Chunking Strategy
                          <span className="text-orange-600 text-xs">ⓘ</span>
                        </label>
                        <Select defaultValue="recursive">
                          <SelectTrigger className="bg-white border-orange-200 focus:border-orange-400 focus:ring-orange-400/20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="recursive">Recursive Character</SelectItem>
                            <SelectItem value="sentence">Sentence-based</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-orange-900 flex items-center gap-1">
                          Database Type
                          <span className="text-orange-600 text-xs">ⓘ</span>
                        </label>
                        <Select defaultValue="faiss">
                          <SelectTrigger className="bg-white border-orange-200 focus:border-orange-400 focus:ring-orange-400/20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="faiss">Faiss</SelectItem>
                            <SelectItem value="chroma">Chroma</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-orange-900 flex items-center gap-1">
                          Embedding Model
                          <span className="text-orange-600 text-xs">ⓘ</span>
                        </label>
                        <Select defaultValue="openai">
                          <SelectTrigger className="bg-white border-orange-200 focus:border-orange-400 focus:ring-orange-400/20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="openai">OpenAI</SelectItem>
                            <SelectItem value="huggingface">HuggingFace</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons Card */}
                <Card className="border-2 border-gray-200 bg-white">
                  <CardContent className="p-6">
                    <div className="flex justify-end gap-3">
                      <Button 
                        variant="outline" 
                        onClick={() => setIsCreating(false)}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </Button>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        Create Knowledge Base
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <>
                {/* Existing List View */}
          {/* Customer Selection Card */}
          <Card className="border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-600 text-white rounded-lg">
                  <Search className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-semibold text-purple-800">Select Customer</h2>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400 z-10" />
                <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                  <SelectTrigger className="w-full pl-10 bg-white border-purple-200 focus:border-purple-400 focus:ring-purple-400/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    <SelectItem value="ACCA">ACCA</SelectItem>
                    <SelectItem value="Customer2">Customer 2</SelectItem>
                    <SelectItem value="Customer3">Customer 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Knowledge Bases Card */}
          <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6 space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600 text-white rounded-lg">
                    <FileText className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-semibold text-blue-800">Knowledge Bases</h2>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    onClick={() => setIsCreating(true)}
                    className="px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Knowledge Base
                  </Button>
                  <Button className="px-6 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Study LO
                  </Button>
                </div>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400 z-10" />
                  <Input
                    placeholder="Search knowledge bases..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white border-blue-200 focus:border-blue-400 focus:ring-blue-400/20"
                  />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-40 bg-white border-blue-200 focus:border-blue-400 focus:ring-blue-400/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    <SelectItem value="All">All Types</SelectItem>
                    <SelectItem value="Book Level">Book Level</SelectItem>
                    <SelectItem value="Chapter Level">Chapter Level</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Table */}
              <div className="bg-white rounded-lg border-2 border-blue-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-blue-50 border-b-2 border-blue-200 hover:bg-blue-50">
                        <TableHead className="font-semibold text-blue-900 py-4">Knowledge Base Name</TableHead>
                        <TableHead className="font-semibold text-blue-900 py-4">Book Name</TableHead>
                        <TableHead className="font-semibold text-blue-900 py-4">Type</TableHead>
                        <TableHead className="font-semibold text-blue-900 py-4">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredKnowledgeBases.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-12 text-gray-500">
                            <div className="flex flex-col items-center gap-2">
                              <FileText className="h-12 w-12 text-gray-300" />
                              <p className="font-medium">No knowledge bases found</p>
                              <p className="text-sm">Try adjusting your search or filters</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredKnowledgeBases.map((kb) => (
                          <TableRow key={kb.id} className="hover:bg-blue-50/50 transition-colors border-b border-blue-100 last:border-b-0">
                            <TableCell className="font-medium text-gray-900 py-4">{kb.name}</TableCell>
                            <TableCell className="text-gray-700 py-4">{kb.bookName}</TableCell>
                            <TableCell className="py-4">
                              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                {kb.type}
                              </span>
                            </TableCell>
                            <TableCell className="py-4">
                              <div className="flex items-center gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-9 w-9 hover:bg-blue-100 transition-colors"
                                >
                                  <Edit className="h-4 w-4 text-blue-600" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-9 w-9 hover:bg-gray-100 transition-colors"
                                >
                                  <Eye className="h-4 w-4 text-gray-600" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-9 w-9 hover:bg-teal-100 transition-colors"
                                >
                                  <MessageSquare className="h-4 w-4 text-teal-600" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-9 w-9 hover:bg-red-100 transition-colors"
                                >
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default KnowledgeBase;
