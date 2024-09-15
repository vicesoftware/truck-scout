'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Search, MoreHorizontal, Mail, DollarSign, FileText, Users, CheckCircle, Clock, ChevronLeft, ChevronRight } from 'lucide-react'
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

interface Carrier {
  id: number;
  name: string;
  mc_number: string;
  dot_number: string;
  phone: string;
  status: string;
  rating: number;
}

export default function CarriersPage() {
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [newCarrier, setNewCarrier] = useState<Omit<Carrier, 'id'>>({ 
    name: '', 
    mc_number: '', 
    dot_number: '', 
    phone: '',
    status: 'Pending', 
    rating: 0 
  });
  const [editingCarrier, setEditingCarrier] = useState<Carrier | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [carriersPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCarriers();
  }, []);

  const fetchCarriers = async () => {
    const response = await fetch('/api/carriers');
    const data = await response.json();
    if (Array.isArray(data)) {
      setCarriers(data);
    } else {
      console.error('Failed to fetch carriers:', data);
      setCarriers([]);
    }
  };

  const createCarrier = async () => {
    const response = await fetch('/api/carriers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCarrier),
    });
    if (response.ok) {
      setNewCarrier({ 
        name: '', 
        mc_number: '', 
        dot_number: '', 
        phone: '',
        status: 'Pending', 
        rating: 0 
      });
      fetchCarriers();
    }
  };

  const updateCarrier = async () => {
    if (!editingCarrier) return;
    const response = await fetch('/api/carriers', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingCarrier),
    });
    if (response.ok) {
      setEditingCarrier(null);
      fetchCarriers();
    }
  };

  const deleteCarrier = async (id: number) => {
    const response = await fetch('/api/carriers', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (response.ok) {
      fetchCarriers();
    }
  };

  const filteredCarriers = carriers.filter(carrier =>
    carrier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    carrier.mc_number.includes(searchTerm) ||
    carrier.dot_number.includes(searchTerm)
  );

  // Get current carriers (update to use filteredCarriers)
  const indexOfLastCarrier = currentPage * carriersPerPage;
  const indexOfFirstCarrier = indexOfLastCarrier - carriersPerPage;
  const currentCarriers = filteredCarriers.slice(indexOfFirstCarrier, indexOfLastCarrier);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#335e88]">Carriers</h1>
        <Button onClick={createCarrier} className="bg-[#335e88] hover:bg-[#264a6b]">
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
            <div className="text-2xl font-bold text-[#335e88]">{carriers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#335e88]">Active This Month</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#335e88]">
              {Array.isArray(carriers) ? carriers.filter(carrier => carrier.status === 'Active').length : 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#335e88]">Pending Approval</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#335e88]">
              {Array.isArray(carriers) ? carriers.filter(carrier => carrier.status === 'Pending').length : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input 
            placeholder="Search carriers" 
            className="pl-8" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
          {currentCarriers.map((carrier) => (
            <TableRow key={carrier.id}>
              <TableCell className="font-medium">{carrier.name}</TableCell>
              <TableCell>{carrier.mc_number}</TableCell>
              <TableCell>{carrier.dot_number}</TableCell>
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
                    <DropdownMenuItem onClick={() => setEditingCarrier(carrier)}>Edit Carrier</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => deleteCarrier(carrier.id)}>Delete Carrier</DropdownMenuItem>
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
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div>
          Showing {indexOfFirstCarrier + 1} to {Math.min(indexOfLastCarrier, filteredCarriers.length)} of {filteredCarriers.length} entries
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            variant="outline"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: Math.ceil(filteredCarriers.length / carriersPerPage) }, (_, i) => (
            <Button
              key={i}
              onClick={() => paginate(i + 1)}
              variant={currentPage === i + 1 ? "default" : "outline"}
              className={currentPage === i + 1 ? "bg-[#335e88] text-white" : "text-[#335e88]"}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === Math.ceil(filteredCarriers.length / carriersPerPage)}
            variant="outline"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Add a modal or form for editing carriers */}
      {editingCarrier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Edit Carrier</h2>
            <Input
              value={editingCarrier.name}
              onChange={(e) => setEditingCarrier({ ...editingCarrier, name: e.target.value })}
              placeholder="Name"
              className="mb-2"
            />
            <Input
              value={editingCarrier.mc_number}
              onChange={(e) => setEditingCarrier({ ...editingCarrier, mc_number: e.target.value })}
              placeholder="MC Number"
              className="mb-2"
            />
            <Input
              value={editingCarrier.dot_number}
              onChange={(e) => setEditingCarrier({ ...editingCarrier, dot_number: e.target.value })}
              placeholder="DOT Number"
              className="mb-2"
            />
            <Input
              value={editingCarrier.phone}
              onChange={(e) => setEditingCarrier({ ...editingCarrier, phone: e.target.value })}
              placeholder="Phone"
              className="mb-2"
            />
            {/* Add inputs for status and rating if needed */}
            <div className="flex justify-end mt-4">
              <Button onClick={() => setEditingCarrier(null)} variant="outline" className="mr-2">Cancel</Button>
              <Button onClick={updateCarrier} className="bg-[#335e88] hover:bg-[#264a6b]">Save Changes</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}