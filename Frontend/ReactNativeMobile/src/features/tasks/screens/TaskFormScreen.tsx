import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Header } from '../../../components/Header';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { useNavigation, NavigationProp, useRoute, RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../../routes'; 
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
  
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [initialTeams, setInitialTeams] = useState<string[]>([]);
  
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [teams, setTeams] = useState<Team[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      await fetchTeams();
      await fetchTask();
      setIsLoading(false);
    }
    loadData();
  }, [id]);
  
  async function fetchTeams() {
    try {
      const teamsData = await teamsService.getTeams('');
      setTeams(teamsData || []);
    } catch {
      Alert.alert("Erro", "Não foi possível buscar os times");
    }
  }

  async function fetchTask() {
    try {
      if (id) {
        const task = await tasksService.getById(id);
        setTitle(task.title);
        setDescription(task.description || "");
        setSelectedStatus(task.status);
        
        if (task.teams && task.teams.length > 0) {
          const teamIds = task.teams.map((t: Team) => t.id);
          setSelectedTeams(teamIds);
          
          setInitialTeams(teamIds);
        }
      }
    } catch {
      Alert.alert("Erro", "Não foi possível buscar a tarefa");
    }
  }

  function handleToggleTeam(teamId: string) {
    setSelectedTeams(prev => {
      if (prev.includes(teamId)) {
        return prev.filter(id => id !== teamId);
      } else {
        return [...prev, teamId];
      }
    });
  }

  async function handleDelete() {
    try {
      if (id) {
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
        teamIds: selectedTeams 
      };

      await tasksService.update(id, payload);
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível editar a tarefa.");
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
        teamIds: selectedTeams
      };

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
          
          <Text className="text-gray-300 text-sm font-semibold mb-2">Título da Tarefa</Text>
          <Input 
            placeholder="Ex: Atualizar layout..." 
            value={title} 
            onChangeText={setTitle}
          />

          <Text className="text-gray-300 text-sm font-semibold mt-4 mb-2">Descrição</Text>
          <Input 
            value={description}
            onChangeText={setDescription}
            placeholder="Detalhes da tarefa..." 
          />

          <Text className="text-gray-300 text-sm font-semibold mt-4 mb-3">Status</Text>
          <View className="bg-gray-800 rounded-lg mb-4 border border-gray-700">
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

          <Text className="text-gray-300 text-sm font-semibold mt-4 mb-3">Vincular Times (Múltipla escolha)</Text>
          <View className="bg-gray-800 p-4 rounded-lg border border-gray-700 mb-8">
            {teams.length === 0 ? (
              <Text className="text-gray-500">Nenhum time cadastrado.</Text>
            ) : (
              teams.map((team) => {
                const isSelected = selectedTeams.includes(team.id);
                return (
                  <TouchableOpacity
                    key={team.id}
                    onPress={() => handleToggleTeam(team.id)}
                    activeOpacity={0.7}
                    className="flex-row items-center py-2"
                  >
                    <View 
                      className={`w-6 h-6 rounded border items-center justify-center mr-3 ${
                        isSelected ? 'bg-emerald-500 border-emerald-500' : 'bg-transparent border-gray-500'
                      }`}
                    >
                      {isSelected && <Text className="text-white font-bold text-xs">✓</Text>}
                    </View>
                    <Text className={`text-base ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                      {team.name}
                    </Text>
                  </TouchableOpacity>
                );
              })
            )}
          </View>

        </ScrollView>
      )}

      <View className="pb-8 pt-4 bg-gray-900 border-t border-gray-800">
        {isEditing && (
          <Button 
            title="Apagar" 
            variant="danger" 
            onPress={handleDelete} 
            className="mb-4" 
            disabled={isLoading} 
          />
        )}
        <Button 
          title={isEditing ? "Salvar Alterações" : "Criar Tarefa"} 
          variant="primary" 
          onPress={isEditing ? handleEdit : handleCreate}
          disabled={isLoading}
        />
      </View>
    </View>
  );
}
