import "./global.css";
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Portal from "./pages/Portal";
import Issues from "./pages/Issues";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Profile from "./pages/portal/Profile";
import Leave from "./pages/portal/Leave";
import Payslips from "./pages/portal/Payslips";
import Reimbursements from "./pages/portal/Reimbursements";
import Attendance from "./pages/portal/Attendance";
import Directory from "./pages/portal/Directory";
import Facilities from "./pages/portal/Facilities";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AuthorityDashboard from "./pages/authority/AuthorityDashboard";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />

              {/* Employee Routes */}
              <Route
                path="/portal"
                element={
                  <ProtectedRoute allowedRoles={["employee"]}>
                    <Portal />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/portal/profile"
                element={
                  <ProtectedRoute allowedRoles={["employee"]}>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/portal/leave"
                element={
                  <ProtectedRoute allowedRoles={["employee"]}>
                    <Leave />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/portal/payslips"
                element={
                  <ProtectedRoute allowedRoles={["employee"]}>
                    <Payslips />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/portal/reimbursements"
                element={
                  <ProtectedRoute allowedRoles={["employee"]}>
                    <Reimbursements />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/portal/attendance"
                element={
                  <ProtectedRoute allowedRoles={["employee"]}>
                    <Attendance />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/portal/directory"
                element={
                  <ProtectedRoute allowedRoles={["employee"]}>
                    <Directory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/portal/facilities"
                element={
                  <ProtectedRoute allowedRoles={["employee"]}>
                    <Facilities />
                  </ProtectedRoute>
                }
              />

              {/* Authority Routes */}
              <Route
                path="/authority/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["authority"]}>
                    <AuthorityDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Issues accessible by all authenticated users */}
              <Route
                path="/issues"
                element={
                  <ProtectedRoute>
                    <Issues />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/portal/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <Sonner />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
