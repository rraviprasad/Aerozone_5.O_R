// src/pages/Home.jsx - Aviation Materials Excellence

"use client";

import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Ruler, Gem, Globe, LineChart, BarChart3, FileJson } from "lucide-react";
import engineDetail from "../src/assets/engine_detail.png";
import planerCheckerImg from "../src/assets/PLANER_CHECKER.jpeg";
import prismImg from "../src/assets/PRISM.jpeg";
import orbitImg from "../src/assets/ORBIT.jpeg";
import analysisImg from "../src/assets/ANALYSIS_1.jpeg";
import mainChartImg from "../src/assets/ANALYSIS_2.jpeg";
import pdfJsonImg from "../src/assets/ANALYSIS_3.jpeg";
import bgVideo from "../src/assets/arezone bgvidio.mp4";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const heroPlaneRef = useRef(null);
  const heroContentRef = useRef(null);
  const modulesSectionRef = useRef(null); // Added for scroll target
  const floatingCardsRef = useRef([]);
  const statsRef = useRef([]);
  const [activeCard, setActiveCard] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Hero airplane flies in from left with 4 second delay
    gsap.fromTo(heroPlaneRef.current,
      { x: -1000, opacity: 0 },
      { x: 0, opacity: 1, duration: 2, delay: 4, ease: "power3.out" }
    );

    // Continuous floating animation for plane (starts after fly-in)
    gsap.to(heroPlaneRef.current, {
      y: -20,
      duration: 3,
      delay: 6, // Start after fly-in completes (4s delay + 2s animation)
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });

    // Hero content fade in with 4 second delay
    gsap.fromTo(heroContentRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.5, delay: 4.5, ease: "power2.out" }
    );

    // Floating cards animation
    floatingCardsRef.current.forEach((card, index) => {
      if (card) {
        gsap.fromTo(card,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            scrollTrigger: {
              trigger: card,
              start: "top bottom-=100",
              toggleActions: "play none none reverse",
            },
            duration: 1,
            delay: index * 0.2,
            ease: "power3.out",
          }
        );
      }
    });
  }, []);

  const modulePages = [
    {
      name: "PLANER CHECKER",
      desc: "Material Tracking & Timeline Insights",
      detailedDesc: "Advanced inspection tool for verifying aircraft surface flatness and material integrity. Features real-time measurements, automated reporting, and compliance verification with aerospace standards.",
      icon: <Ruler size={48} />,
      textColor: "text-blue-500",
      gradient: "from-blue-500 to-blue-700",
      route: "/planner-checker",
      image: planerCheckerImg
    },
    {
      name: "PRISM",
      desc: "PRP Data Monitoring Insights",
      detailedDesc: "Comprehensive prism-based analytics for aerospace materials. Provides multi-dimensional data visualization, material composition analysis, and trend forecasting for inventory management.",
      icon: <Gem size={48} />,
      textColor: "text-orange-500",
      gradient: "from-orange-500 to-amber-600",
      route: "/prism",
      image: prismImg
    },
    {
      name: "ORBIT",
      desc: "Global Perspective & Strategic Insights",
      detailedDesc: "Track and manage material flow across your aerospace supply chain. Visualize distribution patterns, monitor inventory orbits, and optimize material allocation with real-time tracking.",
      icon: <Globe size={48} />,
      textColor: "text-purple-500",
      gradient: "from-purple-500 to-purple-700",
      route: "/orbit",
      image: orbitImg
    },
    {
      name: "ANALYSIS 1",
      desc: "Comprehensive aerospace materials analytics and reporting",
      detailedDesc: "Deep-dive analytics platform for aerospace materials performance.",
      icon: <LineChart size={48} />,
      textColor: "text-gray-500",
      gradient: "from-gray-500 to-gray-600",
      route: "/analysis",
      image: analysisImg
    },
    {
      name: "ANALYSIS 2",
      desc: "Aggregated aerospace tracking and performance analysis",
      detailedDesc: "View aggregated metrics, historical data tracking, and summary insights for high-level technical overviews.",
      icon: <BarChart3 size={48} />,
      textColor: "text-teal-400",
      gradient: "from-teal-400 to-cyan-500",
      route: "/analysis-aggregated",
      image: mainChartImg
    },
    {
      name: "ANALYSIS 3",
      desc: "Advanced data visualization and export tooling",
      detailedDesc: "Explore complex metrics, extract technical data, and generate advanced performance reports for distribution.",
      icon: <FileJson size={48} />,
      textColor: "text-white",
      gradient: "from-gray-600 to-black",
      route: "/analysis-3", 
      image: pdfJsonImg
    },
  ];

  const handleCardClick = (module) => {
    setSelectedModule(module);
  };

  const handleViewPage = () => {
    if (selectedModule) {
      navigate(selectedModule.route);
      setSelectedModule(null);
    }
  };

  const scrollToModules = () => {
    modulesSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-background via-background to-accent/5 text-foreground overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(30deg,transparent_12%,rgba(99,102,241,0.05)_12.5%,rgba(99,102,241,0.05)_37.5%,transparent_37.5%)] bg-[length:50px_50px]"></div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-start justify-center px-6 md:px-12 lg:px-24 pt-16">
        {/* Background Video with Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            autoPlay
            loop
            muted={true}
            playsInline={true}
            className="w-full h-full object-cover scale-105"
            preload="auto"
          >
            <source src={bgVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background"></div>
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div ref={heroContentRef} className="space-y-8">
            <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter uppercase">
              AEROZONE
              <span className="block bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent normal-case not-italic tracking-normal">
                Insight that takes flight
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-xl font-medium">
              Designed for business excellence, driven by analytics, enabling visual visibility with forward-looking decisions beyond reporting
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={scrollToModules}
                className="group px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/50"
              >
                Explore MODULES
                <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">6</div>
                <div className="text-sm text-muted-foreground font-semibold">Modules</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">Weekly</div>
                <div className="text-sm text-muted-foreground font-semibold leading-tight">Current refresh rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground font-semibold">Support</div>
              </div>
            </div>
          </div>

          {/* Right - Animated Analytics Visual */}
          <div ref={heroPlaneRef} className="relative h-[500px] w-full flex items-center justify-center">
            {/* Ambient glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-blue-500/10 to-purple-500/20 rounded-3xl blur-3xl animate-pulse"></div>

            {/* Analytics SVG visual */}
            <div className="relative w-full max-w-[550px] h-[420px]">
              {/* Glass card background */}
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/80 via-zinc-900/60 to-zinc-950/80 border border-zinc-700/40 rounded-3xl backdrop-blur-xl shadow-2xl shadow-primary/10 overflow-hidden">
                {/* Grid pattern */}
                <div className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: 'linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                  }}
                ></div>
              </div>

              {/* Animated Bar Chart */}
              <div className="absolute bottom-12 left-8 flex items-end gap-2.5 h-[180px]">
                {[65, 85, 50, 95, 70, 110, 80, 100, 60, 90].map((h, i) => (
                  <div
                    key={i}
                    className="rounded-t-md transition-all duration-1000"
                    style={{
                      width: '16px',
                      height: `${h}px`,
                      background: `linear-gradient(to top, ${i % 3 === 0 ? '#6366f1' : i % 3 === 1 ? '#3b82f6' : '#8b5cf6'}, transparent)`,
                      opacity: 0.8,
                      animation: `barGrow 2s ease-out ${i * 0.15}s both`,
                    }}
                  ></div>
                ))}
              </div>

              {/* Line Chart overlay */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 550 420" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Line chart path */}
                <path
                  d="M40 280 L90 240 L140 260 L190 200 L240 220 L290 160 L340 180 L390 120 L440 140 L500 80"
                  stroke="url(#lineGrad)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray="600"
                  style={{ animation: 'drawLine 3s ease-out 1s forwards' }}
                  strokeDashoffset="600"
                />
                {/* Area fill under line */}
                <path
                  d="M40 280 L90 240 L140 260 L190 200 L240 220 L290 160 L340 180 L390 120 L440 140 L500 80 L500 350 L40 350 Z"
                  fill="url(#areaGrad)"
                  opacity="0.15"
                  style={{ animation: 'areaFadeIn 2s ease-out 2s forwards' }}
                />

                {/* Data points */}
                {[
                  [90, 240], [190, 200], [290, 160], [390, 120], [500, 80]
                ].map(([cx, cy], i) => (
                  <g key={i}>
                    <circle cx={cx} cy={cy} r="6" fill="#6366f1" opacity="0.3" style={{ animation: `pulseNode 2s ease-in-out ${i * 0.4}s infinite` }} />
                    <circle cx={cx} cy={cy} r="3" fill="#818cf8" />
                  </g>
                ))}

                {/* Gradients */}
                <defs>
                  <linearGradient id="lineGrad" x1="40" y1="280" x2="500" y2="80">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="50%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                  <linearGradient id="areaGrad" x1="270" y1="80" x2="270" y2="350">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Floating stat cards */}
              <div className="absolute top-6 right-6 px-4 py-3 bg-zinc-800/70 backdrop-blur-md border border-zinc-700/50 rounded-xl" style={{ animation: 'floatCard 4s ease-in-out infinite' }}>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Revenue</div>
                <div className="text-xl font-bold text-emerald-400">↑ 24.5%</div>
              </div>

              <div className="absolute top-20 left-6 px-4 py-3 bg-zinc-800/70 backdrop-blur-md border border-zinc-700/50 rounded-xl" style={{ animation: 'floatCard 5s ease-in-out 0.5s infinite' }}>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Efficiency</div>
                <div className="text-xl font-bold text-blue-400">98.2%</div>
              </div>

              <div className="absolute bottom-6 right-8 px-4 py-3 bg-zinc-800/70 backdrop-blur-md border border-zinc-700/50 rounded-xl" style={{ animation: 'floatCard 4.5s ease-in-out 1s infinite' }}>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Growth</div>
                <div className="text-xl font-bold text-purple-400">+312%</div>
              </div>

              {/* Circular progress gauge */}
              <div className="absolute top-8 left-1/2 -translate-x-1/2">
                <svg width="70" height="70" viewBox="0 0 70 70">
                  <circle cx="35" cy="35" r="28" stroke="#27272a" strokeWidth="4" fill="none" />
                  <circle
                    cx="35" cy="35" r="28"
                    stroke="url(#gaugeGrad)"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray="176"
                    strokeDashoffset="35"
                    transform="rotate(-90 35 35)"
                    style={{ animation: 'drawGauge 2s ease-out 1.5s both' }}
                  />
                  <text x="35" y="38" textAnchor="middle" fill="#a5b4fc" fontSize="14" fontWeight="bold">80%</text>
                  <defs>
                    <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Floating particles */}
            <div className="absolute top-10 left-10 w-3 h-3 bg-primary rounded-full animate-ping"></div>
            <div className="absolute bottom-20 right-10 w-2 h-2 bg-purple-500 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute top-1/3 right-20 w-4 h-4 bg-blue-500/50 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-2 bg-primary rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Module Pages Section */}
      <section ref={modulesSectionRef} className="relative py-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Our <span className="text-primary">Modules Analysis Engine</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Access all analysis engine modules and tools from here
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modulePages.map((module, index) => (
              <div
                key={index}
                ref={(el) => (floatingCardsRef.current[index] = el)}
                onClick={() => handleCardClick(module)}
                onMouseEnter={() => setActiveCard(index)}
                onMouseLeave={() => setActiveCard(null)}
                className={`group relative p-8 bg-card/40 backdrop-blur-md border border-zinc-800/50 rounded-[32px] transition-all duration-500 cursor-pointer h-full flex flex-col ${activeCard === index ? "scale-105 shadow-2xl shadow-primary/20 border-primary/30" : "hover:scale-105 shadow-xl hover:shadow-2xl hover:border-primary/20"
                  }`}
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${module.gradient} opacity-0 group-hover:opacity-10 rounded-[32px] transition-opacity duration-500`}></div>

                <div className="relative z-10 flex-1 flex flex-col">
                  <div className={`mb-4 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 ${module.textColor}`}>
                    {module.icon}
                  </div>
                  <h3 className={`text-2xl font-bold mb-3 transition-colors bg-gradient-to-r ${module.gradient} bg-clip-text text-transparent`}>
                    {module.name}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed flex-1">
                    {module.desc}
                  </p>
                  <div className={`mt-4 flex items-center bg-gradient-to-r ${module.gradient} bg-clip-text text-transparent opacity-0 group-hover:opacity-100 transition-opacity`}>
                    <span className="text-sm font-semibold">More details</span>
                    <span className="ml-2 transform group-hover:translate-x-2 transition-transform text-foreground">→</span>
                  </div>
                </div>

                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/20 to-transparent rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module Info Modal */}
      {selectedModule && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6" onClick={() => setSelectedModule(null)}>
          <div className="relative max-w-6xl w-full bg-[#09090b]/95 backdrop-blur-2xl border-2 border-primary/20 rounded-[40px] shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Close button */}
            <button
              onClick={() => setSelectedModule(null)}
              className="absolute top-6 right-6 z-10 w-10 h-10 bg-background/80 hover:bg-destructive/80 text-foreground hover:text-destructive-foreground rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <span className="text-2xl">×</span>
            </button>

            <div className="grid md:grid-cols-[2.5fr_1fr] min-h-[500px]">
              {/* Left - Image */}
              <div className="relative h-64 md:h-full bg-black/50">
                <img
                  src={selectedModule.image}
                  alt={selectedModule.name}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Right - Info */}
              <div className="p-8 space-y-6 flex flex-col justify-center">
                <div className="flex items-center gap-4">
                  <span className={`${selectedModule.textColor}`}>{selectedModule.icon}</span>
                  <div>
                    <h3 className="text-3xl font-bold text-foreground">{selectedModule.name}</h3>
                    <p className="text-muted-foreground">{selectedModule.desc}</p>
                  </div>
                </div>

                <div className="h-px bg-border"></div>

                <div>
                  <h4 className={`text-xl font-semibold mb-3 bg-gradient-to-r ${selectedModule.gradient} bg-clip-text text-transparent`}>About this Module</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedModule.detailedDesc}
                  </p>
                </div>

                <div className="flex gap-4 pt-4 mt-auto">
                  <button
                    onClick={handleViewPage}
                    className={`flex-1 px-6 py-4 bg-gradient-to-r ${selectedModule.gradient} text-white rounded-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/50 border-0`}
                  >
                    View Page →
                  </button>
                  <button
                    onClick={() => setSelectedModule(null)}
                    className="px-6 py-4 bg-card border-2 border-border hover:border-primary/50 text-foreground rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Features Section with Engine Detail */}
      <section className="relative py-24 px-6 md:px-12 lg:px-24 bg-card/30">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-[500px] rounded-3xl overflow-hidden group">
            <img
              src={engineDetail}
              alt="Aircraft Engine"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>


          </div>

          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold">
              Why Choose <span className="text-primary">AeroZone?</span>
            </h2>

            <div className="space-y-4">
              {[
                { title: "Full Visibility. Zero Guesswork", desc: "Maintain complete visibility of material exposure across all programs — no blind spots, no fragmented views" },
                { title: "Plan Ahead. Commit with Confidence", desc: "Anticipate demand through pipeline and commitment analysis before making procurement decisions." },
                { title: "Know Risks Before They Impact", desc: "Identify sourcing concentration and regional dependencies early — reduce risk before it becomes disruption." },
                { title: "Buy Smarter with Real Data", desc: "Evaluate purchase behavior using historical and market trends while understanding pricing and material movement." },
              ].map((feature, idx) => (
                <div key={idx} className="flex gap-4 p-4 rounded-xl hover:bg-accent/20 transition-colors cursor-pointer group">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all">
                    <span className="text-2xl group-hover:scale-110 transition-transform">✓</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-1 group-hover:text-primary transition-colors">{feature.title}</h4>
                    <p className="text-muted-foreground">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative mt-16 border-t border-zinc-800/60 bg-[#09090b]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand Column */}
            <div className="space-y-4 lg:col-span-1">
              <div
                onClick={scrollToTop}
                className="flex items-center gap-3 cursor-pointer group hover:scale-101 transition-transform"
              >
                <div className="flex items-center justify-center p-1 rounded-xl bg-white/5 border border-white/10 shadow-lg group-hover:bg-white/10 transition-all">
                  <img src="/logo-new.png" alt="AEROZONE Logo" className="w-10 h-10 object-contain" />
                </div>
                <div>
                  <div className="text-2xl font-black bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent tracking-tighter uppercase leading-none">
                    AeroZone
                  </div>
                  <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary/80 mt-1 opacity-100">
                    Insight that takes flight
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs pl-1">
                A business analytics platform built specifically for aerospace procurement and fabrication environments.
              </p>
            </div>

            {/* Modules Column */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Modules</h4>
              <ul className="space-y-2.5">
                {modulePages.map((mod, idx) => (
                  <li key={idx}>
                    <Link
                      to={mod.route}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      {mod.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Column */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Company</h4>
              <ul className="space-y-2.5">
                <li>
                  <Link
                    to="/about"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    About Us
                  </Link>
                </li>
                {["Careers", "News", "Partners", "Contact"].map((item) => (
                  <li key={item}>
                    <span className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 cursor-pointer">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Column */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Get In Touch</h4>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>📧 aerozone.service@gmail.com</p>
                <p>📞 +91 9167430612</p>
                <p>📍 Maharashtra, India</p>
              </div>
              <div className="flex gap-3 pt-2">
                {[
                  { name: "LinkedIn", url: "https://www.linkedin.com/company/aerozone/" },
                  { name: "GitHub", url: "https://github.com/aerozoneservice" }
                ].map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 text-xs font-medium bg-zinc-800/60 hover:bg-primary/20 text-muted-foreground hover:text-primary border border-zinc-700/50 rounded-lg transition-all duration-200"
                  >
                    {social.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zinc-800/40">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} AeroZone. All rights reserved.
            </p>
            <div className="flex gap-6 text-xs text-muted-foreground">
              <span className="hover:text-primary cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-primary cursor-pointer transition-colors">Terms of Service</span>
              <span className="hover:text-primary cursor-pointer transition-colors">Cookies</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
