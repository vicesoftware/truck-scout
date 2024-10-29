'use client'

import React, { useState } from 'react'
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Mail, 
  DollarSign, 
  FileText, 
  Users, 
  CheckCircle, 
  Clock, 
  ChevronLeft, 
  ChevronRight,
  X 
} from 'lucide-react'
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
import { saveAs } from 'file-saver'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCarriers, useCarrierMutations } from './queries'
import { Carrier } from '@/types/carrier'

export default function CarriersPage() {
  const { data: carriers = [], isLoading } = useCarriers();
  const { createCarrier: createCarrierMutation, updateCarrier: updateCarrierMutation, deleteCarrier: deleteCarrierMutation } = useCarrierMutations();
  
  const [editingCarrier, setEditingCarrier] = useState<Carrier | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [carriersPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<Carrier, 'id'>>({
    name: '',
    mc_number: '',
    dot_number: '',
    phone: '',
    status: 'Pending',
    rating: 0
  });
  const [errors, setErrors] = useState<Partial<Omit<Carrier, 'id'>>>({});

  if (isLoading) {
    return <div className="p-6">Loading carriers...</div>;
  }

  const deleteCarrier = async (id: number) => {
    try {
      await deleteCarrierMutation.mutateAsync(id);
    } catch (error) {
      console.error('Failed to delete carrier:', error);
    }
  };

  const filteredCarriers = carriers.filter(carrier =>
    (carrier.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
    (carrier.mc_number?.includes(searchTerm) ?? false) ||
    (carrier.dot_number?.includes(searchTerm) ?? false)
  );

  // Get current carriers (update to use filteredCarriers)
  const indexOfLastCarrier = currentPage * carriersPerPage;
  const indexOfFirstCarrier = indexOfLastCarrier - carriersPerPage;
  const currentCarriers = filteredCarriers.slice(indexOfFirstCarrier, indexOfLastCarrier);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const exportToCSV = () => {
    const headers = ['Name', 'MC Number', 'DOT Number', 'Phone', 'Status', 'Rating'];
    const csvData = filteredCarriers.map(carrier => 
      [carrier.name, carrier.mc_number, carrier.dot_number, carrier.phone, carrier.status, carrier.rating.toString()]
    );
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'carriers_export.csv');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value }));
    setErrors((prev) => ({ ...prev, status: '' }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Omit<Carrier, 'id'>> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.mc_number.trim()) newErrors.mc_number = 'MC Number is required';
    if (!formData.dot_number.trim()) newErrors.dot_number = 'DOT Number is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.status) newErrors.status = 'Status is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        if (editingCarrier) {
          await updateCarrierMutation.mutateAsync({ ...formData, id: editingCarrier.id });
        } else {
          await createCarrierMutation.mutateAsync(formData);
        }
        setIsDialogOpen(false);
        setFormData({
          name: '',
          mc_number: '',
          dot_number: '',
          phone: '',
          status: 'Pending',
          rating: 0
        });
        setEditingCarrier(null);
      } catch (error) {
        console.error('Failed to save carrier:', error);
      }
    }
  };

  const openEditDialog = (carrier: Carrier) => {
    setEditingCarrier(carrier);
    setFormData({
      name: carrier.name,
      mc_number: carrier.mc_number,
      dot_number: carrier.dot_number,
      phone: carrier.phone,
      status: carrier.status,
      rating: carrier.rating
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#335e88]" data-testid="carriers-title">Carriers</h1>
        <Button onClick={() => setIsDialogOpen(true)} className="bg-[#335e88] hover:bg-[#264a6b]" data-testid="add-carrier-button">
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
            <div className="text-2xl font-bold text-[#335e88]" data-testid="total-carriers">{carriers.length}</div>
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
            data-testid="search-carriers"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2 top-2.5 h-4 w-4 rounded-full bg-gray-200 hover:bg-[#335e88] hover:text-white flex items-center justify-center"
              data-testid="clear-search"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
        <Button 
          variant="outline" 
          className="text-[#335e88] border-[#335e88] hover:bg-[#335e88] hover:text-white"
          onClick={exportToCSV}
          data-testid="export-button"
        >
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
            <TableRow key={carrier.id} data-testid={`carrier-row-${carrier.id}`}>
              <TableCell className="font-medium" data-testid="carrier-name">{carrier.name}</TableCell>
              <TableCell data-testid="carrier-mc-number">{carrier.mc_number}</TableCell>
              <TableCell data-testid="carrier-dot-number">{carrier.dot_number}</TableCell>
              <TableCell data-testid="carrier-status">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  carrier.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {carrier.status}
                </span>
              </TableCell>
              <TableCell data-testid="carrier-rating">{carrier.rating}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 text-[#335e88] hover:bg-[#335e88] hover:text-white" data-testid={`carrier-actions-${carrier.id}`}>
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => openEditDialog(carrier)} data-testid={`edit-carrier-${carrier.id}`}>Edit Carrier</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => deleteCarrier(carrier.id)} data-testid={`delete-carrier-${carrier.id}`}>Delete Carrier</DropdownMenuItem>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle data-testid="carrier-dialog-title">{editingCarrier ? 'Edit Carrier' : 'Add New Carrier'}</DialogTitle>
            <DialogDescription>
              Enter the details of the carrier here. All fields are required.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} data-testid="carrier-form">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="col-span-3"
                  required
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  data-testid="carrier-name-input"
                />
                {errors.name && <p id="name-error" className="text-sm text-red-500 col-start-2 col-span-3">{errors.name}</p>}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="mc_number" className="text-right">
                  MC Number
                </Label>
                <Input
                  id="mc_number"
                  name="mc_number"
                  value={formData.mc_number}
                  onChange={handleChange}
                  className="col-span-3"
                  required
                  aria-invalid={!!errors.mc_number}
                  aria-describedby={errors.mc_number ? "mc_number-error" : undefined}
                  data-testid="carrier-mc-number-input"
                />
                {errors.mc_number && <p id="mc_number-error" className="text-sm text-red-500 col-start-2 col-span-3">{errors.mc_number}</p>}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dot_number" className="text-right">
                  DOT Number
                </Label>
                <Input
                  id="dot_number"
                  name="dot_number"
                  value={formData.dot_number}
                  onChange={handleChange}
                  className="col-span-3"
                  required
                  aria-invalid={!!errors.dot_number}
                  aria-describedby={errors.dot_number ? "dot_number-error" : undefined}
                  data-testid="carrier-dot-number-input"
                />
                {errors.dot_number && <p id="dot_number-error" className="text-sm text-red-500 col-start-2 col-span-3">{errors.dot_number}</p>}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="col-span-3"
                  required
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                  data-testid="carrier-phone-input"
                />
                {errors.phone && <p id="phone-error" className="text-sm text-red-500 col-start-2 col-span-3">{errors.phone}</p>}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select value={formData.status} onValueChange={handleStatusChange} required>
                  <SelectTrigger id="status" className="col-span-3" data-testid="carrier-status-select">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && <p id="status-error" className="text-sm text-red-500 col-start-2 col-span-3">{errors.status}</p>}
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" data-testid="save-carrier-button">{editingCarrier ? 'Update Carrier' : 'Save Carrier'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
