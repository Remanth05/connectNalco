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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden">
                <img
                  src="/logo.jpg"
                  alt="Company Logo"
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-xl font-bold text-nalco-red">
                  connect
                </span>
                <span className="text-xl font-bold text-nalco-black">
                  NALCO
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <nav className="flex items-center space-x-1">
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
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* User Info, Notifications and Logout */}
              {isAuthenticated && user && (
                <div className="flex items-center space-x-3 border-l pl-4">
                  <div className="text-sm">
                    <div className="font-medium text-nalco-black">
                      {user.name}
                    </div>
                    <div className="text-xs text-nalco-gray capitalize">
                      {user.role}
                    </div>
                  </div>
                  <NotificationBell />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-nalco-gray hover:text-nalco-red"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
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

                {/* Mobile User Info and Logout */}
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
      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t bg-nalco-black/5">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <div className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-nalco-red" />
              <span className="text-sm font-medium text-nalco-black">
                connectNALCO - NALCO Damanjodi Plant Management System
              </span>
            </div>
            <p className="text-sm text-nalco-gray">
              © 2024 National Aluminium Company Limited. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
