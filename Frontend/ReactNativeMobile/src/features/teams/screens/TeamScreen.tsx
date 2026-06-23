import React, { useState, useCallback } from 'react';
import { View, FlatList, ActivityIndicator, Alert } from 'react-native';
import { Header } from '../../../components/Header';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input'; 
import { TeamCard } from '../components/TeamCard';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../routes'; 
import { teamsService, Team } from '../../../services/teamService';
import { useFocusEffect } from '@react-navigation/native';

export function TeamScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');

  async function fetchTeams(search = '') {
    try {
      setIsLoading(true);
      const data = await teamsService.getTeams(search);
      setTeams(data);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível carregar os times.');
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchTeams(searchQuery);
    }, [searchQuery])
  );

  const renderTeamCard = ({ item }: { item: Team }) => (
    <TeamCard 
      data={item}
      onPress={() => navigation.navigate("Tasks", { teamId: item.id, teamName: item.name })}
    />
  );

  return (
    <View className="flex-1 bg-gray-900 px-6">
      <View className="z-10 bg-gray-900 pb-4 pt-2"> 
        <Header 
          title="Times" 
          subtitle="Acesse um dos times" 
          showBackButton={false} 
        />
        <Input 
          placeholder="Busque um time" 
          value={searchQuery}
          onChangeText={setSearchQuery} 
          onSubmitEditing={() => fetchTeams(searchQuery)}
        />
      </View>

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator color="#10B981" size="large" />
        </View>
      ) : (
        <FlatList
          data={teams}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderTeamCard}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
          className="top-2"
        />
      )}

      <View className="absolute bottom-10 left-6 right-6">
        <Button 
          title="Criar time" 
          variant="primary" 
          onPress={() => navigation.navigate("NewTeam")}
        />
      </View>
    </View>
  );
}
