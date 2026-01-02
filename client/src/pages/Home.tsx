import { Button } from "@/components/ui/button";
import { Menu, Plane, TrendingUp, Home as HomeIcon } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { WowGoalCardsCarousel } from "@/components/WowGoalCardsCarousel";
import { WOW_GOAL_CARDS } from "@/data/wowCards.data";

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
  const [, setLocation] = useLocation();
  const goal = GOALS[currentGoalIndex];

  const nextGoal = () => {
    setCurrentGoalIndex((prev) => (prev + 1) % GOALS.length);
  };

  const handleGetStarted = () => {
    setLocation(`/onboarding?goal=${goal.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans relative bg-[#F9F7F2]">
      
      {/* Hero Section */}
      <div className="relative h-screen min-h-[800px] flex flex-col overflow-hidden">
        {/* Full Screen Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero-woman.png" 
            alt="Confident woman against blue sky" 
            className="w-full h-full object-cover object-center"
          />
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent" />
        </div>

        {/* Navigation */}
        <nav className="container py-6 flex justify-between items-center z-20 relative">
        <div className="font-sans font-bold text-2xl tracking-tight text-white">
          UltraWealth
        </div>
        <div className="flex gap-4 items-center">
          <Button 
            onClick={handleGetStarted}
            className="rounded-full px-6 bg-black text-white hover:bg-black/90 border-none font-medium"
          >
            Get started
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/10">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </nav>

        <main className="flex-grow flex flex-col relative z-10 container pt-8 pb-8 h-full">
          
          {/* Top Headline Area */}
          <div className="text-center max-w-4xl mx-auto mb-4">
          <h1 className="font-sans font-bold text-4xl md:text-6xl lg:text-7xl leading-tight tracking-tight text-white drop-shadow-sm">
            Goals first. Money follows.
          </h1>
          <p className="text-lg md:text-xl text-white/90 font-medium mt-4 max-w-xl mx-auto">
            A simpler way to stay on track with what matters most.
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

        </main>
      </div>
      
      {/* Goal Cards Carousel Section */}
      <section aria-label="Goal cards" className="relative z-30 bg-[#F9F7F2]">
        <WowGoalCardsCarousel cards={WOW_GOAL_CARDS} />
      </section>
    </div>
  );
}
