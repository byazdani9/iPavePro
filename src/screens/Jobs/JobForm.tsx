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

type JobFormRouteParams = {
  jobId?: string;
};

const JobForm = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { jobId } = (route.params as JobFormRouteParams) || {};
  const isEditing = !!jobId;

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    status: 'lead',
    customer_id: '',
    description: '',
    address: '',
    city: '',
    province: 'ON',
    postal_code: '',
    amount: '',
    start_date: '',
    end_date: '',
  });

  // Customer selection
  const [customers, setCustomers] = useState<{ id: string; name: string }[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [isCustomerModalVisible, setIsCustomerModalVisible] = useState(false);

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load job data if editing existing job
  useEffect(() => {
    if (jobId) {
      fetchJobData();
    }
    fetchCustomers();
  }, [jobId]);

  const fetchJobData = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('job_id', jobId)
        .single();

      if (error) {
        console.error('Error fetching job from Supabase:', error);
        throw error;
      }
      if (data) {
        setFormData({
          name: data.name || '',
          number: data.number || '',
          status: data.status || 'lead',
          customer_id: data.customer_id || '',
          description: data.description || '',
          address: data.address || '',
          city: data.city || '',
          province: data.province || 'ON',
          postal_code: data.postal_code || '',
          amount: data.amount ? data.amount.toString() : '',
          start_date: data.start_date || '',
          end_date: data.end_date || '',
        });
        setSelectedCustomer(data.customer_id);
      }
    } catch (error) {
      console.error('Error fetching job:', error);
      Alert.alert('Error', 'Failed to load job details');
    }
  };

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('customer_id, first_name, last_name, company_name')
        .order('last_name', { ascending: true });

      if (error) throw error;
      if (data) {
        const formattedCustomers = data.map(customer => ({
          id: customer.customer_id,
          name: customer.company_name 
            ? `${customer.last_name}, ${customer.first_name} (${customer.company_name})`
            : `${customer.last_name}, ${customer.first_name}`
        }));
        setCustomers(formattedCustomers);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
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

    if (!formData.name.trim()) {
      newErrors.name = 'Job name is required';
    }

    if (!formData.customer_id) {
      newErrors.customer_id = 'Customer is required';
    }

    if (formData.amount && isNaN(Number(formData.amount))) {
      newErrors.amount = 'Amount must be a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    const processedData = {
      ...formData,
      amount: formData.amount ? parseFloat(formData.amount) : null,
      // Let Supabase handle updated_at field automatically
    };

    try {
      if (syncService.isOnline()) {
        // Online - direct save
        if (isEditing) {
          // Update existing job
          const { error } = await supabase
            .from('jobs')
            .update(processedData)
            .eq('job_id', jobId);

          if (error) throw error;
        } else {
          // Create new job
          const { error } = await supabase
            .from('jobs')
            .insert(processedData);

          if (error) throw error;
        }
      } else {
        // Offline - queue for sync
        await syncService.addToSyncQueue({
          table: 'jobs',
          operation: isEditing ? 'update' : 'insert',
          data: isEditing 
            ? { ...processedData, job_id: jobId }
            : processedData
        });
      }

      // Navigate back after save
      Alert.alert('Success', `Job successfully ${isEditing ? 'updated' : 'created'}!`);
      navigation.goBack();
    } catch (error) {
      console.error('Error saving job:', error);
      Alert.alert('Error', `Failed to ${isEditing ? 'update' : 'create'} job`);
    }
  };

  const selectCustomer = (customerId: string) => {
    setSelectedCustomer(customerId);
    setFormData(prev => ({ ...prev, customer_id: customerId }));
    setIsCustomerModalVisible(false);
  };

  const renderCustomerSelection = () => {
    const selectedCustomerName = selectedCustomer
      ? customers.find(c => c.id === selectedCustomer)?.name || 'Select Customer'
      : 'Select Customer';

    return (
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Customer *</Text>
        <TouchableOpacity 
          style={[
            styles.customerSelector,
            errors.customer_id ? styles.inputError : null
          ]}
          onPress={() => setIsCustomerModalVisible(true)}
        >
          <Text style={styles.customerSelectorText}>
            {selectedCustomerName}
          </Text>
        </TouchableOpacity>
        {errors.customer_id ? (
          <Text style={styles.errorText}>{errors.customer_id}</Text>
        ) : null}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Header
        title={isEditing ? 'Edit Job' : 'New Job'}
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Cancel</Text>
          </TouchableOpacity>
        }
      />
      
      <ScrollView style={styles.formContainer}>
        <Card style={styles.formCard}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Job Name *</Text>
            <TextInput
              style={[styles.input, errors.name ? styles.inputError : null]}
              value={formData.name}
              onChangeText={(value) => handleChange('name', value)}
              placeholder="Enter job name"
            />
            {errors.name ? (
              <Text style={styles.errorText}>{errors.name}</Text>
            ) : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Job Number</Text>
            <TextInput
              style={styles.input}
              value={formData.number}
              onChangeText={(value) => handleChange('number', value)}
              placeholder="Enter job number"
            />
          </View>

          {renderCustomerSelection()}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(value) => handleChange('description', value)}
              placeholder="Enter job description"
              multiline
              numberOfLines={4}
            />
          </View>
        </Card>

        <Card style={styles.formCard}>
          <Text style={styles.sectionTitle}>Job Site</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Address</Text>
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
                value={formData.postal_code}
                onChangeText={(value) => handleChange('postal_code', value)}
                placeholder="Enter postal code"
              />
            </View>
          </View>
        </Card>

        <Card style={styles.formCard}>
          <Text style={styles.sectionTitle}>Financial Details</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Amount</Text>
            <TextInput
              style={[styles.input, errors.amount ? styles.inputError : null]}
              value={formData.amount}
              onChangeText={(value) => handleChange('amount', value)}
              placeholder="0.00"
              keyboardType="decimal-pad"
            />
            {errors.amount ? (
              <Text style={styles.errorText}>{errors.amount}</Text>
            ) : null}
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Start Date</Text>
              <TextInput
                style={styles.input}
                value={formData.start_date}
                onChangeText={(value) => handleChange('start_date', value)}
                placeholder="YYYY-MM-DD"
              />
            </View>

            <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>End Date</Text>
              <TextInput
                style={styles.input}
                value={formData.end_date}
                onChangeText={(value) => handleChange('end_date', value)}
                placeholder="YYYY-MM-DD"
              />
            </View>
          </View>
        </Card>

        <View style={styles.buttonsContainer}>
          <Button 
            title="Save Job"
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

      {/* Customer Selection Modal would go here */}
      {isCustomerModalVisible && (
        <View style={styles.modalOverlay}>
          <Card style={styles.customerModal}>
            <Text style={styles.modalTitle}>Select Customer</Text>
            
            <ScrollView style={styles.customerList}>
              {customers.map(customer => (
                <TouchableOpacity
                  key={customer.id}
                  style={styles.customerItem}
                  onPress={() => selectCustomer(customer.id)}
                >
                  <Text style={styles.customerItemText}>{customer.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <Button
              title="Cancel"
              variant="outline"
              onPress={() => setIsCustomerModalVisible(false)}
            />
          </Card>
        </View>
      )}
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
  customerSelector: {
    borderWidth: 1,
    borderColor: theme.colors.divider,
    borderRadius: theme.layout.borderRadius.sm,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.inputBackground,
  },
  customerSelectorText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  customerModal: {
    width: '80%',
    maxHeight: '70%',
    padding: theme.spacing.lg,
  },
  modalTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold as any,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  customerList: {
    maxHeight: 300,
    marginBottom: theme.spacing.lg,
  },
  customerItem: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  customerItemText: {
    fontSize: theme.typography.fontSize.md,
  },
});

export default JobForm;
