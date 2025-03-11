import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import theme from '../../theme';

interface ListItemProps {
  title: string;
  subtitle?: string;
  leftIcon?: React.ReactNode;
  rightContent?: React.ReactNode;
  rightText?: string;
  onPress?: () => void;
  showDisclosure?: boolean;
  containerStyle?: ViewStyle;
}

const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  leftIcon,
  rightContent,
  rightText,
  onPress,
  showDisclosure = true,
  containerStyle,
}) => {
  const content = (
    <View style={[styles.container, containerStyle]}>
      {leftIcon && (
        <View style={styles.leftIconContainer}>
          {leftIcon}
        </View>
      )}
      
      <View style={styles.contentContainer}>
        <Text 
          numberOfLines={1} 
          style={styles.title}
        >
          {title}
        </Text>
        
        {subtitle && (
          <Text 
            numberOfLines={1} 
            style={styles.subtitle}
          >
            {subtitle}
          </Text>
        )}
      </View>
      
      <View style={styles.rightContainer}>
        {rightContent ? (
          rightContent
        ) : rightText ? (
          <Text style={styles.rightText}>{rightText}</Text>
        ) : null}
        
        {showDisclosure && (
          <Text style={styles.disclosureIcon}>›</Text>
        )}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
    minHeight: theme.ui.listItemHeight,
  },
  leftIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium as any,
    color: theme.colors.text.primary,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: theme.spacing.md,
  },
  rightText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium as any,
    color: theme.colors.text.primary,
    marginRight: theme.spacing.sm,
  },
  disclosureIcon: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.xs,
  },
});

export default ListItem;
