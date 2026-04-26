import React, { useEffect } from "react";
import { Link } from "react-router-dom";

export default function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-background via-background to-accent/5 text-foreground overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(30deg,transparent_12%,rgba(99,102,241,0.05)_12.5%,rgba(99,102,241,0.05)_37.5%,transparent_37.5%)] bg-[length:50px_50px]"></div>
      </div>

      <section className="relative py-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter uppercase">
              About <span className="text-primary normal-case not-italic">AEROZONE</span>
            </h1>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
            <p className="mt-8 text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We provide the analytical layer that converts fragmented aerospace procurement intelligence into clear, decision-ready insight.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-start pt-12">
            <div className="space-y-8">
              <h3 className="text-3xl font-bold leading-tight text-foreground">
                Specifically built for aerospace procurement and fabrication environments.
              </h3>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  In aerospace operations, critical procurement data exists across systems, teams, and projects — often creating visibility gaps at the exact moments when decisions matter most.
                </p>
                <p>
                  Over time, these gaps translate into delayed actions, cost leakage, and missed optimization opportunities. AEROZONE is created to solve this structural problem.
                </p>
                <p>
                  The platform consolidates fragmented procurement intelligence into a single, structured analytical layer and converts it into clear, decision-ready Insight.
                </p>
              </div>
            </div>

            <div className="bg-card/40 backdrop-blur-md border border-zinc-800/50 rounded-3xl p-8 lg:p-10 space-y-8 shadow-2xl">
              <h4 className="text-xl font-bold text-primary italic uppercase tracking-wider">Analysis Engine Enables:</h4>
              <ul className="space-y-6">
                {[
                  "Maintain precise visibility of material exposure across programs",
                  "Anticipate demand through commitment and pipeline analysis",
                  "Identify sourcing concentration and regional dependency risks",
                  "Evaluate purchase behavior against historical and market-driven trends",
                  "Understand material movement, pricing patterns, and long-term behavior",
                ].map((item, id) => (
                  <li key={id} className="flex gap-4 group">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                      <span className="text-xl font-bold">▷</span>
                    </div>
                    <span className="text-muted-foreground group-hover:text-foreground transition-colors font-medium self-center">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-24 text-center">
            <p className="text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed italic border-t border-zinc-800/40 pt-16">
              "AEROZONE balances operational tracking with deep analytical perspective — allowing teams to move beyond reporting and toward confident, forward-looking decisions."
            </p>
            <div className="mt-12 flex flex-col items-center gap-6">
               <p className="text-lg text-foreground font-semibold">
                Recognize patterns earlier, respond faster, and plan with clarity.
              </p>
              <Link to="/" className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:scale-105 transition-all">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer (Duplicated for consistency as per Home.jsx footer style) */}
      <footer className="relative border-t border-zinc-800/60 bg-[#09090b]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="space-y-4 lg:col-span-1">
              <div onClick={scrollToTop} className="flex items-center gap-3 cursor-pointer group hover:scale-101 transition-transform">
                <div className="flex items-center justify-center p-1 rounded-xl bg-white/5 border border-white/10 shadow-lg group-hover:bg-white/10 transition-all">
                  <img src="/logo-new.png" alt="AEROZONE Logo" className="w-10 h-10 object-contain" />
                </div>
                <div>
                  <div className="text-2xl font-black bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent tracking-tighter uppercase leading-none">
                    AeroZone
                  </div>
                  <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary/80 mt-1">
                    Insight that takes flight
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs pl-1">
                A business analytics platform built specifically for aerospace procurement and fabrication environments.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Modules</h4>
              <ul className="space-y-2.5">
                {["PLANER CHECKER", "PRISM", "ORBIT", "ANALYSIS", "MAIN CHART", "PDF TO JSON"].map((name, idx) => (
                  <li key={idx}>
                    <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Company</h4>
              <ul className="space-y-2.5">
                <li><Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
                {["Careers", "News", "Partners", "Contact"].map((item) => (
                  <li key={item} className="text-sm text-muted-foreground hover:text-primary cursor-pointer transition-colors">{item}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Get In Touch</h4>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>📧 aerozone.service@gmail.com</p>
                <p>📞 +91 9167430612</p>
                <p>📍 Maharashtra, India</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
