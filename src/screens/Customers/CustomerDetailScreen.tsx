import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Header, Card, Button } from '../../components/ui';
import theme from '../../theme';
import { supabase } from '../../api/supabase';

type CustomerDetailRouteParams = {
  customerId: string;
};

// Temporary mock data for a customer
const mockCustomer = {
  id: '1',
  first_name: 'Otmar',
  last_name: 'Taubner',
  company: 'T. Musselman Excavating',
  email: 'otmar@musselman.ca',
  phone: '(416) 555-1234',
  address: '685 Lake Rd',
  city: 'Toronto',
  province: 'ON',
  postal_code: 'M4B 1B3',
  notes: 'Prefers communication via email. Has multiple job sites.',
  jobs: [
    {
      id: '1',
      name: 'Soil Hauling',
      number: 'M23-030',
      status: 'lead',
    },
    {
      id: '2',
      name: 'Material Supply',
      number: '2024-1805',
      status: 'lead',
    }
  ]
};

const CustomerDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  
  // In a real app, we would fetch the customer data based on the customerId from the route params
  // For now, we're using mock data
  const customerId = (route.params as CustomerDetailRouteParams)?.customerId || '1';
  
  // This would be replaced with actual data fetching in a real app
  const fetchCustomerData = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*, jobs(*)')
        .eq('id', customerId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching customer:', error);
      Alert.alert('Error', 'Failed to load customer details');
      return null;
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Customer',
      'Are you sure you want to delete this customer? This action cannot be undone.',
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
              // This would delete the customer in a real app
              // await supabase.from('customers').delete().eq('id', customerId);
              Alert.alert('Success', 'Customer deleted successfully');
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting customer:', error);
              Alert.alert('Error', 'Failed to delete customer');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Customer"
        leftComponent={
          <TouchableOpacity
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Customers</Text>
          </TouchableOpacity>
        }
        rightComponent={
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.headerAction}
              onPress={() => navigation.navigate('CustomerForm', { customerId })}
            >
              <Text style={styles.headerActionText}>Edit</Text>
            </TouchableOpacity>
          </View>
        }
      />
      
      <ScrollView style={styles.scrollView}>
        {/* Customer Header */}
        <View style={styles.customerHeader}>
          <View style={styles.customerIcon}>
            <Text style={styles.customerInitials}>
              {mockCustomer.first_name.charAt(0) + mockCustomer.last_name.charAt(0)}
            </Text>
          </View>
          <View style={styles.customerHeaderContent}>
            <Text style={styles.customerName}>{mockCustomer.first_name} {mockCustomer.last_name}</Text>
            {mockCustomer.company && (
              <Text style={styles.customerCompany}>{mockCustomer.company}</Text>
            )}
          </View>
        </View>
        
        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>CONTACT INFORMATION</Text>
          
          <Card>
            {mockCustomer.phone && (
              <View style={styles.infoRow}>
                <Text style={styles.infoIcon}>📞</Text>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Phone</Text>
                  <Text style={styles.infoValue}>{mockCustomer.phone}</Text>
                </View>
              </View>
            )}
            
            {mockCustomer.email && (
              <View style={styles.infoRow}>
                <Text style={styles.infoIcon}>✉️</Text>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>{mockCustomer.email}</Text>
                </View>
              </View>
            )}
            
            {mockCustomer.address && (
              <View style={styles.infoRow}>
                <Text style={styles.infoIcon}>📍</Text>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Address</Text>
                  <Text style={styles.infoValue}>
                    {mockCustomer.address}, {mockCustomer.city}, {mockCustomer.province} {mockCustomer.postal_code}
                  </Text>
                </View>
              </View>
            )}
          </Card>
        </View>
        
        {/* Notes Section */}
        {mockCustomer.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>NOTES</Text>
            
            <Card>
              <Text style={styles.notes}>{mockCustomer.notes}</Text>
            </Card>
          </View>
        )}
        
        {/* Jobs Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>JOBS</Text>
          
          {mockCustomer.jobs.length > 0 ? (
            mockCustomer.jobs.map(job => (
              <TouchableOpacity 
                key={job.id}
                style={styles.jobItem}
                onPress={() => navigation.navigate('JobDetail', { jobId: job.id })}
              >
                <Text style={styles.jobIcon}>🏗️</Text>
                <View style={styles.jobDetails}>
                  <Text style={styles.jobName}>{job.name}</Text>
                  <Text style={styles.jobNumber}>{job.number}</Text>
                </View>
                <Text style={styles.jobArrow}>›</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Card>
              <Text style={styles.noJobs}>No jobs for this customer</Text>
            </Card>
          )}
          
          <TouchableOpacity 
            style={styles.addJobButton}
            onPress={() => navigation.navigate('JobForm', { customer_id: customerId })}
          >
            <Text style={styles.addJobButtonText}>+ Add New Job</Text>
          </TouchableOpacity>
        </View>
        
        {/* Delete Button */}
        <View style={styles.deleteContainer}>
          <Button
            title="Delete Customer"
            variant="outline"
            onPress={handleDelete}
            fullWidth
            style={styles.deleteButton}
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
  customerHeader: {
    flexDirection: 'row',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
    alignItems: 'center',
  },
  customerIcon: {
    width: 60,
    height: 60,
    backgroundColor: theme.colors.primary,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.lg,
  },
  customerInitials: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text.inverse,
  },
  customerHeaderContent: {
    flex: 1,
  },
  customerName: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  customerCompany: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
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
  infoRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: theme.typography.fontSize.lg,
    width: 30,
    textAlign: 'center',
    marginRight: theme.spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  notes: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    lineHeight: theme.typography.lineHeight.md,
  },
  jobItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.layout.borderRadius.sm,
    marginBottom: theme.spacing.md,
    ...theme.layout.shadow.sm,
  },
  jobIcon: {
    fontSize: theme.typography.fontSize.lg,
    marginRight: theme.spacing.md,
  },
  jobDetails: {
    flex: 1,
  },
  jobName: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium as any,
    color: theme.colors.text.primary,
  },
  jobNumber: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  jobArrow: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.secondary,
  },
  noJobs: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    padding: theme.spacing.lg,
  },
  addJobButton: {
    marginTop: theme.spacing.md,
    alignItems: 'center',
  },
  addJobButtonText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.action.primary,
    fontWeight: theme.typography.fontWeight.medium as any,
  },
  deleteContainer: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl,
  },
  deleteButton: {
    borderColor: theme.colors.action.danger,
  },
});

export default CustomerDetailScreen;
