import React from 'react';
import { View, FlatList } from 'react-native';
import { Header } from '../../../components/Header';
import { Button } from '../../../components/Button';
import { TaskCard } from '../components/TaskCard';
import { TaskStatus } from '../components/StatusBadge';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../routes'; 

type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  teamName: string;
};

const mockTasks: Task[] = [
  { id: '1', title: 'Título da tarefa', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', status: 'pendente', teamName: 'Nome do time' },
  { id: '2', title: 'Título da tarefa', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', status: 'em progresso', teamName: 'Nome do time' },
  { id: '3', title: 'Título da tarefa', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', status: 'concluída', teamName: 'Nome do time' },
];

export function TasksScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const renderHeader = () => (
    <Header 
      title="Tarefas" 
      subtitle="adicione a galera e separe os times" 
    />
  );

  return (
    <View className="flex-1 bg-gray-900 px-6">
      <FlatList
        data={mockTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TaskCard data={item} onPress={() => navigation.navigate("TasksForm")} />}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      />

      <View className="absolute bottom-10 left-6 right-6">
        <Button title="Nova Tarefa" variant="primary" onPress={() => navigation.navigate("TasksForm")} />
      </View>
    </View>
  );
}
