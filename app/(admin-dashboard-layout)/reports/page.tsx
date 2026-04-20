"use client";
import { useState } from "react";

const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap";
document.head.appendChild(fontLink);

const emailAddresses = [
    "user1@example.com",
    "user2@example.com",
    "user3@example.com",
    "user4@example.com",
];

function EmailLink({ email }: { email: string }) {
    return (
        <a
            href={`mailto:${email}`}
            className="text-blue-500 hover:underline" style={{ fontSize: '13px' }}
        >
            [email protected]
        </a>
    );
}

function StatusBadge({ status }: { status: "Active" | "Inactive" }) {
    return (
        <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${status === "Active"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-500"
                }`}
        >
            {status}
        </span>
    );
}

function TypeBadge({ type }: { type: "AUTO" | "MANUAL" }) {
    return (
        <span
            className={`px-2 py-0.5 rounded text-xs font-semibold tracking-wide ${type === "AUTO"
                ? "bg-blue-100 text-blue-600"
                : "bg-purple-100 text-purple-600"
                }`}
        >
            {type}
        </span>
    );
}

function PdfButton({ variant = "active" }: { variant?: "active" | "inactive" }) {
    return (
        <button
            className={`px-3 py-1 rounded text-xs font-semibold border ${variant === "active"
                ? "border-orange-400 text-orange-500 hover:bg-orange-50"
                : "border-gray-300 text-gray-400 hover:bg-gray-50"
                }`}
        >
            ↓ PDF
        </button>
    );
}

export default function ReportsDashboard() {
    const [, setExporting] = useState<string | null>(null);

    const handleExport = (report: string) => {
        setExporting(report);
        setTimeout(() => setExporting(null), 1500);
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {/* Top Banner */}
            <div className="bg-teal-50 border-b border-teal-100 px-6 py-2 flex items-center justify-between text-gray-600" style={{ fontSize: '13px' }}>
                <span>Export weekly and monthly reports as PDF · Auto-generated every Monday & 1st of month</span>
                <span className="flex items-center gap-2 text-green-600 font-medium">
                    <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                    Auto-send active · Next: Mon 23 Mar 2026
                </span>
            </div>

            <div className="w-full px-6 py-6 space-y-6">
                {/* Report Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Weekly Pulse Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
                        <div className="p-6 flex flex-col h-full">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <p className="text-xs font-medium text-blue-500 uppercase tracking-widest mb-1" style={{ letterSpacing: '0.12em', fontSize: '10px' }}>Weekly</p>
                                    <h2 className="font-bold text-gray-900" style={{ fontSize: '22px', lineHeight: '1.2' }}>Weekly Pulse</h2>
                                    <p className="text-gray-500 mt-1" style={{ fontSize: '13px' }}>Key KPIs · Revenue by Area · Alerts & Actions</p>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-xl">📊</div>
                            </div>
                            <ul className="space-y-1.5 mb-6">
                                {[
                                    "Revenue & Operations KPIs with VS LY + YTD",
                                    "Revenue breakdown by space",
                                    "Top 3 highlights · Top 3 action alerts",
                                    "Satisfaction & Labour cost summary",
                                ].map((item) => (
                                    <li key={item} className="flex items-start gap-2 text-gray-700" style={{ fontSize: '13px' }}>
                                        <span className="text-blue-400 mt-0.5">✓</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-auto flex items-end justify-between">
                                <div className="text-gray-400 space-y-0.5" style={{ fontSize: '11.5px' }}>
                                    <p>Format: 2 pages · PDF · English</p>
                                    <p>Auto-sent: Every Monday · 08:00</p>
                                </div>
                                <button
                                    onClick={() => handleExport("weekly")}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg transition-colors" style={{ fontSize: '13px' }}
                                >
                                    ↓ Export PDF
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Monthly Review Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="h-1 bg-gradient-to-r from-orange-400 to-yellow-400" />
                        <div className="p-6 flex flex-col h-full">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <p className="text-xs font-medium text-orange-500 uppercase tracking-widest mb-1" style={{ letterSpacing: '0.12em', fontSize: '10px' }}>Monthly</p>
                                    <h2 className="font-bold text-gray-900" style={{ fontSize: '22px', lineHeight: '1.2' }}>Monthly Review</h2>
                                    <p className="text-gray-500 mt-1" style={{ fontSize: '13px' }}>Full analysis · 5 pages · For management meeting</p>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-xl">🗂️</div>
                            </div>
                            <ul className="space-y-1.5 mb-6">
                                {[
                                    "Executive summary + business health scorecard",
                                    "Sales deep dive · Top 10 products",
                                    "Clients, loyalty & satisfaction analysis",
                                    "Staff costs · Absenteeism · Productivity",
                                    "Marketing & paid media performance",
                                ].map((item) => (
                                    <li key={item} className="flex items-start gap-2 text-gray-700" style={{ fontSize: '13px' }}>
                                        <span className="text-orange-400 mt-0.5">✓</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-auto flex items-end justify-between">
                                <div className="text-gray-400 space-y-0.5" style={{ fontSize: '11.5px' }}>
                                    <p>Format: 5 pages · PDF · English</p>
                                    <p>Auto-sent: 1st of month · 07:00</p>
                                </div>
                                <button
                                    onClick={() => handleExport("monthly")}
                                    className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-5 py-2 rounded-lg transition-colors" style={{ fontSize: '13px' }}
                                >
                                    ↓ Export PDF
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Auto-Send Schedule */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <p className="font-medium text-gray-400 uppercase tracking-widest" style={{ fontSize: '10px', letterSpacing: '0.12em' }}>Auto-Send Schedule</p>
                        <button className="text-gray-300 hover:text-gray-500 text-lg leading-none">—</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full" style={{ fontSize: '13px' }}>
                            <thead>
                                <tr className="text-gray-400 uppercase border-b border-gray-100" style={{ fontSize: '10px', letterSpacing: '0.08em' }}>
                                    <th className="text-left px-6 py-3 font-medium">Report</th>
                                    <th className="text-left px-6 py-3 font-medium">Frequency</th>
                                    <th className="text-left px-6 py-3 font-medium">Send Day/Time</th>
                                    <th className="text-left px-6 py-3 font-medium">Recipients</th>
                                    <th className="text-left px-6 py-3 font-medium">Last Sent</th>
                                    <th className="text-left px-6 py-3 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-semibold text-gray-900">Weekly Pulse</td>
                                    <td className="px-6 py-4 text-gray-600">Every week</td>
                                    <td className="px-6 py-4 text-gray-600">Monday · 08:00</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-2">
                                            {emailAddresses.slice(0, 3).map((e) => (
                                                <EmailLink key={e} email={e} />
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">Mon 9 Mar</td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status="Active" />
                                    </td>
                                </tr>
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-semibold text-gray-900">Monthly Review</td>
                                    <td className="px-6 py-4 text-gray-600">Monthly</td>
                                    <td className="px-6 py-4 text-gray-600">1st · 07:00</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-2">
                                            {emailAddresses.map((e) => (
                                                <EmailLink key={e} email={e} />
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">Sat 1 Mar</td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status="Active" />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Export History */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <p className="font-medium text-gray-400 uppercase tracking-widest" style={{ fontSize: '10px', letterSpacing: '0.12em' }}>Export History</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full" style={{ fontSize: '13px' }}>
                            <thead>
                                <tr className="text-gray-400 uppercase border-b border-gray-100" style={{ fontSize: '10px', letterSpacing: '0.08em' }}>
                                    <th className="text-left px-6 py-3 font-medium">Report</th>
                                    <th className="text-left px-6 py-3 font-medium">Period</th>
                                    <th className="text-left px-6 py-3 font-medium">Type</th>
                                    <th className="text-left px-6 py-3 font-medium">Generated</th>
                                    <th className="text-left px-6 py-3 font-medium">By</th>
                                    <th className="text-right px-6 py-3 font-medium"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    {
                                        report: "Weekly Pulse",
                                        period: "W10 · 9-15 Mar 2026",
                                        type: "AUTO" as const,
                                        generated: "Mon 16 Mar · 08:00",
                                        by: "System",
                                        pdfVariant: "active" as const,
                                    },
                                    {
                                        report: "Monthly Review",
                                        period: "March 2026",
                                        type: "AUTO" as const,
                                        generated: "Sat 1 Mar · 07:00",
                                        by: "System",
                                        pdfVariant: "active" as const,
                                    },
                                    {
                                        report: "Weekly Pulse",
                                        period: "W9 · 2-8 Mar 2026",
                                        type: "MANUAL" as const,
                                        generated: "Thu 12 Mar · 14:32",
                                        by: "Antonio Cano",
                                        pdfVariant: "inactive" as const,
                                    },
                                ].map((row, i) => (
                                    <tr
                                        key={i}
                                        className={`hover:bg-gray-50 transition-colors ${i < 2 ? "border-b border-gray-50" : ""
                                            }`}
                                    >
                                        <td className="px-6 py-4 font-semibold text-gray-900">{row.report}</td>
                                        <td className="px-6 py-4 text-gray-600">{row.period}</td>
                                        <td className="px-6 py-4">
                                            <TypeBadge type={row.type} />
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{row.generated}</td>
                                        <td className="px-6 py-4 text-gray-600">{row.by}</td>
                                        <td className="px-6 py-4 text-right">
                                            <PdfButton variant={row.pdfVariant} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}