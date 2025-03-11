import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Header, Card, StatusBadge, Button } from '../../components/ui';
import theme from '../../theme';
import { JobDetailScreenProps } from '../../navigation/types';

// Mock data for a single job
const mockJob = {
  id: '1',
  name: 'Soil Hauling',
  number: 'M23-030',
  status: 'lead',
  amount: 134944.60,
  customer: {
    id: '1',
    name: 'Otmar Taubner',
    company: 'T. Musselman Excavating',
    address: '685 Lake Rd, Toronto ON M4B 1B3',
    email: 'otmar@musselman.ca',
    phone: '(416) 555-1234',
  },
  jobSite: {
    address: '685 Lake Rd, Toronto ON M4B 1B3',
    notes: 'Access through rear gate. Call before arrival.',
  },
  estimates: [
    {
      id: '1',
      name: 'Site Preparation',
      amount: 45000.00,
      date: '2024-03-05',
    },
    {
      id: '2',
      name: 'Material Supply',
      amount: 89944.60,
      date: '2024-03-07',
    },
  ],
  purchaseOrders: [],
  invoices: [],
  payments: [],
};

const JobDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  
  // In a real app, we would fetch the job data based on the jobId from the route params
  // For now, we're using mock data
  const jobId = (route.params as { jobId: string })?.jobId || '1';
  
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
          <TouchableOpacity>
            <Text style={styles.duplicateText}>Duplicate</Text>
          </TouchableOpacity>
        }
      />
      
      <ScrollView style={styles.scrollView}>
        {/* Job Header */}
        <View style={styles.jobHeader}>
          <View style={styles.jobIcon}>
            <Text style={styles.jobIconText}>🏠</Text>
          </View>
          <View style={styles.jobHeaderContent}>
            <Text style={styles.jobName}>{mockJob.name}</Text>
            <Text style={styles.jobNumber}>{mockJob.number}</Text>
            <StatusBadge status="lead" />
          </View>
        </View>
        
        {/* Customer Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>CUSTOMER</Text>
          
          {mockJob.customer ? (
            <Card>
              <View style={styles.customerInfo}>
                <View style={styles.customerIconContainer}>
                  <Text style={styles.customerIcon}>👤</Text>
                </View>
                <View style={styles.customerDetails}>
                  <Text style={styles.customerName}>{mockJob.customer.name}</Text>
                  {mockJob.customer.company && (
                    <Text style={styles.customerCompany}>{mockJob.customer.company}</Text>
                  )}
                </View>
                <TouchableOpacity>
                  <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity style={styles.contactsButton}>
                <Text style={styles.contactsButtonText}>📞 Contacts</Text>
                <Text style={styles.contactsCount}>1 ›</Text>
              </TouchableOpacity>
            </Card>
          ) : (
            <Card>
              <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addButtonText}>+ Add Customer</Text>
              </TouchableOpacity>
            </Card>
          )}
        </View>
        
        {/* Job Site Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>JOB SITE</Text>
          
          {mockJob.jobSite ? (
            <Card>
              <View style={styles.jobSiteInfo}>
                <View style={styles.jobSiteIconContainer}>
                  <Text style={styles.jobSiteIcon}>📍</Text>
                </View>
                <View style={styles.jobSiteDetails}>
                  <Text style={styles.jobSiteAddress}>{mockJob.jobSite.address}</Text>
                </View>
                <TouchableOpacity>
                  <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.jobSiteNotes}>
                <Text style={styles.jobSiteNotesText}>{mockJob.jobSite.notes}</Text>
              </View>
            </Card>
          ) : (
            <Card>
              <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addButtonText}>+ Add Job Site</Text>
              </TouchableOpacity>
            </Card>
          )}
        </View>
        
        {/* Estimate Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>ESTIMATES AND DOCUMENTS</Text>
          
          {mockJob.estimates.map(estimate => (
            <TouchableOpacity 
              key={estimate.id}
              style={styles.estimateItem}
              onPress={() => navigation.navigate('EstimateDetail', { estimateId: estimate.id })}
            >
              <Text style={styles.estimateIcon}>📄</Text>
              <Text style={styles.estimateName}>{estimate.name}</Text>
              <Text style={styles.estimateAmount}>
                ${estimate.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ›
              </Text>
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity style={styles.addEstimateButton}>
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
              ${mockJob.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
  duplicateText: {
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
