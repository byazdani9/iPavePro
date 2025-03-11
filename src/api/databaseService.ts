import { supabase } from './supabase';
import {
  Customer,
  SalesRepresentative,
  Proposal,
  Project,
  ProjectMilestone,
  MaterialAndQuantity
} from '../models/types';

// Customer services
export const customerService = {
  async getAll(): Promise<Customer[]> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('last_name', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },
  
  async getById(id: string): Promise<Customer | null> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('customer_id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  async create(customer: Omit<Customer, 'customer_id'>): Promise<Customer> {
    const { data, error } = await supabase
      .from('customers')
      .insert(customer)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  async update(id: string, updates: Partial<Customer>): Promise<Customer> {
    const { data, error } = await supabase
      .from('customers')
      .update(updates)
      .eq('customer_id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('customer_id', id);
    
    if (error) throw error;
  }
};

// Similar services for other tables
export const proposalService = {
  async getAll(): Promise<Proposal[]> {
    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .order('date_quoted', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },
  
  // Add other methods similar to customerService
};

export const projectService = {
  async getAll(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('date_signed', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },
  
  // Add other methods similar to customerService
};

// Add similar services for ProjectMilestone and MaterialAndQuantity