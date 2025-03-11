import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Header, Card } from '../../components/ui';
import theme from '../../theme';
import { DashboardScreenNavigationProp } from '../../navigation/types';

// Mock data for the dashboard
const jobStatusData = [
  { status: 'Leads', count: 8, amount: 278346.71 },
  { status: 'Contract Signed', count: 3, amount: 78900.00 },
  { status: 'Work Started', count: 2, amount: 45600.00 },
  { status: 'Work Completed', count: 4, amount: 120000.00 },
  { status: 'Closed', count: 10, amount: 350000.00 },
];

const scheduledJobs = [
  { id: '1', time: '10:30 AM', name: 'Smith Driveway', location: '123 Oak St, Toronto' },
  { id: '2', time: '1:00 PM', name: 'Commercial Paving', location: '456 Main St, Burlington' },
  { id: '3', time: '3:30 PM', name: 'Storm Line Repair', location: '789 Pine Ave, Markham' },
];

const DashboardScreen = () => {
  const navigation = useNavigation<DashboardScreenNavigationProp>();
  
  // Calculate totals
  const totalJobs = jobStatusData.reduce((sum, item) => sum + item.count, 0);
  const totalAmount = jobStatusData.reduce((sum, item) => sum + item.amount, 0);
  
  // Calculate max value for bar chart scaling
  const maxAmount = Math.max(...jobStatusData.map(item => item.amount));
  
  return (
    <View style={styles.container}>
      <Header 
        title="Dashboard" 
        rightComponent={
          <Text style={styles.syncStatus}>Sync ✓</Text>
        }
      />
      
      <ScrollView style={styles.scrollView}>
        {/* Company Header */}
        <View style={styles.companyHeader}>
          <Text style={styles.companyName}>Northland Paving</Text>
        </View>
        
        {/* Job Stats Card */}
        <Card style={styles.statsCard}>
          <Text style={styles.cardTitle}>Job Status</Text>
          <View style={styles.statsTable}>
            <View style={styles.statsRow}>
              <Text style={styles.statsLabel}>Status</Text>
              <Text style={styles.statsValue}>Amount</Text>
            </View>
            
            {jobStatusData.map((item, index) => (
              <TouchableOpacity 
                key={index}
                style={styles.statsRow}
                onPress={() => navigation.navigate('Jobs')}
              >
                <Text style={styles.statsLabel}>{item.status}</Text>
                <Text style={styles.statsValue}>
                  ${item.amount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>
        
        {/* Chart Card */}
        <Card style={styles.chartCard}>
          {/* Simple bar chart implementation */}
          <View style={styles.chart}>
            {jobStatusData.map((item, index) => (
              <View key={index} style={styles.chartBarContainer}>
                <View 
                  style={[
                    styles.chartBar, 
                    { 
                      height: (item.amount / maxAmount) * 100,
                      backgroundColor: getBarColor(index)
                    }
                  ]} 
                />
              </View>
            ))}
          </View>
          <View style={styles.chartLabels}>
            {jobStatusData.map((item, index) => (
              <Text key={index} style={styles.chartLabel}>{item.status.substring(0, 1)}</Text>
            ))}
          </View>
        </Card>
        
        {/* Schedule Card */}
        <Card style={styles.scheduleCard}>
          <Text style={styles.cardTitle}>Today's Schedule</Text>
          <Text style={styles.scheduleCount}>{scheduledJobs.length} Jobs Scheduled</Text>
          
          {scheduledJobs.map((job, index) => (
            <TouchableOpacity 
              key={job.id}
              style={styles.scheduleItem}
              onPress={() => navigation.navigate('JobDetail', { jobId: job.id })}
            >
              <Text style={styles.scheduleTime}>{job.time}</Text>
              <View style={styles.scheduleDetails}>
                <Text style={styles.scheduleName}>{job.name}</Text>
                <Text style={styles.scheduleLocation}>{job.location}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </Card>
      </ScrollView>
    </View>
  );
};

// Helper function for chart colors
const getBarColor = (index: number) => {
  const colors = [
    theme.colors.leadColor,
    theme.colors.contractColor,
    theme.colors.workStartedColor,
    theme.colors.completedColor,
    '#adb5bd',
  ];
  return colors[index % colors.length];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  companyHeader: {
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  companyName: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text.primary,
  },
  syncStatus: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
  },
  statsCard: {
    margin: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  chartCard: {
    margin: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.lg,
    height: 200,
  },
  scheduleCard: {
    margin: theme.spacing.lg,
    marginBottom: theme.spacing.xxxl,
  },
  cardTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold as any,
    marginBottom: theme.spacing.md,
    color: theme.colors.text.primary,
  },
  statsTable: {
    width: '100%',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  statsLabel: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  statsValue: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium as any,
    color: theme.colors.text.primary,
  },
  chart: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingTop: theme.spacing.md,
  },
  chartBarContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 130,
  },
  chartBar: {
    width: 30,
    minHeight: 10,
    borderRadius: 4,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: theme.spacing.md,
  },
  chartLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    width: 20,
    textAlign: 'center',
  },
  scheduleCount: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.lg,
  },
  scheduleItem: {
    flexDirection: 'row',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  scheduleTime: {
    width: 80,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium as any,
    color: theme.colors.text.primary,
  },
  scheduleDetails: {
    flex: 1,
  },
  scheduleName: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  scheduleLocation: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
});

export default DashboardScreen;
