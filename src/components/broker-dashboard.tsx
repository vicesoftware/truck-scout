'use client'

import React from 'react'
import Image from 'next/image'
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CalendarDays,
  Loader2,
  MapPin,
  Package,
  TrendingUp,
  Truck,
  Users,
  Info,
  Activity,
  Menu,
  UserCircle
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function BrokerDashboardComponent() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
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
          <Link href="#" className="flex items-center rounded-lg px-4 py-2 text-[#335e88] hover:bg-gray-200">
            <Package className="mr-3 h-5 w-5" />
            Loads
          </Link>
          <Link href="#" className="flex items-center rounded-lg px-4 py-2 text-[#335e88] hover:bg-gray-200">
            <Users className="mr-3 h-5 w-5" />
            Carriers
          </Link>
          <Link href="#" className="flex items-center rounded-lg px-4 py-2 text-[#335e88] hover:bg-gray-200">
            <Truck className="mr-3 h-5 w-5" />
            Shipments
          </Link>
          <Link href="#" className="flex items-center rounded-lg px-4 py-2 text-[#335e88] hover:bg-gray-200">
            <TrendingUp className="mr-3 h-5 w-5" />
            Analytics
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Navigation Bar */}
        <header className="bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="lg:hidden">
                <Menu className="h-6 w-6 text-[#335e88]" />
              </Button>
              <div className="flex items-center space-x-2 lg:hidden">
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

        <div className="p-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-[#335e88]">Welcome back, Sarah</h2>
            <Button className="bg-[#335e88] hover:bg-[#264a6d]">Create New Load</Button>
          </div>

          {/* Overview Cards */}
          <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#335e88]">Active Loads</CardTitle>
                <Package className="h-4 w-4 text-[#335e88]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#335e88]">24</div>
                <p className="text-xs text-[#335e88]">+2 from yesterday</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#335e88]">Pending Negotiations</CardTitle>
                <Users className="h-4 w-4 text-[#335e88]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#335e88]">7</div>
                <p className="text-xs text-[#335e88]">3 require attention</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#335e88]">On-Time Deliveries</CardTitle>
                <TrendingUp className="h-4 w-4 text-[#335e88]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#335e88]">98.5%</div>
                <p className="text-xs text-[#335e88]">+0.5% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#335e88]">Revenue</CardTitle>
                <Truck className="h-4 w-4 text-[#335e88]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#335e88]">$52,429</div>
                <p className="text-xs text-[#335e88]">+18% from last month</p>
              </CardContent>
            </Card>
          </div>

          {/* Active Loads and Pending Negotiations */}
          <Tabs defaultValue="active-loads" className="mb-8">
            <TabsList>
              <TabsTrigger value="active-loads" className="text-[#335e88]">Active Loads</TabsTrigger>
              <TabsTrigger value="pending-negotiations" className="text-[#335e88]">Pending Negotiations</TabsTrigger>
            </TabsList>
            <TabsContent value="active-loads">
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#335e88]">Active Loads</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { id: "L1234", from: "Los Angeles, CA", to: "New York, NY", carrier: "FastTruck Inc.", progress: 75 },
                      { id: "L5678", from: "Chicago, IL", to: "Miami, FL", carrier: "SpeedyHaul Co.", progress: 30 },
                      { id: "L9101", from: "Seattle, WA", to: "Dallas, TX", carrier: "ReliableRoad Ltd.", progress: 50 },
                    ].map((load) => (
                      <div key={load.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                          <h3 className="font-semibold text-[#335e88]">{load.id}</h3>
                          <p className="text-sm text-[#335e88]">
                            <MapPin className="mr-1 inline-block h-4 w-4" />
                            {load.from} to {load.to}
                          </p>
                          <p className="text-sm text-[#335e88]">{load.carrier}</p>
                        </div>
                        <div className="w-1/3">
                          <Progress value={load.progress} className="h-2 w-full bg-[#e0e8f0]" indicatorClassName="bg-[#335e88]" />
                          <p className="mt-1 text-right text-xs text-[#335e88]">{load.progress}% Complete</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="pending-negotiations">
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#335e88]">Pending Negotiations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { id: "N2468", carrier: "QuickShip Logistics", load: "L3579", status: "Awaiting Response" },
                      { id: "N1357", carrier: "EcoFreight Systems", load: "L2468", status: "Countered" },
                      { id: "N8024", carrier: "PrimeHaul Express", load: "L7913", status: "Requires Attention" },
                    ].map((negotiation) => (
                      <div key={negotiation.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                          <h3 className="font-semibold text-[#335e88]">{negotiation.id}</h3>
                          <p className="text-sm text-[#335e88]">{negotiation.carrier}</p>
                          <p className="text-sm text-[#335e88]">Load: {negotiation.load}</p>
                        </div>
                        <Badge variant={negotiation.status === "Requires Attention" ? "destructive" : "secondary"} className="bg-[#335e88] text-white">
                          {negotiation.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#335e88]">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { icon: Truck, text: "Load L1234 picked up by FastTruck Inc.", time: "2 hours ago" },
                  { icon: Users, text: "New carrier onboarded: GreenMile Logistics", time: "4 hours ago" },
                  { icon: Loader2, text: "Load L5678 30% complete, on schedule", time: "6 hours ago" },
                  { icon: CalendarDays, text: "Scheduled delivery for Load L9101 updated", time: "Yesterday" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <activity.icon className="mt-1 h-5 w-5 text-[#335e88]" />
                    <div className="flex-1">
                      <p className="text-sm text-[#335e88]">{activity.text}</p>
                      <p className="text-xs text-[#335e88]">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}