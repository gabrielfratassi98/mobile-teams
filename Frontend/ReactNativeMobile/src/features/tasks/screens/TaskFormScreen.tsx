import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert, ActivityIndicator, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Header } from '../../../components/Header';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { useNavigation, NavigationProp, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../routes'; 
import { tasksService } from '../../../services/taskService';
import { Team, teamsService } from '../../../services/teamService';

const MOCK_STATUS = [
  { id: 'Pendente', label: 'Pendente' },
  { id: 'Em Progresso', label: 'Em Progresso' },
  { id: 'Concluída', label: 'Concluída' },
];

export function TaskFormScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'TasksForm'>>();
  const id = route.params?.id;
  const isEditing = !!id;
  
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [teams, setTeams] = useState<Team[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [currentTeamsStr, setCurrentTeamsStr] = useState('');

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      await fetchTask();
      await fetchTeams();
      setIsLoading(false);
    }
    loadData();
  }, [id]);
  
  async function fetchTask() {
    try {
      if (!!id) {
        const task = await tasksService.getById(id);
        setTitle(task.title);
        setDescription(task.description || "");
        setSelectedStatus(task.status);
        
        if (task.teams && task.teams.length > 0) {
          setCurrentTeamsStr(task.teams.map((t: Team) => t.name).join(', '));
        }
      }
    } catch {
      Alert.alert("Erro", "Não foi possível buscar a tarefa");
    }
  }

  async function fetchTeams() {
    try {
      const teamsData = await teamsService.getTeams('');
      setTeams(teamsData || []);
    } catch {
      Alert.alert("Erro", "Não foi possível buscar os times");
    }
  }

  async function handleDelete() {
    try {
      if (!!id) {
        setIsLoading(true);
        await tasksService.delete(id);
        navigation.goBack();
      }
    } catch {
      Alert.alert("Erro", "Não foi possível deletar a tarefa");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleEdit() {
    if (!id) return;

    try {
      setIsLoading(true);
      
      const payload: any = {
        title,
        description,
        status: selectedStatus,
      };

      if (selectedTeam) {
        payload.teamId = selectedTeam;
      }

      await tasksService.update(id, payload);
      navigation.goBack();
    } catch {
      Alert.alert("Erro", "Não foi possível editar a tarefa");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreate() {
    try {
      setIsLoading(true);

      const payload: any = {
        title,
        description,
        status: selectedStatus,
      };

      if (selectedTeam) {
        payload.teamId = selectedTeam;
      }

      await tasksService.create(payload);
      navigation.goBack();
    } catch {
      Alert.alert("Erro", "Não foi possível criar a tarefa");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View className="flex-1 bg-gray-900 px-6">
      <Header 
        title={isEditing ? "Editar tarefa" : "Nova tarefa"} 
        subtitle="Gerenciar as tarefas" 
      />

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator color="#10B981" size="large" />
        </View>
      ) : (
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <Input 
            placeholder="Título" 
            value={title} 
            onChangeText={setTitle}
          />

          <Input 
            value={description}
            onChangeText={setDescription}
            placeholder="Descrição" 
            className="h-40"
          />

          {isEditing && currentTeamsStr ? (
            <Text className="text-gray-400 text-base mt-2 mb-4 font-semibold">
              Times atuais: {currentTeamsStr}
            </Text>
          ) : null}

          <View className="bg-gray-800 rounded-lg mb-4 border border-gray-700">
            <Picker
              selectedValue={selectedTeam}
              onValueChange={(itemValue) => setSelectedTeam(itemValue)}
              dropdownIconColor="#9CA3AF"
              style={{ color: '#9CA3AF', height: 56 }}
            >
              <Picker.Item label="Adicione um time" value="" />
              {teams.map((team) => (
                <Picker.Item key={team.id} label={team.name} value={team.id} />
              ))}
            </Picker>
          </View>

          <View className="bg-gray-800 rounded-lg mb-8 border border-gray-700">
            <Picker
              selectedValue={selectedStatus}
              onValueChange={(itemValue) => setSelectedStatus(itemValue)}
              dropdownIconColor="#9CA3AF"
              style={{ color: '#9CA3AF', height: 56 }}
            >
              <Picker.Item label="Selecione um status" value="" />
              {MOCK_STATUS.map((status) => (
                <Picker.Item key={status.id} label={status.label} value={status.id} />
              ))}
            </Picker>
          </View>
        </ScrollView>
      )}

      <View className="pb-8 pt-4 bg-gray-900">
        {isEditing ? (<Button title="Apagar" variant="danger" onPress={handleDelete} className='mb-4' disabled={isLoading} />) : null}
        <Button 
          title={isEditing ? "Salvar" : "Criar"} 
          variant="primary" 
          onPress={isEditing ? handleEdit : handleCreate}
          disabled={isLoading}
        />
      </View>
    </View>
  );
}
