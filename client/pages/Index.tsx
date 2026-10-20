import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Users,
  AlertTriangle,
  Building2,
  Shield,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Flame,
  Pickaxe,
  Factory,
  Boxes,
  Compass,
  FileText,
  Clock,
  Layers,
  PhoneCall,
  Activity,
  Award,
} from "lucide-react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";

interface Facility {
  id: string;
  name: string;
  shortName: string;
  location: string;
  category: string;
  image: string;
  capacity: string;
  description: string;
  highlights: string[];
  operationalSince: string;
  isoStandard: string;
}

const FACILITIES: Facility[] = [
  {
    id: "mines",
    name: "Panchpatmali Bauxite Mines",
    shortName: "Bauxite Mines",
    location: "Damanjodi, Koraput, Odisha",
    category: "Upstream Raw Material",
    image: "/images/mines.jpg",
    capacity: "6.825 Million MT / Annum",
    description:
      "Fully mechanized opencast mine operating on the Panchpatmali plateau, recognized globally as one of the lowest-cost bauxite extraction facilities in the world with state-of-the-art trench mining.",
    highlights: ["14.6 km Curved Overland Conveyor", "Fully Automated Vacuum Mining", "100% Zero-Harm Safety Record"],
    operationalSince: "1985",
    isoStandard: "ISO 14001 & ISO 45001",
  },
  {
    id: "refinery",
    name: "Alumina Refinery Complex",
    shortName: "Alumina Refinery",
    location: "Damanjodi, Koraput, Odisha",
    category: "Chemical Conversion",
    image: "/images/refinery.jpg",
    capacity: "2.275 Million MT / Annum",
    description:
      "Bayer process chemical refinery processing high-grade gibbsitic bauxite into metallurgical grade alumina and specialty alumina hydrates for both domestic smelting and worldwide maritime export.",
    highlights: ["Low-Temperature Bayer Cycle", "Captive Steam Generation", "Zero Effluent Discharge Plant"],
    operationalSince: "1986",
    isoStandard: "ISO 9001:2015 & OHSAS 18001",
  },
  {
    id: "smelter",
    name: "Angul Aluminium Smelter",
    shortName: "Smelter Plant",
    location: "Angul Industrial Belt, Odisha",
    category: "Primary Metallurgy",
    image: "/images/smelter.jpg",
    capacity: "460,000 MT / Annum",
    description:
      "State-of-the-art Hall-Héroult electrolytic reduction pots powered by NALCO's 1200 MW captive thermal power plant, producing LME-registered 99.7% virgin aluminium ingots and billets.",
    highlights: ["240 kA High-Ampere Potlines", "1200 MW Captive Thermal Link", "London Metal Exchange (LME) Registered"],
    operationalSince: "1987",
    isoStandard: "ISO 9001 & ISO 50001",
  },
  {
    id: "ingots",
    name: "Finished Aluminium Logistics & Rolling",
    shortName: "Rolling & Logistics",
    location: "Angul & Vizag Port Terminal",
    category: "Downstream & Logistics",
    image: "/images/ingots.jpg",
    capacity: "Over 400,000 MT Shipped Annually",
    description:
      "Modern casting and automated rolling mills producing wire rods, cast bars, alloy ingots, and sheets distributed across 30+ international markets through dedicated berths at Visakhapatnam Port.",
    highlights: ["EC Grade Wire Rods & Billets", "Dedicated Maritime Loading Berths", "Global Export Network across 30+ Nations"],
    operationalSince: "1989",
    isoStandard: "ISO 9001 & NABL Accredited",
  },
];

export default function Index() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [activeFacilityIndex, setActiveFacilityIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Redirect authenticated users to appropriate dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      const targetPath =
        user.role === "admin"
          ? "/admin/dashboard"
          : user.role === "authority"
            ? "/authority/dashboard"
            : "/portal";
      navigate(targetPath);
    }
  }, [isAuthenticated, user, navigate]);

  // Automatic facility rotation if not paused by hover
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveFacilityIndex((prev) => (prev + 1) % FACILITIES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const activeFacility = FACILITIES[activeFacilityIndex];

  return (
    <Layout>
      {/* 1. DENSE CIVIC ANNOUNCEMENT STRIP */}
      <div className="bg-[#111111] text-white border-b border-nia-border/40 py-2.5 px-4 text-xs">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="nia-chip bg-nia-primary font-bold uppercase tracking-wider text-[10px]">
              OFFICIAL BULLETIN
            </span>
            <span className="text-white/90 font-medium">
              NALCO Panchpatmali Bauxite Mines & Damanjodi Alumina Complex operate at peak annual capacity.
            </span>
          </div>
          <div className="flex items-center space-x-4 text-white/60 text-[11px]">
            <span className="hidden md:inline">Shift Code: <strong className="text-white">SH-A (Morning Operational)</strong></span>
            <span>•</span>
            <span className="hidden md:inline">Air Quality Index: <strong className="text-emerald-400">Good (38 AQI)</strong></span>
            <span>•</span>
            <Link to="/issues" className="text-nia-primaryStrong hover:text-white transition-colors underline font-medium">
              File Plant Grievance
            </Link>
          </div>
        </div>
      </div>

      {/* 2. EDITORIAL HERO WITH DYNAMIC IMAGE SHOWCASE */}
      <section className="relative bg-[#0c121e] text-white overflow-hidden border-b border-nia-border">
        {/* Full-bleed Background with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            key={activeFacility.id}
            src={activeFacility.image}
            alt={activeFacility.name}
            className="w-full h-full object-cover opacity-90 filter brightness-100 transition-all duration-1000 scale-105"
          />
          {/* Soft scrim — lets the industrial facility image show clearly while keeping text crisp */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/65 via-slate-950/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,99,185,0.22),transparent_60%)]" />
        </div>

        <div className="container mx-auto px-4 py-16 lg:py-24 relative z-10">
          <div className="max-w-4xl">
            {/* Civic authority badge */}
            <div className="inline-flex items-center space-x-2.5 bg-white/15 backdrop-blur-md border border-white/25 rounded-full px-3.5 py-1 mb-6 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-nia-primary animate-ping" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-white">
                National Aluminium Authority • Production Grid
              </span>
            </div>

            {/* Authoritative Headline Display (50px / 42px) */}
            <h1 className="nia-headline-display text-white font-medium tracking-tight mb-6 text-3xl md:text-5xl lg:text-[50px] leading-tight drop-shadow-sm">
              Integrated Aluminium & Bauxite Industrial Authority
            </h1>

            {/* Editorial Body Large (24px) */}
            <p className="nia-body-lg text-white/90 max-w-3xl mb-8 leading-relaxed text-lg md:text-2xl font-light drop-shadow-sm">
              Connecting mines, chemical refineries, primary smelting potlines, and workforce governance into a synchronized, single-window public sector enterprise system.
            </p>

            {/* 44px Pill Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-12">
              <Link
                to="/login"
                className="h-[44px] px-6 rounded-full bg-nia-primary hover:bg-[#851b1a] text-white font-bold text-sm tracking-wide inline-flex items-center justify-center transition-all shadow-lg hover:shadow-xl group"
              >
                Access Employee Portal
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/issues"
                className="h-[44px] px-6 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/30 backdrop-blur-md font-bold text-sm tracking-wide inline-flex items-center justify-center transition-all shadow-md"
              >
                <AlertTriangle className="mr-2 h-4 w-4 text-amber-300" />
                Submit Plant Grievance / Issue
              </Link>
              <Link
                to="/safety"
                className="h-[44px] px-6 rounded-full bg-black/20 hover:bg-white/15 text-white/95 border border-white/20 backdrop-blur-md font-medium text-sm inline-flex items-center justify-center transition-all"
              >
                <Shield className="mr-2 h-4 w-4 text-emerald-300" />
                Zero-Harm Safety Protocol
              </Link>
            </div>

            {/* Live Facility Spotlight Banner */}
            <div
              className="bg-slate-950/40 border border-white/25 rounded-xl p-5 backdrop-blur-md max-w-2xl shadow-xl"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="flex items-center justify-between border-b border-white/15 pb-2.5 mb-3">
                <div className="flex items-center space-x-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sky-300">
                    Live Unit Spotlight ({activeFacilityIndex + 1}/{FACILITIES.length})
                  </span>
                </div>
                <span className="text-xs text-white/70 font-mono">
                  Standard: {activeFacility.isoStandard}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white mb-0.5">
                    {activeFacility.name}
                  </h3>
                  <p className="text-xs text-white/80">
                    {activeFacility.location} • <strong className="text-white">{activeFacility.capacity}</strong>
                  </p>
                </div>
                <div className="flex items-center space-x-1 shrink-0">
                  {FACILITIES.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveFacilityIndex(idx)}
                      aria-label={`View ${FACILITIES[idx].name}`}
                      className={`h-2 rounded-full transition-all ${
                        idx === activeFacilityIndex ? "w-6 bg-nia-primary" : "w-2 bg-white/40 hover:bg-white/80"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. FACILITY DOT NAVIGATION */}
        <div
          className="bg-slate-950/40 backdrop-blur-md border-t border-white/15 py-4 px-4"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="container mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Facility name labels with dots */}
              <div className="flex items-center gap-6 flex-wrap justify-center sm:justify-start">
                {FACILITIES.map((facility, index) => {
                  const isActive = index === activeFacilityIndex;
                  return (
                    <button
                      key={facility.id}
                      onMouseEnter={() => setActiveFacilityIndex(index)}
                      onClick={() => setActiveFacilityIndex(index)}
                      className={`flex items-center gap-2 text-xs font-semibold transition-all duration-200 ${
                        isActive ? "text-white" : "text-white/40 hover:text-white/70"
                      }`}
                    >
                      <span
                        className={`h-2.5 w-2.5 rounded-full flex-shrink-0 transition-all duration-300 ${
                          isActive
                            ? "bg-nia-primary scale-125"
                            : "bg-white/25 hover:bg-white/50"
                        }`}
                      />
                      <span className="hidden sm:inline">{facility.shortName}</span>
                      <span className="sm:hidden">0{index + 1}</span>
                    </button>
                  );
                })}
              </div>

              {/* Auto-cycle indicator */}
              <span className="text-[11px] font-mono text-white/40 shrink-0">
                {isPaused ? "⏸ paused" : "▶ auto"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HIGH-CONTRAST CEREMONIAL STATS BAR */}
      <section className="bg-white border-b border-nia-border py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="border-l-4 border-nia-primary pl-4">
              <span className="text-xs font-bold uppercase tracking-wider text-nia-muted">
                Bauxite Extraction
              </span>
              <div className="text-2xl md:text-3xl font-bold text-nia-onSurface mt-1">
                6.825 MTPA
              </div>
              <p className="text-xs text-nia-muted mt-1">100% Captive Panchpatmali Plateau</p>
            </div>

            <div className="border-l-4 border-nia-primaryStrong pl-4">
              <span className="text-xs font-bold uppercase tracking-wider text-nia-muted">
                Alumina Refining
              </span>
              <div className="text-2xl md:text-3xl font-bold text-nia-onSurface mt-1">
                2.275 MTPA
              </div>
              <p className="text-xs text-nia-muted mt-1">Damanjodi High-Efficiency Refinery</p>
            </div>

            <div className="border-l-4 border-nia-secondary pl-4">
              <span className="text-xs font-bold uppercase tracking-wider text-nia-muted">
                Primary Aluminium
              </span>
              <div className="text-2xl md:text-3xl font-bold text-nia-onSurface mt-1">
                460,000 MT
              </div>
              <p className="text-xs text-nia-muted mt-1">High-Purity Cast Metal & Billets</p>
            </div>

            <div className="border-l-4 border-emerald-600 pl-4">
              <span className="text-xs font-bold uppercase tracking-wider text-nia-muted">
                Captive Power Link
              </span>
              <div className="text-2xl md:text-3xl font-bold text-nia-onSurface mt-1">
                1,200 MW
              </div>
              <p className="text-xs text-nia-muted mt-1">Angul Dedicated Thermal Grid</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INDUSTRIAL OPERATIONS & PORTAL SERVICE BLOCKS */}
      <section className="py-16 bg-nia-neutral">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mb-12">
            <div className="inline-block px-2.5 py-0.5 rounded bg-nia-primary/10 text-nia-primary font-bold text-xs uppercase tracking-wider mb-2">
              Enterprise Governance
            </div>
            <h2 className="nia-headline-md text-nia-onSurface font-medium tracking-tight mb-3">
              Operational Portals & Centralized Services
            </h2>
            <p className="nia-body-md text-nia-muted">
              Built in accordance with Department of Public Enterprises guidelines, providing role-based security, continuous telemetry, and prompt grievance resolution across plant units.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Employee Management */}
            <div className="bg-white rounded-xl p-6 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-nia-primary hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-nia-primary to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div>
                <div className="h-12 w-12 rounded-xl bg-red-50 text-nia-primary flex items-center justify-center mb-5 group-hover:bg-nia-primary group-hover:text-white transition-all shadow-sm">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-nia-primary transition-colors">
                  Employee Self-Service (ESS)
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  Access verified payslips, track daily punch attendance, manage earned leaves, and submit official reimbursement claims under your unique NALCO employee ID.
                </p>
              </div>
              <Link
                to="/login"
                className="text-xs font-bold text-nia-primary hover:text-nia-primaryStrong inline-flex items-center group-hover:translate-x-1 transition-all mt-auto"
              >
                Sign In to Portal <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Card 2: Plant Issue Tracker */}
            <div className="bg-white rounded-xl p-6 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-amber-500 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div>
                <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5 group-hover:bg-amber-500 group-hover:text-white transition-all shadow-sm">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">
                  Plant Issue & Grievance Cell
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  Log equipment malfunctions, conveyor delays, safety hazards, or unit maintenance tickets directly to plant superintendents and shift authorities.
                </p>
              </div>
              <Link
                to="/issues"
                className="text-xs font-bold text-amber-600 hover:text-amber-700 inline-flex items-center group-hover:translate-x-1 transition-all mt-auto"
              >
                File or Track Ticket <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Card 3: Plant Telemetry */}
            <div className="bg-white rounded-xl p-6 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-nia-primaryStrong hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-nia-primaryStrong to-sky-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div>
                <div className="h-12 w-12 rounded-xl bg-sky-50 text-nia-primaryStrong flex items-center justify-center mb-5 group-hover:bg-nia-primaryStrong group-hover:text-white transition-all shadow-sm">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-nia-primaryStrong transition-colors">
                  Plant Operational Analytics
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  Monitor real-time potline current, alumina extraction yield ratios, steam output telemetry, and departmental productivity indices.
                </p>
              </div>
              <Link
                to="/analytics"
                className="text-xs font-bold text-nia-primaryStrong hover:text-blue-700 inline-flex items-center group-hover:translate-x-1 transition-all mt-auto"
              >
                View Telemetry <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Card 4: Safety & Compliance */}
            <div className="bg-white rounded-xl p-6 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-500 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div>
                <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-sm">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                  Zero-Harm Safety Protocol
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  ISO 45001 occupational safety oversight, emergency muster stations, incident reporting, and mandatory PPE protocol audits.
                </p>
              </div>
              <Link
                to="/safety"
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 inline-flex items-center group-hover:translate-x-1 transition-all mt-auto"
              >
                Review Safety Rules <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FACILITY DEEP-DIVE SPOTLIGHT SECTION (DETAILED INSPECTION) */}
      <section className="py-16 bg-white border-t border-b border-nia-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Visual Media Container with Hover Interaction */}
            <div className="lg:col-span-7">
              <div className="relative rounded-md overflow-hidden border border-nia-border shadow-sm group">
                <img
                  src={activeFacility.image}
                  alt={activeFacility.name}
                  className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="nia-chip bg-nia-primary text-white text-[11px] mb-2 inline-block">
                    {activeFacility.category}
                  </span>
                  <h3 className="text-2xl font-bold tracking-tight text-white mb-1">
                    {activeFacility.name}
                  </h3>
                  <p className="text-xs text-white/80 font-mono">
                    Operational Location: {activeFacility.location}
                  </p>
                </div>
              </div>
            </div>

            {/* Contextual Technical Specifications */}
            <div className="lg:col-span-5">
              <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-nia-primary mb-2">
                <Factory className="h-4 w-4" />
                <span>Unit Technical Dossier</span>
              </div>
              <h2 className="text-2xl font-bold text-nia-onSurface tracking-tight mb-4">
                {activeFacility.shortName} Performance Parameters
              </h2>
              <p className="text-sm text-nia-muted leading-relaxed mb-6">
                {activeFacility.description}
              </p>

              <div className="space-y-3 mb-8">
                {activeFacility.highlights.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle2 className="h-4 w-4 text-nia-primary shrink-0 mt-0.5" />
                    <span className="text-xs font-medium text-nia-onSurface">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-nia-border flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-nia-muted uppercase tracking-wider block">
                    Certified Standard
                  </span>
                  <span className="text-xs font-bold text-nia-onSurface">
                    {activeFacility.isoStandard}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-nia-muted uppercase tracking-wider block">
                    Commissioned Year
                  </span>
                  <span className="text-xs font-bold text-nia-onSurface font-mono">
                    {activeFacility.operationalSince}
                  </span>
                </div>
                <Link
                  to="/login"
                  className="h-[38px] px-4 rounded-full bg-nia-secondary text-white text-xs font-bold inline-flex items-center hover:bg-nia-primary transition-colors"
                >
                  Unit Portal
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. RESTRAINED PUBLIC SECTOR CALL TO ACTION */}
      <section className="bg-nia-secondary text-white py-14">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="nia-headline-md text-white font-medium mb-4">
            Authorized Personnel & Employee Access
          </h2>
          <p className="nia-body-md text-white/70 mb-8 max-w-xl mx-auto text-sm leading-relaxed">
            Please log in using your official employee ID and registered credentials. First-time credentials issued by your plant administrator can be personalized anytime inside account settings.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/login"
              className="h-[44px] px-8 rounded-full bg-nia-primary hover:bg-[#851b1a] text-white font-bold text-sm tracking-wide inline-flex items-center transition-colors"
            >
              Sign In to connectNALCO
            </Link>
            <Link
              to="/issues"
              className="h-[44px] px-8 rounded-full bg-transparent hover:bg-white/10 text-white border border-white/30 font-bold text-sm tracking-wide inline-flex items-center transition-colors"
            >
              Plant Support & Helpdesk
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
