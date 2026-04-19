"use client"

import * as React from "react"
import {
  ChartColumnBig,
  Gem,
  CircleDot,
  CalendarDays,
  Megaphone,
  Users2,
  UtensilsCrossed,
  FileText,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import mainLogo from "@/public/main-logo.png";

import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "Overview",
      url: "/",
      icon: ChartColumnBig,
      isActive: true,
    },
    {
      title: "Sales",
      url: "/sales",
      icon: Gem,
      items: [
        {
          title: "Global Revenue",
          url: "/sales/global-revenue",
        },
        {
          title: "Sales by Area",
          url: "/sales/by-area",
        },
        {
          title: "Sales by Category",
          url: "/sales/by-category",
        },
        {
          title: "Sales by Product",
          url: "/sales/by-product",
        },
        {
          title: "Sales by Trend",
          url: "/sales/by-trend",
        },
        {
          title: "Discounts & Refunds",
          url: "/sales/discounts-refunds",
        },
        {
          title: "Tips",
          url: "/sales/tips",
        },
        {
          title: "Payment Methods",
          url: "/sales/payment-methods",
        },
      ],
    },
    {
      title: "CRM",
      url: "/crm",
      icon: CircleDot,
      items: [
        {
          title: "Clients",
          url: "/crm/clients",
        },
        {
          title: "Loyalty",
          url: "/crm/loyalty",
        },
        {
          title: "Guest Satisfaction",
          url: "/crm/guest-satisfaction",
        },
        {
          title: "Customer Service",
          url: "/crm/customer-service",
        },
      ],
    },
    {
      title: "Reservations",
      url: "/reservations",
      icon: CalendarDays,
    },
    {
      title: "Marketing",
      url: "/marketing",
      icon: Megaphone,
      items: [
        {
          title: "Website Analytics",
          url: "/marketing/website-analytics",
        },
        {
          title: "Booking Widget",
          url: "/marketing/booking-widget",
        },
        {
          title: "Paid Media",
          url: "/marketing/paid-media",
        },
      ],
    },
    {
      title: "Staff",
      url: "/staff",
      icon: Users2,
      items: [
        {
          title: "Labour Cost",
          url: "/staff/labour-cost",
        },
        {
          title: "Absences",
          url: "/staff/absences",
        },
      ],
    },
    {
      title: "F & B",
      url: "/f-and-b",
      icon: UtensilsCrossed,
      items: [
        {
          title: "Performance",
          url: "/f-and-b/performance",
        },
        {
          title: "Stock & Purchasing",
          url: "/f-and-b/stock-purchasing",
        },
      ],
    },
    {
      title: "Reports",
      url: "/reports",
      icon: FileText,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Link
          href="/"
          className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-white/10"
        >
          <Image
            src={mainLogo}
            alt="Main logo"
            width={100}
            height={20}
            className="h-20 w-full shrink-0 rounded-sm object-contain"
            priority
          />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
