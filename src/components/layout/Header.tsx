"use client";

import React from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { UserCircle, Info, Activity, LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sidebar } from './Sidebar'

export function Header({ isMobile, isSidebarOpen, onToggleSidebar }: { isMobile: boolean, isSidebarOpen: boolean, onToggleSidebar: () => void }) {
  return (
    <header className="bg-white shadow-sm p-4 flex items-center justify-between">
      <div className="flex items-center">
        {isMobile ? (
          <Sidebar isOpen={false} onToggle={onToggleSidebar} />
        ) : (
          <>
            {!isSidebarOpen && (
              <>
                <Image
                  src="/images/IconOnly.png"
                  alt="Small Logo"
                  width={40}
                  height={40}
                  className="mr-2"
                />
                <Image
                  src="/images/TextOnly.png"
                  alt="Truck Scout"
                  width={120}
                  height={24}
                  className="mr-2"
                />
              </>
            )}
          </>
        )}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="text-[#335e88] hover:bg-gray-200">
            <UserCircle className="h-6 w-6" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white border border-gray-200">
          <DropdownMenuLabel className="px-3 py-2">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none text-[#335e88]">John Doe</p>
              <p className="text-xs leading-none text-gray-500">john@example.com</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-gray-200" />
          <DropdownMenuItem className="px-3 py-2 text-[#335e88] hover:bg-gray-100">
            <UserCircle className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="px-3 py-2 text-[#335e88] hover:bg-gray-100">
            <Info className="mr-2 h-4 w-4" />
            <span>About</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="px-3 py-2 text-[#335e88] hover:bg-gray-100">
            <Activity className="mr-2 h-4 w-4" />
            <span>Activity</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-gray-200" />
          <DropdownMenuItem className="px-3 py-2 text-[#335e88] hover:bg-gray-100">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}