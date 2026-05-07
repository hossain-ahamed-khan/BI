"use client"

import { createContext, useContext, useMemo, useState, type ReactNode } from "react"

const rangeKeys = ["day", "week", "month", "year", "custom"] as const
export type RangeKey = (typeof rangeKeys)[number]

type RangeContextValue = {
    activeRange: RangeKey
    setActiveRange: (range: RangeKey) => void
    customStart: string
    setCustomStart: (value: string) => void
    customEnd: string
    setCustomEnd: (value: string) => void
}

const RangeContext = createContext<RangeContextValue | null>(null)

export function RangeProvider({ children }: { children: ReactNode }) {
    const [activeRange, setActiveRange] = useState<RangeKey>("week")
    const [customStart, setCustomStart] = useState("")
    const [customEnd, setCustomEnd] = useState("")

    const value = useMemo(
        () => ({
            activeRange,
            setActiveRange,
            customStart,
            setCustomStart,
            customEnd,
            setCustomEnd,
        }),
        [activeRange, customStart, customEnd]
    )

    return <RangeContext.Provider value={value}>{children}</RangeContext.Provider>
}

export function useRange() {
    const context = useContext(RangeContext)
    if (!context) {
        throw new Error("useRange must be used within RangeProvider")
    }
    return context
}
