import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  TextInput,
  Modal
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Header, TabBar, SplitPanel, ListItem, Card, Button } from '../../components/ui';
import { TabItem } from '../../components/ui/TabBar';
import theme from '../../theme';
import { EstimatesScreenNavigationProp } from '../../navigation/types';

// Mock data for estimates and items
const mockEstimate = {
  id: '1',
  name: 'Commercial Paving',
  number: '2025-1810',
  subtotal: 21900.00,
  overhead: 0,
  profit: 0,
  contingency: 0,
  tax: 2847.00,
  total: 24747.00,
  customer: 'Sagarkumar Radadiya',
  jobSite: '123 Main Street, Toronto ON M4B 1B3',
  issueDate: 'March 11, 2025',
  validUntil: 'April 11, 2025',
};

const mockItemGroups = [
  {
    id: '1',
    name: 'Site work',
    items: [
      {
        id: '1',
        name: 'Asphalt Paving - Heavy Duty',
        description: 'Remove and dispose existing asphalt\nProof roll and inspect existing sub-grade, report\nFine grade existing granular and compact\nAdd up to 150mm granular A (6") for levelling purposes\nSupply and install 50mm HL8 asphalt and 50mm HL3 asphalt (4" total)',
        quantity: 1000,
        unit: 'm2',
        unitPrice: 21.90,
        totalPrice: 21900.00,
        costs: {
          material: 11.90,
          labor: 10.00,
          equipment: 0,
          other: 0,
          subcontract: 0,
        }
      },
      {
        id: '2',
        name: 'Asphalt Paving - Medium Duty',
        description: 'Remove and dispose existing asphalt\nProof roll and inspect existing sub-grade, report',
        quantity: 0,
        unit: 'm2',
        unitPrice: 20.55,
        totalPrice: 0,
        costs: {
          material: 10.55,
          labor: 10.00,
          equipment: 0,
          other: 0,
          subcontract: 0,
        }
      },
    ],
    totalPrice: 21900.00,
  },
  {
    id: '2',
    name: 'Concrete',
    items: [],
    totalPrice: 0,
  },
  {
    id: '3',
    name: 'Removals',
    items: [],
    totalPrice: 0,
  },
  {
    id: '4',
    name: 'Site Services',
    items: [],
    totalPrice: 0,
  },
  {
    id: '5',
    name: 'Miscellaneous',
    items: [],
    totalPrice: 0,
  },
];

// Tab definitions
const tabs: TabItem[] = [
  { key: 'info', label: 'Info' },
  { key: 'items', label: 'Items' },
  { key: 'photos', label: 'Photos' },
  { key: 'document', label: 'Document' },
];

const EstimatesScreen = () => {
  const navigation = useNavigation<EstimatesScreenNavigationProp>();
  const [activeTab, setActiveTab] = useState('items');
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(mockItemGroups[0].id);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  
  // Find selected group and item
  const selectedGroup = mockItemGroups.find(group => group.id === selectedGroupId) || null;
  const selectedItem = selectedGroup?.items.find(item => item.id === selectedItemId) || null;
  
  const handleTabPress = (tabKey: string) => {
    setActiveTab(tabKey);
  };

  // Show estimate creation message
  const showEstimateCreationMsg = () => {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.title}>Estimate Creation</Text>
        <Text style={styles.message}>Estimate creation is not fully implemented yet. This would normally add a new estimate to this job.</Text>
        <Button
          title="OK"
          onPress={() => {}}
          style={styles.button}
        />
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <Header
        title="Estimate"
        leftComponent={
          <TouchableOpacity
            onPress={() => navigation.navigate('Jobs')}
          >
            <Text style={styles.backButtonText}>Job</Text>
          </TouchableOpacity>
        }
        rightComponent={
          <TouchableOpacity>
            <Text style={styles.duplicateText}>Duplicate</Text>
          </TouchableOpacity>
        }
      />
      
      <TabBar
        tabs={tabs}
        activeTab={activeTab}
        onTabPress={handleTabPress}
      />
      
      {showEstimateCreationMsg()}
    </View>
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
  duplicateText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.action.primary,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    minWidth: 100,
  }
});

export default EstimatesScreen;
