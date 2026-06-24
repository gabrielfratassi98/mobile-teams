import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation, NavigationProp, useRoute, RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../../routes'; 
import { Header } from '../../../components/Header';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { teamsService } from '../../../services/teamService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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
  
  const [name, setName] = useState('');
  const [colorHex, setColorHex] = useState(TEAM_COLORS[0]); 

  const { data: team, isLoading: isLoadingTeam } = useQuery({
    queryKey: ['team', id],
    queryFn: () => teamsService.getById(id!),
    enabled: !!id
  });

  useEffect(() => {
    if (team) {
      setName(team.name);
      if (team.colorHex) setColorHex(team.colorHex);
    }
  }, [team]);

  const updateMutation = useMutation({
    mutationFn: (data: { name: string, colorHex: string }) => teamsService.update(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      navigation.goBack();
    },
    onError: () => Alert.alert('Erro', 'Não foi possível atualizar o time.')
  });

  const deleteMutation = useMutation({
    mutationFn: () => teamsService.delete(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      navigation.goBack();
    },
    onError: () => Alert.alert('Erro', 'Não foi possível deletar o time.')
  });

  if (isLoadingTeam) {
    return (
      <View className="flex-1 bg-gray-900 items-center justify-center">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }
  
  return (
    <View className="flex-1 bg-gray-900 px-6">
      <Header 
        title="Editar Time" 
        subtitle="Atualize as informações do seu time" 
      />

      <View className="flex-1 mt-4">
        <Input 
          placeholder="Nome do time" 
          value={name}
          onChangeText={setName}
          autoCorrect={false}
        />

        <Text className="text-gray-400 text-base mt-8 mb-4 font-semibold">
          Selecione a cor do time
        </Text>

        <View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 20 }}
          >
            {TEAM_COLORS.map((color) => (
              <TouchableOpacity
                key={color}
                onPress={() => setColorHex(color)}
                activeOpacity={0.7}
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
        </View>
      </View>

      <View className="pb-8 bottom-10">
        <View className="mb-4">
          <Button 
            title="Ver Tarefas" 
            variant="outline" 
            onPress={() => {
              if (id) {
                navigation.navigate('Tasks', { teamId: id });
              } else {
                Alert.alert('Aviso', 'Não foi possível encontrar o ID do time.');
              }
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
          title={updateMutation.isPending ? "Salvando..." : "Salvar"} 
          variant="primary" 
          onPress={() => updateMutation.mutate({ name, colorHex })}
          disabled={updateMutation.isPending || deleteMutation.isPending}
        />
      </View>
    </View>
  );
}