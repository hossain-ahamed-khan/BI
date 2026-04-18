"use client"

import * as React from "react"

import { TooltipProvider } from "@/components/ui/tooltip"

type ProvidersProps = {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return <TooltipProvider>{children}</TooltipProvider>
}