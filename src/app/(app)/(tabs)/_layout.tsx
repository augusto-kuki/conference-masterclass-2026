import theme from '@/global/styles/theme'
import { Feather } from '@expo/vector-icons'
import { Tabs } from 'expo-router'

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Página inicial',
          tabBarIcon: ({ color, focused }) => (
            <Feather
              name="home"
              size={24}
              color={focused ? theme.colors.primary : color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ajustes',
          tabBarIcon: ({ color, focused }) => (
            <Feather
              name="settings"
              size={24}
              color={focused ? theme.colors.primary : color}
            />
          ),
        }}
      />
    </Tabs>
  )
}
