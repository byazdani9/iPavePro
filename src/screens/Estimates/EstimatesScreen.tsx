import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView } from 'react-native';
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
  
  // Find selected group and item
  const selectedGroup = mockItemGroups.find(group => group.id === selectedGroupId) || null;
  const selectedItem = selectedGroup?.items.find(item => item.id === selectedItemId) || null;
  
  const handleTabPress = (tabKey: string) => {
    setActiveTab(tabKey);
  };
  
  const renderItemGroup = ({ item }: { item: typeof mockItemGroups[0] }) => {
    const isSelected = item.id === selectedGroupId;
    
    return (
      <ListItem
        title={item.name}
        rightText={`$${item.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        containerStyle={{
          ...styles.itemGroup,
          ...(isSelected ? styles.selectedItem : {})
        }}
        onPress={() => {
          setSelectedGroupId(item.id);
          setSelectedItemId(null);
        }}
      />
    );
  };
  
  const renderGroupItem = ({ item }: { item: typeof mockItemGroups[0]['items'][0] }) => {
    const isSelected = item.id === selectedItemId;
    
    return (
      <ListItem
        title={item.name}
        subtitle={item.quantity > 0 ? `${item.quantity} ${item.unit}` : ''}
        leftIcon={
          <View style={styles.itemIcon} />
        }
        rightText={`$${item.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        containerStyle={{
          ...styles.groupItem,
          ...(isSelected ? styles.selectedItem : {})
        }}
        onPress={() => setSelectedItemId(item.id)}
      />
    );
  };
  
  const renderItemsList = () => {
    return (
      <View style={styles.itemsListContainer}>
        <FlatList
          data={mockItemGroups}
          renderItem={renderItemGroup}
          keyExtractor={item => item.id}
          style={styles.groupsList}
        />
        
        {selectedGroup && selectedGroup.items.length > 0 && (
          <FlatList
            data={selectedGroup.items}
            renderItem={renderGroupItem}
            keyExtractor={item => item.id}
            style={styles.itemsList}
          />
        )}
        
        <View style={styles.totalsContainer}>
          <Text style={styles.totalsTitle}>Totals</Text>
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal of Costs</Text>
            <Text style={styles.totalValue}>${mockEstimate.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
          </View>
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Overhead</Text>
            <Text style={styles.totalValue}>${mockEstimate.overhead.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
          </View>
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Profit</Text>
            <Text style={styles.totalValue}>${mockEstimate.profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
          </View>
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Contingency</Text>
            <Text style={styles.totalValue}>${mockEstimate.contingency.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabelBold}>Total with Markup</Text>
            <Text style={styles.totalValueBold}>${mockEstimate.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
          </View>
        </View>
      </View>
    );
  };
  
  const renderItemDetail = () => {
    // Show "No Item Selected" view when no item is selected
    if (!selectedItem) {
      return (
        <View style={styles.noItemContainer}>
          <View style={styles.noItemIconContainer}>
            <View style={styles.noItemIcon} />
          </View>
          <Text style={styles.noItemTitle}>No Item Selected</Text>
          <Text style={styles.noItemText}>Tap + to add a new item</Text>
          <Text style={styles.noItemText}>Or select an existing item</Text>
        </View>
      );
    }
    
    // Show selected item details
    return (
      <ScrollView style={styles.itemDetailContainer}>
        <Text style={styles.itemDetailTitle}>{selectedItem.name}</Text>
        
        <Card style={styles.descriptionCard}>
          <Text style={styles.descriptionTitle}>Description</Text>
          <Text style={styles.descriptionText}>{selectedItem.description}</Text>
        </Card>
        
        <Card style={styles.costCard}>
          <Text style={styles.costTitle}>Cost Per Unit</Text>
          
          <View style={styles.costRow}>
            <Text style={styles.costLabel}>Material</Text>
            <Text style={styles.costValue}>${selectedItem.costs.material} / {selectedItem.unit}</Text>
          </View>
          
          <View style={styles.costRow}>
            <Text style={styles.costLabel}>Labor</Text>
            <Text style={styles.costValue}>${selectedItem.costs.labor} / {selectedItem.unit}</Text>
          </View>
          
          <View style={styles.costRow}>
            <Text style={styles.costLabel}>Equipment</Text>
            <Text style={styles.costValue}>${selectedItem.costs.equipment} / {selectedItem.unit}</Text>
          </View>
          
          <View style={styles.costRow}>
            <Text style={styles.costLabel}>Other</Text>
            <Text style={styles.costValue}>${selectedItem.costs.other} / {selectedItem.unit}</Text>
          </View>
          
          <View style={styles.costRow}>
            <Text style={styles.costLabel}>Subcontract</Text>
            <Text style={styles.costValue}>${selectedItem.costs.subcontract} / {selectedItem.unit}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.costRow}>
            <Text style={styles.costLabelBold}>Total Cost Per Unit</Text>
            <Text style={styles.costValueBold}>${selectedItem.unitPrice} / {selectedItem.unit}</Text>
          </View>
        </Card>
        
        <View style={styles.actionsContainer}>
          <Button
            title="Delete Item"
            variant="danger"
            onPress={() => {}}
            style={styles.actionButton}
          />
          
          <Button
            title="Copy Item To..."
            variant="outline"
            onPress={() => {}}
            style={styles.actionButton}
          />
        </View>
      </ScrollView>
    );
  };
  
  // Render different content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'info':
        return (
          <View style={styles.tabContent}>
            <Text>Info tab content</Text>
          </View>
        );
      case 'items':
        return (
          <SplitPanel
            left={renderItemsList()}
            right={renderItemDetail()}
            containerStyle={styles.splitPanel}
          />
        );
      case 'photos':
        return (
          <View style={styles.tabContent}>
            <Text>Photos tab content</Text>
          </View>
        );
      case 'document':
        return (
          <View style={styles.tabContent}>
            <Text>Document tab content</Text>
          </View>
        );
      default:
        return null;
    }
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
      
      {renderTabContent()}
      
      {activeTab === 'items' && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            // Handle add new item
          }}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      )}
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
  tabContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splitPanel: {
    flex: 1,
  },
  itemsListContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  groupsList: {
    flex: 1,
  },
  itemsList: {
    flex: 2,
  },
  itemGroup: {
    backgroundColor: theme.colors.background,
  },
  groupItem: {
    paddingLeft: theme.spacing.xl,
  },
  selectedItem: {
    backgroundColor: '#f0f7ff',
  },
  itemIcon: {
    width: 30,
    height: 30,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  totalsContainer: {
    padding: theme.spacing.lg,
    backgroundColor: '#f7f7f9',
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider,
  },
  totalsTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold as any,
    marginBottom: theme.spacing.md,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.xs,
  },
  totalLabel: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  totalLabelBold: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text.primary,
  },
  totalValue: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  totalValueBold: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text.primary,
  },
  noItemContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  noItemIconContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  noItemIcon: {
    width: 70,
    height: 70,
    borderWidth: 2,
    borderColor: '#cedfef',
    borderRadius: 8,
  },
  noItemTitle: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  noItemText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  itemDetailContainer: {
    flex: 1,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  itemDetailTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  descriptionCard: {
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.lg,
  },
  descriptionTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium as any,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  descriptionText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    lineHeight: 22,
  },
  costCard: {
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.lg,
  },
  costTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium as any,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
    textTransform: 'uppercase',
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
  },
  costLabel: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  costLabelBold: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text.primary,
  },
  costValue: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  costValueBold: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.divider,
    marginVertical: theme.spacing.sm,
  },
  actionsContainer: {
    marginBottom: 50,
  },
  actionButton: {
    marginBottom: theme.spacing.lg,
  },
  addButton: {
    position: 'absolute',
    top: theme.ui.headerHeight + theme.ui.tabBarHeight + 10,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.action.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.layout.shadow.md,
  },
  addButtonText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    lineHeight: 40,
    textAlign: 'center',
  },
});

export default EstimatesScreen;
