import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface TeamCardProps {
  data: {
    id: string;
    name: string;
    colorHex?: string;
  };
  onPress?: () => void;
}

export function TeamCard({ data, onPress }: TeamCardProps) {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className="bg-gray-800 h-20 rounded-lg mb-4 flex-row items-center justify-between px-4 border border-gray-700"
    >
      <View className="flex-row items-center">
        <View className="w-10 h-10 F-900/30 rounded flex items-center justify-center mr-4">
          <View className="flex-row items-center">
            <View 
              className="w-5 h-5 rounded-full mr-2" 
              style={{ backgroundColor: data.colorHex || '#9CA3AF' }} 
            />
          </View>
        </View>
        <Text className="text-white text-base font-bold">{data.name}</Text>
      </View>
      <Text className="text-gray-500 font-bold">{'>'}</Text>
    </TouchableOpacity>
  );
}
