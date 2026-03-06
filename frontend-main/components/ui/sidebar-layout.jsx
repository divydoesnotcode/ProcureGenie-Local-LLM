// components/ui/sidebar-layout.jsx
"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";
import divyImg from "../images/divyImage.jpeg";

const EASE_SOFT = [0.16, 1, 0.3, 1];

const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>
);
const IconChat = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const IconSettings = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);
const IconLogout = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

function NavItem({ icon, label, isActive, onClick, open }) {
  return (
    <button
      onClick={onClick}
      className="relative flex items-center gap-3 w-full rounded-xl px-3 py-2 text-left group"
      style={{ WebkitAppRegion: "no-drag" }}
    >
      {/* Active background — smooth layoutId spring */}
      {isActive && (
        <motion.div
          layoutId="nav-active-bg"
          className="absolute inset-0 rounded-xl"
          style={{
            background: "rgba(127,90,240,0.16)",
            border: "1px solid rgba(127,90,240,0.26)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.09), 0 2px 8px rgba(127,90,240,0.12)",
          }}
          transition={{ type: "spring", stiffness: 280, damping: 32 }}
        />
      )}

      {/* Hover background */}
      {!isActive && (
        <div className="absolute inset-0 rounded-xl bg-white/0 group-hover:bg-white/[0.038]"
          style={{ transition: "background 250ms ease" }} />
      )}

      <span
        className="relative z-10 shrink-0"
        style={{
          transition: "color 280ms ease",
          color: isActive ? "#9d7bf5" : "rgba(255,255,255,0.3)",
        }}
      >
        {icon}
      </span>

      <AnimatePresence>
        {open && (
          <motion.span
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.25, ease: EASE_SOFT }}
            className="relative z-10 text-[13px] font-medium tracking-tight whitespace-nowrap"
            style={{ color: isActive ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.38)" }}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

export function SidebarLayout({ children, onNavigate, activeView }) {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { label: "Search", view: "search", icon: <IconSearch /> },
    { label: "Assistant", view: "chat", icon: <IconChat /> },
    { label: "Settings", view: null, icon: <IconSettings /> },
    { label: "Sign Out", view: null, icon: <IconLogout /> },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0d0d0f]">

      {/* ── Sidebar ─── */}
      <motion.div
        animate={{ width: open ? 220 : 64 }}
        transition={{ type: "spring", stiffness: 260, damping: 34 }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="relative h-full shrink-0 flex flex-col overflow-hidden z-30"
        style={{
          background: "rgba(15,15,19,0.80)",
          backdropFilter: "blur(60px) saturate(2.0)",
          WebkitBackdropFilter: "blur(60px) saturate(2.0)",
          borderRight: "1px solid rgba(255,255,255,0.055)",
        }}
      >
        {/* Top specular gradient */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.035) 0%, transparent 35%)" }} />

        {/* ── Logo ─── */}
        <div className="flex items-center gap-3 px-4 pt-5 pb-4 shrink-0">
          <div className="relative w-9 h-9 rounded-2xl shrink-0 overflow-hidden shadow-lg flex-shrink-0"
            style={{
              background: "linear-gradient(145deg, #7f5af0 0%, #5a35c8 100%)",
              boxShadow: "0 4px 14px rgba(127,90,240,0.38), inset 0 1px 0 rgba(255,255,255,0.25)",
            }}>
            <div className="absolute inset-x-0 top-0 h-1/2"
              style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.2), transparent)" }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-bold text-base" style={{ fontFamily: "SF Pro Display, system-ui" }}>P</span>
            </div>
          </div>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.3, ease: EASE_SOFT }}
                className="min-w-0"
              >
                <p className="text-white text-[14px] font-semibold tracking-tight leading-none truncate">ProcureGenie</p>
                <p className="text-[10px] font-medium tracking-widest uppercase mt-1 truncate"
                  style={{ color: "rgba(255,255,255,0.28)" }}>Sourcing AI</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Section label */}
        <AnimatePresence>
          {open && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="px-4 pb-1.5 text-[10px] font-semibold tracking-widest uppercase"
              style={{ color: "rgba(255,255,255,0.18)" }}
            >
              Navigation
            </motion.p>
          )}
        </AnimatePresence>

        {/* ── Nav items ─── */}
        <div className="flex-1 flex flex-col gap-0.5 px-2.5 py-1 overflow-hidden">
          {navLinks.map((link) => (
            <NavItem
              key={link.label}
              icon={link.icon}
              label={link.label}
              isActive={activeView === link.view && link.view !== null}
              onClick={() => link.view && onNavigate?.(link.view)}
              open={open}
            />
          ))}
        </div>

        {/* Divider */}
        <div className="mx-3 h-px mb-3" style={{ background: "rgba(255,255,255,0.055)" }} />

        {/* ── User ─── */}
        <div className="px-2.5 pb-5 shrink-0">
          <button
            className="flex items-center gap-3 w-full rounded-xl px-2.5 py-2 group"
            style={{ transition: "background 250ms ease" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.038)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            <div className="relative w-8 h-8 rounded-full shrink-0 overflow-hidden"
              style={{ boxShadow: "0 0 0 1.5px rgba(255,255,255,0.12)" }}>
              <img src={divyImg} className="w-full h-full object-cover" alt="avatar" />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0f0f13]"
                style={{ boxShadow: "0 0 5px rgba(52,211,153,0.55)" }} />
            </div>
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{ duration: 0.25, ease: EASE_SOFT }}
                  className="min-w-0 text-left"
                >
                  <p className="text-[13px] font-medium leading-tight truncate" style={{ color: "rgba(255,255,255,0.82)" }}>Divy Barot</p>
                  <p className="text-[11px] truncate" style={{ color: "rgba(255,255,255,0.28)" }}>Pro Plan</p>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.div>

      {/* ── Main content ─── */}
      <div className="flex-1 relative overflow-hidden">
        {/* Ambient glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[400px] rounded-full"
            style={{ background: "radial-gradient(ellipse, rgba(127,90,240,0.065) 0%, transparent 70%)", filter: "blur(50px)" }} />
          <div className="absolute bottom-0 right-0 w-[500px] h-[400px] rounded-full"
            style={{ background: "radial-gradient(ellipse, rgba(79,70,229,0.045) 0%, transparent 70%)", filter: "blur(50px)" }} />
        </div>
        <div className="h-full overflow-y-auto relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
}

export const Logo = () => null;
export const LogoIcon = () => null;