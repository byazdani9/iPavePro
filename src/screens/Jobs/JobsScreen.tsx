import React, { useState } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { JobsScreenNavigationProp } from '../../navigation/types';
import { Header, SearchBar, StatusBadge, ListItem } from '../../components/ui';
import theme from '../../theme';

// Temporary mock data for jobs
const mockJobs = [
  {
    id: '1',
    name: 'Soil Hauling',
    number: 'M23-030',
    status: 'lead',
    amount: 134944.60,
    customer: 'Otmar Taubner',
    company: 'T. Musselman Excavating',
    address: null,
  },
  {
    id: '2',
    name: 'Test',
    number: '2025-1810',
    status: 'lead',
    amount: 24747.00,
    customer: 'Sagarkumar Radadiya',
    company: null,
    address: null,
  },
  {
    id: '3',
    name: 'Material Supply',
    number: '2024-1805',
    status: 'lead',
    amount: 35044.13,
    customer: 'Stoney Creek Paving',
    company: null,
    address: null,
  },
  {
    id: '4',
    name: 'Temporary Asphalt Patching phase 2',
    number: '2024-1804',
    status: 'lead',
    amount: 70550.42,
    customer: 'Kyle Birnie',
    company: 'Bronte Construction',
    address: '1041 Birchmount Rd, Toronto ON',
  },
  {
    id: '5',
    name: 'Storm Line Replacement',
    number: '2024-1803',
    status: 'lead',
    amount: 20599.90,
    customer: 'Halton Standard Cond Corp',
    company: '#732',
    address: '1153 Pioneer Rd, Burlington ON L7M 1K5',
  },
];

const JobsScreen = () => {
  const navigation = useNavigation<JobsScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  // Filter jobs based on search query
  const filteredJobs = mockJobs.filter(job => {
    const query = searchQuery.toLowerCase();
    return (
      job.name.toLowerCase().includes(query) ||
      job.number.toLowerCase().includes(query) ||
      (job.customer && job.customer.toLowerCase().includes(query)) ||
      (job.company && job.company.toLowerCase().includes(query))
    );
  });

  const renderJobItem = ({ item }: { item: typeof mockJobs[0] }) => {
    const customerDisplay = item.company 
      ? `${item.customer}\n${item.company}` 
      : item.customer;
    
    const addressDisplay = item.address 
      ? item.address 
      : 'No Job Site';
    
    return (
      <ListItem
        title={item.name}
        subtitle={item.number}
        leftIcon={
          <View style={styles.jobIcon}>
            <Text style={styles.jobIconText}>🏠</Text>
          </View>
        }
        rightContent={
          <View style={styles.rightContent}>
            <Text style={styles.amount}>${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
            <StatusBadge status="lead" small />
          </View>
        }
        containerStyle={styles.jobItem}
        onPress={() => navigation.navigate('JobDetail', { jobId: item.id })}
      />
    );
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'list' ? 'map' : 'list');
  };

  const rightComponent = (
    <View style={styles.viewToggle}>
      <TouchableOpacity
        style={[
          styles.viewToggleButton,
          styles.viewToggleButtonLeft,
          viewMode === 'list' && styles.viewToggleButtonActive,
        ]}
        onPress={() => setViewMode('list')}
      >
        <Text
          style={[
            styles.viewToggleText,
            viewMode === 'list' && styles.viewToggleTextActive,
          ]}
        >
          List
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.viewToggleButton,
          styles.viewToggleButtonRight,
          viewMode === 'map' && styles.viewToggleButtonActive,
        ]}
        onPress={() => setViewMode('map')}
      >
        <Text
          style={[
            styles.viewToggleText,
            viewMode === 'map' && styles.viewToggleTextActive,
          ]}
        >
          Map
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Jobs"
        leftComponent={
          <TouchableOpacity
            onPress={() => navigation.navigate('Dashboard')}
          >
            <Text style={styles.backButtonText}>Home</Text>
          </TouchableOpacity>
        }
        rightComponent={rightComponent}
      />
      <SearchBar
        placeholder="Search by job or customer info"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {viewMode === 'list' ? (
        <FlatList
          data={filteredJobs}
          renderItem={renderJobItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.mapContainer}>
          <Text style={styles.mapPlaceholder}>Map View (Coming Soon)</Text>
        </View>
      )}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          // Handle add new job
        }}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    paddingBottom: 20,
  },
  jobItem: {
    paddingVertical: theme.spacing.md,
  },
  jobIcon: {
    width: 50,
    height: 50,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  jobIconText: {
    fontSize: 24,
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium as any,
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  backButtonText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.action.primary,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: theme.colors.inputBackground,
    borderRadius: 15,
    overflow: 'hidden',
  },
  viewToggleButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    minWidth: 50,
    alignItems: 'center',
  },
  viewToggleButtonLeft: {
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },
  viewToggleButtonRight: {
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
  },
  viewToggleButtonActive: {
    backgroundColor: 'white',
  },
  viewToggleText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  viewToggleTextActive: {
    color: theme.colors.text.primary,
  },
  mapContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholder: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.secondary,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.action.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.layout.shadow.md,
  },
  addButtonText: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
    lineHeight: 50,
    textAlign: 'center',
  },
});

export default JobsScreen;
