import React from 'react';
import { View, TextInput, TextInputProps, Text } from 'react-native';

interface InputProps extends TextInputProps {
  icon?: React.ReactNode;
  label?: string;
}

export function Input({ icon, label, ...rest }: InputProps) {
  return (
    <View className="mb-4">
      {label && <Text className="text-gray-400 text-sm mb-2">{label}</Text>}
      <View className="bg-gray-800 h-14 rounded-lg px-4 flex-row items-center border border-gray-700">
        <TextInput 
          className="flex-1 text-white text-base h-full"
          placeholderTextColor="#9ca3af"
          {...rest}
        />
        {icon && <View className="ml-2">{icon}</View>}
      </View>
    </View>
  );
}
