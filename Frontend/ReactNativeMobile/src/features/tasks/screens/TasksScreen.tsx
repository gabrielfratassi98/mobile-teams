import React, { useState, useCallback } from 'react';
import { View, FlatList, Alert, ActivityIndicator } from 'react-native';
import { Header } from '../../../components/Header';
import { TaskCard } from '../components/TaskCard';
import { useNavigation, NavigationProp, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../routes'; 
import { Task, tasksService } from '../../../services/taskService';
import { teamsService } from '../../../services/teamService';
import { useFocusEffect } from '@react-navigation/native';
import { Button } from '../../../components/Button';

export function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Tasks'>>();
  const { teamId, teamName } = route.params ?? {};

  const renderHeader = () => (
    <Header 
      title="Tarefas" 
      subtitle="Adicione a galera e separe os times" 
    />
  );

  async function fetchTasksByTeam() {
    try {
      setIsLoading(true);
      if (teamId) {
        const data = await teamsService.getTasksTeamById(teamId);
        setTasks(data ?? []);
        return;
      }

      const data = await tasksService.getTasks('');
      setTasks(data ?? []);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível carregar as tarefas.');
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchTasksByTeam();
    }, [teamId])
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
            const teamNames = teamId 
              ? teamName 
              : (item as any).teams?.map((t: any) => t.name).join(', ') || 'Sem time';
            
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