"use client";
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

/* =======================
   NAV CONFIG
======================= */
const NAV_ITEMS = [
  { to: "/", label: "Home", id: "home", icon: "🏠" },
  { to: "/data2", label: "Planer Checker", id: "planner", icon: "✈️" },
  { to: "/Module2Page1", label: "Prism", id: "prism", icon: "🔷" },
  { to: "/Module3Page1", label: "Orbit", id: "orbit", icon: "🌍" },
  {
    label: "Analysis",
    id: "Analysis",
    icon: "📈",
    children: [
      { to: "/Analysis1page", id: "analysis1", label: "Analysis Page 1", icon: "📊" },
      { to: "/Analysis2page", id: "analysis2", label: "Analysis Page 2", icon: "📉" },
    ],
  },
  {
    label: "Menu",
    id: "menu",
    icon: "📋",
    children: [
      { to: "/data", id: "DataPage", label: "Main Chart", icon: "📊" },
      { to: "/pdf-to-json", id: "PdfJson", label: "PDF to JSON", icon: "📄" },
    ],
  },
];

/* =======================
   HAMBURGER ICON COMPONENT
======================= */
const HamburgerIcon = ({ isOpen, onClick }) => (
  <button
    onClick={onClick}
    className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-xl
               bg-gray-800/80 dark:bg-gray-700/80 backdrop-blur-sm border border-gray-600/30 dark:border-white/10
               hover:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-300 z-[60] shadow-lg"
    aria-label="Toggle menu"
    id="hamburger-toggle"
  >
    <div className="w-5 h-4 flex flex-col justify-between items-center">
      <span
        className={`block h-[2px] w-full rounded-full transition-all duration-400 ease-[cubic-bezier(0.68,-0.55,0.27,1.55)]
          ${isOpen
            ? "rotate-45 translate-y-[7px] bg-cyan-400"
            : "bg-white"
          }`}
      />
      <span
        className={`block h-[2px] rounded-full transition-all duration-300
          ${isOpen
            ? "w-0 opacity-0 bg-cyan-400"
            : "w-full bg-white opacity-100"
          }`}
      />
      <span
        className={`block h-[2px] w-full rounded-full transition-all duration-400 ease-[cubic-bezier(0.68,-0.55,0.27,1.55)]
          ${isOpen
            ? "-rotate-45 -translate-y-[7px] bg-cyan-400"
            : "bg-white"
          }`}
      />
    </div>
  </button>
);

/* =======================
   MOBILE NAV ITEM
======================= */
const MobileNavItem = ({ item, index, location, openDropdownId, toggleDropdown, onClose }) => {
  const hasChildren = !!item.children;
  const isActive =
    location.pathname === item.to ||
    (hasChildren && item.children.some((c) => c.to === location.pathname));
  const isDropdownOpen = openDropdownId === item.id;

  return (
    <div
      className="mobile-nav-item"
      style={{ animationDelay: `${80 + index * 60}ms` }}
    >
      {hasChildren ? (
        <>
          <button
            onClick={() => toggleDropdown(item.id)}
            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-[15px] font-semibold
              transition-all duration-300 group
              ${isActive
                ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/20"
                : "text-gray-700 dark:text-gray-200 hover:bg-white/60 dark:hover:bg-white/5 border border-transparent"
              }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </div>
            <svg
              className={`w-4 h-4 transition-transform duration-400 ease-[cubic-bezier(0.68,-0.55,0.27,1.55)]
                ${isDropdownOpen ? "rotate-180 text-cyan-400" : "text-gray-400"}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Accordion children */}
          <div
            className={`overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]
              ${isDropdownOpen ? "max-h-60 opacity-100 mt-1" : "max-h-0 opacity-0"}`}
          >
            <div className="ml-4 pl-4 border-l-2 border-cyan-500/20 space-y-1">
              {item.children.map((child, ci) => (
                <Link
                  key={child.id}
                  to={child.to}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-300
                    ${location.pathname === child.to
                      ? "bg-cyan-500/15 text-cyan-400 font-semibold"
                      : "text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-white/5 hover:translate-x-1"
                    }`}
                  style={{ animationDelay: `${ci * 50}ms` }}
                >
                  <span className="text-base">{child.icon}</span>
                  <span>{child.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </>
      ) : (
        <Link
          to={item.to}
          onClick={onClose}
          className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-[15px] font-semibold
            transition-all duration-300 border
            ${isActive
              ? "bg-cyan-500/15 text-cyan-400 border-cyan-500/20"
              : "text-gray-700 dark:text-gray-200 hover:bg-white/60 dark:hover:bg-white/5 border-transparent hover:translate-x-1"
            }`}
        >
          <span className="text-lg">{item.icon}</span>
          <span>{item.label}</span>
          {isActive && (
            <span className="ml-auto w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
          )}
        </Link>
      )}
    </div>
  );
};

/* =======================
   NAVBAR COMPONENT
======================= */
const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const location = useLocation();
  const dropdownRef = useRef(null);

  /* Close menu on route change */
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenDropdownId(null);
  }, [location.pathname]);

  /* Close desktop dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* Lock body scroll when mobile menu is open */
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const toggleDropdown = (id) =>
    setOpenDropdownId((prev) => (prev === id ? null : id));

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setOpenDropdownId(null);
  };

  const isHomePage = location.pathname === "/";

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 pt-2 pb-2
        ${!isHomePage
          ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-sm border-b border-gray-200/50 dark:border-white/5"
          : "md:bg-transparent bg-white/90 dark:bg-gray-900/90 md:backdrop-blur-none backdrop-blur-xl md:shadow-none shadow-sm md:border-0 border-b border-gray-200/50 dark:border-white/5"
        }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* LOGO */}
        <Link to="/" className="flex items-center space-x-3 z-[60]">
          <img src="/logo-new.png" alt="AEROZON" className="h-9" />
          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            AEROZONE
          </span>
        </Link>

        {/* =======================
            DESKTOP NAV
        ======================= */}
        <nav className="hidden md:flex items-center space-x-1" ref={dropdownRef}>
          {NAV_ITEMS.map((item) => {
            const hasChildren = !!item.children;
            const isActive =
              location.pathname === item.to ||
              (hasChildren &&
                item.children.some((c) => c.to === location.pathname));

            if (hasChildren) {
              return (
                <div key={item.id} className="relative">
                  <button
                    onClick={() => toggleDropdown(item.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center transition
                      ${isActive
                        ? "bg-cyan-500/10 text-cyan-600"
                        : "text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50"
                      }`}
                  >
                    {item.label}
                    <svg
                      className={`ml-1 w-4 h-4 transition-transform ${openDropdownId === item.id ? "rotate-180" : ""
                        }`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {openDropdownId === item.id && (
                    <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 rounded-xl shadow-lg py-2 border border-gray-200 dark:border-gray-700">
                      {item.children.map((child) => (
                        <Link
                          key={child.id}
                          to={child.to}
                          className={`flex items-center px-4 py-2 text-sm transition
                            ${location.pathname === child.to
                              ? "bg-cyan-500/10 text-cyan-600"
                              : "hover:bg-gray-100 dark:hover:bg-gray-700/50"
                            }`}
                        >
                          <span className="mr-3">{child.icon}</span>
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.id}
                to={item.to}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition
                  ${isActive
                    ? "bg-cyan-500/10 text-cyan-600"
                    : "text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50"
                  }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* =======================
            MOBILE HAMBURGER BUTTON
        ======================= */}
        <HamburgerIcon
          isOpen={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen((p) => !p)}
        />
      </div>

      {/* =======================
          MOBILE BACKDROP OVERLAY (BLUR)
      ======================= */}
      <div
        className={`fixed inset-0 md:hidden z-[45] transition-all duration-500
          ${isMobileMenuOpen
            ? "opacity-100 pointer-events-auto backdrop-blur-md bg-black/40"
            : "opacity-0 pointer-events-none backdrop-blur-none bg-transparent"
          }`}
        onClick={closeMobileMenu}
        aria-hidden="true"
      />

      {/* =======================
          MOBILE SLIDE-IN MENU PANEL
      ======================= */}
      <div
        className={`fixed top-0 right-0 h-full w-[80%] max-w-[320px] md:hidden z-[55]
          transform transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
          ${isMobileMenuOpen
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0"
          }`}
      >
        {/* Glassmorphism panel */}
        <div className="h-full bg-white/80 dark:bg-gray-900/85 backdrop-blur-2xl border-l border-white/20 dark:border-white/5 shadow-2xl flex flex-col">

          {/* Panel header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-200/50 dark:border-white/10">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                Navigation
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Explore Aerozone
              </p>
            </div>
            {/* Close button */}
            <button
              onClick={closeMobileMenu}
              className="w-8 h-8 flex items-center justify-center rounded-full
                         bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20
                         transition-all duration-300"
              aria-label="Close menu"
            >
              <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Nav items */}
          <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5 scrollbar-hide">
            {NAV_ITEMS.map((item, index) => (
              <MobileNavItem
                key={item.id}
                item={item}
                index={index}
                location={location}
                openDropdownId={openDropdownId}
                toggleDropdown={toggleDropdown}
                onClose={closeMobileMenu}
              />
            ))}
          </nav>

          {/* Panel footer with glow accent */}
          <div className="px-6 py-4 border-t border-gray-200/50 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                <span className="text-white text-xs font-bold">A</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Aerozone 5.O</p>
                <p className="text-[11px] text-gray-400">v3.1 • Dashboard</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
