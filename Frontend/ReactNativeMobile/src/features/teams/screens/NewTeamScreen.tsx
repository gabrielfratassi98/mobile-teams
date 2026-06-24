import React from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Header } from '../../../components/Header';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { teamsService } from '../../../services/teamService';
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

export function NewTeamScreen() {
  const navigation = useNavigation();

  const { control, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<CreateTeamDTO>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: {
      name: '',
      colorHex: TEAM_COLORS[0],
    }
  });

  const colorHex = watch('colorHex');

  async function onSubmit(data: CreateTeamDTO) {
    try {
      await teamsService.create({
        ...data,
        colorHex: data.colorHex ?? TEAM_COLORS[0]
      });
      navigation.goBack();
    } catch {
      Alert.alert('Erro', 'Não foi possível criar o time.');
    }
  }

  return (
    <View className="flex-1 bg-gray-900 px-6">
      <Header title="Novo Time" subtitle="Crie seu time para gerenciar as tarefas" />

      <View className="flex-1 mt-4">
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Nome do time"
              value={value}
              onChangeText={onChange}
            />
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
        <Button
          title={isSubmitting ? 'Criando...' : 'Criar'}
          variant="primary"
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        />
      </View>
    </View>
  );
}