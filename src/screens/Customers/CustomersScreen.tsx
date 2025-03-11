import React, { useState } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Header, SearchBar, ListItem } from '../../components/ui';
import theme from '../../theme';
import { CustomersScreenNavigationProp } from '../../navigation/types';

// Temporary mock data for customers
const mockCustomers = [
  {
    id: '1',
    firstName: 'Otmar',
    lastName: 'Taubner',
    company: 'T. Musselman Excavating',
    email: 'otmar@musselman.ca',
    phone: '(416) 555-1234',
    address: '685 Lake Rd, Toronto ON M4B 1B3',
  },
  {
    id: '2',
    firstName: 'Sagarkumar',
    lastName: 'Radadiya',
    company: null,
    email: 'sagarkumar@gmail.com',
    phone: '(416) 555-5678',
    address: null,
  },
  {
    id: '3',
    firstName: 'Kyle',
    lastName: 'Birnie',
    company: 'Bronte Construction',
    email: 'kyle@bronteconstruction.com',
    phone: '(416) 555-9012',
    address: '1041 Birchmount Rd, Toronto ON M1B 3H2',
  },
  {
    id: '4',
    firstName: 'Frank',
    lastName: 'Resch',
    company: null,
    email: 'frank.resch@gmail.com',
    phone: '(905) 555-3456',
    address: '25 Sewells Rd, Toronto ON M1B 3G5',
  },
  {
    id: '5',
    firstName: 'Scott',
    lastName: 'Quinn',
    company: null,
    email: 'scott.quinn@yahoo.com',
    phone: '(416) 555-7890',
    address: '112F Morse St, Toronto ON M4M 2P8',
  },
];

const CustomersScreen = () => {
  const navigation = useNavigation<CustomersScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter customers based on search query
  const filteredCustomers = mockCustomers.filter(customer => {
    const query = searchQuery.toLowerCase();
    return (
      customer.firstName.toLowerCase().includes(query) ||
      customer.lastName.toLowerCase().includes(query) ||
      (customer.company && customer.company.toLowerCase().includes(query)) ||
      (customer.email && customer.email.toLowerCase().includes(query)) ||
      (customer.phone && customer.phone.toLowerCase().includes(query)) ||
      (customer.address && customer.address.toLowerCase().includes(query))
    );
  });

  const renderCustomerItem = ({ item }: { item: typeof mockCustomers[0] }) => {
    const fullName = `${item.firstName} ${item.lastName}`;
    const subtitle = item.company || (item.address ? item.address.split(',')[0] : item.email);
    
    return (
      <ListItem
        title={fullName}
        subtitle={subtitle}
        leftIcon={
          <View style={styles.customerIcon}>
            <Text style={styles.customerInitials}>
              {item.firstName.charAt(0) + item.lastName.charAt(0)}
            </Text>
          </View>
        }
        containerStyle={styles.customerItem}
        onPress={() => navigation.navigate('CustomerDetail', { customerId: item.id })}
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
        keyExtractor={item => item.id}
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
