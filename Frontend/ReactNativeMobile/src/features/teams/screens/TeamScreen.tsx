import React, { useState, useCallback } from 'react';
import { View, FlatList, ActivityIndicator, Alert, Text } from 'react-native';
import { Header } from '../../../components/Header';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { TeamCard } from '../components/TeamCard';
import { useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../../../routes';
import { teamsService, Team } from '../../../services/teamService';

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
      onPress={() => navigation.navigate("EditTeam", { id: item.id })}
    />
  );

  return (
    <View className="flex-1 bg-gray-900 px-6">
      <View>
        <Header
          title="Times"
          subtitle="Gerencie seus times"
          showBackButton={false}
        />
        <View className="">
          <Input
            placeholder="Buscar time por nome..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => fetchTeams(searchQuery)}
          />
        </View>
      </View>

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator color="#10B981" size="large" />
        </View>
      ) : (
        <FlatList
          className="flex-1"
          data={teams}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderTeamCard}
          contentContainerStyle={{ paddingBottom: 24, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View className="flex-1 justify-center items-center px-10">
              <Text className="text-gray-500 text-center text-lg">
                Nenhum time encontrado.
              </Text>
            </View>
          )}
        />
      )}

      <View className="mb-10 mt-4 gap-3">
        <Button
          title="Ver todas as tarefas"
          variant="outline"
          onPress={() => navigation.navigate("Tasks")}
        />
        
        <Button
          title="Criar novo time"
          variant="primary"
          onPress={() => navigation.navigate("NewTeam")}
        />
      </View>
    </View>
  );
}
