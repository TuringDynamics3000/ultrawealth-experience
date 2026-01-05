import { ReactNode } from "react";
import { useLocation } from "wouter";

interface LayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

export function Layout({ children, showHeader = true, showFooter = true }: LayoutProps) {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      {/* Global Header */}
      {showHeader && (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
          <div className="max-w-[480px] mx-auto px-5 py-3 flex justify-between items-center">
            {/* Left: Logo only */}
            <button 
              onClick={() => setLocation('/')}
              className="font-bold text-xl tracking-tight text-black"
            >
              UltraWealth
            </button>

            {/* Right: Navigation */}
            <div className="flex gap-4 items-center">
              <button 
                onClick={() => setLocation('/activity')}
                className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
              >
                Activity
              </button>
              <button 
                onClick={() => setLocation('/profile')}
                className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
              >
                Profile
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Global Footer */}
      {showFooter && (
        <footer className="border-t border-gray-100 bg-white">
          <div className="max-w-[480px] mx-auto px-5 py-4">
            <p className="text-xs text-gray-400 text-center">
              Self-directed trading · Governed by TuringOS
            </p>
            <p className="text-[10px] text-gray-300 text-center mt-1">
              Cash is held in a Cash Management Account provided by Cuscal. Payments via Zepto.
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}
