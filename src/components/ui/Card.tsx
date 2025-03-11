import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import theme from '../../theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevation?: 'none' | 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({ 
  children, 
  style,
  elevation = 'sm'
}) => {
  return (
    <View style={[
      styles.card,
      theme.layout.shadow[elevation],
      style
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.layout.borderRadius.sm,
    padding: theme.spacing.lg,
    marginVertical: theme.spacing.sm,
    overflow: 'hidden',
  },
});

export default Card;
