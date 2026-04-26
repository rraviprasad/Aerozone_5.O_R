import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

/* =======================
   SVG ICONS
======================= */
const Icons = {
    home: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
            <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        </svg>
    ),
    planner: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
        </svg>
    ),
    prism: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72" />
            <path d="m14 7 3 3" />
            <path d="M5 6v4" />
            <path d="M19 14v4" />
            <path d="M10 2v2" />
            <path d="M7 8H3" />
            <path d="M21 16h-4" />
            <path d="M11 3H9" />
        </svg>
    ),
    orbit: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="4" />
            <line x1="21.17" y1="8" x2="12" y2="8" />
            <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
            <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
        </svg>
    ),
    analysis: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3v16a2 2 0 0 0 2 2h16" />
            <path d="m19 9-5 5-4-4-3 3" />
        </svg>
    ),
    chart: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
    ),
    pdf: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
            <path d="M10 9H8" />
            <path d="M16 13H8" />
            <path d="M16 17H8" />
        </svg>
    ),
    chevronDown: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6" />
        </svg>
    ),
    menu: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
    ),
    close: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    ),
};

/* =======================
   NAV CONFIG
======================= */
const NAV_ITEMS = [
    { to: "/", label: "Home", id: "home", icon: Icons.home },
    { to: "/planner-checker", label: "Planer Checker", id: "planner", icon: Icons.planner },
    { to: "/prism", label: "Prism", id: "prism", icon: Icons.prism },
    { to: "/orbit", label: "Orbit", id: "orbit", icon: Icons.orbit },
    {
        label: "Analysis",
        id: "analysis",
        icon: Icons.analysis,
        children: [
            { to: "/analysis", id: "analysis1", label: "Main Analysis" },
            { to: "/analysis-aggregated", id: "analysis2", label: "Aggregated Analysis" },
            { to: "/analysis-3", id: "analysis3", label: "Project Wise Analysis" },
        ],
    },
    {
        label: "Tools",
        id: "tools",
        icon: Icons.chart,
        children: [
            { to: "/main-chart", id: "DataPage", label: "Main Chart", icon: Icons.chart },
            { to: "/pdf-to-json", id: "PdfJson", label: "PDF to JSON", icon: Icons.pdf },
        ],
    },
];

/* =======================
   SIDEBAR COMPONENT
======================= */
const Sidebar = ({ collapsed: isCollapsed, setCollapsed: setIsCollapsed }) => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const location = useLocation();

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileOpen(false);
    }, [location.pathname]);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isMobileOpen]);

    const toggleDropdown = (id) =>
        setOpenDropdownId((prev) => (prev === id ? null : id));

    const isActive = (path) => location.pathname === path;
    const isGroupActive = (children) => children?.some((c) => c.to === location.pathname);

    /* ----- Render a nav item ----- */
    const renderNavItem = (item, collapsed = false) => {
        const hasChildren = !!item.children;
        const active = item.to ? isActive(item.to) : isGroupActive(item.children);
        const isOpen = openDropdownId === item.id;

        if (hasChildren) {
            return (
                <div key={item.id} className="w-full">
                    <button
                        onClick={() => toggleDropdown(item.id)}
                        title={collapsed ? item.label : undefined}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
              ${active
                                ? "bg-cyan-500/15 text-cyan-400"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                            }
              ${collapsed ? "justify-center" : ""}
            `}
                    >
                        <span className={`flex-shrink-0 transition-colors ${active ? "text-cyan-400" : "text-gray-500 group-hover:text-gray-300"}`}>
                            {item.icon}
                        </span>
                        {!collapsed && (
                            <>
                                <span className="flex-1 text-left">{item.label}</span>
                                <span className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                                    {Icons.chevronDown}
                                </span>
                            </>
                        )}
                    </button>

                    {/* Dropdown (only when expanded) */}
                    {!collapsed && (
                        <div className={`overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
              ${isOpen ? "max-h-40 opacity-100 mt-1" : "max-h-0 opacity-0"}`}>
                            <div className="ml-5 pl-3 border-l border-gray-700/50 space-y-0.5">
                                {item.children.map((child) => (
                                    <Link
                                        key={child.id}
                                        to={child.to}
                                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-all duration-200
                      ${isActive(child.to)
                                                ? "bg-cyan-500/10 text-cyan-400 font-semibold"
                                                : "text-gray-500 hover:text-gray-200 hover:bg-white/5"
                                            }`}
                                    >
                                        {child.icon && <span className="flex-shrink-0">{child.icon}</span>}
                                        <span>{child.label}</span>
                                        {isActive(child.to) && (
                                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.6)]" />
                                        )}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        return (
            <Link
                key={item.id}
                to={item.to}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
          ${active
                        ? "bg-cyan-500/15 text-cyan-400"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }
          ${collapsed ? "justify-center" : ""}
        `}
            >
                <span className={`flex-shrink-0 transition-colors ${active ? "text-cyan-400" : "text-gray-500 group-hover:text-gray-300"}`}>
                    {item.icon}
                </span>
                {!collapsed && (
                    <>
                        <span className="flex-1">{item.label}</span>
                        {active && (
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.6)]" />
                        )}
                    </>
                )}
            </Link>
        );
    };

    return (
        <>
            {/* ========== MOBILE TOP BAR ========== */}
            <div className={`md:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-gray-950/95 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 transition-opacity duration-300 ${isMobileOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <Link to="/" className="flex items-center gap-2.5">
                    <img src="/logo-new.png" alt="AEROZON" className="h-8" />
                    <span className="text-lg font-bold text-white tracking-tight">AEROZONE</span>
                </Link>
                <button
                    onClick={() => setIsMobileOpen((p) => !p)}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
                    aria-label="Toggle menu"
                >
                    {isMobileOpen ? Icons.close : Icons.menu}
                </button>
            </div>

            {/* ========== MOBILE BACKDROP ========== */}
            <div
                className={`fixed inset-0 z-40 md:hidden transition-all duration-400
          ${isMobileOpen
                        ? "opacity-100 pointer-events-auto backdrop-blur-sm bg-black/50"
                        : "opacity-0 pointer-events-none"
                    }`}
                onClick={() => setIsMobileOpen(false)}
            />

            {/* ========== MOBILE SIDEBAR DRAWER ========== */}
            <aside
                className={`fixed top-0 left-0 h-full z-50 md:hidden w-[280px]
          bg-[#09090b]/95 backdrop-blur-2xl border-r border-white/5
          transform transition-transform duration-400 ease-[cubic-bezier(0.32,0.72,0,1)]
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          flex flex-col
        `}
            >
                {/* Mobile sidebar header */}
                <div className="flex items-center justify-between px-5 py-5 border-b border-white/5">
                    <Link to="/" className="flex items-center gap-2.5" onClick={() => setIsMobileOpen(false)}>
                        <img src="/logo-new.png" alt="AEROZON" className="h-8" />
                        <span className="text-lg font-bold text-white tracking-tight">AEROZONE</span>
                    </Link>
                    <button
                        onClick={() => setIsMobileOpen(false)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                        {Icons.close}
                    </button>
                </div>

                {/* Mobile nav items */}
                <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-hide">
                    {NAV_ITEMS.map((item) => renderNavItem(item, false))}
                </nav>

                {/* Mobile footer */}
                <div className="px-5 py-4 border-t border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                            <img src="/logo-new.png" alt="AZ" className="w-6 h-6 object-contain" />
                        </div>
                        <div>
                            <p className="text-[13px] font-semibold text-white">Aerozone 5.O</p>
                            <p className="text-[11px] text-gray-500">V5.0</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* ========== DESKTOP SIDEBAR ========== */}
            <aside
                className={`hidden md:flex fixed top-0 left-0 h-screen z-40 flex-col
          bg-[#09090b] border-r border-white/5
          transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${isCollapsed ? "w-[68px]" : "w-[260px]"}
        `}
            >
                {/* Desktop header */}
                <div className={`flex items-center ${isCollapsed ? "justify-center px-2" : "justify-between px-4"} py-5 border-b border-white/5`}>
                    <Link to="/" className="flex items-center gap-2.5 overflow-hidden">
                        <img src="/logo-new.png" alt="AEROZON" className="h-8 min-w-[32px] w-8 flex-shrink-0 object-contain" />
                        {!isCollapsed && (
                            <span className="text-lg font-bold text-white tracking-tight whitespace-nowrap">
                                AEROZONE
                            </span>
                        )}
                    </Link>
                    {!isCollapsed && (
                        <button
                            onClick={() => setIsCollapsed(true)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-all"
                            title="Collapse sidebar"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m11 17-5-5 5-5" />
                                <path d="m18 17-5-5 5-5" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Expand button (when collapsed) */}
                {isCollapsed && (
                    <button
                        onClick={() => setIsCollapsed(false)}
                        className="mx-auto mt-3 w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-all"
                        title="Expand sidebar"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m13 17 5-5-5-5" />
                            <path d="m6 17 5-5-5-5" />
                        </svg>
                    </button>
                )}

                {/* Desktop nav items */}
                <nav className={`flex-1 overflow-y-auto py-4 space-y-1 scrollbar-hide ${isCollapsed ? "px-2" : "px-3"}`}>
                    {!isCollapsed && (
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-600 px-3 mb-2">
                            Navigation
                        </p>
                    )}
                    {NAV_ITEMS.map((item) => renderNavItem(item, isCollapsed))}
                </nav>

                {/* Desktop footer */}
                <div className={`border-t border-white/5 ${isCollapsed ? "px-2 py-3" : "px-4 py-4"}`}>
                    <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}>
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                            <img src="/logo-new.png" alt="AZ" className="w-6 h-6 object-contain" />
                        </div>
                        {!isCollapsed && (
                            <div>
                                <p className="text-[13px] font-semibold text-white">Aerozone 5.O</p>
                                <p className="text-[11px] text-gray-500">V5.0</p>
                            </div>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
