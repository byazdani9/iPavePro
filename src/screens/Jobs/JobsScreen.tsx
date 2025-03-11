import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { JobsScreenNavigationProp } from '../../navigation/types';
import { Header, SearchBar, StatusBadge, ListItem } from '../../components/ui';
import theme from '../../theme';
import { jobService, customerService } from '../../api/databaseService';
import { Job, Customer } from '../../models/types';

// Temporary mock data for jobs in case database connection fails
const mockJobs = [
  {
    job_id: '1',
    name: 'Soil Hauling',
    number: 'M23-030',
    status: 'lead',
    amount: 134944.60,
    customer_id: '1',
    customer: {
      first_name: 'Otmar',
      last_name: 'Taubner',
      company: 'T. Musselman Excavating'
    },
    address: null,
    city: null,
    province: null,
    postal_code: null
  },
  {
    job_id: '2',
    name: 'Material Supply',
    number: '2024-1805',
    status: 'lead',
    amount: 35044.13,
    customer_id: '1',
    customer: {
      first_name: 'Otmar',
      last_name: 'Taubner',
      company: 'T. Musselman Excavating'
    },
    address: null,
    city: null,
    province: null,
    postal_code: null
  },
  {
    job_id: '3',
    name: 'Temporary Asphalt Patching phase 2',
    number: '2024-1804',
    status: 'lead',
    amount: 70550.42,
    customer_id: '3',
    customer: {
      first_name: 'Kyle',
      last_name: 'Birnie',
      company: 'Bronte Construction'
    },
    address: '1041 Birchmount Rd',
    city: 'Toronto',
    province: 'ON',
    postal_code: 'M1B 3H2'
  }
];

const JobsScreen = () => {
  const navigation = useNavigation<JobsScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch jobs from database
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const data = await jobService.getAll();
        setJobs(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load jobs');
        // Fall back to mock data
        setJobs(mockJobs as unknown as Job[]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Filter jobs based on search query
  const filteredJobs = jobs.filter(job => {
    const query = searchQuery.toLowerCase();
    return (
      job.name.toLowerCase().includes(query) ||
      (job.number && job.number.toLowerCase().includes(query)) ||
      (job.customer && 
        ((job.customer.first_name && job.customer.first_name.toLowerCase().includes(query)) ||
         (job.customer.last_name && job.customer.last_name.toLowerCase().includes(query)) ||
         (job.customer.company && job.customer.company.toLowerCase().includes(query))))
    );
  });

  const renderJobItem = ({ item }: { item: Job }) => {
    // Format customer name for display
    const customerDisplay = item.customer
      ? item.customer.company 
        ? `${item.customer.first_name} ${item.customer.last_name}\n${item.customer.company}` 
        : `${item.customer.first_name} ${item.customer.last_name}`
      : 'Unknown Customer';
    
    // Format address for display
    const addressDisplay = item.address 
      ? `${item.address}, ${item.city || ''} ${item.province || ''} ${item.postal_code || ''}`.trim() 
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
            <Text style={styles.amount}>
              {item.amount 
                ? `$${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
                : 'No amount'}
            </Text>
            <StatusBadge status="lead" small />
          </View>
        }
        containerStyle={styles.jobItem}
        onPress={() => navigation.navigate('JobDetail', { jobId: item.job_id })}
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
          keyExtractor={item => item.job_id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.mapContainer}>
          <Text style={styles.mapPlaceholder}>Map View (Coming Soon)</Text>
        </View>
      )}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('JobForm', {})}
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
