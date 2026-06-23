import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { StatusBadge, TaskStatus } from './StatusBadge';

interface TaskCardProps {
  data: {
    id: string;
    title: string;
    description?: string; 
    status: string;
    teamName?: string;
  };
  onPress: () => void;
}

export function TaskCard({ data, onPress }: TaskCardProps) {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className="bg-gray-800 p-4 rounded-lg mb-4 border border-gray-700">
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1 mr-4">
          <Text className="text-white font-bold text-lg">{data.title}</Text>
          <Text className="text-gray-500 text-xs">{data.teamName}</Text>
        </View>
        <StatusBadge status={data.status} />
      </View>
      <Text className="text-gray-400 text-sm mt-2 leading-5" numberOfLines={2}>
        {data.description || 'Sem descrição'}
      </Text>
    </TouchableOpacity>
  );
}

