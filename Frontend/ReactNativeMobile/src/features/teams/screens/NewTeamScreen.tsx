import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
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

export function NewTeamScreen() {
  const navigation = useNavigation();
  
  const [name, setName] = useState('');
  const [colorHex, setColorHex] = useState(TEAM_COLORS[0]); 
  const [isLoading, setIsLoading] = useState(false);

  async function handleCreate() {
    if (!name.trim()) {
      return Alert.alert('Aviso', 'Por favor, informe o nome do time.');
    }

    try {
      setIsLoading(true);
      await teamsService.create({ name, colorHex });
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível criar o time.');
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    
    <View className="flex-1 bg-gray-900 px-6">
      <Header 
        title="Novo Time" 
        subtitle="Crie seu time para gerenciar as tarefas" 
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
        <Button 
          title="Criar" 
          variant="primary" 
          onPress={handleCreate}
          disabled={isLoading}
        />
      </View>
    </View>
  );
}