import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Header } from '../../../components/Header';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';

interface TaskFormScreenProps {
  isEditing?: boolean;
}

export function TaskFormScreen({ isEditing = false }: TaskFormScreenProps) {
  return (
    <View className="flex-1 bg-gray-900 px-6">
      <Header 
        title={isEditing ? "Editar tarefa" : "Nova tarefa"} 
        subtitle="crie seu time para gerenciar as tarefas" 
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Input placeholder="Título" />

        <Input 
          placeholder="Descrição" 
          style={{ paddingTop: 16 }}
        />

        <TouchableOpacity className="bg-gray-800 h-14 rounded-lg px-4 mb-4 flex-row items-center justify-between border border-gray-700">
          <Text className="text-gray-400 text-base">Selecione um time</Text>
          <Text className="text-gray-600 font-bold">v</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-gray-800 h-14 rounded-lg px-4 mb-8 flex-row items-center justify-between border border-gray-700">
          <Text className="text-gray-400 text-base">Selecione um status</Text>
          <Text className="text-gray-600 font-bold">v</Text>
        </TouchableOpacity>
      </ScrollView>

      <View className="pb-8 pt-4 bg-gray-900 bottom-10">
        <Button title={isEditing ? "Salvar" : "Criar"} variant="primary" />
      </View>
    </View>
  );
}
