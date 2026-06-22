import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Header } from '../../../components/Header';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';

export function NewTeamScreen() {
  return (
    <View className="flex-1 bg-gray-900 px-6">
      <Header 
        title="Novo Time" 
        subtitle="crie seu time para gerenciar as tarefas" 
      />

      <View className="flex-1">
        <Input placeholder="Nome do time" />

        <TouchableOpacity className="bg-gray-800 h-14 rounded-lg px-4 flex-row items-center justify-between border border-gray-700">
          <Text className="text-gray-400 text-base">Cor do time</Text>
          <View className="w-6 h-6 rounded-full bg-yellow-400" />
        </TouchableOpacity>
      </View>

      <View className="pb-8 bottom-10">
        <Button title="Criar" variant="primary" />
      </View>
    </View>
  );
}
