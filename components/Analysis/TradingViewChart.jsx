import { useEffect, useRef, useState, useMemo } from 'react'

// Popular currency pairs grouped by category
const CURRENCY_PAIRS = [
    { label: "USD/INR", value: "FX:USDINR", category: "INR Pairs" },
    { label: "EUR/INR", value: "FX:EURINR", category: "INR Pairs" },
    { label: "GBP/INR", value: "FX:GBPINR", category: "INR Pairs" },
    { label: "JPY/INR", value: "FX:JPYINR", category: "INR Pairs" },
    { label: "AUD/INR", value: "FX_IDC:AUDINR", category: "INR Pairs" },
    { label: "CAD/INR", value: "FX_IDC:CADINR", category: "INR Pairs" },
    { label: "CHF/INR", value: "FX_IDC:CHFINR", category: "INR Pairs" },
    { label: "SGD/INR", value: "FX_IDC:SGDINR", category: "INR Pairs" },
    { label: "EUR/USD", value: "FX:EURUSD", category: "Major Pairs" },
    { label: "GBP/USD", value: "FX:GBPUSD", category: "Major Pairs" },
    { label: "USD/JPY", value: "FX:USDJPY", category: "Major Pairs" },
    { label: "USD/CHF", value: "FX:USDCHF", category: "Major Pairs" },
    { label: "AUD/USD", value: "FX:AUDUSD", category: "Major Pairs" },
    { label: "USD/CAD", value: "FX:USDCAD", category: "Major Pairs" },
    { label: "NZD/USD", value: "FX:NZDUSD", category: "Major Pairs" },
    { label: "EUR/GBP", value: "FX:EURGBP", category: "Cross Pairs" },
    { label: "EUR/JPY", value: "FX:EURJPY", category: "Cross Pairs" },
    { label: "GBP/JPY", value: "FX:GBPJPY", category: "Cross Pairs" },
    { label: "AUD/JPY", value: "FX:AUDJPY", category: "Cross Pairs" },
    { label: "EUR/AUD", value: "FX:EURAUD", category: "Cross Pairs" },
    { label: "USD/CNH", value: "FX:USDCNH", category: "Exotic Pairs" },
    { label: "USD/SGD", value: "FX:USDSGD", category: "Exotic Pairs" },
    { label: "USD/HKD", value: "FX:USDHKD", category: "Exotic Pairs" },
    { label: "USD/THB", value: "FX:USDTHB", category: "Exotic Pairs" },
    { label: "USD/MXN", value: "FX:USDMXN", category: "Exotic Pairs" },
    { label: "USD/ZAR", value: "FX:USDZAR", category: "Exotic Pairs" },
]

// Metals and commodities
const METALS = [
    { label: "Nickel", value: "CAPITALCOM:NICKEL", category: "Base Metals" },
    { label: "Copper", value: "CAPITALCOM:COPPER", category: "Base Metals" },
    { label: "Aluminum", value: "CAPITALCOM:ALUMINUM", category: "Base Metals" },
    { label: "Zinc", value: "CAPITALCOM:ZINC", category: "Base Metals" },
    { label: "Lead", value: "CAPITALCOM:LEAD", category: "Base Metals" },
    { label: "Tin", value: "TVC:TIN", category: "Base Metals" },
    { label: "Gold", value: "TVC:GOLD", category: "Precious Metals" },
    { label: "Silver", value: "TVC:SILVER", category: "Precious Metals" },
    { label: "Platinum", value: "TVC:PLATINUM", category: "Precious Metals" },
    { label: "Palladium", value: "TVC:PALLADIUM", category: "Precious Metals" },
    { label: "Iron Ore", value: "CAPITALCOM:IRONORE", category: "Industrial" },
    { label: "Steel", value: "CAPITALCOM:STEEL", category: "Industrial" },
    { label: "Crude Oil", value: "TVC:USOIL", category: "Energy" },
    { label: "Brent Oil", value: "TVC:UKOIL", category: "Energy" },
    { label: "Natural Gas", value: "TVC:NATURALGAS", category: "Energy" },
]

// Searchable dropdown component
function SearchableDropdown({ options, value, onChange, placeholder, icon }) {
    const [isOpen, setIsOpen] = useState(false)
    const [search, setSearch] = useState('')
    const dropdownRef = useRef(null)
    const inputRef = useRef(null)

    const selectedOption = options.find(o => o.value === value)

    const filtered = useMemo(() => {
        if (!search.trim()) return options
        const q = search.toLowerCase()
        return options.filter(o =>
            o.label.toLowerCase().includes(q) ||
            o.value.toLowerCase().includes(q) ||
            o.category.toLowerCase().includes(q)
        )
    }, [search, options])

    // Group by category
    const grouped = useMemo(() => {
        const groups = {}
        filtered.forEach(o => {
            if (!groups[o.category]) groups[o.category] = []
            groups[o.category].push(o)
        })
        return groups
    }, [filtered])

    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false)
                setSearch('')
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const handleSelect = (opt) => {
        onChange(opt.value)
        setIsOpen(false)
        setSearch('')
    }

    return (
        <div ref={dropdownRef} className="relative" style={{ minWidth: 0, flex: '1 1 0' }}>
            <button
                onClick={() => {
                    setIsOpen(!isOpen)
                    setTimeout(() => inputRef.current?.focus(), 50)
                }}
                style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 8px',
                    background: 'rgba(139, 92, 246, 0.15)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '6px',
                    color: '#e2e8f0',
                    fontSize: '11px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}
                onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.6)'
                    e.currentTarget.style.background = 'rgba(139, 92, 246, 0.25)'
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)'
                    e.currentTarget.style.background = 'rgba(139, 92, 246, 0.15)'
                }}
            >
                <span style={{ fontSize: '13px', flexShrink: 0 }}>{icon}</span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {selectedOption?.label || placeholder}
                </span>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ flexShrink: 0, marginLeft: 'auto', transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
                    <path d="M2 3.5L5 6.5L8 3.5" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    marginTop: '4px',
                    width: '220px',
                    maxHeight: '280px',
                    background: '#1a1025',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '8px',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.6), 0 0 20px rgba(139, 92, 246, 0.1)',
                    zIndex: 100,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    backdropFilter: 'blur(12px)',
                }}>
                    {/* Search input */}
                    <div style={{ padding: '8px', borderBottom: '1px solid rgba(139, 92, 246, 0.15)' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: 'rgba(0,0,0,0.4)',
                            borderRadius: '6px',
                            padding: '5px 8px',
                            border: '1px solid rgba(139, 92, 246, 0.2)',
                        }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.35-4.35"></path>
                            </svg>
                            <input
                                ref={inputRef}
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder={`Search ${placeholder}...`}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    outline: 'none',
                                    color: '#e2e8f0',
                                    fontSize: '11px',
                                    width: '100%',
                                }}
                            />
                        </div>
                    </div>

                    {/* Options */}
                    <div style={{ overflowY: 'auto', flex: 1, padding: '4px' }}>
                        {Object.keys(grouped).length === 0 ? (
                            <div style={{ padding: '12px', textAlign: 'center', color: '#64748b', fontSize: '11px' }}>
                                No results found
                            </div>
                        ) : (
                            Object.entries(grouped).map(([category, items]) => (
                                <div key={category}>
                                    <div style={{
                                        padding: '4px 8px',
                                        fontSize: '9px',
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.08em',
                                        color: '#8b5cf6',
                                        marginTop: '4px',
                                    }}>
                                        {category}
                                    </div>
                                    {items.map(opt => (
                                        <button
                                            key={opt.value}
                                            onClick={() => handleSelect(opt)}
                                            style={{
                                                width: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                padding: '5px 8px',
                                                background: opt.value === value ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                                                border: 'none',
                                                borderRadius: '4px',
                                                color: opt.value === value ? '#c4b5fd' : '#cbd5e1',
                                                fontSize: '11px',
                                                cursor: 'pointer',
                                                textAlign: 'left',
                                                transition: 'background 0.15s',
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(139, 92, 246, 0.15)'}
                                            onMouseLeave={e => e.currentTarget.style.background = opt.value === value ? 'rgba(139, 92, 246, 0.2)' : 'transparent'}
                                        >
                                            {opt.value === value && (
                                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="3">
                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                </svg>
                                            )}
                                            <span>{opt.label}</span>
                                        </button>
                                    ))}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}


function TradingViewChart() {
    const containerRef = useRef(null)
    const [currencyPair, setCurrencyPair] = useState('FX:USDINR')
    const [metal, setMetal] = useState('CAPITALCOM:NICKEL')

    useEffect(() => {
        // Clear previous widget
        if (containerRef.current) {
            const widgetContainer = containerRef.current.querySelector('.tradingview-widget-container__widget')
            if (widgetContainer) {
                widgetContainer.innerHTML = ''
            }
        }

        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.async = true
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'

        const config = {
            "allow_symbol_change": true,
            "calendar": false,
            "details": false,
            "hide_side_toolbar": true,
            "hide_top_toolbar": false,
            "hide_legend": false,
            "hide_volume": true,
            "hotlist": false,
            "interval": "D",
            "locale": "en",
            "save_image": false,
            "style": "1",
            "symbol": currencyPair,
            "theme": "dark",
            "timezone": "Asia/Kolkata",
            "backgroundColor": "#000000",
            "gridColor": "rgba(242, 242, 242, 0.06)",
            "watchlist": [],
            "withdateranges": false,
            "compareSymbols": [
                {
                    "symbol": metal,
                    "position": "NewPriceScale",
                    "color": "#FF9800",
                    "lineWidth": 2
                }
            ],
            "studies": [],
            "autosize": true
        }

        script.textContent = JSON.stringify(config)

        if (containerRef.current) {
            const widgetContainer = containerRef.current.querySelector('.tradingview-widget-container__widget')
            if (widgetContainer) {
                widgetContainer.appendChild(script)
            }
        }

        return () => {
            if (script.parentNode) {
                script.parentNode.removeChild(script)
            }
        }
    }, [currencyPair, metal])

    return (
        <div className="w-full h-60 bg-black" style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Selectors bar */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 8px',
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(0,0,0,0.9))',
                borderBottom: '1px solid rgba(139, 92, 246, 0.15)',
                flexShrink: 0,
                zIndex: 20,
            }}>
                <SearchableDropdown
                    options={CURRENCY_PAIRS}
                    value={currencyPair}
                    onChange={setCurrencyPair}
                    placeholder="Currency Pair"
                    icon="💱"
                />
                <SearchableDropdown
                    options={METALS}
                    value={metal}
                    onChange={setMetal}
                    placeholder="Metal"
                    icon="⛏️"
                />
            </div>

            {/* Chart */}
            <div style={{ flex: 1, minHeight: 0 }} ref={containerRef}>
                <div className="tradingview-widget-container w-full h-full">
                    <div className="tradingview-widget-container__widget w-full h-full"></div>
                </div>
            </div>
        </div>
    )
}

export default TradingViewChart
