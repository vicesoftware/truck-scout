"use client";

import React from 'react'
import Image from 'next/image'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Package, Users, Truck, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

export function Sidebar({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
  const navItems = [
    { href: "/", icon: Package, label: "Loads" },
    { href: "/carriers", icon: Users, label: "Carriers" },
    { href: "/shipments", icon: Truck, label: "Shipments" },
    { href: "/analytics", icon: TrendingUp, label: "Analytics" },
  ]

  return (
    <aside
      className={cn(
        "bg-white transition-all duration-300 ease-in-out shadow-md flex flex-col",
        isOpen ? "w-64" : "w-20"
      )}
    >
      <div className="p-6 flex justify-between items-center">
        {isOpen && (
          <Image
            src="/images/FullLogo.png"
            alt="Truck Scout Logo"
            width={150}
            height={54}
            className="w-auto h-auto max-w-full object-contain"
          />
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="text-[#335e88] hover:bg-gray-200 mx-auto"
        >
          {isOpen ? <ChevronLeft className="h-6 w-6" /> : <ChevronRight className="h-6 w-6" />}
        </Button>
      </div>
      <nav className="space-y-2 mt-8 flex-grow">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center rounded-lg px-4 py-2 text-[#335e88] hover:bg-gray-200",
              !isOpen && "justify-center"
            )}
          >
            <item.icon className={cn("h-5 w-5", isOpen && "mr-3")} />
            {isOpen && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  )
}