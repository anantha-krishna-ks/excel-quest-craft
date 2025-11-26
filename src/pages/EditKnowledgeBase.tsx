import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ArrowLeft, BookOpen, FileText, Search, Menu, HelpCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/AppSidebar";
import { ProfileDropdown } from "@/components/ProfileDropdown";

const EditKnowledgeBase = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // TODO: Fetch knowledge base data by id
  const knowledgeBase = {
    id: id,
    name: "agex",
    bookName: "agex",
    type: "Book Level"
  };

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
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/knowledge-base")}
                className="flex-shrink-0"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                  Edit Knowledge Base
                </h2>
                <p className="text-sm text-gray-600">ID: {id}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
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
                    <Label className="text-sm font-medium text-blue-900">
                      Book Name <span className="text-red-500">*</span>
                    </Label>
                    <Input 
                      placeholder="Enter Book name" 
                      defaultValue={knowledgeBase.bookName}
                      className="bg-white border-blue-200 focus:border-blue-400 focus:ring-blue-400/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-blue-900">
                      Knowledge Base Name <span className="text-red-500">*</span>
                    </Label>
                    <Input 
                      placeholder="Enter knowledge base name" 
                      defaultValue={knowledgeBase.name}
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
                    <Label className="text-sm font-medium text-teal-900">
                      Document Upload <span className="text-red-500">*</span>
                    </Label>
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
                    <Label className="text-sm font-medium text-teal-900">Cover Image Upload</Label>
                    <div className="bg-white border-2 border-dashed border-teal-200 rounded-lg p-8 text-center space-y-3 hover:border-teal-300 transition-colors">
                      <div className="flex justify-center">
                        <div className="p-3 bg-teal-100 rounded-lg">
                          <FileText className="h-8 w-8 text-teal-600" />
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Drag images here or click to select images</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Recommended: 800x400px (2:1 ratio) • PNG, JPEG, GIF, WEBP • Max 10 MB
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
                    <Label className="text-sm font-medium text-orange-900 flex items-center gap-1">
                      Retrieval Strategy
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-orange-600 cursor-help hover:text-orange-700 transition-colors" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs bg-gray-800 text-white border-gray-700 px-4 py-3 rounded-lg shadow-lg">
                            <p className="text-sm leading-relaxed">Retrieval Strategy decides how search results are ranked and selected</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
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
                    <Label className="text-sm font-medium text-orange-900 flex items-center gap-1">
                      Number of Reranking Candidates (k)
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-orange-600 cursor-help hover:text-orange-700 transition-colors" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs bg-gray-800 text-white border-gray-700 px-4 py-3 rounded-lg shadow-lg">
                            <p className="text-sm leading-relaxed">Defines how many of the initially retrieved results are considered during reranking.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Input 
                      type="number" 
                      defaultValue="10" 
                      className="bg-white border-orange-200 focus:border-orange-400 focus:ring-orange-400/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-orange-900 flex items-center gap-1">
                      Chunk Size
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-orange-600 cursor-help hover:text-orange-700 transition-colors" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs bg-gray-800 text-white border-gray-700 px-4 py-3 rounded-lg shadow-lg">
                            <p className="text-sm leading-relaxed">Defines how large each text segment is when splitting documents for retrieval.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Select defaultValue="1000">
                      <SelectTrigger className="bg-white border-orange-200 focus:border-orange-400 focus:ring-orange-400/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="500">500 tokens</SelectItem>
                        <SelectItem value="1000">1000 tokens</SelectItem>
                        <SelectItem value="1500">1500 tokens</SelectItem>
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
                    onClick={() => navigate("/knowledge-base")}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Update Knowledge Base
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditKnowledgeBase;
