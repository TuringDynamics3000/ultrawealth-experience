import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, CheckCircle2, Menu } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans overflow-hidden relative bg-sky-500">
      
      {/* Full Screen Hero Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/hero-woman.png" 
          alt="Confident woman against blue sky" 
          className="w-full h-full object-cover object-center"
        />
        {/* Subtle gradient overlay to ensure text readability at the top */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-transparent" />
      </div>

      {/* Navigation - Transparent & Minimal */}
      <nav className="container py-6 flex justify-between items-center z-20 relative">
        <div className="font-sans font-bold text-2xl tracking-tight text-white">
          UltraWealth
        </div>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex gap-8 text-sm font-medium text-white/90">
          <a href="#" className="hover:text-white transition-colors">Personal</a>
          <a href="#" className="hover:text-white transition-colors">Business</a>
          <a href="#" className="hover:text-white transition-colors">Company</a>
        </div>

        <div className="flex gap-4 items-center">
          <Button variant="ghost" className="hidden sm:flex text-white hover:bg-white/10 hover:text-white">Log in</Button>
          <Button className="rounded-full px-6 bg-white text-black hover:bg-white/90 shadow-lg border-none font-medium">
            Get started
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/10">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </nav>

      <main className="flex-grow flex flex-col relative z-10 container pt-12 pb-8">
        
        {/* Hero Content */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mt-8 md:mt-16 space-y-6">
          <h1 className="font-sans font-bold text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight text-white drop-shadow-sm animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
            Goals first.<br />
            Money follows.
          </h1>
          
          <p className="text-lg md:text-2xl text-white/90 font-medium max-w-xl leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100 ease-out">
            A simpler way to stay on track with what matters most.
          </p>
          
          <div className="pt-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 ease-out">
            <Button size="lg" className="rounded-full px-8 h-14 text-base font-semibold bg-black text-white hover:bg-black/80 border-none shadow-xl transition-all duration-300 group">
              See how it works
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        {/* Floating Goal Card - Positioned to overlay the subject or sit at bottom */}
        <div className="mt-auto mb-8 md:mb-16 w-full flex justify-center animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500 fill-mode-forwards">
          <Card className="w-full max-w-sm p-6 rounded-3xl shadow-2xl border-white/20 backdrop-blur-md bg-white/95 text-card-foreground">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-[#6F6A63]/10 flex items-center justify-center text-[#6F6A63]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-home"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                </div>
                <div>
                  <h3 className="font-bold text-[#6F6A63] text-lg">Home Deposit</h3>
                  <p className="text-sm text-[#6F6A63]/70">Target 2028</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-full">
                <CheckCircle2 className="h-3.5 w-3.5" />
                On track
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-sm font-medium text-[#6F6A63]/70">Progress</span>
                <span className="text-2xl font-bold text-[#6F6A63]">68%</span>
              </div>
              {/* Custom progress bar color to match the "Private Bank" aesthetic inside the card */}
              <Progress value={68} className="h-3 bg-[#6F6A63]/10" indicatorClassName="bg-[#6F6A63]" />
              <div className="flex justify-between text-xs text-[#6F6A63]/50 pt-1">
                <span>$0</span>
                <span>$120,000</span>
              </div>
            </div>
          </Card>
        </div>

      </main>
    </div>
  );
}
