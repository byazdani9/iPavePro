// Common timestamp fields
export interface TimestampFields {
  created_at?: string;
  updated_at?: string;
}

// Customer model
export interface Customer extends TimestampFields {
  customer_id: string;
  first_name: string;
  last_name: string;
  company_name?: string; // Changed from company to company_name to match database schema
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string; // Database column is 'state' not 'province'
  postal_code?: string;
  notes?: string;
  coordinates_latitude?: number;
  coordinates_longitude?: number;
}

// Job model
export interface Job extends TimestampFields {
  job_id: string;
  customer_id: string;
  name: string;
  number?: string;
  status?: string;
  description?: string;
  address?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  amount?: number;
  start_date?: string;
  end_date?: string;
  customer?: Customer;
}

// Sales Rep model
export interface SalesRepresentative extends TimestampFields {
  rep_id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  active_status: boolean;
}

// Proposal Status Type
export type ProposalStatus = 'active' | 'declined' | 'expired' | 'converted';

// Proposal model
export interface Proposal extends TimestampFields {
  proposal_id: string;
  customer_id: string;
  sales_rep_id?: string;
  date_quoted: string;
  bid_value: number;
  scope_description?: string;
  proposal_status: ProposalStatus;
  notes?: string;
}

// Project Status Type
export type ProjectStatus = 'pending' | 'in_progress' | 'completed';

// Project model
export interface Project extends TimestampFields {
  project_id: string;
  customer_id: string;
  original_proposal_id?: string;
  sales_rep_id?: string;
  date_signed: string;
  contract_value: number;
  scope_description?: string;
  permit_required: boolean;
  locates_required: boolean;
  project_status: ProjectStatus;
  notes?: string;
}

// Project Milestone model
export interface ProjectMilestone extends TimestampFields {
  milestone_id: string;
  project_id: string;
  milestone_type: string;
  planned_date?: string;
  actual_date?: string;
  notes?: string;
}

// Materials and Quantities model
export interface MaterialAndQuantity extends TimestampFields {
  quantity_id: string;
  project_id: string;
  material_type: string;
  area_square_feet?: number;
  depth_inches?: number;
  tonnage?: number;
  unit_price?: number;
  total_price?: number;
  notes?: string;
}
