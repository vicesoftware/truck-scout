"use client";

import React from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { UserCircle, Info, Activity } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header({ isSidebarOpen }: { isSidebarOpen: boolean }) {
  return (
    <header className="bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {!isSidebarOpen && (
            <div className="flex items-center space-x-2">
              <Image
                src="/images/IconOnly.png"
                alt="Truck Scout Icon"
                width={48}
                height={48}
                className="w-auto h-8 object-contain"
              />
              <Image
                src="/images/TextOnly.png"
                alt="Truck Scout Text"
                width={120}
                height={40}
                className="h-6 w-auto object-contain"
              />
            </div>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-10 w-10 rounded-full p-0">
              <span className="sr-only">Open user menu</span>
              <UserCircle className="h-6 w-6 text-[#335e88]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="text-[#335e88]">Sarah Johnson</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Info className="mr-2 h-4 w-4 text-[#335e88]" />
              <span className="text-[#335e88]">Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Activity className="mr-2 h-4 w-4 text-[#335e88]" />
              <span className="text-[#335e88]">Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span className="text-[#335e88]">Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}