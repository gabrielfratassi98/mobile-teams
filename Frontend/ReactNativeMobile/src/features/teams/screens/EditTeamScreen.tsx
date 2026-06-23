import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation, NavigationProp, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../routes'; 
import { Header } from '../../../components/Header';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { teamsService } from '../../../services/teamService';

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
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'EditTeam'>>();
  const { id } = route.params ?? {};
  
  const [name, setName] = useState('');
  const [colorHex, setColorHex] = useState(TEAM_COLORS[0]); 
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTeamDetails();
  }, [id]);

  async function fetchTeamDetails() {
      setIsLoading(true);
      if (!id) return;

      try {
        const team = await teamsService.getById(id);
        setName(team.name);
        if (team.colorHex) {
          setColorHex(team.colorHex);
        }
        setIsLoading(false);

      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar os dados do time.');
        navigation.goBack();
      } finally {
        setIsLoading(false);
      }
    }

  async function handleSave() {
    if (!name.trim()) {
      return Alert.alert('Aviso', 'Por favor, informe o nome do time.');
    }

    if (!id) {
      return Alert.alert('Erro', 'ID do time não encontrado.');
    }

    try {
      setIsLoading(true);
      await teamsService.update(id, { 
        name,
        colorHex
      });
      
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o time.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    try {
      setIsLoading(true);
      await teamsService.delete(id);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível deletar o time.');
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
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
                navigation.navigate('Tasks', { teamId: id, teamName: name });
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
            onPress={handleDelete}
            disabled={isLoading}
          />
        </View>

        <Button 
          title={isLoading ? "Salvando..." : "Salvar"} 
          variant="primary" 
          onPress={handleSave}
          disabled={isLoading}
        />
      </View>
    </View>
  );
}

