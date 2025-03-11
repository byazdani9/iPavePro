import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNetwork } from '../context/NetworkContext';
import theme from '../theme';

type Props = {
  compact?: boolean;
};

const NetworkStatusIndicator: React.FC<Props> = ({ compact = false }) => {
  const { isConnected, pendingOperations, trySync, lastConnected } = useNetwork();

  // If we're online and nothing pending, don't show anything
  if (isConnected && pendingOperations === 0 && compact) {
    return null;
  }

  // Format last connected time
  const formatLastConnected = () => {
    if (!lastConnected) return 'Never';
    
    // If within last hour, show minutes
    const minutesAgo = Math.floor((Date.now() - lastConnected.getTime()) / 60000);
    if (minutesAgo < 60) {
      return `${minutesAgo} minute${minutesAgo === 1 ? '' : 's'} ago`;
    }
    
    // If within last day, show hours
    const hoursAgo = Math.floor(minutesAgo / 60);
    if (hoursAgo < 24) {
      return `${hoursAgo} hour${hoursAgo === 1 ? '' : 's'} ago`;
    }
    
    // Otherwise show days
    const daysAgo = Math.floor(hoursAgo / 24);
    return `${daysAgo} day${daysAgo === 1 ? '' : 's'} ago`;
  };

  return (
    <View style={[
      styles.container,
      !isConnected ? styles.offlineContainer : pendingOperations > 0 ? styles.pendingContainer : styles.onlineContainer,
      compact && styles.compactContainer
    ]}>
      {compact ? (
        <View style={styles.statusIndicatorCompact}>
          <View style={[
            styles.statusDot,
            !isConnected ? styles.offlineDot : pendingOperations > 0 ? styles.pendingDot : styles.onlineDot
          ]} />
          <Text style={[
            styles.statusTextCompact,
            !isConnected ? styles.offlineText : pendingOperations > 0 ? styles.pendingText : styles.onlineText
          ]}>
            {!isConnected ? 'Offline' : pendingOperations > 0 ? `${pendingOperations} Pending` : 'Online'}
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.statusContent}>
            <View style={styles.statusRow}>
              <View style={[
                styles.statusDot,
                !isConnected ? styles.offlineDot : pendingOperations > 0 ? styles.pendingDot : styles.onlineDot
              ]} />
              <Text style={[
                styles.statusText,
                !isConnected ? styles.offlineText : pendingOperations > 0 ? styles.pendingText : styles.onlineText
              ]}>
                {!isConnected ? 'Working Offline' : pendingOperations > 0 ? 'Changes Pending' : 'Online'}
              </Text>
            </View>
            
            <Text style={styles.statusDetails}>
              {!isConnected 
                ? `Last connected: ${formatLastConnected()}`
                : pendingOperations > 0 
                  ? `${pendingOperations} change${pendingOperations === 1 ? '' : 's'} waiting to sync`
                  : 'Fully synced'
              }
            </Text>
          </View>
          
          {pendingOperations > 0 && isConnected && (
            <TouchableOpacity 
              style={styles.syncButton}
              onPress={trySync}
            >
              <Text style={styles.syncButtonText}>Sync Now</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  compactContainer: {
    padding: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    borderBottomWidth: 0,
    justifyContent: 'flex-end',
  },
  offlineContainer: {
    // Styling specific to offline state
  },
  onlineContainer: {
    // Styling specific to online state
  },
  pendingContainer: {
    // Styling specific to pending state
  },
  statusContent: {
    flex: 1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: theme.spacing.sm,
  },
  statusIndicatorCompact: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  offlineDot: {
    backgroundColor: theme.colors.action.danger,
  },
  onlineDot: {
    backgroundColor: theme.colors.action.success,
  },
  pendingDot: {
    backgroundColor: theme.colors.action.warning,
  },
  statusText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium as any,
  },
  statusTextCompact: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium as any,
  },
  offlineText: {
    color: theme.colors.action.danger,
  },
  onlineText: {
    color: theme.colors.action.success,
  },
  pendingText: {
    color: theme.colors.action.warning,
  },
  statusDetails: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: 2,
    marginLeft: 20,
  },
  syncButton: {
    backgroundColor: theme.colors.action.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.layout.borderRadius.sm,
  },
  syncButtonText: {
    color: 'white',
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium as any,
  },
});

export default NetworkStatusIndicator;
