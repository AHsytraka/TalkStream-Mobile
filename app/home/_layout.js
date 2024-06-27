import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { FontAwesome6 } from '@expo/vector-icons';
import { Foundation } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue', headerShown:false }}>
      <Tabs.Screen
        name="index"
        options={{
          title:'',
          tabBarIcon: ({ color }) => <Octicons name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <FontAwesome5 name="comments" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <FontAwesome6 name="user" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
