export interface Carrier {
  id: number;
  name: string;
  mc_number: string;
  dot_number: string;
  phone: string;
  status: string;
  rating: number;
}

export type CarrierFormData = Omit<Carrier, 'id'>;
