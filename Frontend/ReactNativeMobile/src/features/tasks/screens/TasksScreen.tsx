import React from 'react';
import { View, FlatList, ActivityIndicator, Text } from 'react-native';
import { Header } from '../../../components/Header';
import { TaskCard } from '../components/TaskCard';
import { useNavigation, NavigationProp, useRoute, RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../../routes'; 
import { tasksService } from '../../../services/taskService';
import { teamsService } from '../../../services/teamService';
import { Button } from '../../../components/Button';
import { useQuery } from '@tanstack/react-query';

export function TasksScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Tasks'>>();
  const { teamId } = route.params ?? {};

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks', teamId],
    queryFn: async () => {
      if (teamId) {
        return await teamsService.getTasksTeamById(teamId);
      }
      return await tasksService.getTasks('');
    }
  });

  const { data: teamData } = useQuery({
    queryKey: ['team', teamId],
    queryFn: () => teamsService.getById(teamId!),
    enabled: !!teamId
  });

  const renderHeader = () => (
    <Header 
      title={teamData ? `Tarefas: ${teamData.name}` : "Tarefas"} 
      subtitle={teamId ? "Gerenciando tarefas deste time" : "Adicione a galera e separe os times"} 
    />
  );

  return (
    <View className="flex-1 bg-gray-900 px-6">
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator color="#10B981" size="large" />
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const teamNames = (item as any).teams && (item as any).teams.length > 0 
              ? (item as any).teams.map((t: any) => t.name).join(', ') 
              : 'Sem time';
            
            return (
              <TaskCard 
                data={{
                  id: item.id,
                  title: item.title,
                  description: item.description || '',
                  status: item.status.toLowerCase(),
                  teamName: teamNames
                }} 
                onPress={() => navigation.navigate("TasksForm", { id: item.id })} 
              />
            );
          }}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      <View className="mb-10 mt-4 gap-3">
        <Button
          title="Criar tarefa"
          variant="primary"
          onPress={() => navigation.navigate("TasksForm")}
        />
      </View>
    </View>
  );
}