import React from 'react';
import { View, Text } from 'react-native';

export type TaskStatus = 'pendente' | 'em progresso' | 'concluída';

interface StatusBadgeProps {
  status: TaskStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStyles = () => {
    switch (status) {
      case 'pendente':
        return { bg: 'bg-red-500', text: 'text-white' };
      case 'em progresso':
        return { bg: 'bg-yellow-500', text: 'text-gray-900' };
      case 'concluída':
        return { bg: 'bg-emerald-500', text: 'text-white' };
      default:
        return { bg: 'bg-gray-500', text: 'text-white' };
    }
  };

  const styles = getStyles();

  return (
    <View className={`px-3 py-1 rounded-full ${styles.bg}`}>
      <Text className={`text-[10px] font-bold uppercase ${styles.text}`}>
        {status}
      </Text>
    </View>
  );
}
