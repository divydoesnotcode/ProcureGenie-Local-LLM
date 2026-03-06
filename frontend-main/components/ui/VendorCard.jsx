// components/ui/VendorCard.jsx
"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EASE_SOFT = [0.16, 1, 0.3, 1];

// ─── Icons ────────────────────────────────────────────────────────────────────
const PhoneIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const MailIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);
const GlobeIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" />
  </svg>
);
const MapPinIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const ChevronIcon = ({ open }) => (
  <motion.svg
    animate={{ rotate: open ? 180 : 0 }}
    transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
    width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6" />
  </motion.svg>
);
const CopyIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);
const CheckIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// ─── Avatar ───────────────────────────────────────────────────────────────────
const GRADIENTS = [
  ["#7f5af0","#5a35c8"],["#f59e0b","#d97706"],["#10b981","#059669"],
  ["#ef4444","#dc2626"],["#3b82f6","#2563eb"],["#ec4899","#db2777"],
];

function VendorAvatar({ name }) {
  const initials = name.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase() || "").join("");
  const [c1, c2] = GRADIENTS[(name.charCodeAt(0) || 0) % GRADIENTS.length];
  return (
    <div className="relative w-11 h-11 rounded-2xl shrink-0 overflow-hidden"
      style={{ background: `linear-gradient(145deg, ${c1} 0%, ${c2} 100%)`, boxShadow: "0 4px 12px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.2)" }}>
      <div className="absolute inset-x-0 top-0 h-1/2" style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.2), transparent)" }} />
      <div className="absolute inset-0 flex items-center justify-center text-white text-sm font-bold">{initials || "?"}</div>
    </div>
  );
}

// ─── Copy button ──────────────────────────────────────────────────────────────
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = async (e) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="ml-1.5 p-1 rounded-md"
      style={{ transition: "all 200ms ease", color: copied ? "#34d399" : "rgba(255,255,255,0.18)", background: copied ? "rgba(52,211,153,0.08)" : "transparent" }}>
      {copied ? <CheckIcon /> : <CopyIcon />}
    </button>
  );
}

// ─── Contact row ──────────────────────────────────────────────────────────────
function ContactRow({ icon, label, href, copyText }) {
  const inner = (
    <span className="flex items-center gap-2" style={{ color: "rgba(255,255,255,0.42)", transition: "color 220ms ease" }}>
      <span style={{ color: "rgba(127,90,240,0.65)" }}>{icon}</span>
      <span className="text-[12px] font-medium truncate">{label}</span>
      {copyText && <CopyButton text={copyText} />}
    </span>
  );
  if (href) return <a href={href} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="block">{inner}</a>;
  return inner;
}

// ─── Vendor Card ──────────────────────────────────────────────────────────────
export function VendorCard({ vendor, index = 0, compact = false }) {
  const [expanded, setExpanded] = useState(false);
  const hasDetails = vendor.phone || vendor.email || vendor.website || vendor.address;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: index * 0.055, ease: EASE_SOFT }}
      className="group relative"
    >
      <div
        onClick={() => hasDetails && setExpanded(!expanded)}
        className="relative overflow-hidden"
        style={{
          transition: "background 300ms ease, border-color 300ms ease, box-shadow 300ms ease",
          background: "rgba(255,255,255,0.044)",
          backdropFilter: "blur(24px) saturate(1.8)",
          WebkitBackdropFilter: "blur(24px) saturate(1.8)",
          borderRadius: "16px",
          border: "1px solid rgba(255,255,255,0.078)",
          boxShadow: "0 4px 18px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.075)",
          cursor: hasDetails ? "pointer" : "default",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.062)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
          e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.11)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.044)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.078)";
          e.currentTarget.style.boxShadow = "0 4px 18px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.075)";
        }}
      >
        {/* Specular top line */}
        <div className="absolute inset-x-0 top-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.1) 50%, transparent 95%)" }} />

        {/* Main row */}
        <div className="flex items-center gap-3.5 p-4">
          <VendorAvatar name={vendor.vendor_name} />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-[14px] font-semibold tracking-tight truncate mb-1"
                  style={{ color: "rgba(255,255,255,0.88)" }}>
                  {vendor.vendor_name}
                </h3>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(127,90,240,0.11)", border: "1px solid rgba(127,90,240,0.2)", color: "#a78bfa" }}>
                    {vendor.item_name}
                  </span>
                  {vendor.location && (
                    <span className="flex items-center gap-1 text-[11px] font-medium"
                      style={{ color: "rgba(255,255,255,0.26)", borderLeft: "1px solid rgba(255,255,255,0.07)", paddingLeft: "8px" }}>
                      <MapPinIcon />
                      <span className="capitalize">{vendor.location}</span>
                    </span>
                  )}
                </div>
              </div>

              {hasDetails && (
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    transition: "background 280ms ease, color 280ms ease",
                    background: expanded ? "rgba(127,90,240,0.14)" : "rgba(255,255,255,0.045)",
                    color: expanded ? "#a78bfa" : "rgba(255,255,255,0.22)",
                  }}>
                  <ChevronIcon open={expanded} />
                </div>
              )}
            </div>

            {/* Contact preview row */}
            {!compact && !expanded && (vendor.phone || vendor.website) && (
              <div className="flex flex-wrap items-center gap-3 mt-3">
                {vendor.phone && (
                  <span className="flex items-center gap-1.5 text-[11.5px]" style={{ color: "rgba(255,255,255,0.34)" }}>
                    <PhoneIcon />{vendor.phone}
                  </span>
                )}
                {vendor.website && (
                  <span className="flex items-center gap-1.5 text-[11.5px]" style={{ color: "rgba(255,255,255,0.34)" }}>
                    <GlobeIcon />Website
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Expanded detail panel */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="mx-4 mb-4">
                <div className="h-px mb-4" style={{ background: "rgba(255,255,255,0.055)" }} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {vendor.address && (
                    <div className="col-span-full">
                      <p className="text-[10px] font-semibold uppercase tracking-wider mb-2"
                        style={{ color: "rgba(255,255,255,0.2)" }}>Address</p>
                      <div className="flex items-start gap-2.5 rounded-xl px-3 py-2.5"
                        style={{ background: "rgba(255,255,255,0.028)", border: "1px solid rgba(255,255,255,0.055)" }}>
                        <span className="mt-0.5 shrink-0" style={{ color: "rgba(127,90,240,0.55)" }}><MapPinIcon /></span>
                        <p className="text-[12px] leading-relaxed" style={{ color: "rgba(255,255,255,0.56)" }}>{vendor.address}</p>
                      </div>
                    </div>
                  )}

                  {(vendor.phone || vendor.email) && (
                    <div className="space-y-2.5">
                      <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.2)" }}>Contact</p>
                      {vendor.phone && <ContactRow icon={<PhoneIcon />} label={vendor.phone} copyText={vendor.phone} />}
                      {vendor.email && <ContactRow icon={<MailIcon />} label={vendor.email} copyText={vendor.email} />}
                    </div>
                  )}

                  <div className="space-y-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.2)" }}>Web</p>
                    {vendor.website ? (
                      <a href={vendor.website} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}
                        className="flex items-center justify-between rounded-xl px-3 py-2.5"
                        style={{
                          transition: "background 250ms ease",
                          background: "rgba(127,90,240,0.08)",
                          border: "1px solid rgba(127,90,240,0.17)",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(127,90,240,0.14)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(127,90,240,0.08)"; }}
                      >
                        <div className="flex items-center gap-2.5">
                          <span style={{ color: "#9d7bf5" }}><GlobeIcon /></span>
                          <span className="text-[12px] font-semibold" style={{ color: "#c4b5fd" }}>Visit Website</span>
                        </div>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#9d7bf5" strokeWidth="2.5">
                          <path d="M7 17L17 7M17 7H7M17 7V17" />
                        </svg>
                      </a>
                    ) : (
                      <span className="text-[11.5px] italic" style={{ color: "rgba(255,255,255,0.18)" }}>Not available</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Vendor Grid ──────────────────────────────────────────────────────────────
export function VendorGrid({ vendors = [], source = null, item = "", location = "" }) {
  if (!vendors.length) return null;
  return (
    <div className="w-full space-y-5">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE_SOFT }}
        className="flex items-end justify-between px-1"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#7f5af0", boxShadow: "0 0 8px rgba(127,90,240,0.55)" }} />
            <h2 className="text-[15px] font-semibold tracking-tight" style={{ color: "rgba(255,255,255,0.84)" }}>Results</h2>
          </div>
          <p className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.28)" }}>
            {vendors.length} vendor{vendors.length !== 1 ? "s" : ""} · {item || "Items"} in {location || "Network"}
          </p>
        </div>

        {source && (
          <span className="text-[10px] font-semibold uppercase tracking-wide px-3 py-1.5 rounded-full"
            style={{
              background: source === "database" ? "rgba(52,211,153,0.07)" : "rgba(251,191,36,0.07)",
              border: source === "database" ? "1px solid rgba(52,211,153,0.18)" : "1px solid rgba(251,191,36,0.18)",
              color: source === "database" ? "#34d399" : "#fbbf24",
            }}>
            {source === "database" ? "From Vault" : "AI Generated"}
          </span>
        )}
      </motion.div>

      <div className="grid grid-cols-1 gap-3">
        {vendors.map((v, i) => <VendorCard key={v.id || i} vendor={v} index={i} />)}
      </div>
    </div>
  );
}

// ─── Compact variant ──────────────────────────────────────────────────────────
export function VendorCardCompact({ vendor, index = 0 }) {
  return (
    <div style={{ transform: "scale(0.96)", transformOrigin: "left center" }}>
      <VendorCard vendor={vendor} index={index} compact />
    </div>
  );
}