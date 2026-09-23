import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { Link } from "react-router-dom";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { logout } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-background/80 backdrop-blur-lg px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <Link to="/dashboard" className="text-lg font-bold gradient-text hidden sm:block">SkillSwap</Link>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="ghost" size="icon" onClick={logout} className="rounded-full">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
