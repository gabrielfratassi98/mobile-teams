import React from "react";
import { TouchableOpacity, Text, TouchableOpacityProps, ActivityIndicator } from "react-native";

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    isLoading?: boolean;
    variant?: 'primary' | 'outline' | 'danger';
    className?: string;
}

export function Button({
    title, 
    isLoading = false, 
    variant = 'primary',
    className = '',
    ...rest
}: ButtonProps) {
    const bgColors = {
        primary: 'bg-emerald-600',
        outline: 'bg-transparent border border-emerald-600',
        danger: 'bg-red-600',
    };

    const textColors = {
        primary: 'text-white',
        outline: 'text-emerald-600',
        danger: 'text-white',
    };

    const currentBgColor = bgColors[variant];
    const currentTextColor = textColors[variant];

    return (
    <TouchableOpacity
      disabled={isLoading}
      className={`h-12 w-full flex-row items-center justify-center rounded-md ${currentBgColor} ${className}`}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'outline' ? '#059669' : '#fff'} />
      ) : (
        <Text className={`text-base font-bold ${currentTextColor}`}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
