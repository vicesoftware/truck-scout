"use client";

import React, { useState } from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { useMediaQuery } from 'usehooks-ts'

export function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const isMobile = useMediaQuery("(max-width: 768px)")

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  return (
    <div className="flex h-screen">
      {!isMobile && (
        <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      )}
      <div className="flex flex-col flex-grow">
        <Header isMobile={isMobile} isSidebarOpen={isSidebarOpen} onToggleSidebar={toggleSidebar} />
        <main className="flex-grow p-6 bg-gray-100">{children}</main>
      </div>
    </div>
  )
}