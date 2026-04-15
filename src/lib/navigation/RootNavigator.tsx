import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { useAuth } from '../../features/auth';
import { useRoleBasedAccess } from '../rbac';

// Import all screens
import { LoginScreen, RegisterScreen } from '../../features/auth';
import { HomeScreen } from '../../features/home';
import { ReportsScreen, ReportCreationScreen, ReportDetailScreen } from '../../features/reports';
import { ReliefDashboardScreen, OperationDetailScreen } from '../../features/relief';
import { ProfileScreen, SettingsScreen, NotificationsScreen } from '../../features/profile';
import { VolunteerDashboardScreen } from '../../features/volunteer';
import { AnalyticsScreen } from '../../features/analytics';
import { EmergencyContactsScreen } from '../../features/emergency';
import { MapComponent } from '../../features/map';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function PublicStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} options={{}} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  const { canAccess } = useRoleBasedAccess();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#9ca3af',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Trang Chủ',
          tabBarLabel: 'Trang Chủ',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>🏠</Text>,
        }}
      />

      <Tab.Screen
        name="Reports"
        component={ReportsScreen}
        options={{
          title: 'Báo Cáo',
          tabBarLabel: 'Báo Cáo',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>📋</Text>,
        }}
      />

      {canAccess(['relief_worker', 'admin']) && (
        <Tab.Screen
          name="Relief"
          component={ReliefDashboardScreen}
          options={{
            title: 'Quản Lý Cứu Trợ',
            tabBarLabel: 'Cứu Trợ',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>🚨</Text>,
          }}
        />
      )}

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Hồ Sơ',
          tabBarLabel: 'Hồ Sơ',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

function ProtectedStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Group>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        
        {/* Reports Screens */}
        <Stack.Screen
          name="ReportDetail"
          component={ReportDetailScreen}
          options={{ title: 'Chi Tiết Báo Cáo' }}
        />
        <Stack.Screen
          name="ReportCreation"
          component={ReportCreationScreen}
          options={{ title: 'Tạo Báo Cáo' }}
        />

        {/* Relief Screens */}
        <Stack.Screen
          name="OperationDetail"
          component={OperationDetailScreen}
          options={{ title: 'Chi Tiết Hoạt Động' }}
        />

        {/* Profile & Settings Screens */}
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: 'Cài Đặt' }}
        />
        <Stack.Screen
          name="Notifications"
          component={NotificationsScreen}
          options={{ title: 'Thông Báo' }}
        />

        {/* Volunteer & Analytics Screens */}
        <Stack.Screen
          name="VolunteerDashboard"
          component={VolunteerDashboardScreen}
          options={{ title: 'Dashboard Tình Nguyện' }}
        />
        <Stack.Screen
          name="Analytics"
          component={AnalyticsScreen}
          options={{ title: 'Thống Kê' }}
        />
        <Stack.Screen
          name="EmergencyContacts"
          component={EmergencyContactsScreen}
          options={{ title: 'Liên Hệ Khẩn Cấp' }}
        />
      </Stack.Group>

      {/* Modal screens */}
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen
          name="MapView"
          component={MapComponent}
          options={{ title: 'Bản Đồ' }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}

export function RootNavigator() {
  const { isAuthenticated, isLoading, accessToken } = useAuth();

  if (isLoading) {
    return null; // Show splash screen
  }

  return (
    <NavigationContainer>
      {isAuthenticated && accessToken ? <ProtectedStack /> : <PublicStack />}
    </NavigationContainer>
  );
}
