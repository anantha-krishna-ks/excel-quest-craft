import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, FileText, Edit, Eye, MessageSquare, Trash2, ChevronDown } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

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
    <div className="min-h-screen flex w-full bg-background">
      {/* Mobile Menu */}
      <Sheet>
        <SheetTrigger asChild className="lg:hidden fixed top-4 left-4 z-50">
          <Button variant="outline" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <AppSidebar onNavigate={() => {}} />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 border-r border-border/20">
        <AppSidebar />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-border/20 bg-white flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-primary" />
            <h1 className="text-xl lg:text-2xl font-bold text-foreground">Knowledge Base System</h1>
          </div>
          <ProfileDropdown />
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-8 space-y-6">
          {/* Customer Selection */}
          <div className="bg-white p-4 lg:p-6 rounded-lg border border-border/20">
            <h2 className="text-base lg:text-lg font-semibold mb-4 text-foreground">Select Customer</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                <SelectTrigger className="w-full pl-10 bg-white border-border/40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACCA">ACCA</SelectItem>
                  <SelectItem value="Customer2">Customer 2</SelectItem>
                  <SelectItem value="Customer3">Customer 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Knowledge Bases Section */}
          <div className="bg-white p-4 lg:p-6 rounded-lg border border-border/20">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <h2 className="text-base lg:text-lg font-semibold text-foreground">Knowledge Bases</h2>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button className="bg-[#B8922B] hover:bg-[#A07F24] text-white">
                  Create New Knowledge Base
                </Button>
                <Button className="bg-[#B8922B] hover:bg-[#A07F24] text-white">
                  Create Study LO
                </Button>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search KBs"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white border-border/40"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-32 bg-white border-border/40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Book Level">Book Level</SelectItem>
                  <SelectItem value="Chapter Level">Chapter Level</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <div className="border border-border/20 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="font-semibold text-foreground">Knowledge Base Name</TableHead>
                      <TableHead className="font-semibold text-foreground">Book Name</TableHead>
                      <TableHead className="font-semibold text-foreground">Type</TableHead>
                      <TableHead className="font-semibold text-foreground">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredKnowledgeBases.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          No knowledge bases found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredKnowledgeBases.map((kb) => (
                        <TableRow key={kb.id} className="hover:bg-muted/20">
                          <TableCell className="font-medium">{kb.name}</TableCell>
                          <TableCell>{kb.bookName}</TableCell>
                          <TableCell>{kb.type}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10">
                                <Edit className="h-4 w-4 text-blue-600" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10">
                                <Eye className="h-4 w-4 text-gray-600" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10">
                                <MessageSquare className="h-4 w-4 text-teal-600" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10">
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
          </div>
        </main>
      </div>
    </div>
  );
};

export default KnowledgeBase;
