import React from 'react'
import Image from 'next/image'
import Link from "next/link"
import { Package, Users, Truck, TrendingUp } from "lucide-react"

export function Sidebar() {
  return (
    <div className="hidden w-64 bg-white p-6 shadow-md lg:block">
      <div className="mb-8">
        <Image
          src="/images/FullLogo.png"
          alt="Truck Scout Logo"
          width={150}
          height={54}
          className="w-auto h-auto max-w-full object-contain"
        />
      </div>
      <nav className="space-y-2">
        <Link href="/" className="flex items-center rounded-lg px-4 py-2 text-[#335e88] hover:bg-gray-200">
          <Package className="mr-3 h-5 w-5" />
          Loads
        </Link>
        <Link href="/carriers" className="flex items-center rounded-lg px-4 py-2 text-[#335e88] hover:bg-gray-200">
          <Users className="mr-3 h-5 w-5" />
          Carriers
        </Link>
        <Link href="/shipments" className="flex items-center rounded-lg px-4 py-2 text-[#335e88] hover:bg-gray-200">
          <Truck className="mr-3 h-5 w-5" />
          Shipments
        </Link>
        <Link href="/analytics" className="flex items-center rounded-lg px-4 py-2 text-[#335e88] hover:bg-gray-200">
          <TrendingUp className="mr-3 h-5 w-5" />
          Analytics
        </Link>
      </nav>
    </div>
  )
}