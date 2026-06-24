import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { TeamScreen } from './features/teams/screens/TeamScreen';
import { NewTeamScreen } from './features/teams/screens/NewTeamScreen';
import { EditTeamScreen } from './features/teams/screens/EditTeamScreen';
import { TasksScreen } from './features/tasks/screens/TasksScreen';
import { TaskFormScreen } from './features/tasks/screens/TaskFormScreen';

export type RootStackParamList = {
  Team: undefined;
  NewTeam: undefined;
  EditTeam: { id: string };
  Tasks: { teamId: string } | undefined; 
  TasksForm: { id?: string } | undefined; 
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Team" 
        screenOptions={{
          headerShown: true, 
          headerTitle: '', 
          headerStyle: {
            backgroundColor: '#111827',
          },
          headerTintColor: '#fff', 
          headerShadowVisible: false, 
        }}
      >
        <Stack.Screen 
          name="Team" 
          component={TeamScreen} 
        />

        <Stack.Screen 
          name="NewTeam" 
          component={NewTeamScreen} 
        />

        <Stack.Screen 
          name="EditTeam" 
          component={EditTeamScreen} 
        />

        <Stack.Screen 
          name="Tasks" 
          component={TasksScreen} 
        />

        <Stack.Screen 
          name="TasksForm" 
          component={TaskFormScreen} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
