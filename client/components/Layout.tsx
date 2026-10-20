import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Building2,
  Users,
  AlertTriangle,
  Settings,
  Menu,
  X,
  LogOut,
  User,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import NotificationBell from "./NotificationBell";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Navigation based on user role
  const getNavigation = () => {
    if (!isAuthenticated) {
      return [
        { name: "Home", href: "/", icon: Building2 },
        { name: "Login", href: "/login", icon: User },
      ];
    }

    if (user?.role === "admin") {
      return [
        { name: "Home", href: "/", icon: Building2 },
        { name: "Admin Dashboard", href: "/admin/dashboard", icon: Settings },
        { name: "Issue Tracker", href: "/issues", icon: AlertTriangle },
        { name: "Settings", href: "/settings", icon: Settings },
      ];
    }

    if (user?.role === "authority") {
      return [
        { name: "Home", href: "/", icon: Building2 },
        {
          name: "Authority Dashboard",
          href: "/authority/dashboard",
          icon: Settings,
        },
        { name: "Issue Tracker", href: "/issues", icon: AlertTriangle },
        { name: "Settings", href: "/settings", icon: Settings },
      ];
    }

    // Employee navigation
    return [
      { name: "Home", href: "/", icon: Building2 },
      { name: "Employee Portal", href: "/portal", icon: Users },
      { name: "Issue Tracker", href: "/issues", icon: AlertTriangle },
      { name: "Settings", href: "/settings", icon: Settings },
    ];
  };

  const navigation = getNavigation();

  return (
    <div className="min-h-screen bg-nia-neutral flex flex-col font-sans">
      {/* Top Civic Utility Bar */}
      <div className="bg-nia-secondary text-nia-tertiary text-xs py-1.5 px-4 border-b border-nia-border/20">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 text-[11px] md:text-xs tracking-wide">
            <span className="font-semibold text-white/90">भारत सरकार का उद्यम</span>
            <span className="text-white/40">|</span>
            <span className="text-white/80">A Government of India Enterprise • Ministry of Mines</span>
          </div>
          <div className="hidden sm:flex items-center space-x-4 text-[11px]">
            <span className="inline-flex items-center text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse mr-1.5"></span>
              Central Operations: Active
            </span>
            <span className="text-white/40">|</span>
            <a href="tel:18003456789" className="text-white/70 hover:text-white transition-colors">
              Helpline: 1800-345-6789
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 w-full border-b border-nia-border bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo & Identity */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-sm overflow-hidden border border-nia-border/60 bg-white p-0.5">
                <img
                  src="/logo.jpg"
                  alt="NALCO Official Emblem"
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center">
                  <span className="text-lg font-bold text-nia-muted tracking-tight">
                    connect
                  </span>
                  <span className="text-lg font-bold text-nia-primary tracking-tight">
                    NALCO
                  </span>
                </div>
                <span className="text-[10px] text-nia-muted uppercase tracking-wider font-semibold">
                  Industrial Authority Portal
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-3">
              <nav className="flex items-center space-x-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        "flex items-center space-x-2 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all",
                        isActive
                          ? "bg-nia-primary text-white shadow-sm"
                          : "text-nia-onSurface hover:bg-nia-neutral hover:text-nia-primary",
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* User Info, Notifications and Logout */}
              {isAuthenticated && user ? (
                <div className="flex items-center space-x-3 border-l border-nia-border pl-4 ml-2">
                  <div className="text-right">
                    <div className="font-bold text-xs text-nia-onSurface">
                      {user.name}
                    </div>
                    <div className="text-[10px] text-nia-primaryStrong font-semibold uppercase tracking-wider">
                      {user.role} • {user.employeeId}
                    </div>
                  </div>
                  <NotificationBell />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="h-8 rounded-full border-nia-border text-nia-onSurface hover:bg-nia-primary hover:text-white hover:border-nia-primary text-xs px-3"
                  >
                    <LogOut className="h-3.5 w-3.5 mr-1" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2 pl-2">
                  <Link
                    to="/login"
                    className="h-[38px] px-5 rounded-full bg-nia-secondary text-white text-xs font-bold inline-flex items-center hover:bg-nia-primary transition-colors"
                  >
                    Employee Sign In
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="border-t md:hidden">
              <nav className="flex flex-col space-y-1 py-4">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        "flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-nalco-red/10 text-nalco-red"
                          : "text-nalco-gray hover:bg-nalco-gray/10 hover:text-nalco-black",
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}

                {/* Mobile User Info, Notifications and Logout */}
                {isAuthenticated && user && (
                  <div className="border-t pt-4 mt-4">
                    <div className="px-3 py-2 text-sm">
                      <div className="font-medium text-nalco-black">
                        {user.name}
                      </div>
                      <div className="text-xs text-nalco-gray capitalize">
                        {user.role}
                      </div>
                    </div>
                    <div className="px-3 py-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-nalco-gray">
                          Notifications
                        </span>
                        <NotificationBell />
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium text-nalco-gray hover:bg-nalco-gray/10 hover:text-nalco-red transition-colors w-full"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Institutional Public-Sector Footer */}
      <footer className="border-t border-nia-border bg-nia-secondary text-nia-tertiary">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-white/10 text-xs">
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <div className="h-7 w-7 rounded bg-white p-0.5 flex items-center justify-center">
                  <img src="/logo.jpg" alt="NALCO Emblem" className="h-full w-full object-contain" />
                </div>
                <span className="font-bold text-sm tracking-wide text-white">NALCO INDIA</span>
              </div>
              <p className="text-white/60 leading-relaxed mb-3">
                National Aluminium Company Limited (NALCO) is a Navratna CPSE under the Ministry of Mines, Government of India.
              </p>
              <span className="inline-block px-2.5 py-1 rounded bg-nia-primary text-[10px] font-bold text-white uppercase tracking-wider">
                Navratna CPSE
              </span>
            </div>

            <div>
              <h4 className="font-bold text-white mb-3 uppercase tracking-wider text-[11px] text-nia-primaryStrong">
                Key Industrial Units
              </h4>
              <ul className="space-y-1.5 text-white/70">
                <li>• Panchpatmali Bauxite Mines, Koraput</li>
                <li>• Alumina Refinery Complex, Damanjodi</li>
                <li>• Aluminium Smelter Plant, Angul</li>
                <li>• 1200 MW Captive Power Plant, Angul</li>
                <li>• Port Facilities, Visakhapatnam</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-3 uppercase tracking-wider text-[11px] text-nia-primaryStrong">
                Operational Portals
              </h4>
              <ul className="space-y-1.5 text-white/70">
                <li><Link to="/login" className="hover:text-white transition-colors">• Employee Self Service (ESS)</Link></li>
                <li><Link to="/issues" className="hover:text-white transition-colors">• Plant Grievance & Issue Cell</Link></li>
                <li><Link to="/safety" className="hover:text-white transition-colors">• Zero-Harm Safety Protocol</Link></li>
                <li><Link to="/analytics" className="hover:text-white transition-colors">• Plant Production Telemetry</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-3 uppercase tracking-wider text-[11px] text-nia-primaryStrong">
                Emergency & Contact
              </h4>
              <div className="space-y-2 text-white/70">
                <p>Plant Control Room (Damanjodi): <br/><span className="text-white font-mono font-semibold">+91-6853-254555</span></p>
                <p>Industrial Safety Cell: <br/><span className="text-white font-mono font-semibold">1800-345-6789</span></p>
                <p className="text-[11px] text-white/50">Bhubaneswar Corporate Office: NALCO Bhawan, P/1, Nayapalli, Bhubaneswar-751013</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between text-[11px] text-white/50">
            <p>© {new Date().getFullYear()} National Aluminium Company Limited (NALCO). A Govt. of India Enterprise.</p>
            <div className="flex items-center space-x-4 mt-3 md:mt-0">
              <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
              <span>•</span>
              <span className="hover:text-white cursor-pointer transition-colors">Terms of Use</span>
              <span>•</span>
              <span className="hover:text-white cursor-pointer transition-colors">Vigilance Portal</span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">ISO 9001:2015 Certified</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
