// src/theme/index.ts
export const colors = {
  // Primary colors
  primary: '#ffcc33', // Northland Paving gold
  secondary: '#333333', // Dark gray
  
  // Status colors
  leadColor: '#ff6b6b', // Red
  contractColor: '#339af0', // Blue
  workStartedColor: '#51cf66', // Green
  completedColor: '#fcc419', // Yellow
  
  // UI colors
  background: '#f8f9fa',
  surface: '#ffffff',
  divider: '#e9ecef',
  border: '#ced4da',
  inputBackground: '#f0f0f0',
  tabBackground: '#f0f0f0',
  activeTab: '#ffffff',
  text: {
    primary: '#333333',
    secondary: '#666666',
    placeholder: '#adb5bd',
    disabled: '#ced4da',
    inverse: '#ffffff',
  },
  
  // Action colors
  action: {
    primary: '#0066cc', // iOS blue
    success: '#4cd964', // iOS green
    danger: '#ff3b30', // iOS red
    warning: '#ff9500', // iOS orange
    info: '#5ac8fa', // iOS light blue
  },
};

export const typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  lineHeight: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 36,
    xxxl: 42,
  },
  fontWeight: {
    regular: '400',
    medium: '500',
    bold: '700',
  }
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const layout = {
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    pill: 9999,
  },
  shadow: {
    none: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.15,
      shadowRadius: 5,
      elevation: 3,
    },
  },
};

// UI constants based on screenshots
export const ui = {
  statusBadgeHeight: 25,
  headerHeight: 60,
  tabBarHeight: 50,
  listItemHeight: 80,
  iconSize: {
    sm: 16,
    md: 24,
    lg: 32,
  },
  splitView: {
    leftPanelWidth: '40%' as const,
    rightPanelWidth: '60%' as const,
  }
};

export default {
  colors,
  typography,
  spacing,
  layout,
  ui,
};
