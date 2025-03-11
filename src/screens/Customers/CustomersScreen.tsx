import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Header, SearchBar, ListItem } from '../../components/ui';
import theme from '../../theme';
import { CustomersScreenNavigationProp } from '../../navigation/types';
import { customerService } from '../../api/databaseService';
import { Customer } from '../../models/types';

// Fallback mock data in case database connection fails
const mockCustomers = [
  {
    customer_id: '1',
    first_name: 'Otmar',
    last_name: 'Taubner',
    company_name: 'T. Musselman Excavating',
    email: 'otmar@musselman.ca',
    phone: '(416) 555-1234',
    address: '685 Lake Rd',
    city: 'Toronto',
    state: 'ON',
    postal_code: 'M4B 1B3',
  },
  {
    customer_id: '2',
    first_name: 'Sagarkumar',
    last_name: 'Radadiya',
    company_name: null,
    email: 'sagarkumar@gmail.com',
    phone: '(416) 555-5678',
    address: null,
    city: null,
    state: null,
    postal_code: null,
  },
  {
    customer_id: '3',
    first_name: 'Kyle',
    last_name: 'Birnie',
    company_name: 'Bronte Construction',
    email: 'kyle@bronteconstruction.com',
    phone: '(416) 555-9012',
    address: '1041 Birchmount Rd',
    city: 'Toronto',
    state: 'ON',
    postal_code: 'M1B 3H2',
  }
];

const CustomersScreen = () => {
  const navigation = useNavigation<CustomersScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch function for getting customers
  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const data = await customerService.getAll();
      console.log('Fetched customers:', data.length);
      setCustomers(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError('Failed to load customers');
      // Fall back to mock data
      setCustomers(mockCustomers as unknown as Customer[]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch customers when component mounts
  useEffect(() => {
    fetchCustomers();
  }, []);
  
  // Refresh customers whenever the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log('CustomersScreen focused, refreshing data');
      fetchCustomers();
      return () => {}; // cleanup function
    }, [])
  );
  
  /* Previous implementation - replaced with useFocusEffect for refresh on navigation
  useEffect(() => {
  }, []);
  */

  // Filter customers based on search query
  const filteredCustomers = customers.filter(customer => {
    const query = searchQuery.toLowerCase();
    return (
      customer.first_name.toLowerCase().includes(query) ||
      customer.last_name.toLowerCase().includes(query) ||
      (customer.company_name && customer.company_name.toLowerCase().includes(query)) ||
      (customer.email && customer.email.toLowerCase().includes(query)) ||
      (customer.phone && customer.phone.toLowerCase().includes(query)) ||
      (customer.address && customer.address.toLowerCase().includes(query)) ||
      (customer.state && customer.state.toLowerCase().includes(query))
    );
  });

  const renderCustomerItem = ({ item }: { item: Customer }) => {
    const fullName = `${item.first_name} ${item.last_name}`;
    const subtitle = item.company_name || (item.address ? item.address : item.email);
    
    return (
      <ListItem
        title={fullName}
        subtitle={subtitle}
        leftIcon={
          <View style={styles.customerIcon}>
            <Text style={styles.customerInitials}>
              {item.first_name.charAt(0) + item.last_name.charAt(0)}
            </Text>
          </View>
        }
        containerStyle={styles.customerItem}
        onPress={() => navigation.navigate('CustomerDetail', { customerId: item.customer_id })}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Customers"
        leftComponent={
          <TouchableOpacity
            onPress={() => navigation.navigate('Dashboard')}
          >
            <Text style={styles.backButtonText}>Home</Text>
          </TouchableOpacity>
        }
      />
      <SearchBar
        placeholder="Search by name, company, or contact info"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredCustomers}
        renderItem={renderCustomerItem}
        keyExtractor={item => item.customer_id}
        contentContainerStyle={styles.listContent}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('CustomerForm', {})}
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
  customerItem: {
    paddingVertical: theme.spacing.md,
  },
  customerIcon: {
    width: 50,
    height: 50,
    backgroundColor: theme.colors.primary,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customerInitials: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text.inverse,
  },
  backButtonText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.action.primary,
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

export default CustomersScreen;
