// components/ui/ChatPage.jsx
"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sendChatMessage } from "../../src/api";
import { VendorCardCompact } from "./VendorCard";
import { BackgroundBeams } from "./background-beams";

const EASE_SOFT = [0.16, 1, 0.3, 1];

// ─── Typing wave ──────────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex items-center gap-[5px] px-4 py-3.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="block rounded-full"
          style={{ width: 5, height: 5, background: "rgba(127,90,240,0.65)" }}
          animate={{ y: [0, -5, 0], opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function GeniAvatar({ size = 32 }) {
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-2xl"
        style={{
          background: "linear-gradient(145deg, #7f5af0 0%, #5a35c8 100%)",
          boxShadow: "0 2px 10px rgba(127,90,240,0.38), inset 0 1px 0 rgba(255,255,255,0.25)",
        }} />
      <div className="absolute inset-x-0 top-0 h-1/2 rounded-t-2xl"
        style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.18), transparent)" }} />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white font-bold text-[11px]" style={{ fontFamily: "SF Pro Display, system-ui" }}>G</span>
      </div>
    </div>
  );
}

// ─── Chat bubble ──────────────────────────────────────────────────────────────
function ChatBubble({ msg, isLatest }) {
  const isUser = msg.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, ease: EASE_SOFT }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-5 group`}
    >
      {!isUser && (
        <div className="mr-2.5 mt-0.5 shrink-0"><GeniAvatar size={30} /></div>
      )}

      <div className={`space-y-3 ${isUser ? "max-w-[72%]" : "max-w-[88%]"}`}>
        {/* Bubble */}
        <div
          className="relative px-4 py-3 text-[13.5px] leading-relaxed"
          style={isUser ? {
            background: "linear-gradient(135deg, rgba(127,90,240,0.82) 0%, rgba(90,53,200,0.82) 100%)",
            backdropFilter: "blur(24px) saturate(1.8)",
            WebkitBackdropFilter: "blur(24px) saturate(1.8)",
            borderRadius: "18px 18px 4px 18px",
            border: "1px solid rgba(127,90,240,0.38)",
            boxShadow: "0 4px 18px rgba(127,90,240,0.18), inset 0 1px 0 rgba(255,255,255,0.18)",
            color: "rgba(255,255,255,0.95)",
          } : {
            background: "rgba(255,255,255,0.052)",
            backdropFilter: "blur(28px) saturate(1.8)",
            WebkitBackdropFilter: "blur(28px) saturate(1.8)",
            borderRadius: "4px 18px 18px 18px",
            border: "1px solid rgba(255,255,255,0.088)",
            boxShadow: "0 4px 18px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.86)",
          }}
        >
          {!isUser && (
            <div className="absolute inset-x-0 top-0 h-px rounded-t-[4px]"
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)" }} />
          )}
          {msg.content}
        </div>

        {/* Vendor cards */}
        {!isUser && msg.vendors && msg.vendors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_SOFT, delay: 0.18 }}
            className="space-y-3 pt-1"
          >
            <div className="flex items-center gap-2 px-1">
              <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.055)" }} />
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full"
                style={{
                  background: msg.source === "database" ? "rgba(52,211,153,0.09)" : "rgba(251,191,36,0.09)",
                  border: msg.source === "database" ? "1px solid rgba(52,211,153,0.22)" : "1px solid rgba(251,191,36,0.22)",
                  color: msg.source === "database" ? "#34d399" : "#fbbf24",
                }}>
                {msg.vendors.length} found · {msg.source === "database" ? "Vault" : "AI"}
              </span>
              <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.055)" }} />
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              {msg.vendors.map((v, i) => (
                <VendorCardCompact key={v.id || i} vendor={v} index={i} />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {isUser && (
        <div className="ml-2.5 mt-0.5 shrink-0 w-[30px] h-[30px] rounded-full flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.055)", border: "1px solid rgba(255,255,255,0.09)" }}>
          <span className="text-[9px] font-bold tracking-tight" style={{ color: "rgba(255,255,255,0.3)" }}>YOU</span>
        </div>
      )}
    </motion.div>
  );
}

// ─── Suggestion chips ─────────────────────────────────────────────────────────
const SUGGESTIONS = [
  { text: "Find laptop vendors in Delhi", icon: "💻" },
  { text: "Office chairs in Mumbai", icon: "🪑" },
  { text: "Electronics in Bangalore", icon: "🔌" },
  { text: "Security gear in Chennai", icon: "🛡️" },
];

function SuggestionChips({ onSelect }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE_SOFT, delay: 0.25 }}
      className="mt-8 mb-2"
    >
      <p className="text-center text-[11px] font-medium tracking-widest uppercase mb-4"
        style={{ color: "rgba(255,255,255,0.18)" }}>
        Quick Search
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-md mx-auto">
        {SUGGESTIONS.map((s, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE_SOFT, delay: 0.3 + i * 0.07 }}
            onClick={() => onSelect(s.text)}
            className="flex items-center gap-3 text-left text-[12.5px] rounded-2xl px-4 py-3 group"
            style={{
              transition: "all 280ms cubic-bezier(0.4,0,0.2,1)",
              background: "rgba(255,255,255,0.032)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.07)",
              color: "rgba(255,255,255,0.42)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(127,90,240,0.09)";
              e.currentTarget.style.borderColor = "rgba(127,90,240,0.22)";
              e.currentTarget.style.color = "rgba(255,255,255,0.78)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.032)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
              e.currentTarget.style.color = "rgba(255,255,255,0.42)";
            }}
          >
            <span className="text-base" style={{ opacity: 0.55 }}>{s.icon}</span>
            <span className="font-medium">{s.text}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Main Chat ────────────────────────────────────────────────────────────────
export function ChatPage({ initialQuery, onQueryProcessed }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm ProcureGenie, your AI procurement assistant. Tell me what product you're sourcing and where — I'll find the best vendors for you.",
      vendors: [],
      source: null,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      sendMessage(initialQuery);
      onQueryProcessed?.();
    }
  }, [initialQuery]);

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setMessages((prev) => [...prev, { role: "user", content: trimmed, vendors: [], source: null }]);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setLoading(true);
    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const data = await sendChatMessage(trimmed, history);
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply, vendors: data.vendors || [], source: data.source }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Something went wrong. Please try again.", vendors: [], source: null }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  return (
    <div className="flex flex-col h-full w-full relative overflow-hidden"
      style={{ background: "transparent", fontFamily: "DM Sans, system-ui, sans-serif" }}>

      {/* Background beams (subtle, under glass) */}
      <BackgroundBeams className="opacity-15" />

      {/* ── Glass toolbar ─── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE_SOFT }}
        className="shrink-0 flex items-center justify-between px-5 py-3.5 z-20 relative"
        style={{
          background: "rgba(16,16,20,0.72)",
          backdropFilter: "blur(40px) saturate(1.9)",
          WebkitBackdropFilter: "blur(40px) saturate(1.9)",
          borderBottom: "1px solid rgba(255,255,255,0.055)",
          boxShadow: "0 1px 0 rgba(255,255,255,0.035)",
        }}
      >
        <div className="flex items-center gap-3">
          <GeniAvatar size={28} />
          <div>
            <p className="text-white text-[13.5px] font-semibold leading-tight tracking-tight">ProcureGenie</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="relative flex h-[6px] w-[6px]">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-55" />
                <span className="relative inline-flex rounded-full h-[6px] w-[6px] bg-emerald-400" />
              </span>
              <span className="text-[10px] font-medium tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.26)" }}>
                Live · AI Assistant
              </span>
            </div>
          </div>
        </div>

        <button
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{
            transition: "all 250ms ease",
            background: "rgba(255,255,255,0.045)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.3)",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.09)"; e.currentTarget.style.color = "rgba(255,255,255,0.65)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.045)"; e.currentTarget.style.color = "rgba(255,255,255,0.3)"; }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </button>
      </motion.div>

      {/* ── Messages ─── */}
      <div className="flex-1 overflow-y-auto px-5 py-6 relative z-10">
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="popLayout">
            {messages.map((msg, i) => (
              <ChatBubble key={i} msg={msg} isLatest={i === messages.length - 1} />
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.45, ease: EASE_SOFT }}
                className="flex justify-start mb-5"
              >
                <div className="mr-2.5 mt-0.5 shrink-0"><GeniAvatar size={30} /></div>
                <div style={{
                  background: "rgba(255,255,255,0.052)",
                  backdropFilter: "blur(28px)",
                  WebkitBackdropFilter: "blur(28px)",
                  borderRadius: "4px 18px 18px 18px",
                  border: "1px solid rgba(255,255,255,0.088)",
                  boxShadow: "0 4px 18px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.08)",
                }}>
                  <TypingDots />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Suggestions on fresh chat */}
          {messages.length === 1 && !loading && (
            <SuggestionChips onSelect={sendMessage} />
          )}
          <div ref={bottomRef} className="h-2" />
        </div>
      </div>

      {/* ── Glass input bar ─── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: EASE_SOFT, delay: 0.1 }}
        className="shrink-0 px-5 pb-5 pt-3 z-20 relative"
      >
        <div className="absolute inset-x-0 top-0 h-10 pointer-events-none"
          style={{ background: "linear-gradient(to top, transparent, rgba(13,13,15,0.35))" }} />

        <div className="relative max-w-3xl mx-auto">
          <div
            className="relative flex items-end gap-2.5 rounded-[22px] p-1.5"
            style={{
              transition: "border-color 350ms ease, box-shadow 350ms ease",
              background: "rgba(255,255,255,0.048)",
              backdropFilter: "blur(32px) saturate(1.8)",
              WebkitBackdropFilter: "blur(32px) saturate(1.8)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.09)",
            }}
            onFocusCapture={(e) => {
              e.currentTarget.style.borderColor = "rgba(127,90,240,0.45)";
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.32), 0 0 0 3px rgba(127,90,240,0.11), inset 0 1px 0 rgba(255,255,255,0.09)";
            }}
            onBlurCapture={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.09)";
            }}
          >
            <div className="absolute inset-x-0 top-0 h-px rounded-t-[22px]"
              style={{ background: "linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.11) 50%, transparent 95%)" }} />

            <div className="flex-1 px-2.5">
              <textarea
                ref={(el) => { inputRef.current = el; textareaRef.current = el; }}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search for vendors, e.g. laptops in Delhi"
                rows={1}
                disabled={loading}
                className="w-full bg-transparent py-3 text-[13.5px] resize-none outline-none leading-relaxed"
                style={{
                  minHeight: "24px",
                  maxHeight: "140px",
                  color: "rgba(255,255,255,0.86)",
                  fontFamily: "DM Sans, system-ui, sans-serif",
                  caretColor: "#7f5af0",
                }}
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 140) + "px";
                }}
              />
            </div>

            {/* Send button */}
            <button
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
              style={{
                transition: "all 280ms cubic-bezier(0.4,0,0.2,1)",
                background: input.trim() && !loading
                  ? "linear-gradient(135deg, #7f5af0 0%, #5a35c8 100%)"
                  : "rgba(255,255,255,0.055)",
                border: input.trim() && !loading
                  ? "1px solid rgba(127,90,240,0.45)"
                  : "1px solid rgba(255,255,255,0.08)",
                boxShadow: input.trim() && !loading
                  ? "0 4px 12px rgba(127,90,240,0.32), inset 0 1px 0 rgba(255,255,255,0.2)"
                  : "none",
                opacity: loading ? 0.38 : 1,
              }}
              onMouseEnter={(e) => {
                if (!e.currentTarget.disabled && input.trim()) {
                  e.currentTarget.style.transform = "scale(1.07)";
                  e.currentTarget.style.boxShadow = "0 6px 16px rgba(127,90,240,0.4), inset 0 1px 0 rgba(255,255,255,0.22)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = input.trim() && !loading
                  ? "0 4px 12px rgba(127,90,240,0.32), inset 0 1px 0 rgba(255,255,255,0.2)"
                  : "none";
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke={input.trim() && !loading ? "white" : "rgba(255,255,255,0.28)"}
                strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                style={{ transform: "translateX(0.5px)" }}>
                <path d="M22 2L11 13" /><path d="M22 2L15 22L11 13L2 9L22 2Z" />
              </svg>
            </button>
          </div>

          <p className="text-center mt-3 text-[10px] font-medium tracking-wider"
            style={{ color: "rgba(255,255,255,0.14)" }}>
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      </motion.div>
    </div>
  );
}