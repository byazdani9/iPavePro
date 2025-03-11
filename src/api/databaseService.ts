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
    
    if (error) {
      console.error('Error in customerService.getAll:', error);
      throw error;
    }
    console.log('Customer data from database:', data ? data.length : 0, 'records');
    
    // Map database fields to client model if needed
    const customers = data?.map(customer => ({
      ...customer,
      // Map state to province if your UI expects it
      province: customer.state,
      // Map any other fields as needed
    })) || [];
    
    return customers;
  },
  
  async getById(id: string): Promise<Customer | null> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('customer_id', id)
      .single();
    
    if (error) {
      console.error('Error in customerService.getById:', error);
      throw error;
    }
    
    if (data) {
      // Map database fields to match client model
      return {
        ...data,
        province: data.state, // Map state to province for UI consistency
      };
    }
    
    return null;
  },
  
  async create(customer: Omit<Customer, 'customer_id'>): Promise<Customer> {
    console.log('Creating new customer with data:', customer);
    
    // Make sure we're mapping any UI province field to state for database
    const dbCustomer: any = { ...customer };
    
    // If there's a UI-based province field that we need to map to state
    if ('province' in dbCustomer && !('state' in dbCustomer)) {
      console.log('Mapping province to state for database insert');
      // Explicitly cast province to string to avoid TypeScript errors
      const provinceValue = dbCustomer.province as string;
      dbCustomer.state = provinceValue;
      delete dbCustomer.province; // Remove province as it doesn't exist in the database
    }
    
    const { data, error } = await supabase
      .from('customers')
      .insert(dbCustomer)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
    
    console.log('Customer created successfully:', data);
    
    // Return customer with both state and province fields for UI consistency
    return {
      ...data,
      province: data.state
    };
  },
  
  async update(id: string, updates: Partial<Customer>): Promise<Customer> {
    console.log('Updating customer with ID:', id, 'and data:', updates);
    
    // Map province to state for database consistency
    const dbUpdates: any = { ...updates };
    
    // Handle province field mapping
    if ('province' in dbUpdates && !('state' in dbUpdates)) {
      console.log('Mapping province to state for database update');
      const provinceValue = dbUpdates.province as string | undefined;
      dbUpdates.state = provinceValue;
      delete dbUpdates.province;
    }
    
    const { data, error } = await supabase
      .from('customers')
      .update(dbUpdates)
      .eq('customer_id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
    
    console.log('Customer updated successfully:', data);
    
    // Map state to province for UI consistency
    return {
      ...data,
      province: data.state
    };
  },
  
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('customer_id', id);
    
    if (error) throw error;
  }
};

// Job services
export const jobService = {
  async getAll(): Promise<any[]> {
    const { data, error } = await supabase
      .from('jobs')
      .select('*, customers(*)')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },
  
  async getById(id: string): Promise<any | null> {
    const { data, error } = await supabase
      .from('jobs')
      .select('*, customers(*)')
      .eq('job_id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  async getByCustomerId(customerId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },
  
  async create(job: any): Promise<any> {
    const { data, error } = await supabase
      .from('jobs')
      .insert(job)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  async update(id: string, updates: any): Promise<any> {
    const { data, error } = await supabase
      .from('jobs')
      .update(updates)
      .eq('job_id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('job_id', id);
    
    if (error) throw error;
  }
};
