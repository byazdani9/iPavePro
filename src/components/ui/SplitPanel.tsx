import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import theme from '../../theme';

interface SplitPanelProps {
  left: React.ReactNode;
  right: React.ReactNode;
  leftStyle?: ViewStyle;
  rightStyle?: ViewStyle;
  containerStyle?: ViewStyle;
  showDivider?: boolean;
}

const SplitPanel: React.FC<SplitPanelProps> = ({
  left,
  right,
  leftStyle,
  rightStyle,
  containerStyle,
  showDivider = true,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.leftPanel, leftStyle]}>
        {left}
      </View>
      
      {showDivider && <View style={styles.divider} />}
      
      <View style={[styles.rightPanel, rightStyle]}>
        {right}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  leftPanel: {
    width: theme.ui.splitView.leftPanelWidth,
    backgroundColor: theme.colors.surface,
  },
  rightPanel: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  divider: {
    width: 1,
    backgroundColor: theme.colors.divider,
  }
});

export default SplitPanel;
