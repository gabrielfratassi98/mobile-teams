import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation, NavigationProp, useRoute, RouteProp } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { RootStackParamList } from '../../../routes';
import { Header } from '../../../components/Header';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { teamsService } from '../../../services/teamService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createTeamSchema, CreateTeamDTO } from '../../../../validations/schemas';

const TEAM_COLORS = [
  '#FACC15',
  '#EF4444',
  '#F97316',
  '#10B981',
  '#3B82F6',
  '#8B5CF6',
  '#EC4899',
  '#A8A29E',
];

export function EditTeamScreen() {
  const queryClient = useQueryClient();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'EditTeam'>>();
  const { id } = route.params ?? {};

  const { control, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<CreateTeamDTO>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: {
      name: '',
      colorHex: TEAM_COLORS[0],
    }
  });

  const colorHex = watch('colorHex');

  const { data: team, isLoading: isLoadingTeam } = useQuery({
    queryKey: ['team', id],
    queryFn: () => teamsService.getById(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (team) {
      reset({
        name: team.name ?? '',
        colorHex: team.colorHex ?? TEAM_COLORS[0],
      });
    }
  }, [team, reset]);

  const updateMutation = useMutation({
    mutationFn: (data: CreateTeamDTO) => teamsService.update(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['team', id] });
      navigation.goBack();
    },
    onError: () => Alert.alert('Erro', 'Não foi possível atualizar o time.'),
  });

  const deleteMutation = useMutation({
    mutationFn: () => teamsService.delete(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      navigation.goBack();
    },
    onError: () => Alert.alert('Erro', 'Não foi possível deletar o time.'),
  });

  function onSubmit(data: CreateTeamDTO) {
    if (!id) return;
    updateMutation.mutate(data);
  }

  if (isLoadingTeam) {
    return (
      <View className="flex-1 bg-gray-900 items-center justify-center">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-900 px-6">
      <Header title="Editar Time" subtitle="Atualize as informações do seu time" />

      <View className="flex-1 mt-4">
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <Input value={value} onChangeText={onChange} />
          )}
        />
        {errors.name && <Text className="text-red-500 text-xs mt-1">{errors.name.message}</Text>}

        <Text className="text-gray-400 text-base mt-8 mb-4 font-semibold">
          Selecione a cor do time
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {TEAM_COLORS.map((color) => (
            <TouchableOpacity
              key={color}
              onPress={() => setValue('colorHex', color)}
              className={`w-12 h-12 rounded-full mr-4 items-center justify-center ${
                colorHex === color ? 'border-2 border-white' : ''
              }`}
              style={{ backgroundColor: color }}
            >
              {colorHex === color && (
                <View className="w-4 h-4 rounded-full bg-white opacity-40" />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
        {errors.colorHex && <Text className="text-red-500 text-xs mt-1">{errors.colorHex.message}</Text>}
      </View>

      <View className="pb-8 bottom-10">
        <View className="mb-4">
          <Button
            title="Ver Tarefas"
            variant="outline"
            onPress={() => {
              if (id) navigation.navigate('Tasks', { teamId: id });
            }}
          />
        </View>

        <View className="mb-4">
          <Button
            title="Deletar"
            variant="danger"
            onPress={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending || updateMutation.isPending}
          />
        </View>

        <Button
          title={updateMutation.isPending ? 'Salvando...' : 'Salvar'}
          variant="primary"
          onPress={handleSubmit(onSubmit)}
          disabled={updateMutation.isPending || deleteMutation.isPending}
        />
      </View>
    </View>
  );
}