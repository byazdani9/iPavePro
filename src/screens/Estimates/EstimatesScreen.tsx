import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Header, TabBar, SplitPanel, Card, Button } from '../../components/ui';
import { TabItem } from '../../components/ui/TabBar';
import theme from '../../theme';
import { EstimatesScreenNavigationProp } from '../../navigation/types';

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
  
  const handleTabPress = (tabKey: string) => {
    setActiveTab(tabKey);
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
          <View style={styles.tabContent}>
            <Card style={styles.noticeCard}>
              <Text style={styles.noticeTitle}>Estimate Creation</Text>
              <Text style={styles.noticeText}>
                Estimate creation is not fully implemented yet. This would normally add a new estimate to this job.
              </Text>
              <Button
                title="OK"
                onPress={() => {}}
                style={styles.noticeButton}
              />
            </Card>
          </View>
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
          onPress={() => Alert.alert('Not Implemented', 'Adding new estimates is not implemented yet.')}
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
    padding: theme.spacing.lg,
  },
  noticeCard: {
    width: '100%',
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  noticeTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold as any,
    marginBottom: theme.spacing.md,
  },
  noticeText: {
    fontSize: theme.typography.fontSize.md,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  noticeButton: {
    width: 120,
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.action.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  addButtonText: {
    fontSize: 24,
    color: theme.colors.text.inverse,
  },
});

export default EstimatesScreen;
