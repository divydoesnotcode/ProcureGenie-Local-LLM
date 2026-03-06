// src/App.jsx
import { useState } from "react";
import { SidebarLayout } from "../components/ui/sidebar-layout";
import { ChatPage } from "../components/ui/ChatPage";
import { VendorGrid } from "../components/ui/VendorCard";
import { generateVendors } from "./api";
import { motion, AnimatePresence } from "framer-motion";
import { BackgroundBeams } from "../components/ui/background-beams";

// Smooth Apple-style easing
const EASE_SOFT = [0.16, 1, 0.3, 1];

// ─── Search Page ─────────────────────────────────────────────────────────────
function SearchPage({ onAskAI }) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [focused, setFocused] = useState(false);

  const handleSearch = async (searchQuery) => {
    const q = (searchQuery || query).trim();
    if (!q) return;
    setLoading(true);
    setError(null);
    try {
      const parts = q.split(" ");
      const item = parts[0];
      const location = parts.slice(1).join(" ") || "India";
      const data = await generateVendors(item, location);
      setResult({ vendors: data.vendors || [], source: data.source, item, location });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-full flex flex-col items-center px-6 pt-16 pb-20 relative overflow-hidden"
      style={{ fontFamily: "DM Sans, system-ui, sans-serif" }}
    >
      {/* ── Background beam lines animation ── */}
      <BackgroundBeams className="opacity-25" />

      {/* Soft ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[10%] w-[70vw] h-[50vh] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(127,90,240,0.07) 0%, transparent 70%)", filter: "blur(90px)" }} />
        <div className="absolute bottom-[5%] right-[-10%] w-[50vw] h-[40vh] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(79,70,229,0.05) 0%, transparent 70%)", filter: "blur(90px)" }} />
      </div>

      <div className="w-full max-w-2xl relative z-10 flex flex-col items-center">

        {/* App icon + headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE_SOFT }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.0, ease: EASE_SOFT, delay: 0.04 }}
            className="mx-auto mb-5 w-16 h-16 rounded-[22px] flex items-center justify-center relative"
            style={{
              background: "linear-gradient(145deg, #7f5af0 0%, #5a35c8 100%)",
              boxShadow: "0 8px 28px rgba(127,90,240,0.38), 0 2px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.25)",
            }}
          >
            <div className="absolute inset-x-0 top-0 h-1/2 rounded-t-[22px]"
              style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.2), transparent)" }} />
            <span className="relative text-white text-2xl font-bold" style={{ fontFamily: "SF Pro Display, system-ui" }}>P</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_SOFT, delay: 0.12 }}
            className="text-[32px] font-bold tracking-tight mb-2"
            style={{ color: "rgba(255,255,255,0.92)", letterSpacing: "-0.03em" }}
          >
            Find Your Vendor
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_SOFT, delay: 0.2 }}
            className="text-[15px] max-w-sm mx-auto leading-relaxed"
            style={{ color: "rgba(255,255,255,0.36)" }}
          >
            AI-powered procurement intelligence. Search any product to discover local suppliers instantly.
          </motion.p>
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_SOFT, delay: 0.26 }}
          className="w-full mb-4"
        >
          <div
            className="relative w-full rounded-2xl"
            style={{
              transition: "border-color 350ms ease, box-shadow 350ms ease",
              background: "rgba(255,255,255,0.055)",
              backdropFilter: "blur(32px) saturate(1.9)",
              WebkitBackdropFilter: "blur(32px) saturate(1.9)",
              border: focused ? "1px solid rgba(127,90,240,0.5)" : "1px solid rgba(255,255,255,0.1)",
              boxShadow: focused
                ? "0 8px 32px rgba(0,0,0,0.28), 0 0 0 4px rgba(127,90,240,0.1), inset 0 1px 0 rgba(255,255,255,0.1)"
                : "0 4px 20px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.07)",
            }}
          >
            <div className="absolute inset-x-0 top-0 h-px rounded-t-2xl"
              style={{ background: "linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.12) 50%, transparent 95%)" }} />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ transition: "color 350ms ease", color: focused ? "rgba(127,90,240,0.7)" : "rgba(255,255,255,0.22)" }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="e.g. laptops Delhi, office chairs Mumbai…"
              className="w-full bg-transparent pl-12 pr-4 py-4 text-[15px] outline-none"
              style={{ color: "rgba(255,255,255,0.88)", fontFamily: "DM Sans, system-ui, sans-serif", caretColor: "#7f5af0" }}
            />
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: EASE_SOFT, delay: 0.34 }}
          className="flex items-center gap-3 w-full"
        >
          <button
            onClick={() => handleSearch()}
            disabled={loading || !query.trim()}
            className="flex-1 py-3 rounded-xl text-[14px] font-semibold tracking-tight disabled:opacity-40"
            style={{
              transition: "all 300ms cubic-bezier(0.4,0,0.2,1)",
              background: "rgba(255,255,255,0.07)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.13)",
              color: "rgba(255,255,255,0.80)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.09)",
            }}
            onMouseEnter={(e) => { if (!e.currentTarget.disabled) { e.currentTarget.style.background = "rgba(255,255,255,0.11)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"; }}}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.13)"; }}
          >
            Search Vault
          </button>
          <button
            onClick={() => onAskAI?.(query)}
            disabled={loading || !query.trim()}
            className="flex-1 py-3 rounded-xl text-[14px] font-semibold tracking-tight disabled:opacity-40"
            style={{
              transition: "all 300ms cubic-bezier(0.4,0,0.2,1)",
              background: "linear-gradient(135deg, #7f5af0 0%, #5a35c8 100%)",
              border: "1px solid rgba(127,90,240,0.4)",
              color: "white",
              boxShadow: "0 4px 14px rgba(127,90,240,0.32), inset 0 1px 0 rgba(255,255,255,0.2)",
            }}
            onMouseEnter={(e) => { if (!e.currentTarget.disabled) { e.currentTarget.style.boxShadow = "0 6px 22px rgba(127,90,240,0.42), inset 0 1px 0 rgba(255,255,255,0.25)"; e.currentTarget.style.transform = "translateY(-1px)"; }}}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 4px 14px rgba(127,90,240,0.32), inset 0 1px 0 rgba(255,255,255,0.2)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            Ask ProcureGenie AI
          </button>
        </motion.div>

        {/* Suggestion pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.1, ease: EASE_SOFT, delay: 0.48 }}
          className="flex flex-wrap justify-center gap-2 mt-5"
        >
          {["Laptops Delhi", "Office Chairs Mumbai", "Electronics Bangalore", "CCTV Chennai"].map((s, i) => (
            <motion.button
              key={s}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE_SOFT, delay: 0.52 + i * 0.07 }}
              onClick={() => { setQuery(s); handleSearch(s); }}
              className="text-[12px] font-medium px-3.5 py-1.5 rounded-full"
              style={{
                transition: "all 250ms cubic-bezier(0.4,0,0.2,1)",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
                color: "rgba(255,255,255,0.32)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "rgba(255,255,255,0.62)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "rgba(255,255,255,0.32)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}
            >
              {s}
            </motion.button>
          ))}
        </motion.div>

        {/* Loading */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5, ease: EASE_SOFT }}
              className="mt-8 flex items-center gap-3"
            >
              <svg className="animate-spin w-5 h-5" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="8" stroke="rgba(127,90,240,0.18)" strokeWidth="2" />
                <path d="M10 2a8 8 0 0 1 8 8" stroke="#7f5af0" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className="text-[13px] font-medium" style={{ color: "rgba(255,255,255,0.38)" }}>
                Searching procurement database…
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.45, ease: EASE_SOFT }}
              className="mt-5 px-4 py-3 rounded-2xl text-[13px] text-center"
              style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.18)", color: "#f87171" }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.7, ease: EASE_SOFT }}
              className="w-full mt-10"
            >
              <VendorGrid vendors={result.vendors} source={result.source} item={result.item} location={result.location} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────
function App() {
  const [view, setView] = useState("search");
  const [initialChatQuery, setInitialChatQuery] = useState("");

  const handleAskAI = (query) => { setInitialChatQuery(query); setView("chat"); };
  const handleClearInitialQuery = () => setInitialChatQuery("");

  return (
    <SidebarLayout onNavigate={setView} activeView={view}>
      <AnimatePresence mode="wait">
        {view === "chat" ? (
          <motion.div key="chat" className="h-full"
            initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.45, ease: EASE_SOFT }}>
            <ChatPage initialQuery={initialChatQuery} onQueryProcessed={handleClearInitialQuery} />
          </motion.div>
        ) : (
          <motion.div key="search" className="h-full"
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.45, ease: EASE_SOFT }}>
            <SearchPage onAskAI={handleAskAI} />
          </motion.div>
        )}
      </AnimatePresence>
    </SidebarLayout>
  );
}

export default App;