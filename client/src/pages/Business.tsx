import { Button } from "@/components/ui/button";
import { Menu, Building2, Shield, Landmark, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";

const BUSINESS_TYPES = [
  {
    id: "company",
    name: "Company",
    icon: Building2,
    description: "For Pty Ltd companies and corporations",
    features: ["Corporate treasury management", "Multi-signatory controls", "Director-level reporting"],
  },
  {
    id: "trust",
    name: "Trust",
    icon: Shield,
    description: "For family trusts and discretionary trusts",
    features: ["Beneficiary tracking", "Distribution management", "Trustee controls"],
  },
  {
    id: "smsf",
    name: "SMSF",
    icon: Landmark,
    description: "For self-managed super funds",
    features: ["Compliance-first design", "Member benefit tracking", "Audit-ready records"],
  },
];

export default function Business() {
  const [showStickyNav, setShowStickyNav] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky nav after scrolling past the hero image
      setShowStickyNav(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleGetStarted = (type?: string) => {
    setLocation('/invest');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans relative bg-[#F9F7F2]">
      
      {/* Sticky Navigation - appears after scrolling */}
      <div className={`fixed top-0 left-0 right-0 z-50 bg-black transition-transform duration-300 ${showStickyNav ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => setLocation('/')}
              className="font-bold text-xl tracking-tight text-white"
            >
              UltraWealth
            </button>
            <nav className="hidden md:flex items-center gap-6">
              <button 
                onClick={() => setLocation('/')}
                className="text-sm font-medium text-white/60 hover:text-white/80 transition-colors"
              >
                Personal
              </button>
              <span className="text-sm font-medium text-white">
                Business
              </span>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-sm font-medium text-white hover:text-white/80 transition-colors hidden sm:block">
              Log in
            </button>
            <button 
              onClick={() => handleGetStarted()}
              className="px-5 py-2 bg-white text-black text-sm font-semibold rounded-full hover:bg-white/90 transition-colors"
            >
              Sign up
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section - Split layout */}
      <div className="relative">
        {/* Top gradient section with headline */}
        <div className="bg-gradient-to-b from-[#E8E4DD] via-[#F0EDE8] to-[#F9F7F2] pt-16 pb-8">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="font-sans font-bold text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight text-gray-900 mb-6">
                Business-grade wealth management
              </h1>
              <p className="text-lg md:text-xl text-gray-600 font-medium max-w-2xl mx-auto">
                Purpose-built for companies, trusts, and SMSFs. Full control, complete transparency, audit-ready records.
              </p>
            </div>
          </div>
        </div>

        {/* Hero Image - Cropped portrait style */}
        <div className="relative w-full max-w-2xl mx-auto px-4">
          <div className="relative aspect-[4/3] overflow-hidden rounded-t-3xl">
            <img 
              src="/images/hero-business.png" 
              alt="Confident businessman" 
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>
      </div>

      {/* Inline Navigation Bar */}
      <div className="bg-black sticky top-0 z-40">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => setLocation('/')}
              className="font-bold text-xl tracking-tight text-white"
            >
              UltraWealth
            </button>
            <nav className="hidden md:flex items-center gap-6">
              <button 
                onClick={() => setLocation('/')}
                className="text-sm font-medium text-white/60 hover:text-white/80 transition-colors"
              >
                Personal
              </button>
              <span className="text-sm font-medium text-white">
                Business
              </span>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-sm font-medium text-white hover:text-white/80 transition-colors hidden sm:block">
              Log in
            </button>
            <button 
              onClick={() => handleGetStarted()}
              className="px-5 py-2 bg-white text-black text-sm font-semibold rounded-full hover:bg-white/90 transition-colors"
            >
              Sign up
            </button>
          </div>
        </div>
      </div>

      {/* Business Types Section */}
      <section className="py-16 md:py-20 bg-[#F9F7F2]">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Choose your entity type
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Each entity type has tailored controls and reporting designed for its specific requirements.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {BUSINESS_TYPES.map((type) => {
              const Icon = type.icon;
              return (
                <div
                  key={type.id}
                  className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-200 transition-all"
                >
                  {/* Icon - Amber/Orange style */}
                  <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6 text-amber-600" />
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{type.name}</h3>
                  <p className="text-gray-500 text-sm mb-5">{type.description}</p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {type.features.map((feature, idx) => (
                      <li key={idx} className="text-sm text-gray-500 flex items-start gap-2">
                        <span className="text-gray-300 mt-1">›</span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <button 
                    onClick={() => handleGetStarted(type.id)}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-900 hover:gap-3 transition-all"
                  >
                    Get started
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-20 bg-[#F9F7F2]">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-10 text-center">
              Built for business
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-2">Multi-signatory controls</h3>
                <p className="text-gray-500 text-sm">
                  Require multiple approvals for transactions above thresholds you define.
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-2">Role-based access</h3>
                <p className="text-gray-500 text-sm">
                  Directors, trustees, and members see only what they need to see.
                </p>
              </div>
              <div className="bg-amber-50 p-6 rounded-2xl">
                <h3 className="font-bold text-gray-900 mb-2">Audit-ready records</h3>
                <p className="text-gray-500 text-sm">
                  Every action is recorded with full provenance. Download records anytime.
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-2">Compliance-first design</h3>
                <p className="text-gray-500 text-sm">
                  Built to meet regulatory requirements for each entity type.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gray-900 text-white">
        <div className="container text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to get started?
          </h2>
          <p className="text-white/60 mb-8 max-w-xl mx-auto">
            Set up your business account in minutes. No paperwork, no waiting.
          </p>
          <button 
            onClick={() => handleGetStarted()}
            className="px-8 py-4 bg-transparent text-white font-semibold rounded-full border-2 border-white hover:bg-white hover:text-gray-900 transition-colors"
          >
            Create business account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-gray-900 border-t border-gray-800 text-white/40">
        <div className="container text-center text-sm">
          Self-directed execution platform · No advice provided · Governed by TuringOS
        </div>
      </footer>

    </div>
  );
}
