"use client";
import React, { useState, useMemo } from "react";
import { useRange } from "@/components/range-context";
import { useSatisfactionData } from "@/hooks/use-metrics";
import { ReviewItem } from "@/lib/types/api";

type Tab = "reviews" | "negative" | "social";

// ── Helpers ──────────────────────────────────────────────────────────────────

const typeBadge: Record<string, { label: string; color: string }> = {
    "GOOGLE": { label: "GOOGLE", color: "#4285F4" },
    "SEVENROOMS": { label: "SEVENROOMS", color: "#8b5cf6" },
};

// ── Sub-components ─────────────────────────────────────────────────────────────

const RatingBars = ({ distribution }: { distribution: Record<string, number> }) => {
    const bars = [
        { star: "5★", pct: distribution["5"] || 0, color: "#22a06b" },
        { star: "4★", pct: distribution["4"] || 0, color: "#86c765" },
        { star: "3★", pct: distribution["3"] || 0, color: "#f5a623" },
        { star: "2★", pct: distribution["2"] || 0, color: "#f07d58" },
        { star: "1★", pct: distribution["1"] || 0, color: "#e5534b" },
    ];
    return (
        <div className="mt-4 space-y-2">
            {bars.map(({ star, pct, color }) => (
                <div key={star} className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-gray-400 w-6">{star}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${pct}%`, background: color }} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 w-8 text-right">{Math.round(pct)}%</span>
                </div>
            ))}
        </div>
    );
};

const StatCard = ({
    label,
    value,
    badge,
    badgeColor,
    secondary,
    children,
}: {
    label: string;
    value: string | number;
    badge?: string;
    badgeColor?: "green" | "red" | "orange";
    secondary?: string;
    children?: React.ReactNode;
}) => {
    const badgeStyles: Record<string, string> = {
        green: "text-emerald-600 bg-emerald-50 border-emerald-100",
        red: "text-red-500 bg-red-50 border-red-100",
        orange: "text-amber-600 bg-amber-50 border-amber-100",
    };
    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex-1 min-w-0 flex flex-col">
            <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2">{label}</div>
            <div className="text-3xl font-light text-slate-900 leading-none mb-2">
                {value}
            </div>
            {badge && (
                <div className="mt-1">
                    <span className={`text-[10px] font-bold rounded-full px-2 py-0.5 border ${badgeStyles[badgeColor || "green"]}`}>
                        {badge}
                    </span>
                </div>
            )}
            {secondary && <div className="text-[11px] font-medium text-slate-400 mt-2">{secondary}</div>}
            <div className="mt-auto">{children}</div>
        </div>
    );
};

const ReviewsTab = ({ reviews }: { reviews: ReviewItem[] }) => {
    const [activeFilter, setActiveFilter] = useState("All ★");
    const [search, setSearch] = useState("");
    const filters = ["All ★", "5★", "4★", "3★", "2★", "1★"];

    const filtered = useMemo(() => {
        return reviews.filter(r => {
            const matchStar = activeFilter === "All ★" || `${r.rating}★` === activeFilter;
            const matchSearch = !search || r.guest.toLowerCase().includes(search.toLowerCase()) || r.content.toLowerCase().includes(search.toLowerCase());
            return matchStar && matchSearch;
        });
    }, [reviews, activeFilter, search]);

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-6 flex-wrap">
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border border-slate-100 bg-slate-50 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-600 w-64 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                        placeholder="Search reviews..."
                    />
                </div>
                {filters.map((f) => (
                    <button
                        key={f}
                        onClick={() => setActiveFilter(f)}
                        className={`border rounded-xl px-4 py-2 text-xs font-bold transition-all ${activeFilter === f
                            ? "bg-slate-900 text-white border-slate-900"
                            : "border-slate-100 text-slate-500 bg-white hover:bg-slate-50"
                            }`}
                    >
                        {f}
                    </button>
                ))}
                <select className="border border-slate-100 bg-white rounded-xl px-3 py-2 text-xs font-bold text-slate-600 outline-none cursor-pointer">
                    <option>All Sources</option>
                    <option>Google</option>
                    <option>SevenRooms</option>
                </select>
                <span className="ml-auto text-xs font-bold text-slate-300 uppercase tracking-wider">{filtered.length} reviews</span>
            </div>
            <div className="space-y-6">
                {filtered.map((r, i) => (
                    <div key={i} className="border-t border-slate-50 pt-6 first:border-t-0 first:pt-0 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-[15px] text-slate-900">{r.guest}</span>
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">{r.source}</span>
                                <span className={`text-[10px] font-bold flex items-center gap-1.5 ${r.status === 'RESPONDED' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${r.status === 'RESPONDED' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                    {r.status}
                                </span>
                            </div>
                        </div>
                        <div className="text-amber-400 text-sm tracking-widest">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
                        <div className="text-[14px] text-slate-600 leading-relaxed font-medium italic">
                            {r.content ? `"${r.content}"` : <span className="text-slate-300 font-normal">No comment provided.</span>}
                        </div>
                        <div className="flex gap-2 mt-2">
                            <span className="bg-slate-50 text-slate-500 font-bold border border-slate-100 rounded-lg px-3 py-1 text-[10px] uppercase">{r.date}</span>
                            <span className="bg-slate-50 text-slate-500 font-bold border border-slate-100 rounded-lg px-3 py-1 text-[10px] uppercase">{r.area}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ─── MAIN DASHBOARD ─────────────────────────────────────────────────────────

export default function GuestSatisfactionDashboard() {
    const { activeRange, customStart, customEnd } = useRange();
    const { data, isLoading, error } = useSatisfactionData(activeRange, customStart, customEnd);

    if (isLoading) return <div className="p-20 text-center text-slate-400 font-medium">Loading Satisfaction Analysis...</div>;
    if (error || !data) return <div className="p-20 text-center text-red-400 font-medium">Error loading satisfaction data.</div>;

    const { summary, reviews } = data;

    return (
        <div className="p-8 bg-[#f8f9fb] min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
            <div className="w-full mx-auto space-y-6">
                
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-bold text-slate-900">Guest Satisfaction Analysis</h1>
                    <div className="flex items-center gap-4">
                        <div className="bg-white border border-slate-200 rounded-full px-4 py-1.5 text-[11px] font-bold text-slate-500 shadow-sm">
                            Period: <span className="text-indigo-600 capitalize">{activeRange}</span>
                        </div>
                    </div>
                </div>

                {/* STAT CARDS */}
                <div className="flex gap-4">
                    <StatCard label="Avg Rating" value={`${summary.avg_rating}/5`} badge="+0.2 vs LM" badgeColor="green">
                        <RatingBars distribution={summary.star_distribution} />
                    </StatCard>
                    <StatCard label="Total Reviews" value={summary.total_reviews} secondary="All platforms combined">
                        <div className="mt-6 flex flex-col gap-1">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sentiment Mix</div>
                            <div className="flex h-2 rounded-full overflow-hidden w-full bg-slate-100">
                                <div style={{ width: '80%', background: '#22a06b' }} />
                                <div style={{ width: '15%', background: '#f5a623' }} />
                                <div style={{ width: '5%', background: '#e5534b' }} />
                            </div>
                        </div>
                    </StatCard>
                    <StatCard label="Negative Reviews" value={summary.negative_reviews.count} badge={`${summary.negative_reviews.percentage}% of total`} badgeColor="red">
                        <div className="mt-8 text-[11px] text-slate-400 font-medium italic">
                            "Main issues: Service speed & Wait time"
                        </div>
                    </StatCard>
                    <StatCard label="Response Rate" value={`${summary.response_rate}%`} badge="Attention needed" badgeColor="orange" secondary="Pending replies across platforms">
                        <div className="mt-6 flex items-center justify-between text-[11px] font-bold text-slate-400">
                            <span>GOOGLE: 0%</span>
                            <span>SEVENROOMS: 0%</span>
                        </div>
                    </StatCard>
                    <StatCard label="Review Sources" value="2 Live" secondary="Connected feeds">
                        <div className="mt-6 flex gap-2">
                            <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold border border-blue-100">GOOGLE</span>
                            <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-bold border border-indigo-100">SEVENROOMS</span>
                        </div>
                    </StatCard>
                </div>

                {/* TABS (Static for now as requested) */}
                <div className="flex gap-2">
                    <button className="px-6 py-2.5 rounded-full text-sm font-bold bg-slate-900 text-white shadow-lg shadow-slate-900/20">Reviews Feed</button>
                    <button className="px-6 py-2.5 rounded-full text-sm font-bold text-slate-500 bg-white border border-slate-100 hover:bg-slate-50 transition-all">Sentiment Analysis</button>
                    <button className="px-6 py-2.5 rounded-full text-sm font-bold text-slate-500 bg-white border border-slate-100 hover:bg-slate-50 transition-all">Social Alerts</button>
                </div>

                {/* TAB CONTENT */}
                <ReviewsTab reviews={reviews} />
            </div>
        </div>
    );
}
