import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, FileText, LogOut, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const SuperAdminReports = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("reports");
  const userEmail = localStorage.getItem("userEmail") || "";
  
  const [fromDate, setFromDate] = useState("2024-01-01");
  const [toDate, setToDate] = useState("2025-11-26");
  const [organization, setOrganization] = useState("");
  const [status, setStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [hasData, setHasData] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    navigate("/");
  };

  const menuItems = [
    { id: "dashboard", label: "Home / Dashboard", icon: Home, path: "/superadmin-dashboard" },
    { id: "reports", label: "Reports", icon: FileText, path: "/superadmin-reports" }
  ];

  const handleSubmit = () => {
    // Simulate data check
    if (!organization || organization === "none") {
      setShowError(true);
      setHasData(false);
    } else {
      setShowError(false);
      setHasData(true);
    }
  };

  const mockData = [
    {
      date: "02/18/2025 9:19 AM",
      userName: "Madhuri R",
      contactDetails: "8660554859",
      emailId: "madhuri.r@excelindia.com",
      applicationName: "Item Generation",
      adminStatus: "Approved"
    },
    {
      date: "02/17/2025 3:45 PM",
      userName: "Rajesh K",
      contactDetails: "9876543210",
      emailId: "rajesh.k@excelindia.com",
      applicationName: "Essay Evaluation",
      adminStatus: "Rejected"
    },
    {
      date: "02/16/2025 11:30 AM",
      userName: "Priya S",
      contactDetails: "8765432109",
      emailId: "priya.s@excelindia.com",
      applicationName: "Doc Chat",
      adminStatus: "Approved"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/b5b0f5a8-9552-4635-8c44-d5e6f994179c.png" 
                alt="AI-Levate" 
                className="h-8 w-auto"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{userEmail}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveMenu(item.id);
                    navigate(item.path);
                  }}
                  className={`flex items-center space-x-2 px-3 py-4 border-b-2 transition-colors ${
                    activeMenu === item.id
                      ? "border-primary text-primary font-medium"
                      : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
              <Input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
              <Input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Organization</label>
              <Select value={organization} onValueChange={setOrganization}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Organization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Select Organization</SelectItem>
                  <SelectItem value="excelsoft">Excelsoft Technologies</SelectItem>
                  <SelectItem value="other">Other Organization</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="flex items-end">
              <Button 
                onClick={handleSubmit}
                className="w-full bg-[#2563eb] hover:bg-[#2563eb]/90"
              >
                Submit
              </Button>
            </div>
          </div>
        </div>

        {/* Error State */}
        {showError && (
          <div className="bg-white rounded-lg shadow-sm p-12 flex items-center justify-center">
            <div className="bg-red-500 text-white px-8 py-4 rounded-lg text-center">
              <p className="text-lg font-medium">No subscription details available.</p>
            </div>
          </div>
        )}

        {/* Data Table */}
        {hasData && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="font-semibold">User Name</TableHead>
                  <TableHead className="font-semibold">Contact Details</TableHead>
                  <TableHead className="font-semibold">Email Id</TableHead>
                  <TableHead className="font-semibold">Application Name</TableHead>
                  <TableHead className="font-semibold">Admin Status</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockData
                  .filter((row) => {
                    if (status === "all") return true;
                    return row.adminStatus.toLowerCase() === status;
                  })
                  .filter((row) => {
                    if (!searchQuery) return true;
                    const searchLower = searchQuery.toLowerCase();
                    return (
                      row.userName.toLowerCase().includes(searchLower) ||
                      row.emailId.toLowerCase().includes(searchLower) ||
                      row.applicationName.toLowerCase().includes(searchLower)
                    );
                  })
                  .map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>{row.userName}</TableCell>
                      <TableCell>{row.contactDetails}</TableCell>
                      <TableCell>{row.emailId}</TableCell>
                      <TableCell>{row.applicationName}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            row.adminStatus === "Approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {row.adminStatus}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <button
                            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                            title="Approve"
                          >
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          </button>
                          <button
                            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                            title="Reject"
                          >
                            <XCircle className="w-5 h-5 text-red-600" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Initial State */}
        {!hasData && !showError && (
          <div className="bg-white rounded-lg shadow-sm p-12 flex items-center justify-center">
            <p className="text-gray-500 text-center">
              Please select an organization and click Submit to view reports.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default SuperAdminReports;
