import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Header, Button, Card } from '../../components/ui';
import theme from '../../theme';
import { supabase } from '../../api/supabase';
import { syncService } from '../../api/syncService';

type CustomerFormRouteParams = {
  customerId?: string;
};

const CustomerForm = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { customerId } = (route.params as CustomerFormRouteParams) || {};
  const isEditing = !!customerId;

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: 'ON',
    postalCode: '',
    notes: '',
  });

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Mock data for development until backend is fully set up
  const mockCustomers: Record<string, {
    first_name: string;
    last_name: string;
    company: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    province: string;
    postal_code: string;
    notes: string;
  }> = {
    '1': {
      first_name: 'Otmar',
      last_name: 'Taubner',
      company: 'T. Musselman Excavating',
      email: 'otmar@musselman.ca',
      phone: '(416) 555-1234',
      address: '685 Lake Rd',
      city: 'Toronto',
      province: 'ON',
      postal_code: 'M4B 1B3',
      notes: 'Prefers communication via email. Has multiple job sites.'
    }
  };

  // Load customer data if editing existing customer
  useEffect(() => {
    if (customerId) {
      fetchCustomerData();
    }
  }, [customerId]);

  const fetchCustomerData = async () => {
    try {
      // Try to get data from Supabase
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('customer_id', customerId) // Using customer_id instead of id based on error
        .single();

      if (error) {
        console.error('Error fetching customer from Supabase:', error);
        // Fall back to mock data if Supabase fails
        if (customerId && customerId in mockCustomers) {
          const mockData = mockCustomers[customerId];
          setFormData({
            firstName: mockData.first_name || '',
            lastName: mockData.last_name || '',
            company: mockData.company || '',
            email: mockData.email || '',
            phone: mockData.phone || '',
            address: mockData.address || '',
            city: mockData.city || '',
            province: mockData.province || 'ON',
            postalCode: mockData.postal_code || '',
            notes: mockData.notes || '',
          });
          console.log('Using mock data instead');
          return;
        }
        Alert.alert('Error', 'Failed to load customer details');
        return;
      }

      if (data) {
        setFormData({
          firstName: data.first_name || '',
          lastName: data.last_name || '',
          company: data.company_name || '', // Use company_name instead of company to match schema
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          city: data.city || '',
          province: data.state || 'ON', // Note: database field is 'state'
          postalCode: data.postal_code || '',
          notes: data.notes || '',
        });
      }
    } catch (error) {
      console.error('Error in fetchCustomerData:', error);
      Alert.alert('Error', 'Failed to load customer details');
    }
  };

  const handleChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    
    // Clear error for this field when user makes a change
    if (errors[key]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (formData.email && !formData.email.includes('@')) {
      newErrors.email = 'Email must be valid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    // Create processed data with the correct field names to match database schema
    const processedData = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      company_name: formData.company, // Use company_name instead of company to match schema
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      state: formData.province, // Using state as the field name in the database
      postal_code: formData.postalCode,
      notes: formData.notes
      // Let Supabase handle updated_at automatically
    };

    try {
      if (syncService.isOnline()) {
        // Online - direct save
        if (isEditing) {
          // Update existing customer
          const { error } = await supabase
            .from('customers')
            .update(processedData)
            .eq('customer_id', customerId); // Using customer_id based on error

          if (error) throw error;
        } else {
          // Create new customer
          console.log('Inserting customer with data:', processedData);
          // Don't manually set created_at, let Supabase handle that automatically
          const { data, error } = await supabase
            .from('customers')
            .insert(processedData)
            .select();

          if (error) {
            console.error('Supabase error details:', error);
            throw error;
          }
          console.log('Customer created successfully:', data);
        }
      } else {
        // Offline - queue for sync
        // For offline sync, use the processed data without adding timestamp fields
        const syncData = isEditing 
          ? { ...processedData, customer_id: customerId }
          : processedData;
        
        // Let the database handle timestamps automatically
        await syncService.addToSyncQueue({
          table: 'customers',
          operation: isEditing ? 'update' : 'insert',
          data: syncData
        });
      }

      // Navigate back after save
      Alert.alert('Success', `Customer successfully ${isEditing ? 'updated' : 'created'}!`);
      navigation.goBack();
    } catch (error) {
      console.error('Error saving customer:', error);
      Alert.alert('Error', `Failed to ${isEditing ? 'update' : 'create'} customer`);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Header
        title={isEditing ? 'Edit Customer' : 'New Customer'}
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Cancel</Text>
          </TouchableOpacity>
        }
      />
      
      <ScrollView style={styles.formContainer}>
        <Card style={styles.formCard}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>First Name *</Text>
            <TextInput
              style={[styles.input, errors.firstName ? styles.inputError : null]}
              value={formData.firstName}
              onChangeText={(value) => handleChange('firstName', value)}
              placeholder="Enter first name"
            />
            {errors.firstName ? (
              <Text style={styles.errorText}>{errors.firstName}</Text>
            ) : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Last Name *</Text>
            <TextInput
              style={[styles.input, errors.lastName ? styles.inputError : null]}
              value={formData.lastName}
              onChangeText={(value) => handleChange('lastName', value)}
              placeholder="Enter last name"
            />
            {errors.lastName ? (
              <Text style={styles.errorText}>{errors.lastName}</Text>
            ) : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Company</Text>
            <TextInput
              style={styles.input}
              value={formData.company}
              onChangeText={(value) => handleChange('company', value)}
              placeholder="Enter company name (optional)"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, errors.email ? styles.inputError : null]}
              value={formData.email}
              onChangeText={(value) => handleChange('email', value)}
              placeholder="Enter email address"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email ? (
              <Text style={styles.errorText}>{errors.email}</Text>
            ) : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={(value) => handleChange('phone', value)}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
            />
          </View>
        </Card>

        <Card style={styles.formCard}>
          <Text style={styles.sectionTitle}>Address</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Street Address</Text>
            <TextInput
              style={styles.input}
              value={formData.address}
              onChangeText={(value) => handleChange('address', value)}
              placeholder="Enter street address"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>City</Text>
            <TextInput
              style={styles.input}
              value={formData.city}
              onChangeText={(value) => handleChange('city', value)}
              placeholder="Enter city"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Province</Text>
              <TextInput
                style={styles.input}
                value={formData.province}
                onChangeText={(value) => handleChange('province', value)}
                placeholder="ON"
              />
            </View>

            <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Postal Code</Text>
              <TextInput
                style={styles.input}
                value={formData.postalCode}
                onChangeText={(value) => handleChange('postalCode', value)}
                placeholder="Enter postal code"
              />
            </View>
          </View>
        </Card>

        <Card style={styles.formCard}>
          <Text style={styles.sectionTitle}>Additional Information</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.notes}
              onChangeText={(value) => handleChange('notes', value)}
              placeholder="Enter notes about this customer"
              multiline
              numberOfLines={4}
            />
          </View>
        </Card>

        <View style={styles.buttonsContainer}>
          <Button 
            title="Save Customer"
            variant="primary"
            onPress={handleSave}
            fullWidth
          />
          
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  backButtonText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.action.primary,
  },
  formContainer: {
    flex: 1,
    padding: theme.spacing.md,
  },
  formCard: {
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold as any,
    marginBottom: theme.spacing.md,
    color: theme.colors.text.primary,
  },
  inputContainer: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.typography.fontSize.sm,
    marginBottom: theme.spacing.xs,
    color: theme.colors.text.secondary,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.divider,
    borderRadius: theme.layout.borderRadius.sm,
    padding: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
    backgroundColor: theme.colors.inputBackground,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: theme.colors.action.danger,
  },
  errorText: {
    color: theme.colors.action.danger,
    fontSize: theme.typography.fontSize.sm,
    marginTop: theme.spacing.xs,
  },
  row: {
    flexDirection: 'row',
  },
  buttonsContainer: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xxxl,
  },
  cancelButton: {
    marginTop: theme.spacing.lg,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: theme.colors.action.primary,
    fontSize: theme.typography.fontSize.md,
  },
});

export default CustomerForm;
