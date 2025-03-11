import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import theme from '../../theme';

export type StatusType = 'lead' | 'contract' | 'started' | 'completed' | 'closed';

interface StatusBadgeProps {
  status: StatusType;
  text?: string;
  small?: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  text, 
  small = false 
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'lead':
        return theme.colors.leadColor;
      case 'contract':
        return theme.colors.contractColor;
      case 'started':
        return theme.colors.workStartedColor;
      case 'completed':
        return theme.colors.completedColor;
      case 'closed':
        return theme.colors.text.secondary;
      default:
        return theme.colors.text.secondary;
    }
  };

  const getStatusText = () => {
    if (text) return text;
    
    switch (status) {
      case 'lead':
        return 'Lead';
      case 'contract':
        return 'Contract Signed';
      case 'started':
        return 'Work Started';
      case 'completed':
        return 'Work Completed';
      case 'closed':
        return 'Closed';
      default:
        return '';
    }
  };

  return (
    <View style={[
      styles.container,
      { backgroundColor: getStatusColor() },
      small && styles.smallContainer
    ]}>
      <Text style={[
        styles.text,
        small && styles.smallText
      ]}>
        {getStatusText()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: theme.ui.statusBadgeHeight,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.ui.statusBadgeHeight / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallContainer: {
    height: theme.ui.statusBadgeHeight * 0.8,
    paddingHorizontal: theme.spacing.sm,
  },
  text: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.text.inverse,
  },
  smallText: {
    fontSize: theme.typography.fontSize.xs,
  },
});

export default StatusBadge;
