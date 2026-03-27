/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Radar, 
  Activity, 
  MessageSquare, 
  Ship, 
  Shield, 
  Settings, 
  Lock, 
  Radio, 
  Search, 
  Plus, 
  Minus, 
  Navigation, 
  AlertTriangle, 
  CheckCircle, 
  Cpu, 
  Wifi, 
  Clock, 
  Database,
  User,
  Fingerprint,
  TrendingUp,
  History,
  Archive,
  LogOut,
  Bell,
  Menu,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Vessel, 
  IntelAlert, 
  generateInitialVessels, 
  generateInitialAlerts, 
  updateVesselPositions 
} from './services/maritimeService';

type View = 'LIVE_MAP' | 'DATA_ANALYTICS' | 'COMMUNICATIONS' | 'FLEET_STATUS' | 'THREATS' | 'LOGISTICS' | 'TRENDS' | 'ARCHIVE';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('LIVE_MAP');
  const [vessels, setVessels] = useState<Vessel[]>(generateInitialVessels());
  const [alerts, setAlerts] = useState<IntelAlert[]>(generateInitialAlerts());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedVessel, setSelectedVessel] = useState<Vessel | null>(null);

  // Update time and vessel positions
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      setVessels(prev => updateVesselPositions(prev));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-GB', { hour12: false });
  };

  const stats = useMemo(() => {
    const flowRate = (vessels.length * 3.5).toFixed(1);
    const totalTraffic = 1024 + Math.floor(Math.random() * 10);
    const origins = vessels.reduce((acc, v) => {
      acc[v.origin] = (acc[v.origin] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return { flowRate, totalTraffic, origins };
  }, [vessels]);

  return (
    <div className="flex flex-col h-screen bg-background text-on-background font-sans select-none overflow-hidden">
      {/* TOP NAVIGATION BAR */}
      <header className="h-14 bg-surface border-b border-outline-variant/20 flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="text-xl font-headline font-black text-primary tracking-tighter drop-shadow-[0_0_2px_#ffd79b]">
              HORUMZ_C2_TACTICAL
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6 font-headline text-xs uppercase tracking-widest">
            <button 
              onClick={() => setCurrentView('LIVE_MAP')}
              className={`pb-1 transition-all ${currentView === 'LIVE_MAP' ? 'text-primary border-b-2 border-primary' : 'text-outline hover:text-primary'}`}
            >
              MONITOR_01
            </button>
            <button 
              onClick={() => setCurrentView('ARCHIVE')}
              className={`pb-1 transition-all ${currentView === 'ARCHIVE' ? 'text-primary border-b-2 border-primary' : 'text-outline hover:text-primary'}`}
            >
              ARCHIVE_LOGS
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-surface-container-high border border-outline-variant/20">
            <Radio className="w-3 h-3 text-secondary" />
            <span className="text-[10px] font-headline text-secondary tracking-widest uppercase">LINK_ESTABLISHED</span>
          </div>
          
          <div className="flex items-center gap-4 text-primary">
            <Lock className="w-4 h-4 cursor-pointer hover:animate-pulse" />
            <Settings className="w-4 h-4 cursor-pointer hover:animate-pulse" />
            <div className="ml-4 font-headline font-bold tracking-widest text-sm">
              MISSION_TIME_UTC {formatTime(currentTime)}
            </div>
            <div className="flex items-center gap-3 border-l border-outline-variant/30 pl-4">
              <div className="text-right">
                <p className="text-[10px] text-secondary-fixed font-headline uppercase">Operator ID</p>
                <p className="text-xs font-bold font-headline">7749-B</p>
              </div>
              <div className="w-10 h-10 bg-surface-container-highest border border-primary/30 flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* SIDE NAVIGATION BAR */}
        <aside className="w-64 bg-surface-container-low border-r border-outline-variant/20 flex flex-col z-40 grid-overlay">
          <div className="p-6 border-b border-outline-variant/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-surface-container-highest border border-primary/30 flex items-center justify-center">
                <Fingerprint className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-primary font-headline font-bold uppercase text-xs">STRATCOM_HORMUZ</div>
                <div className="text-[9px] font-headline text-secondary opacity-70 uppercase tracking-widest">SECTOR_04_ACTIVE</div>
              </div>
            </div>
          </div>

          <nav className="flex-1 py-4 flex flex-col gap-1">
            <NavItem 
              icon={<Radar className="w-4 h-4" />} 
              label="Live Map" 
              active={currentView === 'LIVE_MAP'} 
              onClick={() => setCurrentView('LIVE_MAP')} 
            />
            <NavItem 
              icon={<Activity className="w-4 h-4" />} 
              label="Data Analytics" 
              active={currentView === 'DATA_ANALYTICS'} 
              onClick={() => setCurrentView('DATA_ANALYTICS')} 
            />
            <NavItem 
              icon={<MessageSquare className="w-4 h-4" />} 
              label="Communications" 
              active={currentView === 'COMMUNICATIONS'} 
              onClick={() => setCurrentView('COMMUNICATIONS')} 
            />
            <NavItem 
              icon={<Ship className="w-4 h-4" />} 
              label="Fleet Status" 
              active={currentView === 'FLEET_STATUS'} 
              onClick={() => setCurrentView('FLEET_STATUS')} 
            />
            <div className="mt-4 px-3 mb-2 opacity-40 text-[10px] font-headline tracking-[0.2em] text-outline uppercase">TACTICAL OVERLAY</div>
            <NavItem 
              icon={<Shield className="w-4 h-4" />} 
              label="Threats" 
              active={currentView === 'THREATS'} 
              onClick={() => setCurrentView('THREATS')} 
            />
            <NavItem 
              icon={<TrendingUp className="w-4 h-4" />} 
              label="Trends" 
              active={currentView === 'TRENDS'} 
              onClick={() => setCurrentView('TRENDS')} 
            />
          </nav>

          <div className="p-4 mt-auto border-t border-outline-variant/10 flex flex-col gap-2">
            <button className="flex items-center gap-3 px-4 py-2 text-outline hover:text-secondary-fixed transition-colors font-headline font-bold text-[10px] uppercase">
              <Cpu className="w-3 h-3" />
              <span>SYSTEM_HEALTH</span>
            </button>
            <button className="w-full bg-primary-container text-on-primary-container py-3 font-headline font-bold uppercase text-xs tracking-widest border-t border-primary flicker-effect active:scale-[0.98] active:brightness-125">
              INITIATE_COMMS
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {currentView === 'LIVE_MAP' && (
              <motion.div 
                key="live-map"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full grid grid-cols-12 gap-6 p-6"
              >
                {/* LEFT PANEL: STATS */}
                <div className="col-span-3 flex flex-col gap-6 h-full overflow-y-auto pr-2 custom-scrollbar">
                  <div className="bg-surface-container-low p-5 border-l-2 border-secondary relative overflow-hidden">
                    <div className="scanner-line opacity-10"></div>
                    <div className="text-[10px] font-headline text-secondary mb-1 uppercase tracking-widest">REAL_TIME_FLOW_RATE</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-headline font-black">{stats.flowRate}</span>
                      <span className="text-xs font-headline text-outline uppercase">VESSELS / HR</span>
                    </div>
                    <div className="mt-4 flex gap-1 h-1">
                      <div className="flex-1 bg-secondary"></div>
                      <div className="flex-1 bg-secondary"></div>
                      <div className="flex-1 bg-secondary"></div>
                      <div className="flex-1 bg-secondary/30"></div>
                      <div className="flex-1 bg-secondary/10"></div>
                    </div>
                  </div>

                  <div className="bg-surface-container-low p-5 border-l-2 border-primary relative">
                    <div className="text-[10px] font-headline text-primary mb-1 uppercase tracking-widest">TOTAL_TRAFFIC_24H</div>
                    <div className="text-4xl font-headline font-black">{stats.totalTraffic.toLocaleString()}</div>
                    <div className="mt-2 text-[10px] font-mono text-outline uppercase tracking-widest">Awaiting local AIS update...</div>
                  </div>

                  <div className="bg-surface-container-low p-5 border-l-2 border-outline-variant flex-1 flex flex-col">
                    <div className="text-[10px] font-headline text-outline mb-4 uppercase tracking-widest">TANKER_ORIGIN_MATRIX</div>
                    <div className="space-y-4 flex-1">
                      {Object.entries(stats.origins).map(([origin, count]) => (
                        <div key={origin} className="space-y-1">
                          <div className="flex justify-between text-[11px] font-headline">
                            <span className="text-on-surface uppercase">{origin}</span>
                            <span className="text-secondary">{count as number}</span>
                          </div>
                          <div className="w-full bg-surface-container-highest h-1.5">
                            <div className="bg-primary h-full" style={{ width: `${((count as number) / vessels.length) * 100}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 pt-6 border-t border-outline-variant/20">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
                        <span className="text-[10px] font-headline text-error uppercase font-bold tracking-widest">THREAT_LEVEL: ELEVATED</span>
                      </div>
                      <p className="text-[10px] leading-relaxed text-outline font-sans">
                        AIS anomalies detected in Sector 04. Naval patrol dispatched for visual verification.
                      </p>
                    </div>
                  </div>
                </div>

                {/* CENTER PANEL: RADAR MAP */}
                <div className="col-span-6 bg-surface-container-lowest relative border border-outline-variant/20 overflow-hidden">
                  <div className="absolute inset-0 grid-overlay opacity-30"></div>
                  <div className="absolute inset-0 opacity-100">
                    <img 
                      className="w-full h-full object-cover filter contrast-110 brightness-110" 
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Strait_of_Hormuz_map.png/1200px-Strait_of_Hormuz_map.png" 
                      alt="Strait of Hormuz Map"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  
                  {/* HUD OVERLAY */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-secondary/10 rounded-full"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-secondary/10 rounded-full"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-full h-[1px] bg-secondary/10"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-y-1/2 w-[1px] h-full bg-secondary/10"></div>
                    <div className="scanner-line opacity-20"></div>

                    {/* VESSEL MARKERS */}
                    {vessels.map(v => (
                      <div 
                        key={v.id}
                        className="absolute pointer-events-auto cursor-crosshair group"
                        style={{ 
                          top: `${(((v.lat as number) - 26.25) / 0.5) * 100}%`, 
                          left: `${(((v.lng as number) - 56.15) / 0.5) * 100}%` 
                        }}
                        onClick={() => setSelectedVessel(v)}
                      >
                        <div className="relative">
                          <Ship className={`w-4 h-4 ${v.type === 'NAVY' ? 'text-error' : v.type === 'OIL TANKER' ? 'text-primary' : 'text-secondary'}`} />
                          {v.type === 'NAVY' && <div className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full animate-ping"></div>}
                          
                          {/* TOOLTIP */}
                          <div className="absolute top-4 left-4 bg-surface-container-highest/90 p-2 border border-outline-variant/40 backdrop-blur-md hidden group-hover:block min-w-[140px] z-50">
                            <div className={`text-[10px] font-headline font-black mb-1 ${v.type === 'NAVY' ? 'text-error' : 'text-primary'}`}>{v.name}</div>
                            <div className="grid grid-cols-2 gap-x-2 text-[8px] text-outline font-mono">
                              <span>TYPE:</span><span className="text-on-surface">{v.type}</span>
                              <span>SPD:</span><span className="text-on-surface">{v.speed} KTS</span>
                              <span>HDG:</span><span className="text-on-surface">{v.heading}°</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* MAP UI OVERLAYS */}
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    <button className="bg-surface-container-high/80 p-2 border border-outline-variant/30 text-on-surface hover:bg-surface-bright transition-colors">
                      <Plus className="w-3 h-3" />
                    </button>
                    <button className="bg-surface-container-high/80 p-2 border border-outline-variant/30 text-on-surface hover:bg-surface-bright transition-colors">
                      <Minus className="w-3 h-3" />
                    </button>
                    <button className="bg-surface-container-high/80 p-2 border border-outline-variant/30 text-on-surface hover:bg-surface-bright transition-colors">
                      <Navigation className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <div className="bg-surface-container-high/80 px-3 py-1.5 border border-outline-variant/30 backdrop-blur-sm">
                      <div className="text-[8px] font-headline text-outline uppercase mb-0.5 tracking-widest">COORD_SYSTEM</div>
                      <div className="text-[10px] font-mono text-secondary">WGS84_RADIAL</div>
                    </div>
                    <div className="bg-surface-container-high/80 px-3 py-1.5 border border-outline-variant/30 backdrop-blur-sm">
                      <div className="text-[8px] font-headline text-outline uppercase mb-0.5 tracking-widest">MAP_LAYERS</div>
                      <div className="flex gap-2 mt-1">
                        <div className="w-2 h-2 bg-primary"></div>
                        <div className="w-2 h-2 bg-secondary"></div>
                        <div className="w-2 h-2 border border-outline"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT PANEL: INTEL FEED */}
                <div className="col-span-3 flex flex-col gap-6">
                  <div className="bg-surface-container-low p-5 border-l-2 border-primary-container h-1/2 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-[10px] font-headline text-primary uppercase tracking-widest">INTEL_FEED_SIGINT</div>
                      <span className="text-[8px] font-mono text-outline animate-pulse">LIVE</span>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2">
                      {alerts.map(alert => (
                        <div key={alert.id} className="group border-b border-outline-variant/10 pb-3">
                          <div className={`text-[9px] font-mono mb-1 ${alert.level === 'CRITICAL' ? 'text-error' : 'text-secondary'}`}>
                            {alert.timestamp} // {alert.sector}
                          </div>
                          <p className={`text-[11px] leading-tight font-sans ${alert.level === 'CRITICAL' ? 'text-error' : 'text-on-surface'}`}>
                            {alert.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-surface-container-low p-5 border-l-2 border-outline-variant h-1/2 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] font-headline text-outline mb-4 uppercase tracking-widest">SYSTEM_DIAGNOSTICS</div>
                      <div className="grid grid-cols-2 gap-4">
                        <DiagItem label="CPU_LOAD" value="31%" color="text-secondary" />
                        <DiagItem label="NET_LATENCY" value="14MS" color="text-secondary" />
                        <DiagItem label="UPTIME" value="144:12:01" color="text-on-surface" />
                        <DiagItem label="STORAGE" value="92%" color="text-on-surface" />
                      </div>
                    </div>
                    <div className="bg-surface-container-highest p-3 border border-outline-variant/20">
                      <div className="text-[8px] font-headline text-primary uppercase mb-2 tracking-widest">QUICK_ACTIONS</div>
                      <div className="grid grid-cols-2 gap-2">
                        <button className="bg-background text-[9px] font-bold text-primary py-1.5 border border-primary/20 hover:bg-primary/10 uppercase tracking-widest">RESET_AIS</button>
                        <button className="bg-background text-[9px] font-bold text-error py-1.5 border border-error/20 hover:bg-error/10 uppercase tracking-widest">PURGE_LOGS</button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentView === 'FLEET_STATUS' && (
              <motion.div 
                key="fleet-status"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full p-8 overflow-y-auto custom-scrollbar"
              >
                <div className="max-w-6xl mx-auto">
                  <div className="flex justify-between items-end mb-8">
                    <div>
                      <h2 className="text-3xl font-headline font-black tracking-tighter uppercase">STR_HORMUZ_FLEET_STATUS</h2>
                      <p className="text-secondary-fixed text-xs font-headline tracking-widest uppercase">REAL-TIME_VESSEL_TRACKING_SYS_v4.2</p>
                    </div>
                    <div className="relative">
                      <input 
                        className="bg-surface-container-low border-b border-outline-variant px-4 py-2 text-xs font-headline w-64 focus:ring-0 focus:border-secondary transition-colors text-on-surface placeholder:text-outline/50 uppercase" 
                        placeholder="SEARCH_BY_IMO_OR_NAME..." 
                        type="text"
                      />
                      <Search className="absolute right-2 top-2 w-4 h-4 text-outline" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-12 px-4 py-2 bg-surface-container-highest border-l-4 border-outline text-[10px] font-headline text-outline tracking-[0.2em] uppercase">
                      <div className="col-span-4">Vessel Identifier</div>
                      <div className="col-span-2">Registry</div>
                      <div className="col-span-2">Cargo</div>
                      <div className="col-span-2">Kinematics</div>
                      <div className="col-span-2">Status</div>
                    </div>

                    {vessels.map(v => (
                      <div 
                        key={v.id}
                        className={`grid grid-cols-12 items-center p-4 bg-surface-container-high border-l-4 transition-all cursor-pointer group ${selectedVessel?.id === v.id ? 'border-secondary shadow-[0_0_15px_rgba(121,255,91,0.05)]' : 'border-outline-variant/40 hover:bg-surface-container-highest'}`}
                        onClick={() => setSelectedVessel(v)}
                      >
                        <div className="col-span-4 flex items-center gap-4">
                          <Ship className={`w-5 h-5 ${v.type === 'NAVY' ? 'text-error' : 'text-secondary'}`} />
                          <div>
                            <div className="text-primary font-headline font-bold text-lg tracking-tight uppercase">{v.name}</div>
                            <div className="text-[10px] font-headline text-outline uppercase tracking-wider">IMO: {v.imo} | MMSI: {v.mmsi}</div>
                          </div>
                        </div>
                        <div className="col-span-2">
                          <div className="text-on-surface font-headline text-xs uppercase">{v.origin}</div>
                          <div className="text-[9px] font-headline text-outline uppercase">PORT: {v.origin.split(' ')[0]}</div>
                        </div>
                        <div className="col-span-2">
                          <span className="bg-surface-container-lowest px-2 py-0.5 border border-outline-variant text-[10px] font-headline text-secondary tracking-tighter uppercase">
                            {v.type === 'OIL TANKER' ? 'CRUDE OIL' : v.type === 'GAS' ? 'LNG' : 'GENERAL'}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <div className="text-on-surface font-headline text-xs">{v.speed} KTS / {v.heading}°</div>
                          <div className="text-[9px] font-headline text-outline uppercase">ETA: {v.destination}</div>
                        </div>
                        <div className="col-span-2 flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${v.status === 'CRUISING' ? 'bg-secondary-fixed animate-pulse' : 'bg-outline/40'}`}></div>
                          <span className={`${v.status === 'CRUISING' ? 'text-secondary-fixed' : 'text-outline'} text-[10px] font-headline font-bold uppercase tracking-widest`}>
                            {v.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {currentView === 'TRENDS' && (
              <motion.div 
                key="trends"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full p-8 overflow-y-auto custom-scrollbar"
              >
                <div className="max-w-6xl mx-auto">
                  <div className="flex justify-between items-end mb-12 border-b border-outline-variant/20 pb-4">
                    <div>
                      <h1 className="text-4xl font-headline font-black tracking-tighter text-on-surface uppercase mb-1">Historical Trend Analysis</h1>
                      <div className="flex gap-4 text-[10px] font-headline uppercase tracking-widest text-outline">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-secondary-fixed"></span> AREA: STRAIT OF HORMUZ</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-primary"></span> PERIOD: 12 MONTH RECAP</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-error"></span> CLASSIFICATION: TOP SECRET</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-8 bg-surface-container-low hud-border p-6 min-h-[400px]">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <p className="text-[10px] font-headline text-secondary-fixed mb-1 uppercase tracking-widest">Metric: [V_FLOW_RATE]</p>
                          <h2 className="text-xl font-headline font-bold uppercase tracking-tight">Vessel Flow Rate (12M)</h2>
                        </div>
                      </div>
                      <div className="h-64 w-full bg-surface-container-highest/20 relative mt-8">
                        <div className="absolute inset-0 grid-overlay opacity-10"></div>
                        <svg className="w-full h-full" viewBox="0 0 1000 100" preserveAspectRatio="none">
                          <polyline 
                            fill="none" 
                            stroke="#79ff5b" 
                            strokeWidth="2" 
                            points="0,80 100,75 200,85 300,60 400,40 500,45 600,30 700,55 800,20 900,25 1000,10" 
                          />
                        </svg>
                        <div className="absolute bottom-[-20px] left-0 right-0 flex justify-between text-[8px] font-headline text-outline uppercase">
                          <span>AUG 23</span><span>OCT 23</span><span>DEC 23</span><span>FEB 24</span><span>APR 24</span><span>JUN 24</span>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-4 bg-surface-container-low hud-border p-6 flex flex-col justify-between">
                      <h2 className="text-xl font-headline font-bold uppercase tracking-tight">Cargo Distribution</h2>
                      <div className="relative w-48 h-48 mx-auto my-8">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" r="16" fill="none" stroke="#282a2d" strokeWidth="4" />
                          <circle cx="18" cy="18" r="16" fill="none" stroke="#ffb300" strokeWidth="4" strokeDasharray="65 100" />
                          <circle cx="18" cy="18" r="16" fill="none" stroke="#79ff5b" strokeWidth="4" strokeDasharray="20 100" strokeDashoffset="-65" />
                          <circle cx="18" cy="18" r="16" fill="none" stroke="#ffb4ab" strokeWidth="4" strokeDasharray="15 100" strokeDashoffset="-85" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                          <span className="text-2xl font-headline font-bold text-on-surface">34.8M</span>
                          <span className="text-[8px] font-headline text-outline uppercase tracking-widest">Total Barrels/Day</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <LegendItem color="bg-primary" label="Crude Oil" value="65%" />
                        <LegendItem color="bg-secondary-fixed" label="LNG" value="20%" />
                        <LegendItem color="bg-error" label="Refined Fuel" value="15%" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* FOOTER TICKER */}
      <footer className="h-8 bg-surface border-t border-outline-variant/40 flex items-center px-4 overflow-hidden z-50">
        <div className="flex items-center gap-12 font-mono text-[10px] tracking-widest uppercase text-secondary-fixed animate-[ticker_30s_linear_infinite] whitespace-nowrap">
          <TickerItem icon={<CheckCircle className="w-3 h-3" />} text="SYSTEM_HEALTH_98%" />
          <TickerItem icon={<Lock className="w-3 h-3" />} text="ENCRYPTION_LAYER_7_ACTIVE" />
          <TickerItem icon={<Wifi className="w-3 h-3" />} text="SATELLITE_LINK_ESTABLISHED" />
          <TickerItem icon={<Bell className="w-3 h-3" />} text="PRIORITY_ALERT: SECTOR_04_CONGESTION" />
          <TickerItem icon={<Activity className="w-3 h-3" />} text="MARITIME_INTEL_TICKER_V4.2" />
          {/* Repeat for loop */}
          <TickerItem icon={<CheckCircle className="w-3 h-3" />} text="SYSTEM_HEALTH_98%" />
          <TickerItem icon={<Lock className="w-3 h-3" />} text="ENCRYPTION_LAYER_7_ACTIVE" />
        </div>
      </footer>

      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-4 px-6 py-3 transition-all font-headline font-bold uppercase text-[12px] ${active ? 'bg-surface-container-high text-primary border-l-4 border-secondary-fixed shadow-[0_0_8px_rgba(121,255,91,0.3)]' : 'text-outline opacity-70 hover:bg-surface-container-highest hover:opacity-100'}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function DiagItem({ label, value, color }: { label: string, value: string, color: string }) {
  return (
    <div className="space-y-1">
      <div className="text-[9px] text-outline uppercase tracking-widest">{label}</div>
      <div className={`text-lg font-headline font-bold ${color}`}>{value}</div>
    </div>
  );
}

function LegendItem({ color, label, value }: { color: string, label: string, value: string }) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span className={`w-2 h-4 ${color}`}></span>
        <span className="text-[10px] font-headline uppercase tracking-widest">{label}</span>
      </div>
      <span className="font-headline text-sm font-bold">{value}</span>
    </div>
  );
}

function TickerItem({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <span>{text}</span>
    </div>
  );
}
