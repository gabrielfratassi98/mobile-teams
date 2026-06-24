import React, { useEffect } from 'react';
import { View, ScrollView, Alert, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Header } from '../../../components/Header';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { useNavigation, NavigationProp, useRoute, RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../../routes'; 
import { tasksService } from '../../../services/taskService';
import { Team, teamsService } from '../../../services/teamService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createTaskSchema, CreateTaskDTO } from '../../../../../validations/schemas';

type TaskFormInput = z.input<typeof createTaskSchema>;

const MOCK_STATUS = [
  { id: 'Pendente', label: 'Pendente' },
  { id: 'Em Progresso', label: 'Em Progresso' },
  { id: 'Concluída', label: 'Concluída' },
];

export function TaskFormScreen() {
  const queryClient = useQueryClient();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'TasksForm'>>();
  const id = route.params?.id;
  const isEditing = !!id;

  const { control, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<TaskFormInput>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'Pendente',
      teamIds: [],
    }
  });

  const selectedTeams = watch('teamIds') || [];

  const { data: teams = [], isLoading: isLoadingTeams } = useQuery({
    queryKey: ['teams'],
    queryFn: () => teamsService.getTeams('')
  });

  const { data: task, isLoading: isLoadingTask } = useQuery({
    queryKey: ['task', id],
    queryFn: () => tasksService.getById(id!),
    enabled: isEditing,
  });

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description || "",
        status: task.status,
        teamIds: task.teams ? task.teams.map((t: Team) => t.id) : [],
      });
    }
  }, [task, reset]);

  const createMutation = useMutation({
    mutationFn: (payload: CreateTaskDTO) => tasksService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'], exact: false });
      navigation.goBack();
    },
    onError: () => {
      Alert.alert("Erro", "Não foi possível criar a tarefa");
    }
  });

  const updateMutation = useMutation({
    mutationFn: (payload: CreateTaskDTO) => tasksService.update(id!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['task', id] });
      navigation.goBack();
    },
    onError: () => {
      Alert.alert("Erro", "Não foi possível editar a tarefa.");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: () => tasksService.delete(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'], exact: false });
      navigation.goBack();
    },
    onError: () => {
      Alert.alert("Erro", "Não foi possível deletar a tarefa");
    }
  });

  function handleToggleTeam(teamId: string) {
    const currentTeams = [...selectedTeams];
    if (currentTeams.includes(teamId)) {
      setValue('teamIds', currentTeams.filter(tid => tid !== teamId));
    } else {
      setValue('teamIds', [...currentTeams, teamId]);
    }
  }

  function onSubmit(data: TaskFormInput) {
    const payload = data as CreateTaskDTO;
    
    if (isEditing) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  }

  const isScreenLoading =
    isLoadingTeams ||
    isLoadingTask ||
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  return (
    <View className="flex-1 bg-gray-900 px-6">
      <Header
        title={isEditing ? "Editar tarefa" : "Nova tarefa"}
        subtitle="Gerenciar as tarefas"
      />

      {isScreenLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator color="#10B981" size="large" />
        </View>
      ) : (
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <Text className="text-gray-300 text-sm font-semibold mb-2">
            Título da Tarefa
          </Text>
          
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Ex: Atualizar layout..."
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.title && <Text className="text-red-500 text-xs mt-1">{errors.title.message}</Text>}

          <Text className="text-gray-300 text-sm font-semibold mt-4 mb-2">
            Descrição
          </Text>

          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <Input
                value={value}
                onChangeText={onChange}
                placeholder="Detalhes da tarefa..."
              />
            )}
          />
          {errors.description && <Text className="text-red-500 text-xs mt-1">{errors.description.message}</Text>}

          <Text className="text-gray-300 text-sm font-semibold mt-4 mb-3">
            Status
          </Text>

          <Controller
            control={control}
            name="status"
            render={({ field: { onChange, value } }) => (
              <View className="bg-gray-800 rounded-lg mb-1 border border-gray-700">
                <Picker
                  selectedValue={value}
                  onValueChange={onChange}
                  dropdownIconColor="#9CA3AF"
                  style={{ color: '#9CA3AF', height: 56 }}
                >
                  {MOCK_STATUS.map((status) => (
                    <Picker.Item
                      key={status.id}
                      label={status.label}
                      value={status.id}
                    />
                  ))}
                </Picker>
              </View>
            )}
          />
          {errors.status && <Text className="text-red-500 text-xs mt-1">{errors.status.message}</Text>}

          <Text className="text-gray-300 text-sm font-semibold mt-4 mb-3">
            Vincular Times
          </Text>

          <View className="bg-gray-800 p-4 rounded-lg border border-gray-700 mb-2">
            {teams.length === 0 ? (
              <Text className="text-gray-500">Nenhum time cadastrado.</Text>
            ) : (
              teams.map((team: Team) => {
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
                        isSelected
                          ? 'bg-emerald-500 border-emerald-500'
                          : 'bg-transparent border-gray-500'
                      }`}
                    >
                      {isSelected && (
                        <Text className="text-white font-bold text-xs">✓</Text>
                      )}
                    </View>

                    <Text
                      className={`text-base ${
                        isSelected ? 'text-white' : 'text-gray-400'
                      }`}
                    >
                      {team.name}
                    </Text>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
          {errors.teamIds && <Text className="text-red-500 text-xs mt-1 mb-8">{errors.teamIds.message}</Text>}
        </ScrollView>
      )}

      <View className="pb-8 pt-4 bg-gray-900 border-t border-gray-800">
        {isEditing && (
          <Button
            title="Apagar"
            variant="danger"
            onPress={() => deleteMutation.mutate()}
            className="mb-4"
            disabled={isScreenLoading}
          />
        )}

        <Button
          title={isEditing ? "Salvar Alterações" : "Criar Tarefa"}
          variant="primary"
          onPress={handleSubmit(onSubmit)}
          disabled={isScreenLoading}
        />
      </View>
    </View>
  );
}