'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Package,
  Users,
  TrendingUp,
  Truck,
  MapPin,
  CalendarDays,
  Loader2
} from "lucide-react"
import { cn } from "@/lib/utils"

export function BrokerDashboardComponent() {
  const getProgressColor = (progress: number) => {
    if (progress < 33) return "bg-red-400" // Subdued coral-red
    if (progress < 66) return "bg-amber-400" // Soft amber
    return "bg-teal-500" // Muted teal-green
  }

  return (
    <>
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
                      <div className="h-2 w-full bg-[#e0e8f0] rounded-full overflow-hidden">
                        <div
                          className={cn("h-full", getProgressColor(load.progress))}
                          style={{ width: `${load.progress}%` }}
                        ></div>
                      </div>
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
    </>
  )
}