import "./global.css";
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import Index from "./pages/Index";
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

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/portal" element={<Portal />} />
            <Route path="/portal/profile" element={<Profile />} />
            <Route path="/portal/leave" element={<Leave />} />
            <Route path="/portal/payslips" element={<Payslips />} />
            <Route path="/portal/reimbursements" element={<Reimbursements />} />
            <Route path="/portal/attendance" element={<Attendance />} />
            <Route path="/portal/directory" element={<Directory />} />
            <Route path="/portal/facilities" element={<Facilities />} />
            <Route path="/portal/settings" element={<Settings />} />
            <Route path="/issues" element={<Issues />} />
            <Route path="/settings" element={<Settings />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <Sonner />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
