import { Button } from "@/components/ui/button";
import { Menu, Plane, TrendingUp, Home as HomeIcon, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { WowGoalCardsCarousel } from "@/components/WowGoalCardsCarousel";
import { WOW_GOAL_CARDS } from "@/data/wowCards.data";
import { HowItWorksFlow } from "@/components/HowItWorksFlow";

const GOALS = [
  {
    id: "home",
    label: "Home Deposit",
    amount: "$81,600",
    notification: { label: "Contribution", amount: "+$5,100", icon: HomeIcon }
  },
  {
    id: "travel",
    label: "Europe Trip",
    amount: "$12,450",
    notification: { label: "Flight Savings", amount: "+$850", icon: Plane }
  },
  {
    id: "invest",
    label: "Retirement",
    amount: "$142,800",
    notification: { label: "Dividend", amount: "+$1,240", icon: TrendingUp }
  }
];

export default function Home() {
  const [currentGoalIndex, setCurrentGoalIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [personalDropdownOpen, setPersonalDropdownOpen] = useState(false);
  
  const [, setLocation] = useLocation();
  const goal = GOALS[currentGoalIndex];
  const personalDropdownRef = useRef<HTMLDivElement>(null);
  

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (personalDropdownRef.current && !personalDropdownRef.current.contains(event.target as Node)) {
        setPersonalDropdownOpen(false);
      }

    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const nextGoal = () => {
    setCurrentGoalIndex((prev) => (prev + 1) % GOALS.length);
  };

  const handleGetStarted = () => {
    setLocation('/invest');
  };

  const handleCreateGoals = () => {
    setLocation('/goals/new');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans relative bg-[#F9F7F2]">
      
      {/* Revolut-style Dark Top Toolbar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black">
        <div className="container flex items-center justify-between h-14">
          {/* Left: Logo + Nav Links */}
          <div className="flex items-center gap-8">
            <span className="font-bold text-xl tracking-tight text-white">
              UltraWealth
            </span>
            <nav className="hidden md:flex items-center gap-6">
              {/* Personal Dropdown */}
              <div className="relative" ref={personalDropdownRef}>
                <button 
                  onClick={() => {
                    setPersonalDropdownOpen(!personalDropdownOpen);
                  }}
                  className="flex items-center gap-1 text-sm font-medium text-white hover:text-white/80 transition-colors"
                >
                  Personal
                  <ChevronDown className={`w-4 h-4 transition-transform ${personalDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Personal Dropdown Menu */}
                {personalDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-40 bg-white rounded-xl shadow-lg py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <button 
                      onClick={() => {
                        setPersonalDropdownOpen(false);
                        handleGetStarted();
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                    >
                      Individual
                    </button>
                    <button 
                      onClick={() => {
                        setPersonalDropdownOpen(false);
                        // Joint account flow - placeholder
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                    >
                      Joint
                    </button>
                  </div>
                )}
              </div>
              
              {/* Business - Navigate to Business page */}
              <button 
                onClick={() => setLocation('/business')}
                className="text-sm font-medium text-white/60 hover:text-white/80 transition-colors"
              >
                Business
              </button>
            </nav>
          </div>

          {/* Right: Auth Buttons */}
          <div className="flex items-center gap-3">
            <button className="text-sm font-medium text-white hover:text-white/80 transition-colors hidden sm:block">
              Log in
            </button>
            <button 
              onClick={handleGetStarted}
              className="px-5 py-2 bg-white text-black text-sm font-semibold rounded-full hover:bg-white/90 transition-colors"
            >
              Sign up
            </button>
            <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/10">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-screen min-h-[800px] flex flex-col overflow-hidden pt-14">
        {/* Full Screen Hero Background Image */}
        <div className="absolute inset-0 z-0 top-14">
          <img 
            src="/images/hero-woman.png" 
            alt="Confident woman against blue sky" 
            className="w-full h-full object-cover object-center will-change-transform"
            style={{ transform: `translateY(${scrollY * 0.4}px)` }}
          />
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent" />
        </div>

        {/* Secondary Navigation (inside hero) */}
        <nav className="container py-6 flex justify-between items-center z-20 relative">
          <div className="font-sans font-bold text-2xl tracking-tight text-white opacity-0">
            UltraWealth
          </div>
          <div className="flex gap-4 items-center">
            <Button 
              onClick={handleGetStarted}
              className="rounded-full px-6 bg-black text-white hover:bg-black/90 border-none font-medium"
            >
              Start investing
            </Button>
          </div>
        </nav>

        <main className="flex-grow flex flex-col relative z-10 container pt-8 pb-8 h-full">
          
          {/* Top Headline Area - Updated per spec */}
          <div className="text-center max-w-4xl mx-auto mb-4">
            <h1 className="font-sans font-bold text-4xl md:text-6xl lg:text-7xl leading-tight tracking-tight text-white drop-shadow-sm">
              Self-directed investing, with system-grade control.
            </h1>
            <p className="text-lg md:text-xl text-white/90 font-medium mt-4 max-w-xl mx-auto">
              You set the rules. You place the trades. The system enforces and records.
            </p>
          </div>

          {/* The "Phone Frame" Overlay */}
          <div className="flex-grow relative flex justify-center items-end pb-8 md:pb-12">
            {/* The White Border Frame */}
            <div className="relative w-full max-w-md h-[60vh] md:h-[65vh] border border-white/40 rounded-[2.5rem] flex flex-col items-center justify-end pb-8 overflow-hidden shadow-2xl ring-1 ring-white/20">
              
              {/* Center UI Group - Positioned absolutely to sit over torso */}
              <div className="absolute top-1/2 left-0 right-0 flex flex-col items-center gap-4 transform translate-y-4">
                {/* Big Number */}
                <div key={goal.amount} className="text-6xl md:text-7xl font-bold text-white tracking-tight drop-shadow-md animate-in fade-in zoom-in-95 duration-300">
                  {goal.amount}
                </div>
                
                {/* Pill Button */}
                <button 
                  onClick={nextGoal}
                  className="bg-white text-black px-6 py-3 rounded-full font-semibold text-sm shadow-lg cursor-pointer hover:scale-105 active:scale-95 transition-all select-none"
                >
                  {goal.label}
                </button>
              </div>

              {/* Bottom Notification Card */}
              <div key={goal.id} className="w-[90%] bg-white rounded-2xl p-4 flex items-center gap-4 shadow-xl animate-in slide-in-from-bottom-4 fade-in duration-500">
                <div className="h-10 w-10 rounded-full bg-[#6F6A63] flex items-center justify-center text-white shrink-0">
                  <goal.notification.icon className="h-5 w-5" />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-[#6F6A63] text-sm">{goal.notification.label}</h3>
                    <span className="text-[#6F6A63] font-bold text-sm">{goal.notification.amount}</span>
                  </div>
                  <p className="text-xs text-[#6F6A63]/60">Today, 11:28</p>
                </div>
              </div>

            </div>
          </div>

          {/* CTAs below the phone frame */}
          <div className="flex flex-col items-center gap-3 mt-4">
            <Button 
              onClick={handleGetStarted}
              className="rounded-full px-8 py-6 bg-black text-white hover:bg-black/90 border-none font-semibold text-lg"
            >
              Start investing
            </Button>
            <button 
              onClick={handleCreateGoals}
              className="text-white/80 hover:text-white text-sm font-medium underline underline-offset-4 transition-colors"
            >
              Create goals (optional rules)
            </button>
          </div>

        </main>
      </div>
      
      {/* Goal Cards Carousel Section */}
      <section aria-label="Goal cards" className="relative z-30 bg-[#F9F7F2]">
        <WowGoalCardsCarousel cards={WOW_GOAL_CARDS} />
      </section>

      {/* How It Works Section */}
      <section aria-label="How UltraWealth works">
        <HowItWorksFlow />
      </section>

    </div>
  );
}
