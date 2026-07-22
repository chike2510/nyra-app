import { useState, useEffect, useRef, useCallback } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import {
  Home, MessageSquare, Shield, Bell, Send, Check, X, Plus, Zap,
  AlertTriangle, ChevronRight, Eye, EyeOff, Activity, BarChart2,
  Settings, User, Rocket, CheckCircle, XCircle, ArrowRight, Pause,
  Play, Globe, Smartphone, Copy, MoreHorizontal, Search, Menu,
  CreditCard, TrendingUp, ArrowUpRight, ArrowDownLeft, LogOut,
  RefreshCw, Lock, ChevronDown, Filter
} from "lucide-react";

const sleep = ms => new Promise(r => setTimeout(r, ms));

/* ── CSS ─────────────────────────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#0A0A0A;
  --s1:#111111;
  --s2:#161616;
  --s3:#1E1E1E;
  --accent:#A8E63D;
  --accent-dim:rgba(168,230,61,0.08);
  --accent-glow:rgba(168,230,61,0.3);
  --t1:#F0F0F0;
  --t2:#666666;
  --t3:#3A3A3A;
  --err:#FF4444;
  --err-dim:rgba(255,68,68,0.1);
  --warn:#F59E0B;
  --border:rgba(255,255,255,0.07);
  --border-h:rgba(255,255,255,0.12);
  --sidebar:220px;
  --dur:200ms;
  --ease:cubic-bezier(0.22,1,0.36,1);
}
body{font-family:'Inter',sans-serif;background:var(--bg);color:var(--t1);-webkit-font-smoothing:antialiased;min-height:100vh}
::selection{background:var(--accent);color:#000}
*::-webkit-scrollbar{width:4px;height:4px}
*::-webkit-scrollbar-track{background:transparent}
*::-webkit-scrollbar-thumb{background:var(--s3);border-radius:4px}
scrollbar-width:thin;scrollbar-color:var(--s3) transparent;

/* ── App shell ── */
.app-shell{display:flex;min-height:100vh;background:var(--bg)}
.sidebar{
  width:var(--sidebar);min-height:100vh;background:var(--s1);
  border-right:1px solid var(--border);
  display:flex;flex-direction:column;padding:24px 12px;
  position:fixed;top:0;left:0;bottom:0;z-index:50;
  flex-shrink:0;
}
.main-area{margin-left:var(--sidebar);flex:1;display:flex;flex-direction:column;min-height:100vh}

/* ── Sidebar ── */
.sb-logo{display:flex;align-items:center;gap:10px;padding:0 8px;margin-bottom:32px}
.sb-wordmark{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:20px;color:var(--t1);letter-spacing:-0.02em}
.sb-nav{display:flex;flex-direction:column;gap:2px;flex:1}
.sb-item{
  display:flex;align-items:center;gap:10px;padding:9px 10px;
  border-radius:8px;cursor:pointer;border:none;background:transparent;
  color:var(--t2);font-family:'Inter',sans-serif;font-size:13px;font-weight:500;
  width:100%;text-align:left;transition:all var(--dur) var(--ease);
}
.sb-item:hover{background:rgba(255,255,255,0.04);color:var(--t1)}
.sb-item.on{background:var(--accent-dim);color:var(--accent)}
.sb-item.on svg{stroke:var(--accent)}
.sb-section{font-size:10px;font-weight:600;color:var(--t3);letter-spacing:0.1em;text-transform:uppercase;padding:16px 10px 6px}
.sb-footer{border-top:1px solid var(--border);padding-top:16px;margin-top:8px}
.sb-status{padding:12px 10px;background:var(--s2);border-radius:10px;border:1px solid var(--border)}
.sb-status-label{font-size:10px;font-weight:600;color:var(--t3);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px}
.sb-status-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px}
.sb-status-text{font-size:13px;font-weight:600;color:var(--accent)}
.sb-status-desc{font-size:11px;color:var(--t2);line-height:1.5}

/* ── Toggle ── */
.tog{position:relative;width:36px;height:20px;cursor:pointer;flex-shrink:0}
.tog input{opacity:0;width:0;height:0;position:absolute}
.tsl{position:absolute;inset:0;background:var(--s3);border-radius:10px;transition:background var(--dur)}
.tog input:checked+.tsl{background:var(--accent)}
.tsl::before{content:'';position:absolute;width:14px;height:14px;left:3px;top:3px;background:#000;border-radius:50%;transition:transform var(--dur) var(--ease)}
.tog input:checked+.tsl::before{transform:translateX(16px)}

/* ── Top bar ── */
.topbar{
  padding:20px 28px;display:flex;align-items:center;justify-content:space-between;
  border-bottom:1px solid var(--border);background:var(--bg);
  position:sticky;top:0;z-index:40;
}
.topbar-left h1{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:18px;color:var(--t1);letter-spacing:-0.02em}
.topbar-left p{font-size:12px;color:var(--t2);margin-top:2px}
.topbar-right{display:flex;align-items:center;gap:10px}
.tb-badge{
  display:flex;align-items:center;gap:6px;padding:6px 12px;
  background:var(--accent-dim);border:1px solid rgba(168,230,61,0.2);
  border-radius:20px;font-size:11px;font-weight:600;color:var(--accent);
}
.ico-btn{
  width:36px;height:36px;border-radius:8px;background:var(--s2);
  border:1px solid var(--border);display:flex;align-items:center;
  justify-content:center;cursor:pointer;color:var(--t2);
  transition:all var(--dur);position:relative;
}
.ico-btn:hover{border-color:var(--border-h);color:var(--t1)}
.ico-btn .dot{position:absolute;top:6px;right:6px;width:6px;height:6px;border-radius:50%;background:var(--accent);border:1.5px solid var(--s1)}
.avatar{width:36px;height:36px;border-radius:8px;background:linear-gradient(135deg,#2A4A1A,var(--accent));display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#000;cursor:pointer;flex-shrink:0}

/* ── Page layout ── */
.page{padding:28px;flex:1;overflow-y:auto}
.page-row{display:flex;gap:20px;align-items:flex-start}
.page-main{flex:1;min-width:0}
.page-right{width:280px;flex-shrink:0}

/* ── Cards ── */
.card{background:var(--s2);border:1px solid var(--border);border-radius:14px;padding:20px;transition:border-color var(--dur)}
.card:hover{border-color:var(--border-h)}
.card-sm{background:var(--s2);border:1px solid var(--border);border-radius:10px;padding:14px}
.card-dark{background:var(--s1);border:1px solid var(--border);border-radius:14px;padding:20px}

/* ── Stats row ── */
.stats-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:20px}
.stat-card{background:var(--s2);border:1px solid var(--border);border-radius:14px;padding:20px;transition:border-color var(--dur)}
.stat-card:hover{border-color:var(--border-h)}
.stat-label{font-size:11px;font-weight:600;color:var(--t2);text-transform:uppercase;letter-spacing:0.07em;margin-bottom:10px}
.stat-value{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:24px;color:var(--t1);letter-spacing:-0.03em;margin-bottom:6px}
.stat-mono{font-family:'JetBrains Mono',monospace;font-weight:600}
.stat-sub{font-size:11px;color:var(--t2)}
.prog{height:3px;background:var(--s3);border-radius:3px;overflow:hidden;margin-top:8px}
.prog-fill{height:100%;background:var(--accent);border-radius:3px;transition:width 0.8s var(--ease)}

/* ── Tx table ── */
.tx-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
.tx-list{display:flex;flex-direction:column;gap:1px}
.tx-row{
  display:grid;grid-template-columns:auto 1fr auto auto auto;
  align-items:center;gap:14px;
  padding:13px 16px;background:var(--s2);border-radius:10px;
  cursor:pointer;transition:background var(--dur);
  margin-bottom:2px;border:1px solid transparent;
}
.tx-row:hover{background:var(--s3);border-color:var(--border)}
.tx-ico{width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex-shrink:0}
.tx-name{font-size:14px;font-weight:600;color:var(--t1)}
.tx-cat{font-size:11px;color:var(--t2);margin-top:1px}
.tx-time{font-size:11px;color:var(--t3);white-space:nowrap}
.tx-amt{font-family:'JetBrains Mono',monospace;font-size:14px;font-weight:600;color:var(--t1);text-align:right;white-space:nowrap}
.tx-reason{font-size:10px;color:var(--err);margin-top:2px;text-align:right}

/* ── Status chips ── */
.chip{display:inline-flex;align-items:center;gap:4px;border-radius:20px;font-size:11px;font-weight:600;padding:3px 9px;white-space:nowrap;letter-spacing:0.02em}
.chip-ok{background:rgba(168,230,61,0.1);color:var(--accent);border:1px solid rgba(168,230,61,0.2)}
.chip-err{background:var(--err-dim);color:var(--err);border:1px solid rgba(255,68,68,0.2)}
.chip-warn{background:rgba(245,158,11,0.1);color:var(--warn);border:1px solid rgba(245,158,11,0.2)}
.chip-muted{background:var(--s3);color:var(--t2);border:1px solid var(--border)}

/* ── Buttons ── */
.btn{
  border:none;border-radius:8px;font-family:'Inter',sans-serif;
  font-weight:600;font-size:14px;cursor:pointer;
  display:inline-flex;align-items:center;gap:8px;
  transition:all 100ms;padding:10px 18px;
}
.btn:active{transform:scale(0.97)}
.btn-accent{background:var(--accent);color:#000}
.btn-accent:hover{background:#B8F040;box-shadow:0 0 20px var(--accent-glow)}
.btn-ghost{background:var(--s3);color:var(--t2);border:1px solid var(--border)}
.btn-ghost:hover{border-color:var(--border-h);color:var(--t1)}
.btn-outline{background:transparent;color:var(--accent);border:1px solid rgba(168,230,61,0.3)}
.btn-outline:hover{background:var(--accent-dim)}
.btn-danger{background:var(--err-dim);color:var(--err);border:1px solid rgba(255,68,68,0.2)}
.btn-full{width:100%;justify-content:center}
.btn-lg{padding:13px 24px;font-size:15px;border-radius:10px}
.btn-sm{padding:6px 12px;font-size:12px;border-radius:6px}
.btn:disabled{opacity:0.4;cursor:not-allowed;transform:none}

/* ── Inputs ── */
.inp-wrap{display:flex;flex-direction:column;gap:6px}
.inp-label{font-size:11px;font-weight:600;color:var(--t2);text-transform:uppercase;letter-spacing:0.07em}
.inp{
  background:var(--s3);border:1px solid var(--border);border-radius:8px;
  color:var(--t1);font-family:'Inter',sans-serif;font-size:14px;
  padding:11px 14px;outline:none;width:100%;
  transition:border-color var(--dur),box-shadow var(--dur);
}
.inp:focus{border-color:rgba(168,230,61,0.4);box-shadow:0 0 0 3px rgba(168,230,61,0.08)}
.inp::placeholder{color:var(--t3)}

/* ── Ask Nyra panel ── */
.ask-panel{display:flex;flex-direction:column;gap:12px}
.ask-input-row{display:flex;flex-direction:column;gap:8px}
.ask-textarea{
  background:var(--s3);border:1px solid var(--border);border-radius:10px;
  color:var(--t1);font-family:'Inter',sans-serif;font-size:13px;
  padding:12px 14px;outline:none;resize:none;width:100%;
  transition:border-color var(--dur);line-height:1.5;min-height:72px;
}
.ask-textarea:focus{border-color:rgba(168,230,61,0.4)}
.ask-textarea::placeholder{color:var(--t3)}
.ask-btn{background:var(--accent);color:#000;border:none;border-radius:8px;padding:10px 16px;font-family:'Inter',sans-serif;font-weight:700;font-size:13px;cursor:pointer;width:100%;transition:all 100ms;display:flex;align-items:center;justify-content:center;gap:6px}
.ask-btn:hover{background:#B8F040;box-shadow:0 0 16px var(--accent-glow)}
.ask-btn:disabled{opacity:0.4;cursor:not-allowed}

/* ── Quick actions ── */
.qa-item{
  display:flex;align-items:center;gap:10px;padding:10px 12px;
  background:var(--s3);border-radius:8px;cursor:pointer;
  border:1px solid var(--border);transition:all var(--dur);
  font-size:13px;font-weight:500;color:var(--t1);
}
.qa-item:hover{border-color:var(--border-h);background:var(--s2)}
.qa-ico{width:30px;height:30px;border-radius:6px;background:var(--s2);display:flex;align-items:center;justify-content:center;flex-shrink:0}

/* ── Chat (Ask Nyra full screen) ── */
.chat-page{display:flex;flex-direction:column;height:calc(100vh - 77px)}
.chat-msgs{flex:1;overflow-y:auto;padding:24px 28px;display:flex;flex-direction:column;gap:16px}
.bub-me{background:var(--accent);color:#000;border-radius:16px 16px 4px 16px;padding:11px 16px;max-width:72%;font-size:13px;font-weight:500;line-height:1.6;align-self:flex-end}
.bub-nyra{background:var(--s2);border:1px solid var(--border);color:var(--t1);border-radius:16px 16px 16px 4px;padding:12px 16px;max-width:78%;font-size:13px;line-height:1.6;align-self:flex-start}
.chat-bar{padding:16px 28px;border-top:1px solid var(--border);background:var(--bg);display:flex;gap:10px;align-items:flex-end}
.chat-inp{flex:1;background:var(--s2);border:1px solid var(--border);border-radius:10px;color:var(--t1);font-family:'Inter',sans-serif;font-size:14px;padding:12px 16px;outline:none;resize:none;line-height:1.4;max-height:100px;transition:border-color var(--dur)}
.chat-inp:focus{border-color:rgba(168,230,61,0.4)}
.chat-inp::placeholder{color:var(--t3)}
.chat-send{width:42px;height:42px;border-radius:8px;background:var(--accent);border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;transition:all 100ms}
.chat-send:hover{background:#B8F040;box-shadow:0 0 12px var(--accent-glow)}
.chat-send:disabled{opacity:0.3;cursor:not-allowed}
@keyframes tdot{0%,80%,100%{transform:scale(0.7);opacity:0.3}40%{transform:scale(1.1);opacity:1}}
.tdot{width:5px;height:5px;border-radius:50%;background:var(--t2);display:inline-block;animation:tdot 1.2s ease-in-out infinite}

/* ── Pipeline ── */
.pipeline{background:var(--s1);border:1px solid rgba(168,230,61,0.12);border-radius:10px;overflow:hidden;max-width:80%;align-self:flex-start}
.pip-head{padding:8px 12px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:6px;font-size:10px;font-weight:700;color:var(--t3);letter-spacing:0.08em;text-transform:uppercase}
.pip-step{display:flex;gap:9px;padding:8px 12px;border-bottom:1px solid var(--border);transition:background var(--dur)}
.pip-step:last-child{border-bottom:none}
.pip-step.running{background:var(--accent-dim)}
.pdot{width:6px;height:6px;border-radius:50%;flex-shrink:0;margin-top:5px;transition:background var(--dur)}
.pdot.done{background:var(--accent)}
.pdot.running{background:var(--accent);animation:tdot 0.9s infinite}
.pdot.pending{background:var(--t3)}
.pdot.failed{background:var(--err)}
.plabel{font-size:12px;font-weight:600;color:var(--t1)}
.pdetail{font-size:11px;color:var(--t2);margin-top:2px;line-height:1.5}

/* ── Policy rows ── */
.pol-row{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid var(--border)}
.pol-row:last-child{border-bottom:none}
.pol-title{font-size:14px;font-weight:600;color:var(--t1)}
.pol-sub{font-size:11px;color:var(--t2);margin-top:2px}
.pchip{display:inline-flex;align-items:center;gap:5px;background:var(--accent-dim);border:1px solid rgba(168,230,61,0.2);color:var(--accent);border-radius:20px;padding:4px 10px;font-size:11px;font-weight:600}
.pchip button{background:transparent;border:none;cursor:pointer;color:var(--accent);opacity:0.5;padding:0;display:flex;transition:opacity var(--dur)}
.pchip button:hover{opacity:1}

/* ── Animations ── */
@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes breathe{0%,100%{box-shadow:0 0 0 0 var(--accent-glow)}50%{box-shadow:0 0 0 8px rgba(168,230,61,0)}}
@keyframes glowPulse{0%,100%{opacity:1;filter:drop-shadow(0 0 4px var(--accent))}50%{opacity:0.7;filter:drop-shadow(0 0 10px var(--accent))}}
.fa{animation:fadeUp 0.22s var(--ease) both}

/* ── Landing ── */
.landing{min-height:100vh;background:var(--bg);display:flex;flex-direction:column}
.land-nav{padding:24px 48px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--border)}
.land-hero{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:64px 24px;position:relative;overflow:hidden}
.land-hero::before{content:'';position:absolute;top:-200px;left:50%;transform:translateX(-50%);width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,rgba(168,230,61,0.06) 0%,transparent 70%);pointer-events:none}
.land-tagline{font-size:11px;font-weight:600;color:var(--accent);letter-spacing:0.15em;text-transform:uppercase;margin-bottom:20px}
.land-h{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:clamp(42px,6vw,72px);color:var(--t1);line-height:1.05;letter-spacing:-0.04em;margin-bottom:20px}
.land-h .dim{color:var(--t2)}
.land-sub{font-size:16px;color:var(--t2);line-height:1.75;max-width:480px;margin-bottom:40px}
.land-btns{display:flex;gap:12px;justify-content:center;margin-bottom:80px}
.land-preview{width:100%;max-width:900px;background:var(--s1);border:1px solid var(--border);border-radius:20px;overflow:hidden;box-shadow:0 40px 100px rgba(0,0,0,0.6)}
.prev-bar{padding:12px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:8px}
.prev-dot{width:10px;height:10px;border-radius:50%;background:var(--s3)}
.prev-dot:nth-child(1){background:#FF5F56}
.prev-dot:nth-child(2){background:#FFBD2E}
.prev-dot:nth-child(3){background:#27C93F}
.prev-content{display:grid;grid-template-columns:180px 1fr;min-height:380px}
.prev-sidebar{background:var(--s1);border-right:1px solid var(--border);padding:16px 10px;display:flex;flex-direction:column;gap:4px}
.prev-main{padding:20px;display:flex;flex-direction:column;gap:14px}
.prev-nav-item{padding:7px 10px;border-radius:6px;font-size:12px;color:var(--t2);display:flex;align-items:center;gap:8px}
.prev-nav-item.on{background:var(--accent-dim);color:var(--accent)}
.prev-stat{background:var(--s2);border:1px solid var(--border);border-radius:10px;padding:14px;flex:1}
.prev-tx{background:var(--s2);border:1px solid var(--border);border-radius:8px;padding:10px 12px;display:flex;align-items:center;gap:10px;margin-bottom:2px}
.land-features{padding:80px 48px;display:grid;grid-template-columns:repeat(3,1fr);gap:20px;max-width:1100px;margin:0 auto;width:100%}
.feat{background:var(--s1);border:1px solid var(--border);border-radius:16px;padding:28px;transition:border-color var(--dur)}
.feat:hover{border-color:rgba(168,230,61,0.2)}
.feat-num{font-family:'Space Grotesk',sans-serif;font-size:32px;font-weight:700;color:var(--s3);margin-bottom:16px;letter-spacing:-0.04em}
.feat-title{font-family:'Space Grotesk',sans-serif;font-size:17px;font-weight:700;color:var(--t1);margin-bottom:8px;letter-spacing:-0.02em}
.feat-desc{font-size:13px;color:var(--t2);line-height:1.7}
.land-cta{padding:80px 48px;text-align:center;border-top:1px solid var(--border)}
.land-cta h2{font-family:'Space Grotesk',sans-serif;font-size:40px;font-weight:700;color:var(--t1);margin-bottom:16px;letter-spacing:-0.03em}

/* ── Auth ── */
.auth-wrap{min-height:100vh;background:var(--bg);display:flex;align-items:center;justify-content:center;padding:24px}
.auth-card{width:400px;background:var(--s1);border:1px solid var(--border);border-radius:18px;padding:36px}
.strength-segs{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;margin-top:6px}
.strength-seg{height:3px;border-radius:2px;background:var(--s3);transition:background 0.3s}

/* ── Onboarding ── */
.ob-wrap{min-height:100vh;background:var(--bg);display:flex;align-items:center;justify-content:center;padding:24px}
.ob-card{width:460px;background:var(--s1);border:1px solid var(--border);border-radius:18px;padding:36px}
.ob-steps{display:flex;gap:6px;justify-content:center;margin-bottom:28px}
.ob-step{height:3px;border-radius:2px;background:var(--s3);transition:all 0.25s var(--ease)}
.ob-step.done{background:rgba(168,230,61,0.4);flex:0 0 20px}
.ob-step.active{background:var(--accent);flex:0 0 32px}
.ob-step.pending{flex:0 0 20px}

/* ── Mobile ── */
@media(max-width:768px){
  .sidebar{display:none}
  .main-area{margin-left:0;padding-bottom:64px}
  .page{padding:14px 14px 20px}
  .page-row{flex-direction:column;gap:14px}
  .page-right{width:100%}
  .stats-grid{grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px}
  .stat-card{padding:14px}
  .stat-value{font-size:18px}
  .topbar{padding:14px 16px}
  .topbar .tb-badge{display:none}
  .topbar-left h1{font-size:16px}
  .topbar-left p{font-size:11px}
  .tx-row{grid-template-columns:auto 1fr auto auto;gap:10px;padding:12px 14px}
  .tx-time{display:none}
  .land-nav{padding:16px 20px}
  .land-nav .btn-ghost{display:none}
  .land-hero{padding:32px 20px 28px}
  .land-h{font-size:clamp(28px,8vw,42px);margin-bottom:14px}
  .land-sub{font-size:14px;margin-bottom:28px}
  .land-btns{flex-direction:column;align-items:stretch;gap:10px;margin-bottom:40px}
  .land-btns .btn{justify-content:center}
  .land-preview{display:none}
  .land-features{grid-template-columns:1fr;padding:32px 20px;gap:12px}
  .land-cta{padding:40px 20px}
  .land-cta h2{font-size:26px}
  .feat{padding:20px}
  .prev-content{grid-template-columns:1fr}
  .prev-sidebar{display:none}
  .chat-page{height:calc(100dvh - 130px)}
  .chat-msgs{padding:14px 16px}
  .chat-bar{padding:10px 14px}
  .mob-bnav{display:flex}
  .page-row .card{padding:14px}
  .auth-card{width:100%;max-width:400px;padding:28px 20px}
  .ob-card{width:100%;max-width:460px;padding:28px 20px}
  .auth-wrap,.ob-wrap{padding:16px;align-items:flex-start;padding-top:40px}
}
@media(max-width:400px){
  .stats-grid{grid-template-columns:1fr}
  .land-h{font-size:26px}
  .topbar-right{gap:6px}
}
@media(min-width:769px){.mob-bnav{display:none!important}}
.mob-bnav{position:fixed;bottom:0;left:0;right:0;height:64px;background:var(--s1);border-top:1px solid var(--border);display:flex;align-items:center;justify-content:space-around;padding:0 8px 8px;z-index:60}
.mob-nitem{display:flex;flex-direction:column;align-items:center;gap:3px;padding:6px 12px;border-radius:8px;cursor:pointer;border:none;background:transparent;color:var(--t3);font-family:'Inter',sans-serif;transition:all var(--dur)}
.mob-nitem.on{color:var(--accent)}
.mob-nlabel{font-size:9px;font-weight:600;letter-spacing:0.04em}

/* ── Section headers ── */
.sec-h{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
.sec-title{font-family:'Space Grotesk',sans-serif;font-size:15px;font-weight:700;color:var(--t1);letter-spacing:-0.01em}
.sec-link{font-size:12px;font-weight:600;color:var(--accent);cursor:pointer;border:none;background:transparent;font-family:'Inter',sans-serif;transition:opacity var(--dur)}
.sec-link:hover{opacity:0.75}
.divider{height:1px;background:var(--border);margin:16px 0}
`;

/* ── Mock data ────────────────────────────────────────────────────────────── */
const MOCK_TXS = [
  { id:1, name:"Uber Ride", cat:"Transport", time:"Today, 8:45 AM", amount:3200, status:"APPROVED", color:"#1C1C1C", letter:"U", reason:null },
  { id:2, name:"Spotify Premium", cat:"Entertainment", time:"Yesterday, 7:12 PM", amount:1500, status:"APPROVED", color:"#1DB954", letter:"S", reason:null },
  { id:3, name:"Tunde Adeola", cat:"Transfer", time:"Yesterday, 3:30 PM", amount:20000, status:"APPROVED", color:"#2563EB", letter:"T", reason:null },
  { id:4, name:"Luxury Store", cat:"Shopping", time:"Yesterday, 11:05 AM", amount:120000, status:"BLOCKED", color:"#7C3AED", letter:"L", reason:"Exceeds per-transaction limit" },
  { id:5, name:"IKEDC", cat:"Utility", time:"Mon, 10:00 AM", amount:4500, status:"APPROVED", color:"#059669", letter:"I", reason:null },
  { id:6, name:"Emeka Okafor", cat:"Transfer", time:"Mon, 2:15 PM", amount:3500, status:"ESCALATED", color:"#D97706", letter:"E", reason:"First-time recipient" },
];

const SPEND_DATA = [
  {m:"Feb",v:280000},{m:"Mar",v:195000},{m:"Apr",v:420000},
  {m:"May",v:310000},{m:"Jun",v:356800},
];

const INIT_POLICY = {
  perTx:50000, monthly:1000000,
  whitelist:["uber","spotify","ikedc","mtn"],
  startH:6, endH:22,
  categories:{bills:true,transfers:false,shopping:false,utilities:true,entertainment:true},
  emergency:false, firstTime:true,
};

const INIT_CHAT = [
  { id:1, role:"nyra", text:"Hi Candelar 👋\n\nI'm monitoring your wallet and ready to act within your rules. Tell me what to pay, or ask me anything about your spending." },
];

const PIPELINE_STEPS = [
  { id:"intent",   label:"Parsing intent",        icon:"🔍" },
  { id:"policy",   label:"Checking policy",        icon:"📋" },
  { id:"balance",  label:"Verifying balance",      icon:"💰" },
  { id:"risk",     label:"Risk assessment",        icon:"⚡" },
  { id:"decision", label:"Decision",               icon:"✅" },
];

const sleep_ms = ms => new Promise(r => setTimeout(r, ms));

function parseIntent(text) {
  if (!/pay|send|transfer|buy/i.test(text)) return null;
  const a = text.match(/[\d,]+/);
  const r = text.toLowerCase().match(/to\s+([a-z0-9]+)/);
  if (!a) return null;
  return { amount: parseFloat(a[0].replace(/,/g,"")), recipient: r?.[1] || "unknown" };
}

/* ── N Logo SVG ──────────────────────────────────────────────────────────── */
function NLogo({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <defs>
        <linearGradient id="ng" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3ECF8E"/>
          <stop offset="100%" stopColor="#A8E63D"/>
        </linearGradient>
        <filter id="gf" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <path d="M7 33 L7 7 L33 33 L33 7" stroke="url(#ng)" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="20" cy="20" r="3.2" fill="#A8E63D" filter="url(#gf)" style={{animation:"glowPulse 3s ease-in-out infinite"}}/>
    </svg>
  );
}

function Chip({ status }) {
  if (status === "APPROVED") return <span className="chip chip-ok">✓ Approved</span>;
  if (status === "BLOCKED")  return <span className="chip chip-err">✗ Blocked</span>;
  if (status === "ESCALATED") return <span className="chip chip-warn">! Escalated</span>;
  return <span className="chip chip-muted">{status}</span>;
}

function Toggle({ checked, onChange }) {
  return (
    <label className="tog">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)}/>
      <span className="tsl"/>
    </label>
  );
}

function LiveDot() {
  return <div style={{width:7,height:7,borderRadius:"50%",background:"var(--accent)",flexShrink:0,animation:"breathe 3s ease-in-out infinite"}}/>;
}

/* ── Landing ─────────────────────────────────────────────────────────────── */
function Landing({ onEnter }) {
  return (
    <div className="landing">
      <nav className="land-nav">
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <NLogo size={28}/><span style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,fontSize:18,color:"var(--t1)",letterSpacing:"-0.02em"}}>nyra</span>
        </div>
        <div style={{display:"flex",gap:10}}>
          <button className="btn btn-ghost btn-sm" onClick={onEnter}>Sign in</button>
          <button className="btn btn-accent btn-sm" onClick={onEnter}>Get started</button>
        </div>
      </nav>

      <div className="land-hero">
        <div className="land-tagline">AI That Manages Your Money</div>
        <h1 className="land-h">
          Your wallet,<br/>
          <span className="dim">on autopilot.</span>
        </h1>
        <p className="land-sub">Nyra handles routine payments automatically, within rules you define — and explains every single decision it makes.</p>
        <div className="land-btns">
          <button className="btn btn-accent btn-lg" onClick={onEnter}>Get started free <ArrowRight size={16}/></button>
          <button className="btn btn-ghost btn-lg" onClick={onEnter}>Sign in</button>
        </div>

        {/* Dashboard preview */}
        <div className="land-preview">
          <div className="prev-bar">
            <div className="prev-dot"/><div className="prev-dot"/><div className="prev-dot"/>
            <span style={{marginLeft:8,fontSize:11,color:"var(--t3)"}}>nyra — Overview</span>
          </div>
          <div className="prev-content">
            <div className="prev-sidebar">
              <div style={{display:"flex",alignItems:"center",gap:8,padding:"4px 8px",marginBottom:12}}>
                <NLogo size={20}/>
                <span style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,fontSize:13,color:"var(--t1)"}}>nyra</span>
              </div>
              {["Overview","Transactions","Ask Nyra","Policies","Settings"].map((n,i) => (
                <div key={n} className={`prev-nav-item ${i===0?"on":""}`}>
                  <div style={{width:4,height:4,borderRadius:"50%",background:i===0?"var(--accent)":"var(--t3)"}}/>
                  {n}
                </div>
              ))}
            </div>
            <div className="prev-main">
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
                <div>
                  <div style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,fontSize:14,color:"var(--t1)"}}>Good morning, Candelar</div>
                  <div style={{fontSize:11,color:"var(--t2)",marginTop:2}}>Nyra is active and managing your transactions.</div>
                </div>
                <div style={{width:32,height:32,borderRadius:"50%",background:"var(--accent-dim)",border:"1px solid rgba(168,230,61,0.2)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <NLogo size={16}/>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
                {[["Total Balance","₦1,250,000"],["Spent This Month","₦356,800"],["Managed","42 txns"]].map(([l,v]) => (
                  <div key={l} className="prev-stat">
                    <div style={{fontSize:10,color:"var(--t2)",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.06em"}}>{l}</div>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:600,fontSize:13,color:"var(--t1)"}}>{v}</div>
                  </div>
                ))}
              </div>
              {MOCK_TXS.slice(0,3).map(tx => (
                <div key={tx.id} className="prev-tx">
                  <div style={{width:26,height:26,borderRadius:"50%",background:tx.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#fff",flexShrink:0}}>{tx.letter}</div>
                  <div style={{flex:1}}><div style={{fontSize:11,fontWeight:600,color:"var(--t1)"}}>{tx.name}</div><div style={{fontSize:10,color:"var(--t2)"}}>{tx.cat}</div></div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:600,color:"var(--t1)"}}>₦{tx.amount.toLocaleString()}</div>
                  <Chip status={tx.status}/>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="land-features">
        {[
          {n:"01",t:"Set your rules",d:"Define spending limits, trusted recipients, allowed hours, and category controls. Nyra enforces them — automatically, every time."},
          {n:"02",t:"Nyra explains itself",d:"Every decision — approved, blocked, or escalated — comes with a plain-English reason and a confidence score. No black boxes."},
          {n:"03",t:"Chat to transact",d:"Send Nyra a message on Telegram or WhatsApp. Same wallet, same rules, same history. One agent everywhere you already are."},
        ].map(f => (
          <div key={f.n} className="feat">
            <div className="feat-num">{f.n}</div>
            <div className="feat-title">{f.t}</div>
            <p className="feat-desc">{f.d}</p>
          </div>
        ))}
      </div>

      <div className="land-cta">
        <h2>Ready to delegate your wallet?</h2>
        <p style={{fontSize:15,color:"var(--t2)",marginBottom:28,lineHeight:1.7}}>Join Nigerians who've stopped babysitting their recurring payments.</p>
        <button className="btn btn-accent btn-lg" onClick={onEnter}>Get started free <ArrowRight size={16}/></button>
      </div>
    </div>
  );
}

/* ── Auth ────────────────────────────────────────────────────────────────── */
function Auth({ onAuth }) {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showP, setShowP] = useState(false);
  const strength = [pass.length>=8,/[A-Z]/.test(pass),/[0-9]/.test(pass),/[^A-Za-z0-9]/.test(pass)].filter(Boolean).length;
  const sColors = ["var(--s3)","var(--err)","var(--warn)","#86EFAC","var(--accent)"];

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div style={{display:"flex",alignItems:"center",gap:10,justifyContent:"center",marginBottom:28}}>
          <NLogo size={32}/>
          <span style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,fontSize:22,color:"var(--t1)"}}>nyra</span>
        </div>
        <h2 style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,fontSize:20,color:"var(--t1)",marginBottom:4,letterSpacing:"-0.02em"}}>{mode==="signin"?"Welcome back":"Create account"}</h2>
        <p style={{fontSize:13,color:"var(--t2)",marginBottom:24}}>{mode==="signin"?"Sign in to your agent":"Deploy your AI payment agent"}</p>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div className="inp-wrap">
            <label className="inp-label">Email</label>
            <input className="inp" type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)}/>
          </div>
          <div className="inp-wrap">
            <label className="inp-label">Password</label>
            <div style={{position:"relative"}}>
              <input className="inp" type={showP?"text":"password"} placeholder="••••••••" value={pass} onChange={e=>setPass(e.target.value)} style={{paddingRight:44}}/>
              <button onClick={()=>setShowP(s=>!s)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"transparent",border:"none",cursor:"pointer",color:"var(--t3)",display:"flex"}}>
                {showP?<EyeOff size={16}/>:<Eye size={16}/>}
              </button>
            </div>
            {mode==="signup"&&pass.length>0&&(
              <div className="strength-segs">
                {[0,1,2,3].map(i=><div key={i} className="strength-seg" style={{background:i<strength?sColors[strength]:"var(--s3)"}}/>)}
              </div>
            )}
          </div>
          <button className="btn btn-accent btn-full btn-lg" style={{marginTop:4}} onClick={onAuth}>
            {mode==="signin"?"Sign in":"Create account"} <ArrowRight size={15}/>
          </button>
        </div>
        <div style={{height:1,background:"var(--border)",margin:"20px 0"}}/>
        <p style={{textAlign:"center",fontSize:13,color:"var(--t2)"}}>
          {mode==="signin"?"No account? ":"Already have one? "}
          <span style={{color:"var(--accent)",fontWeight:600,cursor:"pointer"}} onClick={()=>setMode(m=>m==="signin"?"signup":"signin")}>
            {mode==="signin"?"Sign up":"Sign in"}
          </span>
        </p>
      </div>
    </div>
  );
}

/* ── Onboarding ──────────────────────────────────────────────────────────── */
function Onboarding({ onDone }) {
  const [step, setStep] = useState(0);
  const [perTx, setPerTx] = useState("50000");
  const [monthly, setMonthly] = useState("1000000");
  const [recips, setRecips] = useState(["uber","spotify","ikedc","mtn"]);
  const [newR, setNewR] = useState("");
  const addR = () => { const v=newR.trim().toLowerCase(); if(v&&!recips.includes(v)){setRecips(r=>[...r,v]);setNewR("");} };

  const steps = [
    { title:"Meet Nyra", sub:"Your AI payment agent",
      body:(
        <div style={{textAlign:"center",paddingTop:8}}>
          <div style={{width:72,height:72,borderRadius:"50%",background:"var(--accent-dim)",border:"1px solid rgba(168,230,61,0.2)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",animation:"breathe 3s ease-in-out infinite"}}>
            <NLogo size={36}/>
          </div>
          <p style={{fontSize:14,color:"var(--t2)",lineHeight:1.8,marginBottom:20}}>Nyra monitors your wallet and handles payments automatically — within limits you control. Every decision comes with a plain-English explanation.</p>
          {[["Pay automatically","Set rules once, Nyra executes them every time"],["Every decision explained","Approved, blocked, or escalated — always with a reason"],["Chat from Telegram","Same wallet, same rules, from any chat app"]].map(([t,d])=>(
            <div key={t} style={{display:"flex",gap:10,padding:"10px 12px",background:"var(--s2)",borderRadius:8,border:"1px solid var(--border)",marginBottom:8,textAlign:"left"}}>
              <Check size={14} color="var(--accent)" style={{marginTop:2,flexShrink:0}}/>
              <div><div style={{fontSize:13,fontWeight:600,color:"var(--t1)"}}>{t}</div><div style={{fontSize:11,color:"var(--t2)",marginTop:1}}>{d}</div></div>
            </div>
          ))}
        </div>
      )
    },
    { title:"Set your limits", sub:"Nyra will never exceed these",
      body:(
        <div style={{display:"flex",flexDirection:"column",gap:14,paddingTop:8}}>
          <div className="inp-wrap"><label className="inp-label">Per-transaction limit (₦)</label><input className="inp" type="number" value={perTx} onChange={e=>setPerTx(e.target.value)}/><p style={{fontSize:11,color:"var(--t3)",marginTop:4}}>No single payment will exceed this amount</p></div>
          <div className="inp-wrap"><label className="inp-label">Monthly cap (₦)</label><input className="inp" type="number" value={monthly} onChange={e=>setMonthly(e.target.value)}/><p style={{fontSize:11,color:"var(--t3)",marginTop:4}}>Nyra stops automatically when this is reached</p></div>
          <div style={{background:"var(--accent-dim)",border:"1px solid rgba(168,230,61,0.15)",borderRadius:8,padding:"11px 14px",fontSize:12,color:"var(--t2)",lineHeight:1.6}}>
            <span style={{color:"var(--accent)",fontWeight:600}}>How it works: </span>Any request above these limits is automatically blocked and explained.
          </div>
        </div>
      )
    },
    { title:"Trusted recipients", sub:"Nyra auto-approves payments to these",
      body:(
        <div style={{paddingTop:8}}>
          <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:12}}>
            {recips.map(r=><span key={r} className="pchip">{r.toUpperCase()}<button onClick={()=>setRecips(rs=>rs.filter(x=>x!==r))}><X size={10}/></button></span>)}
          </div>
          <div style={{display:"flex",gap:8}}>
            <input className="inp" placeholder="Add recipient (e.g. dstv)" value={newR} onChange={e=>setNewR(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addR()} style={{flex:1}}/>
            <button className="btn btn-ghost btn-sm" onClick={addR}><Plus size={14}/></button>
          </div>
          <p style={{fontSize:11,color:"var(--t3)",marginTop:8,lineHeight:1.6}}>Anyone not on this list will need your confirmation before Nyra pays them.</p>
        </div>
      )
    }
  ];

  return (
    <div className="ob-wrap">
      <div className="ob-card">
        <div style={{display:"flex",alignItems:"center",gap:10,justifyContent:"center",marginBottom:24}}>
          <NLogo size={28}/>
          <span style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,fontSize:20,color:"var(--t1)"}}>nyra</span>
        </div>
        <div className="ob-steps">
          {steps.map((_,i)=><div key={i} className={`ob-step ${i===step?"active":i<step?"done":"pending"}`}/>)}
        </div>
        <h2 style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,fontSize:19,color:"var(--t1)",marginBottom:3,letterSpacing:"-0.02em"}}>{steps[step].title}</h2>
        <p style={{fontSize:13,color:"var(--t2)",marginBottom:4}}>{steps[step].sub}</p>
        <div style={{flex:1}}>{steps[step].body}</div>
        <div style={{display:"flex",gap:10,marginTop:24}}>
          {step>0&&<button className="btn btn-ghost" style={{flex:1,minHeight:44}} onClick={()=>setStep(s=>s-1)}>Back</button>}
          <button className="btn btn-accent" style={{flex:1,minHeight:44,justifyContent:"center"}} onClick={()=>step<steps.length-1?setStep(s=>s+1):onDone({perTx:Number(perTx),monthly:Number(monthly),whitelist:recips})}>
            {step<steps.length-1?"Continue":"Launch Nyra"} <ArrowRight size={14}/>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Sidebar ─────────────────────────────────────────────────────────────── */
function Sidebar({ screen, setScreen, nyraActive, setNyraActive, escalations, onLogout }) {
  const nav = [
    {id:"overview", icon:<Home size={15}/>, label:"Overview"},
    {id:"transactions", icon:<Activity size={15}/>, label:"Transactions"},
    {id:"ask", icon:<MessageSquare size={15}/>, label:"Ask Nyra"},
    {id:"policies", icon:<Shield size={15}/>, label:"Policies"},
    {id:"deploy", icon:<Rocket size={15}/>, label:"Deploy Agent"},
    {id:"settings", icon:<Settings size={15}/>, label:"Settings"},
  ];
  return (
    <div className="sidebar">
      <div className="sb-logo">
        <NLogo size={26}/>
        <span className="sb-wordmark">nyra</span>
      </div>
      <div className="sb-nav">
        {nav.map(n=>(
          <button key={n.id} className={`sb-item ${screen===n.id?"on":""}`} onClick={()=>setScreen(n.id)}>
            {n.icon}{n.label}
            {n.id==="ask"&&escalations>0&&<span style={{marginLeft:"auto",width:16,height:16,borderRadius:"50%",background:"var(--warn)",color:"#000",fontSize:9,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{escalations}</span>}
          </button>
        ))}
      </div>
      <div className="sb-footer">
        <div className="sb-status">
          <div className="sb-status-label">Nyra Status</div>
          <div className="sb-status-row">
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <LiveDot/>
              <span className="sb-status-text">{nyraActive?"Active":"Paused"}</span>
            </div>
            <Toggle checked={nyraActive} onChange={setNyraActive}/>
          </div>
          <div className="sb-status-desc">{nyraActive?"Nyra is monitoring and managing on your behalf.":"All autonomous actions are paused."}</div>
        </div>
        <button className="sb-item" onClick={onLogout} style={{color:"var(--err)",marginTop:4}}>
          <LogOut size={15}/>Sign out
        </button>
      </div>
    </div>
  );
}

/* ── Top Bar ─────────────────────────────────────────────────────────────── */
function TopBar({ nyraActive, setNyraActive, screen, setScreen }) {
  const titles = {overview:"Overview",transactions:"Transactions",ask:"Ask Nyra",policies:"Policies",deploy:"Deploy Agent",settings:"Settings"};
  const subs = {overview:"Good morning, Candelar",transactions:"All agent activity",ask:"Conversational AI interface",policies:"Guardrail configuration",deploy:"Platform integrations",settings:"Preferences"};
  return (
    <div className="topbar">
      <div className="topbar-left">
        <h1>{titles[screen]||"Nyra"}</h1>
        <p>{subs[screen]||""}</p>
      </div>
      <div className="topbar-right">
        <div className="tb-badge"><LiveDot/>{nyraActive?"Nyra Active":"Nyra Paused"}</div>
        <div className="ico-btn" onClick={()=>setScreen("notifications")}>
          <Bell size={16}/><span className="dot"/>
        </div>
        <div className="avatar">C</div>
      </div>
    </div>
  );
}

/* ── Overview ────────────────────────────────────────────────────────────── */
function Overview({ nyraActive, setNyraActive, transactions, policy, escalations, setScreen }) {
  const [showBal, setShowBal] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const spent = 356800;
  const pct = Math.round((spent/policy.monthly)*100);

  return (
    <div className="page">
      <div className="page-row">
        <div className="page-main">
          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Total Balance</div>
              <div className="stat-value stat-mono" style={{cursor:"pointer"}} onClick={()=>setShowBal(s=>!s)}>
                {showBal?"₦1,250,000.00":"₦ ••••••••"}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <span className="stat-sub">All accounts</span>
                <button onClick={()=>setShowBal(s=>!s)} style={{background:"transparent",border:"none",cursor:"pointer",color:"var(--t3)",display:"flex",padding:0}}>
                  {showBal?<Eye size={11}/>:<EyeOff size={11}/>}
                </button>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Spent This Month</div>
              <div className="stat-value stat-mono">₦{spent.toLocaleString()}</div>
              <div className="stat-sub">of ₦{(policy.monthly/1000000).toFixed(0)}M limit</div>
              <div className="prog"><div className="prog-fill" style={{width:`${pct}%`}}/></div>
              <div style={{display:"flex",justifyContent:"flex-end",marginTop:4}}><span className="stat-sub">{pct}%</span></div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Transactions Managed</div>
              <div className="stat-value">42</div>
              <div className="stat-sub">This month</div>
              <div style={{height:40,marginTop:8}}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={SPEND_DATA} margin={{top:0,right:0,bottom:0,left:0}}>
                    <defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#A8E63D" stopOpacity={0.3}/><stop offset="100%" stopColor="#A8E63D" stopOpacity={0}/></linearGradient></defs>
                    <Area type="monotone" dataKey="v" stroke="#A8E63D" strokeWidth={1.5} fill="url(#ag)" dot={false}/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Escalation alert */}
          {escalations>0&&(
            <div style={{display:"flex",gap:10,padding:"12px 16px",background:"rgba(245,158,11,0.08)",border:"1px solid rgba(245,158,11,0.2)",borderRadius:10,marginBottom:16,alignItems:"center",cursor:"pointer"}} onClick={()=>setScreen("ask")}>
              <AlertTriangle size={15} color="var(--warn)"/>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:600,color:"var(--t1)"}}>{escalations} transaction{escalations>1?"s":""} need{escalations===1?"s":""} your review</div>
                <div style={{fontSize:11,color:"var(--t2)",marginTop:1}}>Tap to review in Ask Nyra</div>
              </div>
              <ChevronRight size={14} color="var(--warn)"/>
            </div>
          )}

          {/* Recent Transactions */}
          <div className="card" style={{padding:"18px 20px"}}>
            <div className="sec-h">
              <span className="sec-title">Recent Transactions</span>
              <button className="sec-link" onClick={()=>setScreen("transactions")}>View all</button>
            </div>
            {transactions.slice(0,5).map(tx=>(
              <div key={tx.id} className="tx-row" onClick={()=>setExpanded(expanded===tx.id?null:tx.id)}>
                <div className="tx-ico" style={{background:tx.color,border:"1px solid rgba(255,255,255,0.1)"}}><span style={{color:"#fff"}}>{tx.letter}</span></div>
                <div>
                  <div className="tx-name">{tx.name}</div>
                  <div className="tx-cat">{tx.cat}</div>
                  {expanded===tx.id&&tx.reason&&<div style={{fontSize:11,color:"var(--err)",marginTop:3}}>↳ {tx.reason}</div>}
                </div>
                <div className="tx-time">{tx.time}</div>
                <div>
                  <div className="tx-amt">₦{tx.amount.toLocaleString()}</div>
                  {expanded===tx.id&&tx.reason&&<div style={{fontSize:10,color:"var(--t3)",marginTop:2,textAlign:"right"}}>Blocked by policy</div>}
                </div>
                <Chip status={tx.status}/>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div className="page-right">
          <div className="card" style={{marginBottom:14}}>
            <div className="sec-h" style={{marginBottom:12}}><span className="sec-title">Ask Nyra</span></div>
            <p style={{fontSize:12,color:"var(--t2)",marginBottom:12,lineHeight:1.65}}>What would you like Nyra to help you with?</p>
            <textarea className="ask-textarea" placeholder="e.g. Send ₦20,000 to Tunde for project fee" rows={3} readOnly onClick={()=>setScreen("ask")}/>
            <button className="ask-btn" style={{marginTop:8}} onClick={()=>setScreen("ask")}>
              <Zap size={14} fill="#000"/>Ask Nyra
            </button>
          </div>

          <div className="card">
            <div className="sec-h" style={{marginBottom:12}}><span className="sec-title">Quick Actions</span></div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {[
                {label:"Send Money",icon:<ArrowUpRight size={15} color="var(--accent)"/>},
                {label:"Pay Bill",icon:<CheckCircle size={15} color="var(--accent)"/>},
                {label:"Top Up",icon:<Plus size={15} color="var(--accent)"/>},
                {label:"Request Money",icon:<ArrowDownLeft size={15} color="var(--accent)"/>},
              ].map(a=>(
                <div key={a.label} className="qa-item">
                  <div className="qa-ico">{a.icon}</div>
                  <span style={{fontSize:13,fontWeight:500}}>{a.label}</span>
                  <ChevronRight size={13} color="var(--t3)" style={{marginLeft:"auto"}}/>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Ask Nyra (full chat) ────────────────────────────────────────────────── */
function AskNyra({ policy, transactions }) {
  const [chat, setChat] = useState(INIT_CHAT);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pipelines, setPipelines] = useState({});
  const endRef = useRef(null);
  const monthlySpent = transactions.filter(t=>t.status==="APPROVED").reduce((s,t)=>s+t.amount,0);
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"})},[chat,loading,pipelines]);

  const updateStep = useCallback((pid,sid,status,detail)=>{
    setPipelines(ps=>{const p=ps[pid];if(!p)return ps;return{...ps,[pid]:{...p,steps:p.steps.map(s=>s.id===sid?{...s,status,detail}:s)}};});
  },[]);

  const send = async()=>{
    const text=input.trim();if(!text||loading)return;
    setInput("");setLoading(true);
    const msgId=Date.now();
    setChat(c=>[...c,{id:msgId,role:"user",text}]);
    const intent=parseIntent(text);
    const apiP=fetch("https://api.anthropic.com/v1/messages",{
      method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        model:"claude-sonnet-4-6",max_tokens:1000,
        system:`You are Nyra, an AI payment agent for a Nigerian mobile wallet. You speak directly, confidently, and are always transparent.
Policy: per-transaction limit ₦${policy.perTx.toLocaleString()}, monthly cap ₦${policy.monthly.toLocaleString()}, whitelisted: ${policy.whitelist.join(", ")}, hours ${policy.startH}:00–${policy.endH}:00, spent this month ₦${monthlySpent.toLocaleString()}.
For transaction requests: start with APPROVED, BLOCKED, or ESCALATED. Give the reason in 1-2 sentences with specific numbers. End with Confidence: X%.
For other messages: be helpful, concise, focused. Use ₦ for amounts.`,
        messages:[...chat.filter((_,i)=>i>0).map(m=>({role:m.role==="user"?"user":"assistant",content:m.text})),{role:"user",content:text}]
      })
    }).then(r=>r.json()).then(d=>d.content?.[0]?.text||"Something went wrong.").catch(()=>"Connection failed. Please try again.");

    const pid=msgId;
    setPipelines(ps=>({...ps,[pid]:{steps:PIPELINE_STEPS.map(s=>({...s,status:"pending",detail:null})),status:"running"}}));
    setChat(c=>[...c,{id:pid+0.1,role:"pipeline",pipelineId:pid}]);
    await sleep_ms(320);
    const onWl=intent?policy.whitelist.includes(intent.recipient?.toLowerCase()):null;
    const overLim=intent?intent.amount>policy.perTx:null;
    updateStep(pid,"intent","done",intent?`${intent.recipient} · ₦${intent.amount?.toLocaleString()}`:"Conversational message");
    await sleep_ms(380);
    updateStep(pid,"policy",overLim||onWl===false?"failed":"done",intent?`Whitelist: ${onWl?"✓":"✗"} · Limit: ${overLim?"✗":"✓"} · Hours: ✓`:"No policy check");
    await sleep_ms(320);updateStep(pid,"balance","done","₦1,250,000 available");
    await sleep_ms(380);updateStep(pid,"risk","done",intent?(onWl?"LOW · Known recipient":"MEDIUM · New contact"):"—");
    updateStep(pid,"decision","running",null);
    const reply=await apiP;
    const conf=reply.match(/Confidence:\s*(\d+)%/)?.[1];
    updateStep(pid,"decision","done",conf?`${conf}% confidence`:"Evaluated");
    setPipelines(ps=>({...ps,[pid]:{...ps[pid],status:"done"}}));
    setChat(c=>[...c,{id:Date.now(),role:"nyra",text:reply}]);
    setLoading(false);
  };

  return (
    <div className="chat-page">
      <div style={{padding:"14px 28px",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",gap:10,background:"var(--bg)",flexShrink:0}}>
        <div style={{width:32,height:32,borderRadius:"50%",background:"var(--accent-dim)",border:"1px solid rgba(168,230,61,0.2)",display:"flex",alignItems:"center",justifyContent:"center"}}><NLogo size={16}/></div>
        <div><div style={{fontSize:13,fontWeight:600,color:"var(--t1)"}}>Nyra</div><div style={{display:"flex",alignItems:"center",gap:5}}><LiveDot/><span style={{fontSize:10,fontWeight:600,color:"var(--accent)"}}>Active · AI payment agent</span></div></div>
      </div>

      <div className="chat-msgs">
        {chat.map(msg=>{
          if(msg.role==="user") return(
            <div key={msg.id} style={{display:"flex",justifyContent:"flex-end"}} className="fa">
              <div className="bub-me">{msg.text}</div>
            </div>
          );
          if(msg.role==="pipeline"){
            const p=pipelines[msg.pipelineId];if(!p)return null;
            return(
              <div key={msg.id} className="pipeline fa">
                <div className="pip-head"><Zap size={9} color="var(--accent)"/>Nyra reasoning{p.status==="running"&&<span style={{marginLeft:"auto",color:"var(--accent)",fontSize:9}}>thinking…</span>}{p.status==="done"&&<span style={{marginLeft:"auto",color:"var(--accent)",fontSize:9}}>complete</span>}</div>
                {p.steps.map(s=>(
                  <div key={s.id} className={`pip-step ${s.status==="running"?"running":""}`}>
                    <div className={`pdot ${s.status}`}/>
                    <div>
                      <div style={{display:"flex",alignItems:"center",gap:5}}>
                        <span style={{fontSize:11}}>{s.icon}</span>
                        <div className="plabel">{s.label}</div>
                        {s.status==="done"&&<CheckCircle size={10} color="var(--accent)"/>}
                        {s.status==="failed"&&<XCircle size={10} color="var(--err)"/>}
                        {s.status==="running"&&<span style={{display:"flex",gap:3,marginLeft:2}}>{[0,1,2].map(i=><span key={i} className="tdot" style={{animationDelay:`${i*0.2}s`}}/>)}</span>}
                      </div>
                      {s.detail&&<div className="pdetail">{s.detail}</div>}
                    </div>
                  </div>
                ))}
              </div>
            );
          }
          if(msg.role==="nyra") return(
            <div key={msg.id} style={{display:"flex",gap:8,alignItems:"flex-end"}} className="fa">
              <div style={{width:24,height:24,borderRadius:"50%",background:"var(--accent-dim)",border:"1px solid rgba(168,230,61,0.2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><NLogo size={12}/></div>
              <div className="bub-nyra" style={{whiteSpace:"pre-line"}}>{msg.text}</div>
            </div>
          );
          return null;
        })}
        {loading&&!Object.values(pipelines).some(p=>p.status==="running")&&(
          <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
            <div style={{width:24,height:24,borderRadius:"50%",background:"var(--accent-dim)",flexShrink:0}}/>
            <div className="bub-nyra" style={{display:"flex",gap:5,padding:"14px"}}>{[0,1,2].map(i=><span key={i} className="tdot" style={{animationDelay:`${i*0.2}s`}}/>)}</div>
          </div>
        )}
        <div ref={endRef}/>
      </div>

      <div className="chat-bar">
        <textarea className="chat-inp" rows={1} placeholder="Tell Nyra what to pay, or ask anything…" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}}/>
        <button className="chat-send" onClick={send} disabled={!input.trim()||loading}><Send size={16} color="#000"/></button>
      </div>
    </div>
  );
}

/* ── Transactions ────────────────────────────────────────────────────────── */
function Transactions({ transactions }) {
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);
  const list = filter==="all"?transactions:transactions.filter(t=>t.status.toLowerCase()===filter);
  return (
    <div className="page">
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
        {["all","approved","blocked","escalated"].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} className="btn btn-sm" style={{background:filter===f?"var(--accent-dim)":"var(--s2)",color:filter===f?"var(--accent)":"var(--t2)",border:`1px solid ${filter===f?"rgba(168,230,61,0.2)":"var(--border)"}`,fontWeight:600}}>
            {f.charAt(0).toUpperCase()+f.slice(1)}
          </button>
        ))}
      </div>
      <div className="card" style={{padding:"18px 20px"}}>
        {list.map((tx,i)=>(
          <div key={tx.id} className="tx-row fa" style={{animationDelay:`${i*25}ms`}} onClick={()=>setExpanded(expanded===tx.id?null:tx.id)}>
            <div className="tx-ico" style={{background:tx.color}}><span style={{color:"#fff"}}>{tx.letter}</span></div>
            <div>
              <div className="tx-name">{tx.name}</div>
              <div className="tx-cat">{tx.cat}</div>
              {expanded===tx.id&&<div style={{fontSize:11,color:"var(--t2)",marginTop:4,lineHeight:1.5}}>{tx.reason||"All policy conditions satisfied."}</div>}
            </div>
            <div className="tx-time">{tx.time}</div>
            <div><div className="tx-amt">₦{tx.amount.toLocaleString()}</div>{expanded===tx.id&&<div style={{fontSize:10,color:"var(--t3)",marginTop:2,textAlign:"right"}}>Confidence 96%</div>}</div>
            <Chip status={tx.status}/>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Policies ────────────────────────────────────────────────────────────── */
function Policies({ policy, setPolicy }) {
  const [d, setD] = useState({...policy,newR:""});
  const [saved, setSaved] = useState(false);
  const save=()=>{setPolicy({...d});setSaved(true);setTimeout(()=>setSaved(false),2000)};
  const rmR=v=>setD(p=>({...p,whitelist:p.whitelist.filter(x=>x!==v)}));
  const addR=()=>{const v=d.newR.trim().toLowerCase();if(v&&!d.whitelist.includes(v)){setD(p=>({...p,whitelist:[...p.whitelist,v],newR:""}));}};

  const Section = ({title,children}) => (
    <div className="card" style={{marginBottom:14}}>
      <div style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,fontSize:15,color:"var(--t1)",marginBottom:14,letterSpacing:"-0.01em"}}>{title}</div>
      {children}
    </div>
  );

  return (
    <div className="page" style={{maxWidth:680}}>
      {d.emergency&&(
        <div style={{display:"flex",gap:10,padding:"12px 16px",background:"var(--err-dim)",border:"1px solid rgba(255,68,68,0.2)",borderRadius:10,marginBottom:14,alignItems:"center"}}>
          <AlertTriangle size={15} color="var(--err)"/>
          <span style={{fontSize:13,fontWeight:600,color:"var(--err)",flex:1}}>Emergency pause active — all autonomous transactions stopped.</span>
          <button className="btn btn-danger btn-sm" onClick={()=>setD(p=>({...p,emergency:false}))}>Disable</button>
        </div>
      )}
      <Section title="Spending Limits">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <div className="inp-wrap"><label className="inp-label">Per-transaction limit (₦)</label><input className="inp" type="number" value={d.perTx} onChange={e=>setD(p=>({...p,perTx:e.target.value}))}/></div>
          <div className="inp-wrap"><label className="inp-label">Monthly cap (₦)</label><input className="inp" type="number" value={d.monthly} onChange={e=>setD(p=>({...p,monthly:e.target.value}))}/></div>
        </div>
      </Section>
      <Section title="Trusted Recipients">
        <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:12}}>
          {d.whitelist.map(r=><span key={r} className="pchip">{r.toUpperCase()}<button onClick={()=>rmR(r)}><X size={10}/></button></span>)}
        </div>
        <div style={{display:"flex",gap:8}}>
          <input className="inp" placeholder="Add recipient (e.g. dstv)" value={d.newR} onChange={e=>setD(p=>({...p,newR:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&addR()} style={{flex:1}}/>
          <button className="btn btn-ghost btn-sm" onClick={addR}><Plus size={14}/></button>
        </div>
      </Section>
      <Section title="Allowed Hours">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <div className="inp-wrap"><label className="inp-label">From (24h)</label><input className="inp" type="number" min={0} max={23} value={d.startH} onChange={e=>setD(p=>({...p,startH:e.target.value}))}/></div>
          <div className="inp-wrap"><label className="inp-label">Until (24h)</label><input className="inp" type="number" min={0} max={23} value={d.endH} onChange={e=>setD(p=>({...p,endH:e.target.value}))}/></div>
        </div>
      </Section>
      <Section title="Category Controls">
        {Object.entries(d.categories).map(([cat,on])=>(
          <div key={cat} className="pol-row">
            <div><div className="pol-title" style={{textTransform:"capitalize"}}>{cat}</div><div className="pol-sub">{on?"Auto-approved by Nyra":"Requires your confirmation"}</div></div>
            <Toggle checked={on} onChange={v=>setD(p=>({...p,categories:{...p.categories,[cat]:v}}))}/>
          </div>
        ))}
      </Section>
      <Section title="Safety">
        <div className="pol-row">
          <div><div className="pol-title">First-time recipient approval</div><div className="pol-sub">Always escalate new contacts</div></div>
          <Toggle checked={d.firstTime} onChange={v=>setD(p=>({...p,firstTime:v}))}/>
        </div>
        <div className="pol-row">
          <div><div className="pol-title" style={{color:"var(--err)"}}>Emergency pause</div><div className="pol-sub">Stop all autonomous actions immediately</div></div>
          <Toggle checked={d.emergency} onChange={v=>setD(p=>({...p,emergency:v}))}/>
        </div>
      </Section>
      <button className="btn btn-accent btn-full btn-lg" onClick={save}>
        {saved?<><Check size={16}/>Saved</>:"Save policy"}
      </button>
    </div>
  );
}

/* ── Deploy ──────────────────────────────────────────────────────────────── */
function Deploy() {
  const [tgDone, setTgDone] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const connect = async()=>{setConnecting(true);await sleep_ms(1800);setConnecting(false);setTgDone(true);};
  return (
    <div className="page" style={{maxWidth:680}}>
      <div className="card" style={{marginBottom:14,background:"var(--accent-dim)",borderColor:"rgba(168,230,61,0.15)"}}>
        <div style={{display:"flex",gap:10}}>
          <Rocket size={18} color="var(--accent)" style={{marginTop:2,flexShrink:0}}/>
          <div><div style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,fontSize:15,color:"var(--t1)",marginBottom:4}}>Platform deployments</div><div style={{fontSize:13,color:"var(--t2)",lineHeight:1.65}}>Deploy Nyra to external chat apps. All platforms share the same wallet, policies, history, and reasoning engine — one agent, everywhere.</div></div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <div className={`card ${tgDone?"":"" }`} style={{borderColor:tgDone?"rgba(168,230,61,0.25)":"var(--border)",background:tgDone?"rgba(168,230,61,0.03)":"var(--s2)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
            <div style={{display:"flex",gap:10,alignItems:"center"}}>
              <div style={{width:42,height:42,borderRadius:10,background:"rgba(41,182,246,0.1)",display:"flex",alignItems:"center",justifyContent:"center"}}><Smartphone size={20} color="#29B6F6"/></div>
              <div><div style={{fontWeight:700,fontSize:15,color:"var(--t1)"}}>Telegram</div><div style={{fontSize:11,color:"var(--t2)"}}>Available now</div></div>
            </div>
            {tgDone&&<span className="chip chip-ok">LIVE</span>}
          </div>
          {tgDone?(
            <>
              <div style={{display:"flex",gap:8,padding:"10px 12px",background:"rgba(168,230,61,0.08)",borderRadius:8,marginBottom:12,border:"1px solid rgba(168,230,61,0.15)",alignItems:"center"}}>
                <CheckCircle size={13} color="var(--accent)"/>
                <div><div style={{fontSize:12,fontWeight:600,color:"var(--accent)"}}>Connected</div><div style={{fontSize:11,color:"var(--t2)"}}>@NyraAgentBot · synced now</div></div>
              </div>
              <button className="btn btn-danger btn-full btn-sm" onClick={()=>setTgDone(false)}>Disconnect</button>
            </>
          ):(
            <>
              {[["1","Message @BotFather on Telegram"],["2","Send /newbot, copy the token"],["3","Paste below to connect"]].map(([n,s])=>(
                <div key={n} style={{display:"flex",gap:10,padding:"8px 0",borderBottom:"1px solid var(--border)"}}>
                  <div style={{width:20,height:20,borderRadius:"50%",background:"var(--accent-dim)",border:"1px solid rgba(168,230,61,0.2)",color:"var(--accent)",fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{n}</div>
                  <div style={{fontSize:12,color:"var(--t2)",lineHeight:1.5}}>{s}</div>
                </div>
              ))}
              <input className="inp" placeholder="Paste bot token" style={{margin:"12px 0",fontSize:12}}/>
              <button className="btn btn-accent btn-full" onClick={connect} disabled={connecting}>
                {connecting?<span style={{display:"flex",gap:4}}>{[0,1,2].map(i=><span key={i} className="tdot" style={{animationDelay:`${i*0.2}s`}}/>)}</span>:"Connect Telegram"}
              </button>
            </>
          )}
        </div>
        <div className="card" style={{opacity:0.55}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
            <div style={{display:"flex",gap:10,alignItems:"center"}}>
              <div style={{width:42,height:42,borderRadius:10,background:"rgba(37,211,102,0.08)",display:"flex",alignItems:"center",justifyContent:"center"}}><Globe size={20} color="#25D366"/></div>
              <div><div style={{fontWeight:700,fontSize:15,color:"var(--t1)"}}>WhatsApp</div><div style={{fontSize:11,color:"var(--t2)"}}>Coming soon</div></div>
            </div>
            <span className="chip chip-muted">SOON</span>
          </div>
          <p style={{fontSize:12,color:"var(--t3)",lineHeight:1.65}}>Requires Meta Business API verification. All policies carry over automatically.</p>
        </div>
      </div>
    </div>
  );
}

/* ── Settings ────────────────────────────────────────────────────────────── */
function AppSettings({ onLogout }) {
  const [s, setS] = useState({notifs:true,biometric:false,twoFactor:true,ai:true});
  return (
    <div className="page" style={{maxWidth:560}}>
      <div className="card" style={{marginBottom:14,display:"flex",gap:14,alignItems:"center"}}>
        <div style={{width:52,height:52,borderRadius:12,background:"linear-gradient(135deg,#1A2A0A,var(--accent))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:700,color:"#000",flexShrink:0}}>C</div>
        <div><div style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,fontSize:16,color:"var(--t1)"}}>Candelar</div><div style={{fontSize:12,color:"var(--t2)",marginTop:2}}>candelar@example.com</div></div>
      </div>
      <div className="card">
        {[["Push notifications","Real-time alerts for every Nyra action","notifs"],["Biometric confirmation","Face ID for escalations","biometric"],["Two-factor auth","For high-value confirmations","twoFactor"],["AI suggestions","Let Nyra recommend policy improvements","ai"]].map(([t,sub,k])=>(
          <div key={k} className="pol-row">
            <div><div className="pol-title">{t}</div><div className="pol-sub">{sub}</div></div>
            <Toggle checked={s[k]} onChange={v=>setS(p=>({...p,[k]:v}))}/>
          </div>
        ))}
        <div style={{paddingTop:14}}>
          <button className="btn btn-danger btn-full" onClick={onLogout}><LogOut size={15}/>Sign out</button>
        </div>
      </div>
    </div>
  );
}

/* ── Root App ────────────────────────────────────────────────────────────── */
export default function NyraApp() {
  const [view, setView] = useState("landing");
  const [screen, setScreen] = useState("overview");
  const [nyraActive, setNyraActive] = useState(true);
  const [policy, setPolicy] = useState(INIT_POLICY);
  const [transactions] = useState(MOCK_TXS);
  const escalations = transactions.filter(t=>t.status==="ESCALATED").length;

  if(view==="landing") return(<><style>{CSS}</style><Landing onEnter={()=>setView("auth")}/></>);
  if(view==="auth") return(<><style>{CSS}</style><Auth onAuth={()=>setView("onboarding")}/></>);
  if(view==="onboarding") return(<><style>{CSS}</style><Onboarding onDone={p=>{setPolicy(prev=>({...prev,...p}));setView("app");}}/></>);

  const screenMap = {
    overview: <Overview nyraActive={nyraActive} setNyraActive={setNyraActive} transactions={transactions} policy={policy} escalations={escalations} setScreen={setScreen}/>,
    transactions: <Transactions transactions={transactions}/>,
    ask: <AskNyra policy={policy} transactions={transactions}/>,
    policies: <Policies policy={policy} setPolicy={setPolicy}/>,
    deploy: <Deploy/>,
    settings: <AppSettings onLogout={()=>setView("landing")}/>,
  };

  const mobileNav = [
    {id:"overview",icon:<Home size={20}/>,label:"Overview"},
    {id:"transactions",icon:<Activity size={20}/>,label:"Activity"},
    {id:"ask",icon:<MessageSquare size={20}/>,label:"Ask Nyra"},
    {id:"policies",icon:<Shield size={20}/>,label:"Policies"},
    {id:"settings",icon:<Settings size={20}/>,label:"Settings"},
  ];

  return (
    <>
      <style>{CSS}</style>
      <div className="app-shell">
        <Sidebar screen={screen} setScreen={setScreen} nyraActive={nyraActive} setNyraActive={setNyraActive} escalations={escalations} onLogout={()=>setView("landing")}/>
        <div className="main-area">
          <TopBar nyraActive={nyraActive} setNyraActive={setNyraActive} screen={screen} setScreen={setScreen}/>
          {screen==="ask"
            ?<div style={{flex:1,display:"flex",flexDirection:"column"}}>{screenMap.ask}</div>
            :<div style={{flex:1,overflowY:"auto"}}>{screenMap[screen]||screenMap.overview}</div>
          }
        </div>
        <nav className="mob-bnav">
          {mobileNav.map(n=>(
            <button key={n.id} className={`mob-nitem ${screen===n.id?"on":""}`} onClick={()=>setScreen(n.id)}>
              {n.icon}<span className="mob-nlabel">{n.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
