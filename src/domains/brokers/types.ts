// TypeScript types for brokers domain, aligned with PostgreSQL database schema

export interface Broker {
  id?: number;
  name: string;
  contact_email?: string;
  contact_phone?: string;
  type: 'BROKER_ONLY' | 'BROKER_CARRIER';
}

export interface Load {
  id?: number;
  broker_id: number;
  carrier_id?: number;
  shipper_id: number;
  status: LoadStatus;
  origin: string;
  destination: string;
  weight?: number;
  dimensions?: string;
  special_instructions?: string;
  rate: number;
  created_at?: Date;
  updated_at?: Date;
}

export type LoadStatus = 
  | 'CREATED'       // Load initially created
  | 'SEARCHING'     // Searching for a carrier
  | 'NEGOTIATING'   // Negotiating details with carrier
  | 'ASSIGNED'      // Assigned to a carrier
  | 'IN_PROGRESS'   // Load is being transported
  | 'COMPLETED'     // Load has been delivered
  | 'INVOICED'      // Invoice generated
  | 'PAID'          // Payment received
  | 'CANCELLED';    // Load was cancelled

export interface Carrier {
  id?: number;
  name: string;
  contact_email?: string;
  contact_phone?: string;
  dot_number?: string;
  mc_number?: string;
  total_trucks?: number;
  active_loads?: number;
  performance_rating?: number;
}

export interface Shipper {
  id?: number;
  name: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  industry_type?: string;
  frequent_shipper?: boolean;
}

export interface Factor {
  id?: number;
  name: string;
  contact_email?: string;
  contact_phone?: string;
  financing_specialty?: string;
  max_financing_amount?: number;
  interest_rate?: number;
}

// Utility types for database interactions
export type DatabaseResult<T> = T & {
  rows: T[];
};
