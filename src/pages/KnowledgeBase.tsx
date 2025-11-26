import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Search, FileText, Edit, Eye, MessageSquare, Trash2, ArrowLeft, BookOpen, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const knowledgeBases = [
  { id: 1, name: "agex", bookName: "agex", type: "Book Level" },
  { id: 2, name: "imageblank1", bookName: "imageblank", type: "Book Level" },
];

const KnowledgeBase = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("ACCA");
  const [typeFilter, setTypeFilter] = useState("All");

  const filteredKnowledgeBases = knowledgeBases.filter((kb) =>
    kb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    kb.bookName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Knowledge Base System</h1>
              <p className="text-xs text-gray-500">Manage and organize your knowledge repositories</p>
            </div>
          </div>
          
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="text-gray-600">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
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
                  <Button className="px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
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
        </div>
      </main>
    </div>
  );
};

export default KnowledgeBase;
