import type { ReactNode } from "react"
import {
  Bell,
  LogOut,
  Settings,
  ArrowRightLeft,
  Users,
} from "lucide-react"

import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

type DashboardShellProps = {
  section: string
  children: ReactNode
}

export function DashboardShell({ section, children }: DashboardShellProps) {
  const timeRanges = ["Day", "Week", "Month", "Year", "Custom"]
  const activeRange = "Week"
  const profileMenuItems = [
    { label: "General Settings", icon: Settings },
    { label: "Team & Roles", icon: Users },
    { label: "Integrations", icon: ArrowRightLeft },
    { label: "Notifications", icon: Bell },
  ]

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-zinc-200 bg-zinc-50/60 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{section}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto flex items-center gap-2 px-4">
            <div className="inline-flex items-center rounded-xl border border-zinc-200 bg-zinc-100 p-1">
              {timeRanges.map((range) => (
                <button
                  key={range}
                  type="button"
                  className={
                    range === activeRange
                      ? "rounded-lg bg-white px-4 py-1 text-sm font-medium text-zinc-900 shadow-sm"
                      : "rounded-lg px-4 py-1 text-sm font-medium text-zinc-500 hover:text-zinc-700"
                  }
                >
                  {range}
                </button>
              ))}
            </div>
            <details className="group/profile relative">
              <summary className="list-none cursor-pointer [&::-webkit-details-marker]:hidden">
                <div className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-fuchsia-500 to-orange-400 text-xs font-semibold text-white">
                  AC
                </div>
              </summary>
              <div className="absolute right-0 top-11 z-50 w-64 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl">
                <div className="flex items-center gap-3 bg-indigo-50 px-4 py-4">
                  <div className="grid size-12 place-items-center rounded-full bg-gradient-to-br from-fuchsia-500 to-orange-400 text-base font-semibold text-white">
                    AC
                  </div>
                  <div>
                    <p className="text-lg/5 font-medium text-zinc-900">Antonio Cano</p>
                    <p className="text-sm leading-5 text-zinc-500">Super Admin</p>
                  </div>
                </div>

                <div className="px-4 py-3">
                  {profileMenuItems.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-zinc-700 transition-colors hover:bg-zinc-50"
                    >
                      <item.icon className="size-4 text-zinc-700" />
                      <span className="text-[15px] leading-6 text-zinc-700">{item.label}</span>
                    </button>
                  ))}
                </div>

                <div className="border-t border-zinc-200 px-4 py-3">
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-rose-500 transition-colors hover:bg-rose-50"
                  >
                    <LogOut className="size-4" />
                    <span className="text-[15px] leading-6">Sign Out</span>
                  </button>
                </div>
              </div>
            </details>
          </div>
        </header>
        <div className="flex flex-1 flex-col p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}