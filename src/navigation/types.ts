import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Define the param list for the Stack navigator
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  JobDetail: { jobId: string };
  JobForm: { jobId?: string };
  CustomerDetail: { customerId: string };
  EstimateDetail: { estimateId: string };
  AddJob: undefined;
  AddCustomer: undefined;
  AddEstimate: { jobId?: string };
};

// Define the param list for the Bottom Tab navigator
export type MainTabParamList = {
  Dashboard: undefined;
  Jobs: undefined;
  Customers: undefined;
  Estimates: undefined;
  Settings: undefined;
};

// Combined navigation type for screens within tabs
export type TabScreenNavigationProp<T extends keyof MainTabParamList> = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, T>,
  StackNavigationProp<RootStackParamList>
>;

// For Main tab screens
export type DashboardScreenNavigationProp = TabScreenNavigationProp<'Dashboard'>;
export type JobsScreenNavigationProp = TabScreenNavigationProp<'Jobs'>;
export type CustomersScreenNavigationProp = TabScreenNavigationProp<'Customers'>;
export type EstimatesScreenNavigationProp = TabScreenNavigationProp<'Estimates'>;
export type SettingsScreenNavigationProp = TabScreenNavigationProp<'Settings'>;

// For Stack screens
export type JobDetailNavigationProp = StackNavigationProp<RootStackParamList, 'JobDetail'>;
export type JobDetailRouteProp = RouteProp<RootStackParamList, 'JobDetail'>;

// Types with both navigation prop and route prop
export type JobDetailScreenProps = {
  navigation: JobDetailNavigationProp;
  route: JobDetailRouteProp;
};
