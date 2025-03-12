import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { Header, Card, StatusBadge, Button } from '../../components/ui';
import theme from '../../theme';
import { JobDetailScreenProps } from '../../navigation/types';
import { supabase } from '../../api/supabase';

// Interface for job data
interface JobData {
  job_id: string;
  name: string;
  number: string;
  status: string;
  amount: number | null;
  customer_id: string;
  description?: string;
  address?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  start_date?: string;
  end_date?: string;
  created_at?: string;
  updated_at?: string;
  customer?: {
    customer_id: string;
    first_name: string;
    last_name: string;
    company_name?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    postal_code?: string;
  };
}

const JobDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const jobId = (route.params as { jobId: string })?.jobId || '1';
  
  // State for job data
  const [job, setJob] = useState<JobData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch job data when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchJobData();
      return () => {};
    }, [jobId])
  );
  
  // Function to fetch job data from Supabase
  const fetchJobData = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching job with ID:', jobId);
      
      // Get job data
      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .select('*')
        .eq('job_id', jobId)
        .single();
      
      if (jobError) {
        console.error('Error fetching job:', jobError);
        Alert.alert('Error', 'Failed to load job details');
        setIsLoading(false);
        return;
      }
      
      if (!jobData) {
        console.error('No job found with ID:', jobId);
        Alert.alert('Error', 'Job not found');
        setIsLoading(false);
        return;
      }
      
      // Get customer data for this job
      if (jobData.customer_id) {
        const { data: customerData, error: customerError } = await supabase
          .from('customers')
          .select('*')
          .eq('customer_id', jobData.customer_id)
          .single();
          
        if (customerError) {
          console.error('Error fetching customer for job:', customerError);
        } else if (customerData) {
          // Add customer to job data
          jobData.customer = customerData;
        }
      }
      
      console.log('Job data loaded:', jobData);
      setJob(jobData);
    } catch (error) {
      console.error('Error in fetchJobData:', error);
      Alert.alert('Error', 'Failed to load job details');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to format customer name
  const formatCustomerName = (customer?: JobData['customer']) => {
    if (!customer) return 'No Customer';
    return `${customer.first_name} ${customer.last_name}`;
  };

  // Function to format customer full address
  const formatAddress = (customer?: JobData['customer']) => {
    if (!customer || !customer.address) return 'No address';
    return `${customer.address}, ${customer.city || ''} ${customer.state || ''}${customer.postal_code ? ' ' + customer.postal_code : ''}`;
  };
  
  // Function to format job site address
  const formatJobSiteAddress = (job?: JobData | null) => {
    if (!job || !job.address) return 'No job site address';
    return `${job.address}, ${job.city || ''} ${job.province || ''}${job.postal_code ? ' ' + job.postal_code : ''}`;
  };
  
  // Handle job deletion
  const handleDeleteJob = () => {
    Alert.alert(
      'Delete Job',
      'Are you sure you want to delete this job? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);
              const { error } = await supabase
                .from('jobs')
                .delete()
                .eq('job_id', jobId);
                
              if (error) {
                console.error('Error deleting job:', error);
                Alert.alert('Error', 'Failed to delete job');
                setIsLoading(false);
                return;
              }
              
              Alert.alert('Success', 'Job deleted successfully');
              navigation.goBack();
            } catch (error) {
              console.error('Error in handleDeleteJob:', error);
              Alert.alert('Error', 'Failed to delete job');
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };
  
  // Show loading indicator while data is being fetched
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header
          title="Job"
          leftComponent={
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backButtonText}>Jobs</Text>
            </TouchableOpacity>
          }
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading job details...</Text>
        </View>
      </View>
    );
  }
  
  // Show message if no job data is available
  if (!job) {
    return (
      <View style={styles.container}>
        <Header
          title="Job"
          leftComponent={
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backButtonText}>Jobs</Text>
            </TouchableOpacity>
          }
        />
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>No job data available</Text>
          <Button
            title="Go back"
            variant="primary"
            onPress={() => navigation.goBack()}
          />
        </View>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Header
        title="Job"
        leftComponent={
          <TouchableOpacity
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Jobs</Text>
          </TouchableOpacity>
        }
        rightComponent={
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.headerAction}
              onPress={() => navigation.navigate('JobForm', { jobId: job.job_id })}
            >
              <Text style={styles.headerActionText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerAction}>
              <Text style={styles.headerActionText}>Duplicate</Text>
            </TouchableOpacity>
          </View>
        }
      />
      
      <ScrollView style={styles.scrollView}>
        {/* Job Header */}
        <View style={styles.jobHeader}>
          <View style={styles.jobIcon}>
            <Text style={styles.jobIconText}>🏠</Text>
          </View>
          <View style={styles.jobHeaderContent}>
            <Text style={styles.jobName}>{job.name || 'Untitled Job'}</Text>
            <Text style={styles.jobNumber}>{job.number || 'No job number'}</Text>
            <StatusBadge status={(job.status as 'lead' | 'contract' | 'started' | 'completed' | 'closed') || 'lead'} />
          </View>
        </View>
        
        {/* Customer Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>CUSTOMER</Text>
          
          {job.customer ? (
            <Card>
              <View style={styles.customerInfo}>
                <View style={styles.customerIconContainer}>
                  <Text style={styles.customerIcon}>👤</Text>
                </View>
                <View style={styles.customerDetails}>
                  <Text style={styles.customerName}>
                    {formatCustomerName(job.customer)}
                  </Text>
                  {job.customer.company_name && (
                    <Text style={styles.customerCompany}>
                      {job.customer.company_name}
                    </Text>
                  )}
                </View>
                <TouchableOpacity
                  onPress={() => navigation.navigate('CustomerForm', { customerId: job.customer_id })}
                >
                  <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity 
                style={styles.contactsButton}
                onPress={() => navigation.navigate('CustomerDetail', { customerId: job.customer_id })}
              >
                <Text style={styles.contactsButtonText}>📞 View Customer</Text>
                <Text style={styles.contactsCount}>›</Text>
              </TouchableOpacity>
            </Card>
          ) : (
            <Card>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => navigation.navigate('CustomerForm')}
              >
                <Text style={styles.addButtonText}>+ Add Customer</Text>
              </TouchableOpacity>
            </Card>
          )}
        </View>
        
        {/* Job Site Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>JOB SITE</Text>
          
          {job.address ? (
            <Card>
              <View style={styles.jobSiteInfo}>
                <View style={styles.jobSiteIconContainer}>
                  <Text style={styles.jobSiteIcon}>📍</Text>
                </View>
                <View style={styles.jobSiteDetails}>
                  <Text style={styles.jobSiteAddress}>
                    {formatJobSiteAddress(job)}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => navigation.navigate('JobForm', { jobId: job.job_id })}
                >
                  <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
              </View>
              
              {job.description && (
                <View style={styles.jobSiteNotes}>
                  <Text style={styles.jobSiteNotesText}>{job.description}</Text>
                </View>
              )}
            </Card>
          ) : (
            <Card>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => navigation.navigate('JobForm', { jobId: job.job_id })}
              >
                <Text style={styles.addButtonText}>+ Add Job Site</Text>
              </TouchableOpacity>
            </Card>
          )}
        </View>
        
        {/* Estimate Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>ESTIMATES AND DOCUMENTS</Text>
          
        <TouchableOpacity 
            style={styles.addEstimateButton}
            onPress={() => navigation.navigate('EstimateForm', { jobId: job.job_id })}
          >
            <Text style={styles.addEstimateButtonText}>+ Add Estimate</Text>
          </TouchableOpacity>
        </View>
        
        {/* Financial Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>FINANCES</Text>
          
          <View style={styles.financialItem}>
            <Text style={styles.financialIcon}>📊</Text>
            <Text style={styles.financialName}>Job Total</Text>
            <Text style={styles.financialAmount}>
              {job.amount 
                ? `$${job.amount.toLocaleString(undefined, { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}` 
                : 'No amount'}
            </Text>
          </View>
          
          <TouchableOpacity style={styles.financialItem}>
            <Text style={styles.financialIcon}>📋</Text>
            <Text style={styles.financialName}>Purchase Orders</Text>
            <Text style={styles.financialAmount}>None ›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.financialItem}>
            <Text style={styles.financialIcon}>📝</Text>
            <Text style={styles.financialName}>Invoices</Text>
            <Text style={styles.financialAmount}>None ›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.financialItem}>
            <Text style={styles.financialIcon}>💵</Text>
            <Text style={styles.financialName}>Payments</Text>
            <Text style={styles.financialAmount}>None ›</Text>
          </TouchableOpacity>
        </View>
        
        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Button
            title="Convert to Contract"
            variant="primary"
            onPress={() => {}}
            fullWidth
            style={styles.actionButton}
          />
          
          <Button
            title="Make Inactive"
            variant="outline"
            onPress={() => {}}
            fullWidth
            style={styles.actionButton}
          />
          
          <Button
            title="Delete Job"
            variant="danger"
            onPress={handleDeleteJob}
            fullWidth
            style={styles.actionButton}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
  },
  errorText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.action.danger,
    marginBottom: theme.spacing.lg,
  },
  backButtonText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.action.primary,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerAction: {
    marginHorizontal: theme.spacing.xs,
  },
  headerActionText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.action.primary,
  },
  jobHeader: {
    flexDirection: 'row',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  jobIcon: {
    width: 60,
    height: 60,
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.lg,
  },
  jobIconText: {
    fontSize: theme.typography.fontSize.xxl,
  },
  jobHeaderContent: {
    flex: 1,
  },
  jobName: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  jobNumber: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    marginBottom: 8,
  },
  section: {
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  sectionHeader: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  customerIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: theme.colors.primary,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  customerIcon: {
    fontSize: 20,
  },
  customerDetails: {
    flex: 1,
  },
  customerName: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium as any,
    color: theme.colors.action.primary,
  },
  customerCompany: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  editText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.action.primary,
  },
  contactsButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    borderRadius: theme.layout.borderRadius.sm,
  },
  contactsButtonText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  contactsCount: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
  },
  addButton: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.action.primary,
    fontWeight: theme.typography.fontWeight.medium as any,
  },
  jobSiteInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  jobSiteIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  jobSiteIcon: {
    fontSize: 20,
  },
  jobSiteDetails: {
    flex: 1,
  },
  jobSiteAddress: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.action.primary,
    fontWeight: theme.typography.fontWeight.medium as any,
  },
  jobSiteNotes: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    borderRadius: theme.layout.borderRadius.sm,
  },
  jobSiteNotesText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  estimateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    borderRadius: theme.layout.borderRadius.sm,
    marginBottom: theme.spacing.md,
  },
  estimateIcon: {
    fontSize: theme.typography.fontSize.md,
    marginRight: theme.spacing.md,
  },
  estimateName: {
    flex: 1,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  estimateAmount: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeight.medium as any,
  },
  addEstimateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
  },
  addEstimateButtonText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.action.primary,
    fontWeight: theme.typography.fontWeight.medium as any,
  },
  financialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    borderRadius: theme.layout.borderRadius.sm,
    marginBottom: theme.spacing.md,
  },
  financialIcon: {
    fontSize: theme.typography.fontSize.md,
    marginRight: theme.spacing.md,
  },
  financialName: {
    flex: 1,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  financialAmount: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeight.medium as any,
  },
  actionsContainer: {
    padding: theme.spacing.lg,
    marginBottom: 50,
  },
  actionButton: {
    marginBottom: theme.spacing.md,
  },
});

export default JobDetailScreen;
