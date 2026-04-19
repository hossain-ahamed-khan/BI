"use client";
import { useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────

interface KpiCard {
    label: string;
    value: string;
    vsLY: string;
    vsLYPositive: boolean;
    ytd: string;
}

interface WeekRow {
    week: string;
    cols: { value: string; vs?: string; vsPositive?: boolean }[];
}

interface SubSection {
    name: string;
    kpis: KpiCard[];
    tableHeaders: string[];
    rows: WeekRow[];
}

interface Section {
    name: string;
    icon?: string;
    subsections: SubSection[];
}

// ── Data ──────────────────────────────────────────────────────────────────────

const data: Section[] = [
    {
        name: "Restaurants",
        icon: "🍽",
        subsections: [
            {
                name: "EL COMEDOR",
                kpis: [
                    { label: "GROSS REVENUE", value: "€64,512", vsLY: "+10.2% vs LY", vsLYPositive: true, ytd: "YTD: € 448,200" },
                    { label: "NET REVENUE", value: "€56,730", vsLY: "+8.4% vs LY", vsLYPositive: true, ytd: "YTD: € 394,400" },
                    { label: "DISCOUNTS", value: "€2,240", vsLY: "+2.1% vs LY", vsLYPositive: false, ytd: "YTD: € 15,600" },
                    { label: "COVERS", value: "820", vsLY: "+5.6% vs LY", vsLYPositive: true, ytd: "YTD: 5,740" },
                    { label: "AVG TICKET", value: "€78.6", vsLY: "+1.8% vs LY", vsLYPositive: true, ytd: "YTD: € 78.1" },
                    { label: "RETURNING GUESTS", value: "42%", vsLY: "+3.2pp vs LY", vsLYPositive: true, ytd: "YTD: 40%" },
                ],
                tableHeaders: ["WEEK", "GROSS REV", "VS LY", "NET REV", "VS LY", "DISCOUNTS", "VS LY", "COVERS", "VS LY", "AVG TICKET", "VS LY"],
                rows: [
                    { week: "W1", cols: [{ value: "€ 12,100" }, { value: "▲10.2%", vsPositive: true }, { value: "€ 10,648" }, { value: "▲10.2%", vsPositive: true }, { value: "€ 420" }, { value: "▲7.7%", vsPositive: true }, { value: "155" }, { value: "▲4.7%", vsPositive: true }, { value: "€ 78.1" }, { value: "▲5.3%", vsPositive: true }] },
                    { week: "W2", cols: [{ value: "€ 13,200" }, { value: "▲11.9%", vsPositive: true }, { value: "€ 11,616" }, { value: "▲8.4%", vsPositive: true }, { value: "€ 480" }, { value: "▲4.3%", vsPositive: true }, { value: "168" }, { value: "▲6.3%", vsPositive: true }, { value: "€ 78.6" }, { value: "▲5.2%", vsPositive: true }] },
                    { week: "W3", cols: [{ value: "€ 14,800" }, { value: "▲8.8%", vsPositive: true }, { value: "€ 13,024" }, { value: "▲7.3%", vsPositive: true }, { value: "€ 560" }, { value: "▲5.7%", vsPositive: true }, { value: "188" }, { value: "▲6.8%", vsPositive: true }, { value: "€ 78.7" }, { value: "▲1.8%", vsPositive: true }] },
                    { week: "W4", cols: [{ value: "€ 11,900" }, { value: "▲10.2%", vsPositive: true }, { value: "€ 10,472" }, { value: "▲8.2%", vsPositive: true }, { value: "€ 400" }, { value: "▲5.3%", vsPositive: true }, { value: "150" }, { value: "▲5.6%", vsPositive: true }, { value: "€ 79.3" }, { value: "▲4.2%", vsPositive: true }] },
                    { week: "W5", cols: [{ value: "€ 12,512" }, { value: "▲9.8%", vsPositive: true }, { value: "€ 11,000" }, { value: "▲8.7%", vsPositive: true }, { value: "€ 380" }, { value: "▲5.6%", vsPositive: true }, { value: "159" }, { value: "▲6%", vsPositive: true }, { value: "€ 78.7" }, { value: "▲3.6%", vsPositive: true }] },
                ],
            },
            {
                name: "JAZZ CLUB",
                kpis: [
                    { label: "GROSS REVENUE", value: "€28,000", vsLY: "+5.0% vs LY", vsLYPositive: true, ytd: "YTD: € 196,000" },
                    { label: "NET REVENUE", value: "€24,500", vsLY: "+4.2% vs LY", vsLYPositive: true, ytd: "YTD: € 171,500" },
                    { label: "DISCOUNTS", value: "€1,100", vsLY: "+1.5% vs LY", vsLYPositive: false, ytd: "YTD: € 7,700" },
                    { label: "COVERS", value: "360", vsLY: "+3.1% vs LY", vsLYPositive: true, ytd: "YTD: 2,520" },
                    { label: "AVG TICKET", value: "€77.8", vsLY: "+1.2% vs LY", vsLYPositive: true, ytd: "YTD: € 77.1" },
                    { label: "RETURNING GUESTS", value: "38%", vsLY: "+2.0pp vs LY", vsLYPositive: true, ytd: "YTD: 37%" },
                ],
                tableHeaders: ["WEEK", "GROSS REV", "VS LY", "NET REV", "VS LY", "DISCOUNTS", "VS LY", "COVERS", "VS LY", "AVG TICKET", "VS LY"],
                rows: [
                    { week: "W1", cols: [{ value: "€ 5,200" }, { value: "▲5.1%", vsPositive: true }, { value: "€ 4,576" }, { value: "▲4.8%", vsPositive: true }, { value: "€ 208" }, { value: "▲1.2%", vsPositive: false }, { value: "68" }, { value: "▲3.0%", vsPositive: true }, { value: "€ 76.5" }, { value: "▲1.1%", vsPositive: true }] },
                    { week: "W2", cols: [{ value: "€ 5,600" }, { value: "▲4.9%", vsPositive: true }, { value: "€ 4,928" }, { value: "▲4.5%", vsPositive: true }, { value: "€ 224" }, { value: "▲1.6%", vsPositive: false }, { value: "73" }, { value: "▲3.3%", vsPositive: true }, { value: "€ 76.7" }, { value: "▲1.3%", vsPositive: true }] },
                    { week: "W3", cols: [{ value: "€ 6,200" }, { value: "▲5.2%", vsPositive: true }, { value: "€ 5,456" }, { value: "▲4.6%", vsPositive: true }, { value: "€ 248" }, { value: "▲1.8%", vsPositive: false }, { value: "80" }, { value: "▲3.1%", vsPositive: true }, { value: "€ 77.5" }, { value: "▲1.0%", vsPositive: true }] },
                    { week: "W4", cols: [{ value: "€ 5,400" }, { value: "▲4.8%", vsPositive: true }, { value: "€ 4,752" }, { value: "▲4.2%", vsPositive: true }, { value: "€ 216" }, { value: "▲1.4%", vsPositive: false }, { value: "70" }, { value: "▲2.9%", vsPositive: true }, { value: "€ 77.1" }, { value: "▲1.1%", vsPositive: true }] },
                    { week: "W5", cols: [{ value: "€ 5,600" }, { value: "▲5.0%", vsPositive: true }, { value: "€ 4,928" }, { value: "▲4.3%", vsPositive: true }, { value: "€ 204" }, { value: "▲1.5%", vsPositive: false }, { value: "69" }, { value: "▲2.8%", vsPositive: true }, { value: "€ 77.8" }, { value: "▲1.2%", vsPositive: true }] },
                ],
            },
            {
                name: "LA BARRA JAPONESA",
                kpis: [
                    { label: "GROSS REVENUE", value: "€41,200", vsLY: "+7.3% vs LY", vsLYPositive: true, ytd: "YTD: € 288,400" },
                    { label: "NET REVENUE", value: "€36,256", vsLY: "+6.8% vs LY", vsLYPositive: true, ytd: "YTD: € 253,792" },
                    { label: "DISCOUNTS", value: "€1,640", vsLY: "+1.8% vs LY", vsLYPositive: false, ytd: "YTD: € 11,480" },
                    { label: "COVERS", value: "520", vsLY: "+4.4% vs LY", vsLYPositive: true, ytd: "YTD: 3,640" },
                    { label: "AVG TICKET", value: "€79.2", vsLY: "+2.1% vs LY", vsLYPositive: true, ytd: "YTD: € 78.6" },
                    { label: "RETURNING GUESTS", value: "45%", vsLY: "+3.0pp vs LY", vsLYPositive: true, ytd: "YTD: 43%" },
                ],
                tableHeaders: ["WEEK", "GROSS REV", "VS LY", "NET REV", "VS LY", "DISCOUNTS", "VS LY", "COVERS", "VS LY", "AVG TICKET", "VS LY"],
                rows: [
                    { week: "W1", cols: [{ value: "€ 7,800" }, { value: "▲7.1%", vsPositive: true }, { value: "€ 6,864" }, { value: "▲6.9%", vsPositive: true }, { value: "€ 312" }, { value: "▲1.7%", vsPositive: false }, { value: "98" }, { value: "▲4.3%", vsPositive: true }, { value: "€ 79.6" }, { value: "▲2.0%", vsPositive: true }] },
                    { week: "W2", cols: [{ value: "€ 8,400" }, { value: "▲7.4%", vsPositive: true }, { value: "€ 7,392" }, { value: "▲7.0%", vsPositive: true }, { value: "€ 336" }, { value: "▲1.9%", vsPositive: false }, { value: "106" }, { value: "▲4.5%", vsPositive: true }, { value: "€ 79.2" }, { value: "▲2.2%", vsPositive: true }] },
                    { week: "W3", cols: [{ value: "€ 9,200" }, { value: "▲7.6%", vsPositive: true }, { value: "€ 8,096" }, { value: "▲7.1%", vsPositive: true }, { value: "€ 368" }, { value: "▲2.0%", vsPositive: false }, { value: "116" }, { value: "▲4.6%", vsPositive: true }, { value: "€ 79.3" }, { value: "▲2.1%", vsPositive: true }] },
                    { week: "W4", cols: [{ value: "€ 8,000" }, { value: "▲7.2%", vsPositive: true }, { value: "€ 7,040" }, { value: "▲6.8%", vsPositive: true }, { value: "€ 320" }, { value: "▲1.8%", vsPositive: false }, { value: "101" }, { value: "▲4.4%", vsPositive: true }, { value: "€ 79.2" }, { value: "▲2.1%", vsPositive: true }] },
                    { week: "W5", cols: [{ value: "€ 7,800" }, { value: "▲7.3%", vsPositive: true }, { value: "€ 6,864" }, { value: "▲7.0%", vsPositive: true }, { value: "€ 304" }, { value: "▲1.6%", vsPositive: false }, { value: "99" }, { value: "▲4.2%", vsPositive: true }, { value: "€ 78.8" }, { value: "▲2.0%", vsPositive: true }] },
                ],
            },
            {
                name: "MESAS ALTAS",
                kpis: [
                    { label: "GROSS REVENUE", value: "€22,300", vsLY: "+4.5% vs LY", vsLYPositive: true, ytd: "YTD: € 156,100" },
                    { label: "NET REVENUE", value: "€19,624", vsLY: "+3.9% vs LY", vsLYPositive: true, ytd: "YTD: € 137,368" },
                    { label: "DISCOUNTS", value: "€890", vsLY: "+1.1% vs LY", vsLYPositive: false, ytd: "YTD: € 6,230" },
                    { label: "COVERS", value: "290", vsLY: "+2.8% vs LY", vsLYPositive: true, ytd: "YTD: 2,030" },
                    { label: "AVG TICKET", value: "€76.9", vsLY: "+1.0% vs LY", vsLYPositive: true, ytd: "YTD: € 76.1" },
                    { label: "RETURNING GUESTS", value: "36%", vsLY: "+1.5pp vs LY", vsLYPositive: true, ytd: "YTD: 35%" },
                ],
                tableHeaders: ["WEEK", "GROSS REV", "VS LY", "NET REV", "VS LY", "DISCOUNTS", "VS LY", "COVERS", "VS LY", "AVG TICKET", "VS LY"],
                rows: [
                    { week: "W1", cols: [{ value: "€ 4,200" }, { value: "▲4.4%", vsPositive: true }, { value: "€ 3,696" }, { value: "▲3.8%", vsPositive: true }, { value: "€ 168" }, { value: "▲1.0%", vsPositive: false }, { value: "55" }, { value: "▲2.7%", vsPositive: true }, { value: "€ 76.4" }, { value: "▲1.0%", vsPositive: true }] },
                    { week: "W2", cols: [{ value: "€ 4,600" }, { value: "▲4.5%", vsPositive: true }, { value: "€ 4,048" }, { value: "▲4.0%", vsPositive: true }, { value: "€ 184" }, { value: "▲1.1%", vsPositive: false }, { value: "60" }, { value: "▲2.9%", vsPositive: true }, { value: "€ 76.7" }, { value: "▲1.0%", vsPositive: true }] },
                    { week: "W3", cols: [{ value: "€ 5,100" }, { value: "▲4.7%", vsPositive: true }, { value: "€ 4,488" }, { value: "▲4.1%", vsPositive: true }, { value: "€ 204" }, { value: "▲1.2%", vsPositive: false }, { value: "66" }, { value: "▲3.0%", vsPositive: true }, { value: "€ 77.3" }, { value: "▲1.1%", vsPositive: true }] },
                    { week: "W4", cols: [{ value: "€ 4,300" }, { value: "▲4.4%", vsPositive: true }, { value: "€ 3,784" }, { value: "▲3.9%", vsPositive: true }, { value: "€ 172" }, { value: "▲1.0%", vsPositive: false }, { value: "56" }, { value: "▲2.8%", vsPositive: true }, { value: "€ 76.8" }, { value: "▲1.0%", vsPositive: true }] },
                    { week: "W5", cols: [{ value: "€ 4,100" }, { value: "▲4.5%", vsPositive: true }, { value: "€ 3,608" }, { value: "▲3.8%", vsPositive: true }, { value: "€ 162" }, { value: "▲1.1%", vsPositive: false }, { value: "53" }, { value: "▲2.7%", vsPositive: true }, { value: "€ 76.4" }, { value: "▲1.0%", vsPositive: true }] },
                ],
            },
        ],
    },
    {
        name: "Bars",
        icon: "🍸",
        subsections: [
            {
                name: "COCKTAIL BAR",
                kpis: [
                    { label: "GROSS REVENUE", value: "€36,864", vsLY: "-2.1% vs LY", vsLYPositive: false, ytd: "YTD: € 256,500" },
                    { label: "NET REVENUE", value: "€32,440", vsLY: "-1.8% vs LY", vsLYPositive: false, ytd: "YTD: € 225,700" },
                    { label: "DISCOUNTS", value: "€1,280", vsLY: "+4.2% vs LY", vsLYPositive: true, ytd: "YTD: € 8,920" },
                    { label: "COCKTAIL SALES", value: "€22,100", vsLY: "+1.2% vs LY", vsLYPositive: true, ytd: "YTD: € 153,800" },
                    { label: "LONG DRINK SALES", value: "€8,200", vsLY: "-8.4% vs LY", vsLYPositive: false, ytd: "YTD: € 57,100" },
                    { label: "WINE SALES", value: "€4,200", vsLY: "+3.6% vs LY", vsLYPositive: true, ytd: "YTD: € 29,200" },
                    { label: "RETURNING GUESTS", value: "35%", vsLY: "-2.4pp vs LY", vsLYPositive: false, ytd: "YTD: 37%" },
                ],
                tableHeaders: ["WEEK", "GROSS REV", "VS LY", "NET REV", "VS LY", "DISCOUNTS", "VS LY", "COCKTAILS", "VS LY", "LONG DRINKS", "VS LY", "WINE", "VS LY"],
                rows: [
                    { week: "W1", cols: [{ value: "€ 6,800" }, { value: "▼2%", vsPositive: false }, { value: "€ 5,984" }, { value: "▼2%", vsPositive: false }, { value: "€ 240" }, { value: "▲4.3%", vsPositive: true }, { value: "€ 4,100" }, { value: "▲1%", vsPositive: true }, { value: "€ 1,500" }, { value: "▼8.5%", vsPositive: false }, { value: "€ 780" }, { value: "▲3.7%", vsPositive: true }] },
                    { week: "W2", cols: [{ value: "€ 7,400" }, { value: "▼1.9%", vsPositive: false }, { value: "€ 6,512" }, { value: "▼1.8%", vsPositive: false }, { value: "€ 255" }, { value: "▲4.5%", vsPositive: true }, { value: "€ 4,500" }, { value: "▲2.7%", vsPositive: true }, { value: "€ 1,650" }, { value: "▼8.3%", vsPositive: false }, { value: "€ 840" }, { value: "▲3.7%", vsPositive: true }] },
                    { week: "W3", cols: [{ value: "€ 8,100" }, { value: "▼1.9%", vsPositive: false }, { value: "€ 7,128" }, { value: "▼1.9%", vsPositive: false }, { value: "€ 270" }, { value: "▲4.7%", vsPositive: true }, { value: "€ 4,900" }, { value: "▲1.7%", vsPositive: true }, { value: "€ 1,800" }, { value: "▼8.6%", vsPositive: false }, { value: "€ 900" }, { value: "▲3.7%", vsPositive: true }] },
                    { week: "W4", cols: [{ value: "€ 7,200" }, { value: "▼1.9%", vsPositive: false }, { value: "€ 6,336" }, { value: "▼1.9%", vsPositive: false }, { value: "€ 240" }, { value: "▲4.3%", vsPositive: true }, { value: "€ 4,300" }, { value: "▲1.9%", vsPositive: true }, { value: "€ 1,600" }, { value: "▼8.6%", vsPositive: false }, { value: "€ 820" }, { value: "▲3.8%", vsPositive: true }] },
                    { week: "W5", cols: [{ value: "€ 7,364" }, { value: "▼1.9%", vsPositive: false }, { value: "€ 6,480" }, { value: "▼2%", vsPositive: false }, { value: "€ 275" }, { value: "▲4.6%", vsPositive: true }, { value: "€ 4,300" }, { value: "▲1.4%", vsPositive: true }, { value: "€ 1,650" }, { value: "▼8.8%", vsPositive: false }, { value: "€ 860" }, { value: "▲3.6%", vsPositive: true }] },
                ],
            },
            {
                name: "PRIVATE CLUB BAR",
                kpis: [
                    { label: "GROSS REVENUE", value: "€18,400", vsLY: "+6.3% vs LY", vsLYPositive: true, ytd: "YTD: € 128,800" },
                    { label: "NET REVENUE", value: "€16,192", vsLY: "+5.8% vs LY", vsLYPositive: true, ytd: "YTD: € 113,344" },
                    { label: "DISCOUNTS", value: "€640", vsLY: "+1.6% vs LY", vsLYPositive: false, ytd: "YTD: € 4,480" },
                    { label: "COCKTAIL SALES", value: "€11,040", vsLY: "+5.0% vs LY", vsLYPositive: true, ytd: "YTD: € 77,280" },
                    { label: "LONG DRINK SALES", value: "€4,100", vsLY: "+3.2% vs LY", vsLYPositive: true, ytd: "YTD: € 28,700" },
                    { label: "WINE SALES", value: "€2,100", vsLY: "+4.5% vs LY", vsLYPositive: true, ytd: "YTD: € 14,700" },
                    { label: "RETURNING GUESTS", value: "41%", vsLY: "+2.1pp vs LY", vsLYPositive: true, ytd: "YTD: 39%" },
                ],
                tableHeaders: ["WEEK", "GROSS REV", "VS LY", "NET REV", "VS LY", "DISCOUNTS", "VS LY", "COCKTAILS", "VS LY", "LONG DRINKS", "VS LY", "WINE", "VS LY"],
                rows: [
                    { week: "W1", cols: [{ value: "€ 3,400" }, { value: "▲6.2%", vsPositive: true }, { value: "€ 2,992" }, { value: "▲5.7%", vsPositive: true }, { value: "€ 119" }, { value: "▲1.5%", vsPositive: false }, { value: "€ 2,040" }, { value: "▲4.9%", vsPositive: true }, { value: "€ 756" }, { value: "▲3.1%", vsPositive: true }, { value: "€ 385" }, { value: "▲4.4%", vsPositive: true }] },
                    { week: "W2", cols: [{ value: "€ 3,700" }, { value: "▲6.4%", vsPositive: true }, { value: "€ 3,256" }, { value: "▲5.9%", vsPositive: true }, { value: "€ 129" }, { value: "▲1.7%", vsPositive: false }, { value: "€ 2,220" }, { value: "▲5.1%", vsPositive: true }, { value: "€ 822" }, { value: "▲3.3%", vsPositive: true }, { value: "€ 422" }, { value: "▲4.6%", vsPositive: true }] },
                    { week: "W3", cols: [{ value: "€ 4,100" }, { value: "▲6.5%", vsPositive: true }, { value: "€ 3,608" }, { value: "▲6.0%", vsPositive: true }, { value: "€ 144" }, { value: "▲1.8%", vsPositive: false }, { value: "€ 2,460" }, { value: "▲5.2%", vsPositive: true }, { value: "€ 911" }, { value: "▲3.4%", vsPositive: true }, { value: "€ 468" }, { value: "▲4.7%", vsPositive: true }] },
                    { week: "W4", cols: [{ value: "€ 3,600" }, { value: "▲6.2%", vsPositive: true }, { value: "€ 3,168" }, { value: "▲5.7%", vsPositive: true }, { value: "€ 126" }, { value: "▲1.6%", vsPositive: false }, { value: "€ 2,160" }, { value: "▲4.9%", vsPositive: true }, { value: "€ 799" }, { value: "▲3.1%", vsPositive: true }, { value: "€ 411" }, { value: "▲4.5%", vsPositive: true }] },
                    { week: "W5", cols: [{ value: "€ 3,600" }, { value: "▲6.3%", vsPositive: true }, { value: "€ 3,168" }, { value: "▲5.8%", vsPositive: true }, { value: "€ 122" }, { value: "▲1.6%", vsPositive: false }, { value: "€ 2,160" }, { value: "▲5.0%", vsPositive: true }, { value: "€ 812" }, { value: "▲3.2%", vsPositive: true }, { value: "€ 414" }, { value: "▲4.5%", vsPositive: true }] },
                ],
            },
        ],
    },
    {
        name: "VIP Tables",
        icon: "✦",
        subsections: [
            {
                name: "PRIVATE CLUB VIP TABLES",
                kpis: [
                    { label: "GROSS REVENUE", value: "€36,864", vsLY: "+22.0% vs LY", vsLYPositive: true, ytd: "YTD: € 256,500" },
                    { label: "NET REVENUE", value: "€32,440", vsLY: "+18.4% vs LY", vsLYPositive: true, ytd: "YTD: € 225,700" },
                    { label: "DISCOUNTS", value: "€1,500", vsLY: "+5.1% vs LY", vsLYPositive: false, ytd: "YTD: € 10,450" },
                    { label: "AVG SPENT/TABLE", value: "€920", vsLY: "+14.2% vs LY", vsLYPositive: true, ytd: "YTD: € 904" },
                    { label: "RETURNING GUESTS", value: "61%", vsLY: "+8.4pp vs LY", vsLYPositive: true, ytd: "YTD: 58%" },
                ],
                tableHeaders: ["WEEK", "GROSS REV", "VS LY", "NET REV", "VS LY", "DISCOUNTS", "VS LY", "AVG/TABLE", "VS LY"],
                rows: [
                    { week: "W1", cols: [{ value: "€ 7,000" }, { value: "▲22%", vsPositive: true }, { value: "€ 6,160" }, { value: "▲22%", vsPositive: true }, { value: "€ 280" }, { value: "▲5.3%", vsPositive: false }, { value: "€ 880" }, { value: "▲14%", vsPositive: true }] },
                    { week: "W2", cols: [{ value: "€ 7,400" }, { value: "▲22%", vsPositive: true }, { value: "€ 6,512" }, { value: "▲22%", vsPositive: true }, { value: "€ 295" }, { value: "▲5.4%", vsPositive: false }, { value: "€ 910" }, { value: "▲13.8%", vsPositive: true }] },
                    { week: "W3", cols: [{ value: "€ 8,000" }, { value: "▲21.9%", vsPositive: true }, { value: "€ 7,040" }, { value: "▲21.9%", vsPositive: true }, { value: "€ 320" }, { value: "▲5.3%", vsPositive: false }, { value: "€ 950" }, { value: "▲13.6%", vsPositive: true }] },
                    { week: "W4", cols: [{ value: "€ 7,200" }, { value: "▲21.9%", vsPositive: true }, { value: "€ 6,336" }, { value: "▲21.9%", vsPositive: true }, { value: "€ 285" }, { value: "▲5.2%", vsPositive: false }, { value: "€ 900" }, { value: "▲13.6%", vsPositive: true }] },
                    { week: "W5", cols: [{ value: "€ 7,264" }, { value: "▲21.9%", vsPositive: true }, { value: "€ 6,392" }, { value: "▲21.9%", vsPositive: true }, { value: "€ 320" }, { value: "▲5.3%", vsPositive: false }, { value: "€ 940" }, { value: "▲13.8%", vsPositive: true }] },
                ],
            },
        ],
    },
];

// ── Styles ────────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
    root: { fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", background: "#f4f5f7", minHeight: "100vh", padding: "0" },
    card: { background: "#fff", borderRadius: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden" },
    topNav: { display: "flex", gap: 4, padding: "12px 20px", borderBottom: "1px solid #f0f0f0", background: "#fff", borderRadius: "16px 16px 0 0" },
    subNav: { display: "flex", gap: 0, padding: "12px 20px 0", background: "#fff" },
    sectionLabel: { fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", color: "#aaa", padding: "16px 20px 8px", textTransform: "uppercase" },
    kpiGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, padding: "0 20px 20px" },
    kpiCard: { background: "#fff", border: "1px solid #ebebeb", borderRadius: 12, padding: "16px 18px" },
    kpiLabel: { fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", color: "#aaa", marginBottom: 8, textTransform: "uppercase" },
    kpiValue: { fontSize: 24, fontWeight: 700, color: "#1a1a1a", marginBottom: 6 },
    kpiYtd: { fontSize: 11, color: "#bbb" },
    tableWrap: { overflowX: "auto", padding: "0 20px 20px" },
    table: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
    th: { textAlign: "left", fontSize: 10, fontWeight: 600, color: "#aaa", letterSpacing: "0.07em", padding: "6px 10px", textTransform: "uppercase", borderBottom: "1px solid #f0f0f0" },
    td: { padding: "9px 10px", color: "#333", borderBottom: "1px solid #f8f8f8" },
    tdWeek: { padding: "9px 10px", color: "#888", fontWeight: 600, fontSize: 12, borderBottom: "1px solid #f8f8f8" },
};

// Dynamic style functions
const dynStyles = {
    topNavBtn: (active: boolean): React.CSSProperties => ({
        display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer",
        background: active ? "#6c47ff" : "transparent", color: active ? "#fff" : "#555",
        fontWeight: active ? 600 : 400, fontSize: 14, transition: "all 0.15s",
    }),
    subNavBtn: (active: boolean): React.CSSProperties => ({
        padding: "8px 20px", border: "none", cursor: "pointer", fontSize: 13, fontWeight: active ? 600 : 400,
        color: active ? "#6c47ff" : "#666", background: "transparent",
        borderBottom: active ? "2px solid #6c47ff" : "2px solid transparent", transition: "all 0.15s",
    }),
    kpiBadge: (positive: boolean): React.CSSProperties => ({
        display: "inline-flex", alignItems: "center", gap: 2, fontSize: 11, fontWeight: 600,
        color: positive ? "#12b76a" : "#f04438", marginBottom: 4,
    }),
    badge: (positive: boolean): React.CSSProperties => ({
        fontSize: 11, fontWeight: 600, color: positive ? "#12b76a" : "#f04438",
        padding: "9px 10px", borderBottom: "1px solid #f8f8f8",
    }),
};

// ── Sub-components ─────────────────────────────────────────────────────────────

function KpiCard({ kpi }: { kpi: KpiCard }) {
    return (
        <div style={styles.kpiCard}>
            <div style={styles.kpiLabel}>{kpi.label}</div>
            <div style={styles.kpiValue}>{kpi.value}</div>
            <div style={dynStyles.kpiBadge(kpi.vsLYPositive)}>
                {kpi.vsLYPositive ? "▲" : "▼"}{kpi.vsLY.replace("+", "").replace("-", "")}
            </div>
            <div style={styles.kpiYtd}>{kpi.ytd}</div>
        </div>
    );
}

function DataTable({ headers, rows }: { headers: string[]; rows: WeekRow[] }) {
    return (
        <div style={styles.tableWrap}>
            <table style={styles.table}>
                <thead>
                    <tr>
                        {headers.map((h, i) => (
                            <th key={i} style={styles.th}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={row.week}>
                            <td style={styles.tdWeek}>{row.week}</td>
                            {row.cols.map((col, ci) => (
                                <td key={ci} style={col.vsPositive !== undefined ? dynStyles.badge(col.vsPositive) : styles.td}>
                                    {col.value}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function VenueDashboard() {
    const [activeSection, setActiveSection] = useState(0);
    const [activeSubsection, setActiveSubsection] = useState(0);

    const section = data[activeSection];
    const subsection = section.subsections[activeSubsection];

    const handleSectionChange = (idx: number) => {
        setActiveSection(idx);
        setActiveSubsection(0);
    };

    return (
        <div style={styles.root}>
            <div style={{ width: "100%", margin: "24px 0", padding: "0 24px" }}>
                <div style={styles.card}>
                    {/* Top nav */}
                    <div style={styles.topNav}>
                        {data.map((s, i) => (
                            <button key={i} style={dynStyles.topNavBtn(i === activeSection)} onClick={() => handleSectionChange(i)}>
                                <span>{s.icon}</span>
                                {s.name}
                            </button>
                        ))}
                    </div>

                    {/* Sub nav */}
                    {section.subsections.length > 1 && (
                        <div style={styles.subNav}>
                            {section.subsections.map((sub, i) => (
                                <button key={i} style={dynStyles.subNavBtn(i === activeSubsection)} onClick={() => setActiveSubsection(i)}>
                                    {sub.name.charAt(0) + sub.name.slice(1).toLowerCase().replace(/ \w/g, (c) => c.toUpperCase())}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Section label */}
                    <div style={styles.sectionLabel}>{subsection.name}</div>

                    {/* KPI cards */}
                    <div style={styles.kpiGrid}>
                        {subsection.kpis.map((kpi, i) => (
                            <KpiCard key={i} kpi={kpi} />
                        ))}
                    </div>

                    {/* Data table */}
                    <DataTable headers={subsection.tableHeaders} rows={subsection.rows} />
                </div>
            </div>
        </div>
    );
}