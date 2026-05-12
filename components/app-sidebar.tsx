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
      url: "/admin-dashboard",
      icon: ChartColumnBig,
      isActive: true,
    },
    {
      title: "Sales",
      url: "/admin-dashboard/sales",
      icon: Gem,
      items: [
        {
          title: "Global Revenue",
          url: "/admin-dashboard/sales/global-revenue",
        },
        {
          title: "Sales by Area",
          url: "/admin-dashboard/sales/by-area",
        },
        {
          title: "Sales by Category",
          url: "/admin-dashboard/sales/by-category",
        },
        {
          title: "Sales by Product",
          url: "/admin-dashboard/sales/by-product",
        },
        {
          title: "Sales by Trend",
          url: "/admin-dashboard/sales/by-trend",
        },
        {
          title: "Discounts & Refunds",
          url: "/admin-dashboard/sales/discounts-refunds",
        },
        {
          title: "Tips",
          url: "/admin-dashboard/sales/tips",
        },
        {
          title: "Payment Methods",
          url: "/admin-dashboard/sales/payment-methods",
        },
      ],
    },
    {
      title: "CRM",
      url: "/admin-dashboard/crm",
      icon: CircleDot,
      items: [
        {
          title: "Clients",
          url: "/admin-dashboard/crm/clients",
        },
        {
          title: "Loyalty",
          url: "/admin-dashboard/crm/loyalty",
        },
        {
          title: "Guest Satisfaction",
          url: "/admin-dashboard/crm/guest-satisfaction",
        },
        {
          title: "Customer Service",
          url: "/admin-dashboard/crm/customer-service",
        },
      ],
    },
    {
      title: "Reservations",
      url: "/admin-dashboard/reservations",
      icon: CalendarDays,
    },
    {
      title: "Marketing",
      url: "/admin-dashboard/marketing",
      icon: Megaphone,
      items: [
        {
          title: "Website Analytics",
          url: "/admin-dashboard/marketing/website-analytics",
        },
        {
          title: "Booking Widget",
          url: "/admin-dashboard/marketing/booking-widget",
        },
        {
          title: "Paid Media",
          url: "/admin-dashboard/marketing/paid-media",
        },
      ],
    },
    {
      title: "Staff",
      url: "/admin-dashboard/staff",
      icon: Users2,
      items: [
        {
          title: "Labour Cost",
          url: "/admin-dashboard/staff/labour-cost",
        },
        {
          title: "Absences",
          url: "/admin-dashboard/staff/absences",
        },
      ],
    },
    {
      title: "F & B",
      url: "/admin-dashboard/f-and-b",
      icon: UtensilsCrossed,
      items: [
        {
          title: "Performance",
          url: "/admin-dashboard/f-and-b/performance",
        },
        {
          title: "Stock & Purchasing",
          url: "/admin-dashboard/f-and-b/stock-purchasing",
        },
      ],
    },
    {
      title: "Reports",
      url: "/admin-dashboard/reports",
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
          className="inline-flex w-fit items-center rounded-md p-1 hover:bg-white/10"
        >
          <Image
            src={mainLogo}
            alt="Main logo"
            width={300}
            height={80}
            style={{ height: 'auto' }}
            className="h-20 w-auto shrink-0 rounded-sm object-contain"
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
