import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Edit, Trash2, Bell, Menu, Plus, Users as UsersIcon, X } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { ProfileDropdown } from "@/components/ProfileDropdown";

const users = [
  { id: 1, firstName: "ShivaEu01", lastName: "M", loginName: "ShivaEu01", emailId: "shivaraj@gmail.com" },
  { id: 2, firstName: "naresh", lastName: "dp", loginName: "nareshdp", emailId: "nareshgowdadpn@gmail.com" },
  { id: 3, firstName: "Vish", lastName: "", loginName: "Vish", emailId: "Vishwanath.subbanng@excelindia.com" },
  { id: 4, firstName: "Naresh", lastName: "N", loginName: "nareshgowda.dp@excelindia.com", emailId: "nareshgowda.dp@excelindia.com" },
  { id: 5, firstName: "abcd", lastName: "D", loginName: "abcd", emailId: "abcd@gmail.com" },
  { id: 6, firstName: "ESUser1", lastName: "", loginName: "ESUser1", emailId: "ESUser1@excelsoftcorp.com" },
  { id: 7, firstName: "ESUser2", lastName: "", loginName: "ESUser2", emailId: "ESUser2@excelsoftcorp.com" },
  { id: 8, firstName: "ESUser3", lastName: "", loginName: "ESUser3", emailId: "ESUser3@excelsoftcorp.com" },
];

const Collaboration = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    userName: "",
    password: "",
    confirmPassword: "",
    contactNumber: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveUser = () => {
    // TODO: Add validation and save logic
    console.log("Saving user:", formData);
    setIsAddingUser(false);
    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      userName: "",
      password: "",
      confirmPassword: "",
      contactNumber: "",
    });
  };

  const filteredUsers = users.filter((user) =>
    user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.loginName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.emailId.toLowerCase().includes(searchQuery.toLowerCase())
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
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <UsersIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                  User Management
                </h2>
              </div>
            </div>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white flex-shrink-0"
              onClick={() => setIsAddingUser(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>

        {/* Add User Dialog */}
        <Dialog open={isAddingUser} onOpenChange={setIsAddingUser}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900">Create User</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-5 py-4">
              <div className="space-y-2">
                <Label className="text-base font-semibold text-gray-900">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className="bg-white border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-base font-semibold text-gray-900">Last Name</Label>
                <Input
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className="bg-white border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-base font-semibold text-gray-900">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="bg-white border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-base font-semibold text-gray-900">
                  User Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="Username"
                  value={formData.userName}
                  onChange={(e) => handleInputChange("userName", e.target.value)}
                  className="bg-white border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-base font-semibold text-gray-900">
                  Password <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="bg-white border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-base font-semibold text-gray-900">
                  Confirm Password <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  className="bg-white border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-base font-semibold text-gray-900">Contact Number</Label>
                <Input
                  placeholder="+91-00000-00000"
                  value={formData.contactNumber}
                  onChange={(e) => handleInputChange("contactNumber", e.target.value)}
                  className="bg-white border-gray-300"
                />
              </div>

              <Button 
                onClick={handleSaveUser}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base font-semibold"
              >
                Save
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Main Content */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Search Bar */}
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white border-gray-300"
                />
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-900">First Name</TableHead>
                    <TableHead className="font-semibold text-gray-900">Last Name</TableHead>
                    <TableHead className="font-semibold text-gray-900">Login Name</TableHead>
                    <TableHead className="font-semibold text-gray-900">Email Id</TableHead>
                    <TableHead className="font-semibold text-gray-900">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="text-gray-900">{user.firstName}</TableCell>
                        <TableCell className="text-gray-900">{user.lastName}</TableCell>
                        <TableCell className="text-gray-900">{user.loginName}</TableCell>
                        <TableCell className="text-gray-900">{user.emailId}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              onClick={() => console.log('Edit user:', user.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => console.log('Delete user:', user.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                              onClick={() => console.log('Notify user:', user.id)}
                            >
                              <Bell className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                        No users found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Collaboration;
