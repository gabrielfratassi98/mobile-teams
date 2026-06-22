import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

export function Header({ title, subtitle, showBackButton = false, onBackPress }: HeaderProps) {
  return (
    <View className="mb-8 mt-10">
      {showBackButton && (
        <TouchableOpacity 
          className="mb-6 w-10 h-10 justify-center"
          onPress={onBackPress}
        >
          <Text className="text-white text-xl font-bold">{'<'}</Text>
        </TouchableOpacity>
      )}
      <View className="items-center">
        <Text className="text-2xl font-bold text-white mb-2">{title}</Text>
        {subtitle && (
          <Text className="text-gray-400">{subtitle}</Text>
        )}
      </View>
    </View>
  );
}
