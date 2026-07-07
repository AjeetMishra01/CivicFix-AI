import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, Bot, Sparkles, MapPin, Upload, Activity, FileCheck, 
  Bell, Users, ArrowRight, CheckCircle2, Menu, X, ChevronRight, 
  Clock, ShieldAlert, BarChart3, Lock
} from 'lucide-react';
import ThemeToggle from '../components/common/ThemeToggle';
import useTheme from '../hooks/useTheme';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const stats = [
    { label: "AI Route Classification Accuracy", value: "95%+" },
    { label: "Routing Latency", value: "< 2 seconds" },
    { label: "Transparency Framework", value: "Real-time" },
    { label: "Supported Departments", value: "Multi-Agency" }
  ];

  const features = [
    {
      icon: <Brain className="text-blue-600 dark:text-blue-400" size={24} />,
      title: "AI-Powered Department Classification",
      desc: "FastAPI AI service automatically parses complaints and routes them to the correct department (Water, Roads, Safety, etc.) instantly."
    },
    {
      icon: <ShieldAlert className="text-red-600 dark:text-red-400" size={24} />,
      title: "AI-Based Severity Prediction",
      desc: "Deep learning categorizes issue severity (High, Medium, Low) based on semantic descriptions, ensuring critical complaints get immediate action."
    },
    {
      icon: <Activity className="text-emerald-600 dark:text-emerald-400" size={24} />,
      title: "Smart Complaint Prioritization",
      desc: "Help officers triage their backlog by dynamically sorting tasks based on AI severity classifications and submission timestamps."
    },
    {
      icon: <MapPin className="text-amber-600 dark:text-amber-400" size={24} />,
      title: "Location-Based Reporting",
      desc: "Integrated OpenStreetMap and Leaflet map allows citizens to pin complaints and reverse-geocode exact addresses seamlessly."
    },
    {
      icon: <Upload className="text-violet-600 dark:text-violet-400" size={24} />,
      title: "Image Evidence Upload",
      desc: "Support file uploads for citizen complaints to provide immediate photographic evidence to responding officers."
    },
    {
      icon: <CheckCircle2 className="text-teal-600 dark:text-teal-400" size={24} />,
      title: "Transparent Status Tracking",
      desc: "Citizens receive clear updates as their ticket moves from Submitted -> Accepted -> In Progress -> Resolved, with estimated timers."
    },
    {
      icon: <FileCheck className="text-indigo-600 dark:text-indigo-400" size={24} />,
      title: "Department Workflow Management",
      desc: "Dedicated workspaces for department officers to accept, update, remark upon, and resolve issues assigned directly to them."
    },
    {
      icon: <BarChart3 className="text-pink-600 dark:text-pink-400" size={24} />,
      title: "Administrative Analytics",
      desc: "Overview dashboards for platform administrators, complete with interactive charts showing department performance and statistics."
    },
    {
      icon: <Bell className="text-sky-600 dark:text-sky-400" size={24} />,
      title: "Department Notifications",
      desc: "Broadcasting system for administrator announcements and target notifications for department members."
    }
  ];

  const roles = [
    {
      title: "Citizen",
      badge: "Reporter",
      color: "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300",
      description: "Report localized infrastructure issues with map pins and photo uploads. Monitor resolution status and provide feedback once resolved.",
      bulletPoints: ["Easy map-based complaint submission", "Real-time ticket updates", "Direct service feedback rating"]
    },
    {
      title: "Department Officer",
      badge: "Resolver",
      color: "bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300",
      description: "Access department-specific backlogs, prioritize by AI-predicted severity, update status flags, and add detailed remarks.",
      bulletPoints: ["Departmental queue filters", "Accept & In-Progress controls", "Provide resolution comments"]
    },
    {
      title: "Platform Admin",
      badge: "Operator",
      color: "bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300",
      description: "Provision department accounts, create responding officer credentials, broadcast announcements, and monitor analytical dashboards.",
      bulletPoints: ["Create department & officer accounts", "Broadcast notifications", "View charts & department latency metrics"]
    }
  ];

  const handleStart = () => {
    if (user) {
      if (user.role === 'citizen') navigate('/citizen');
      else if (user.role === 'department') navigate('/department');
      else navigate('/admin');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 overflow-x-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
                <Activity className="text-white" size={20} />
              </div>
              <span className="font-heading font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 to-brand-600 dark:from-white dark:to-brand-400 bg-clip-text text-transparent">
                CivicFix
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#how-it-works" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">How It Works</a>
              <a href="#features" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Features</a>
              <a href="#roles" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Platform Roles</a>
              <a href="#about" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">About</a>
            </div>

            {/* Right CTAs */}
            <div className="hidden md:flex items-center gap-4">
              <ThemeToggle theme={theme} onToggle={toggleTheme} />
              {user ? (
                <button onClick={handleStart} className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-brand-600 transition-colors">
                  Go to Dashboard
                </button>
              ) : (
                <button onClick={() => navigate('/login')} className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Login
                </button>
              )}
              <button 
                onClick={handleStart} 
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 text-white text-sm font-semibold hover:from-brand-700 hover:to-brand-800 shadow-md hover:shadow-lg transition duration-150 active:scale-95"
              >
                Report an Issue
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-3">
              <ThemeToggle theme={theme} onToggle={toggleTheme} />
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-6 space-y-3 transition-all duration-200 animate-fade-in-up">
            <a 
              href="#how-it-works" 
              onClick={() => setMobileMenuOpen(false)} 
              className="block px-3 py-2 rounded-xl text-base font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              How It Works
            </a>
            <a 
              href="#features" 
              onClick={() => setMobileMenuOpen(false)} 
              className="block px-3 py-2 rounded-xl text-base font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Features
            </a>
            <a 
              href="#roles" 
              onClick={() => setMobileMenuOpen(false)} 
              className="block px-3 py-2 rounded-xl text-base font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Platform Roles
            </a>
            <a 
              href="#about" 
              onClick={() => setMobileMenuOpen(false)} 
              className="block px-3 py-2 rounded-xl text-base font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              About
            </a>
            <div className="pt-4 border-t border-slate-200 dark:border-slate-850 flex flex-col gap-3">
              {user ? (
                <button 
                  onClick={handleStart}
                  className="w-full text-center px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl font-medium"
                >
                  Dashboard
                </button>
              ) : (
                <>
                  <button 
                    onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}
                    className="w-full text-center px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl font-medium"
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => { setMobileMenuOpen(false); navigate('/register'); }}
                    className="w-full text-center px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl font-medium"
                  >
                    Register
                  </button>
                </>
              )}
              <button 
                onClick={() => { setMobileMenuOpen(false); handleStart(); }}
                className="w-full text-center px-4 py-2.5 rounded-xl bg-brand-600 text-white font-semibold shadow-md hover:bg-brand-700"
              >
                Report an Issue
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background gradient flares */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-500/10 dark:bg-brand-500/5 blur-[120px] rounded-full pointer-events-none z-0"></div>
        <div className="absolute top-1/3 left-10 w-[300px] h-[300px] bg-civic-teal/10 dark:bg-civic-teal/5 blur-[90px] rounded-full pointer-events-none z-0"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Hero text content */}
            <div className="lg:col-span-6 flex flex-col gap-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 self-center lg:self-start bg-brand-100/80 dark:bg-brand-950/50 border border-brand-200/50 dark:border-brand-900/60 rounded-full px-4 py-1.5 text-xs font-semibold text-brand-700 dark:text-brand-400">
                <Sparkles size={14} className="animate-pulse" />
                <span>Next-Gen AI-Driven Civic Governance</span>
              </div>

              {/* Title */}
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-slate-900 dark:text-white">
                Smarter Civic Reporting.
                <span className="block mt-2 bg-gradient-to-r from-brand-600 to-civic-teal dark:from-brand-400 dark:to-teal-400 bg-clip-text text-transparent">
                  Faster Public Resolution.
                </span>
              </h1>

              {/* Description */}
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto lg:mx-0">
                Empower your neighborhood. Report public issues with map accuracy, let the AI automatically categorize and prioritize response severity, and watch specialized municipal departments resolve tickets transparently.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-2">
                <button 
                  onClick={handleStart} 
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-700 text-white font-semibold hover:from-brand-700 hover:to-brand-800 shadow-xl shadow-brand-500/20 hover:shadow-brand-500/30 hover:shadow-2xl transition duration-150 flex items-center gap-2 active:scale-95"
                >
                  <span>Report an Issue Now</span>
                  <ArrowRight size={18} />
                </button>
                <a 
                  href="#how-it-works" 
                  className="px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-850 hover:border-slate-300 dark:hover:border-slate-700 transition shadow-sm flex items-center gap-2"
                >
                  Explore How It Works
                </a>
              </div>
            </div>

            {/* Hero Visual Mockup (Tasteful CSS-Based Composition) */}
            <div className="lg:col-span-6 relative">
              <div className="w-full max-w-lg lg:max-w-none mx-auto relative z-10 transition duration-300 hover:scale-[1.02]">
                {/* Main Card (Glassmorphism Dashboard Preview) */}
                <div className="rounded-3xl border border-slate-200/60 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-5 shadow-2xl">
                  {/* Mock Window Controls */}
                  <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50 pb-4 mb-4">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                      <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                    </div>
                    <div className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-2xs font-medium text-slate-500 tracking-wider">
                      AI CLASSIFIER MODULE
                    </div>
                  </div>

                  {/* Complaint Item Detail Visual Mockup */}
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 p-4 shadow-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="px-2 py-0.5 rounded-full text-3xs font-bold tracking-wider bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
                              WATER PIPELINE
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-3xs font-bold tracking-wider bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 flex items-center gap-1">
                              <Bot size={10} /> HIGH SEVERITY (AI)
                            </span>
                          </div>
                          <h4 className="font-semibold text-slate-800 dark:text-white text-base">
                            Major water leakage flooding Sector-4 Main Road
                          </h4>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-3xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                          In Progress
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                        Water has been overflowing from the main joint pipe for the last 6 hours, creating huge traffic blocks and road erosion.
                      </p>

                      {/* Map Picker Mockup */}
                      <div className="h-28 w-full mt-3 rounded-xl bg-slate-100 dark:bg-slate-900 relative overflow-hidden border border-slate-200/40 dark:border-slate-800/40">
                        {/* Static Grid lines */}
                        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px]"></div>
                        {/* Mock Pin */}
                        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                          <MapPin size={24} className="text-red-500 drop-shadow-md animate-bounce" />
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full blur-[2px]"></div>
                        </div>
                        {/* Mock Info Box */}
                        <div className="absolute bottom-2 right-2 bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 px-2 py-1 rounded-lg text-4xs font-semibold shadow-sm">
                          Sector-4 Cross Rd, Metro Lane
                        </div>
                      </div>

                      {/* AI Routing flow bar */}
                      <div className="mt-4 pt-3 border-t border-slate-150 dark:border-slate-850 flex items-center justify-between text-2xs">
                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                          <Brain size={14} className="text-brand-500" />
                          <span>AI Routing Confidence: <strong className="text-brand-600 dark:text-brand-400">97.8%</strong></span>
                        </div>
                        <span className="text-slate-400">Routed to Water Dept.</span>
                      </div>
                    </div>

                    {/* Progress tracking line mockup */}
                    <div className="rounded-2xl bg-brand-50/50 dark:bg-brand-950/20 border border-brand-100/50 dark:border-brand-900/40 p-3.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold text-xs">
                          ✓
                        </div>
                        <div>
                          <p className="text-2xs font-semibold text-slate-800 dark:text-white">Routed to Dept Officer</p>
                          <p className="text-4xs text-slate-500">Department accepted issue in 12 min</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-slate-500 text-2xs font-semibold bg-white dark:bg-slate-950 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-850">
                        <Clock size={12} className="text-brand-500" />
                        <span>EST: 24 Hours</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Smaller side graphics */}
                <div className="absolute -bottom-6 -left-6 w-36 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 p-3 shadow-xl hidden sm:block animate-pulse">
                  <p className="text-4xs uppercase tracking-wider text-slate-400 font-semibold">TICKET STATUS</p>
                  <p className="text-sm font-extrabold text-slate-800 dark:text-white mt-1">98.2% Done</p>
                  <div className="w-full bg-slate-100 dark:bg-slate-850 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
                
                <div className="absolute -top-6 -right-6 w-44 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 p-3.5 shadow-xl hidden sm:block">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-xl bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400 flex items-center justify-center font-bold text-xs">
                      ⚡
                    </div>
                    <div>
                      <p className="text-4xs uppercase tracking-wider text-slate-400 font-semibold">Department Speed</p>
                      <p className="text-xs font-bold text-slate-800 dark:text-white">Active Resolution</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-24 border-t border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-brand-600 dark:text-brand-400 mb-2">OPERATIONAL FLOW</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">How CivicFix Works</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-4 text-base">
              A transparent, automated communication pipeline connecting citizen-reported issues directly to departmental staff via predictive AI routing.
            </p>
          </div>

          {/* Timeline steps */}
          <div className="grid md:grid-cols-5 gap-8 relative">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center group">
              <div className="h-16 w-16 rounded-2xl bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-850 flex items-center justify-center shadow-sm text-brand-600 dark:text-brand-400 group-hover:scale-105 group-hover:bg-brand-500 group-hover:text-white transition duration-200">
                <MapPin size={26} />
              </div>
              <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 my-2 md:hidden"></div>
              <h4 className="font-heading font-bold text-lg text-slate-900 dark:text-white mt-4">1. Citizen Reports</h4>
              <p className="text-xs text-slate-500 mt-2 px-2">
                Log detailed complaint, pick coordinates on the interactive map, and add image evidence.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center group">
              <div className="h-16 w-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-850 flex items-center justify-center shadow-sm text-indigo-600 dark:text-indigo-400 group-hover:scale-105 group-hover:bg-indigo-600 group-hover:text-white transition duration-200">
                <Brain size={26} />
              </div>
              <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 my-2 md:hidden"></div>
              <h4 className="font-heading font-bold text-lg text-slate-900 dark:text-white mt-4">2. AI Analysis</h4>
              <p className="text-xs text-slate-500 mt-2 px-2">
                FastAPI classifier analyses text, predicts severity level and flags the incident category.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center group">
              <div className="h-16 w-16 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-850 flex items-center justify-center shadow-sm text-amber-600 dark:text-amber-400 group-hover:scale-105 group-hover:bg-amber-500 group-hover:text-white transition duration-200">
                <Activity size={26} />
              </div>
              <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 my-2 md:hidden"></div>
              <h4 className="font-heading font-bold text-lg text-slate-900 dark:text-white mt-4">3. Automated Routing</h4>
              <p className="text-xs text-slate-500 mt-2 px-2">
                The complaint is routed directly into the designated department officer's active work dashboard.
              </p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center group">
              <div className="h-16 w-16 rounded-2xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-850 flex items-center justify-center shadow-sm text-teal-600 dark:text-teal-400 group-hover:scale-105 group-hover:bg-teal-600 group-hover:text-white transition duration-200">
                <FileCheck size={26} />
              </div>
              <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 my-2 md:hidden"></div>
              <h4 className="font-heading font-bold text-lg text-slate-900 dark:text-white mt-4">4. Officer Action</h4>
              <p className="text-xs text-slate-500 mt-2 px-2">
                Department members accept, assign estimated timelines, work the issue, and append remarks.
              </p>
            </div>

            {/* Step 5 */}
            <div className="flex flex-col items-center text-center group">
              <div className="h-16 w-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-850 flex items-center justify-center shadow-sm text-emerald-600 dark:text-emerald-400 group-hover:scale-105 group-hover:bg-emerald-600 group-hover:text-white transition duration-200">
                <CheckCircle2 size={26} />
              </div>
              <h4 className="font-heading font-bold text-lg text-slate-900 dark:text-white mt-4">5. Real-Time Tracking</h4>
              <p className="text-xs text-slate-500 mt-2 px-2">
                Citizen follows resolution status, views official comments, and rates the service quality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-50 dark:bg-slate-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-brand-600 dark:text-brand-400 mb-2">FULL CAPABILITIES</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">Smart Features Built For Civic Action</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-4 text-base">
              A comprehensive toolkit empowering citizens, optimizing department operations, and providing admins full analytical overviews.
            </p>
          </div>

          {/* Grid of features */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div 
                key={idx} 
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md hover:border-slate-350 dark:hover:border-slate-700 transition duration-150"
              >
                <div className="h-12 w-12 rounded-xl bg-slate-50 dark:bg-slate-950 flex items-center justify-center mb-5 border border-slate-100 dark:border-slate-800">
                  {feature.icon}
                </div>
                <h4 className="font-heading font-bold text-base text-slate-900 dark:text-white mb-2">{feature.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-to-r from-brand-900 to-indigo-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,0.15),transparent_60%)] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col gap-2 p-4">
                <p className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <div className="h-0.5 w-12 bg-brand-500 mx-auto my-1"></div>
                <p className="text-xs font-semibold text-slate-300 tracking-wider uppercase">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Roles Section */}
      <section id="roles" className="py-24 bg-white dark:bg-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-brand-600 dark:text-brand-400 mb-2">ACCESS LEVELS</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">Role-Based Platform Ecosystem</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-4 text-base">
              CivicFix distributes platform operations across three distinct user roles, securing endpoints and customizing workflows.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {roles.map((role, idx) => (
              <div 
                key={idx} 
                className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-6 flex flex-col justify-between hover:shadow-lg transition duration-200"
              >
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="font-heading font-extrabold text-xl text-slate-900 dark:text-white">{role.title}</h4>
                    <span className={`px-2.5 py-1 rounded-full text-3xs font-extrabold uppercase border ${role.color}`}>
                      {role.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                    {role.description}
                  </p>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-3">Key Responsibilities:</p>
                  <ul className="space-y-2 text-2xs text-slate-500 dark:text-slate-400">
                    {role.bulletPoints.map((bp, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-brand-500">✔</span>
                        <span>{bp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950 transition-colors relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading mb-6">
            Ready to improve your community's services?
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto mb-8 leading-relaxed">
            Report issues, track workflow routing, and verify public service updates transparently. Join hands with local officers today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button 
              onClick={handleStart} 
              className="px-8 py-4 rounded-2xl bg-brand-600 text-white font-semibold hover:bg-brand-700 shadow-xl shadow-brand-500/20 hover:shadow-2xl transition duration-150 active:scale-95"
            >
              Get Started with CivicFix
            </button>
            <button 
              onClick={() => navigate('/login')} 
              className="px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-850 transition"
            >
              Department Login
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-brand-600 to-brand-500 flex items-center justify-center shadow-md">
                  <Activity className="text-white" size={16} />
                </div>
                <span className="font-heading font-bold text-lg text-slate-900 dark:text-white">CivicFix</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                CivicFix is a modern AI-enabled platform connecting citizen issue reporting with automated municipal routing, ensuring faster local complaints resolution through role-based governance.
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-4">Navigation</p>
              <ul className="space-y-2 text-2xs text-slate-500 dark:text-slate-400">
                <li><a href="#how-it-works" className="hover:text-brand-600 transition-colors">How It Works</a></li>
                <li><a href="#features" className="hover:text-brand-600 transition-colors">Features</a></li>
                <li><a href="#roles" className="hover:text-brand-600 transition-colors">Platform Roles</a></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-4">Portal Access</p>
              <ul className="space-y-2 text-2xs text-slate-500 dark:text-slate-400">
                <li><button onClick={() => navigate('/login')} className="hover:text-brand-600 transition-colors text-left">Citizen Login</button></li>
                <li><button onClick={() => navigate('/register')} className="hover:text-brand-600 transition-colors text-left">Citizen Register</button></li>
                <li><button onClick={() => navigate('/login')} className="hover:text-brand-600 transition-colors text-left flex items-center gap-1"><Lock size={10} /> Officer workspace</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200/60 dark:border-slate-800/60 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between text-2xs text-slate-400">
            <p>&copy; {new Date().getFullYear()} CivicFix Platform. All rights reserved.</p>
            <p className="mt-2 sm:mt-0">Built using FastAPI AI & React Stack</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
