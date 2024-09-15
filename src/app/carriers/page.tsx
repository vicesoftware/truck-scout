import React from 'react'
import { Plus, Search, MoreHorizontal, Mail, DollarSign, FileText, Truck, Users, CheckCircle, Clock } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CarriersPage() {
  const carriers = [
    { id: 1, name: 'FastTruck Inc.', mc: 'MC-123456', dot: 'DOT-7890123', status: 'Active', rating: 4.8 },
    { id: 2, name: 'SpeedyHaul Co.', mc: 'MC-234567', dot: 'DOT-8901234', status: 'Pending', rating: 4.5 },
    { id: 3, name: 'ReliableRoad Ltd.', mc: 'MC-345678', dot: 'DOT-9012345', status: 'Active', rating: 4.9 },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#335e88]">Carriers</h1>
        <Button className="bg-[#335e88] hover:bg-[#264a6b]">
          <Plus className="mr-2 h-4 w-4" /> Add New Carrier
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#335e88]">Total Carriers</CardTitle>
            <Users className="h-4 w-4 text-[#335e88]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#335e88]">247</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#335e88]">Active This Month</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#335e88]">182</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#335e88]">Pending Approval</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#335e88]">15</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input placeholder="Search carriers" className="pl-8" />
        </div>
        <Button variant="outline" className="text-[#335e88] border-[#335e88] hover:bg-[#335e88] hover:text-white">
          <FileText className="mr-2 h-4 w-4" /> Export
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-[#335e88]">Carrier Name</TableHead>
            <TableHead className="text-[#335e88]">MC Number</TableHead>
            <TableHead className="text-[#335e88]">DOT Number</TableHead>
            <TableHead className="text-[#335e88]">Status</TableHead>
            <TableHead className="text-[#335e88]">Rating</TableHead>
            <TableHead className="text-[#335e88]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {carriers.map((carrier) => (
            <TableRow key={carrier.id}>
              <TableCell className="font-medium">{carrier.name}</TableCell>
              <TableCell>{carrier.mc}</TableCell>
              <TableCell>{carrier.dot}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  carrier.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {carrier.status}
                </span>
              </TableCell>
              <TableCell>{carrier.rating}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 text-[#335e88] hover:bg-[#335e88] hover:text-white">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <Mail className="mr-2 h-4 w-4" />
                      <span>Invite to Platform</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <DollarSign className="mr-2 h-4 w-4" />
                      <span>Create Invoice</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Edit Carrier</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}