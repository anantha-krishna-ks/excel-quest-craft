import { LayoutDashboard, Sparkles, BookOpen, BarChart3, Users, LogOut } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"


const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "AI Tools",
    url: "/ai-tools",
    icon: Sparkles,
  },
  {
    title: "Knowledge Base",
    url: "/knowledge-base",
    icon: BookOpen,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Collaboration",
    url: "/collaboration",
    icon: Users,
  },
]

interface AppSidebarProps {
  onNavigate?: () => void
}

export function AppSidebar({ onNavigate }: AppSidebarProps = {}) {
  const location = useLocation()
  const currentPath = location.pathname

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return currentPath === "/" || currentPath === "/dashboard"
    }
    return currentPath === path
  }

  const handleLogout = () => {
    // Add logout logic here
    console.log("Logging out...")
  }

  return (
    <div className="h-full w-full bg-white/95 backdrop-blur-xl border-r border-border/20 shadow-xl">
      <div className="p-4 border-b border-border/20">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/b5b0f5a8-9552-4635-8c44-d5e6f994179c.png" 
            alt="AI-Levate" 
            className="h-8 w-auto"
          />
        </div>
      </div>
      
      <div className="px-4 py-6">
        <nav className="space-y-2">
          {items.map((item) => (
            <Link
              key={item.title}
              to={item.url}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.url) 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span className="font-medium">{item.title}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}

export { items }