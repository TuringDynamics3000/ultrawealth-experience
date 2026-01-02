import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans overflow-x-hidden selection:bg-accent selection:text-accent-foreground">
      {/* Navigation Placeholder - kept minimal as per "Above the fold" rule focus */}
      <nav className="container py-6 flex justify-between items-center z-10 relative">
        <div className="font-serif font-semibold text-xl tracking-tight text-primary">
          UltraWealth
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground">
          <a href="#" className="hover:text-primary transition-colors">Features</a>
          <a href="#" className="hover:text-primary transition-colors">Pricing</a>
          <a href="#" className="hover:text-primary transition-colors">About</a>
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" className="hidden sm:flex hover:bg-transparent hover:text-primary/80">Log in</Button>
          <Button className="rounded-full px-6 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm">
            Get started
          </Button>
        </div>
      </nav>

      <main className="flex-grow flex flex-col justify-center relative">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-white/40 to-transparent pointer-events-none" />
        
        <div className="container grid lg:grid-cols-2 gap-12 items-center py-12 lg:py-20 relative z-0">
          
          {/* Left Column: Text Content */}
          <div className="space-y-8 max-w-xl animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-medium leading-[1.1] tracking-tight text-primary">
              Goals first.<br />
              Money follows.
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed max-w-md">
              A simpler way to stay on track with what matters most.
            </p>
            
            <div className="pt-4">
              <Button size="lg" className="rounded-full px-8 h-14 text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 group">
                See how it works
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>

          {/* Right Column: Hero Visual */}
          <div className="relative lg:h-[600px] flex items-center justify-center lg:justify-end animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200 ease-out">
            
            {/* Main Image Container */}
            <div className="relative w-full max-w-md lg:max-w-lg aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-black/5">
              <img 
                src="/images/hero-woman.png" 
                alt="Confident woman looking forward in natural light" 
                className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700 ease-out"
              />
              
              {/* Subtle overlay for text readability if needed, though image is clean */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-20" />
            </div>

            {/* Floating Goal Card */}
            <Card className="absolute bottom-12 -left-4 md:-left-12 w-72 p-5 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border-white/50 backdrop-blur-sm bg-white/90 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 fill-mode-forwards">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-accent/30 flex items-center justify-center text-chart-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-home"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-primary text-sm">Home Deposit</h3>
                    <p className="text-xs text-muted-foreground">Target 2028</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  <CheckCircle2 className="h-3 w-3" />
                  On track
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium text-primary">68%</span>
                </div>
                <Progress value={68} className="h-2 bg-secondary" indicatorClassName="bg-chart-1" />
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
