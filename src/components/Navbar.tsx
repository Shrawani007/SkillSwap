import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { LogOut, User, Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const { token, user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 glass-strong">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="text-xl font-bold gradient-text">
          SkillSwap
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          {token ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">Dashboard</Button>
              </Link>
              <Link to="/profile">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={logout} className="rounded-full">
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Link to="/login"><Button variant="ghost" size="sm">Sign In</Button></Link>
              <Link to="/register"><Button size="sm">Get Started</Button></Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border px-4 py-4 md:hidden glass-strong">
          <div className="flex flex-col gap-2">
            {token ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">Dashboard</Button>
                </Link>
                <Link to="/profile" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">Profile</Button>
                </Link>
                <Button variant="ghost" className="w-full justify-start" onClick={() => { logout(); setMobileOpen(false); }}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">Sign In</Button>
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
