import React, { useState } from 'react';
import { Alert, ScrollView, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import * as SQLite from 'expo-sqlite';
import { theme } from '@/styles/theme';

const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
  padding: 20px;
`;

const Label = styled.Text`
  color: white;
  font-size: 16px;
  margin-bottom: 8px;
  margin-top: 15px;
`;

const Input = styled.TextInput`
  background-color: ${props => props.theme.colors.surface};
  color: white;
  padding: 15px;
  border-radius: 10px;
  font-size: 16px;
  border: 1px solid ${props => props.theme.colors.primary}30;
`;

const PickerContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 10px;
`;

const TypeButton = styled.TouchableOpacity<{ active: boolean }>`
  background-color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.surface};
  padding: 10px;
  border-radius: 8px;
  width: 30%;
  align-items: center;
`;

const TypeText = styled.Text<{ active: boolean }>`
  color: ${props => props.active ? 'white' : props.theme.colors.gray};
  font-weight: bold;
  font-size: 12px;
`;

const SaveButton = styled.TouchableOpacity`
  background-color: ${props => props.theme.colors.primary};
  padding: 18px;
  border-radius: 12px;
  align-items: center;
  margin-top: 40px;
`;

const SaveButtonText = styled.Text`
  color: white;
  font-weight: bold;
  font-size: 18px;
`;

export default function NewAppointment() {
  const router = useRouter();
  const [petName, setPetName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState('Consulta');

  const handleSave = async () => {
    if (!petName || !ownerName || !date) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    try {
      const db = await SQLite.openDatabaseAsync('purrfectcare.db');
      
      // Salva no SQLite com synced = 0
      await db.runAsync(
        'INSERT INTO appointments (pet_name, owner_name, type, date, synced) VALUES (?, ?, ?, ?, ?)',
        [petName, ownerName, type, date, 0]
      );

      Alert.alert("Sucesso!", `${type} agendada com sucesso!`);
      router.back();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Falha ao salvar no banco local.");
    }
  };

  return (
    <Container>
      <Stack.Screen options={{ title: 'Novo Agendamento', headerTintColor: theme.colors.primary }} />
      <ScrollView showsVerticalScrollIndicator={false}>
        
        <Label>Nome do Pet</Label>
        <Input 
          placeholder="Ex: Seth ou Mafalda" 
          placeholderTextColor="#666"
          value={petName}
          onChangeText={setPetName}
        />

        <Label>Nome do Tutor</Label>
        <Input 
          placeholder="Nome do cliente" 
          placeholderTextColor="#666"
          value={ownerName}
          onChangeText={setOwnerName}
        />

        <Label>Data e Hora</Label>
        <Input 
          placeholder="Ex: 30/04 às 14:00" 
          placeholderTextColor="#666"
          value={date}
          onChangeText={setDate}
        />

        <Label>Tipo de Procedimento</Label>
        <PickerContainer>
          {['Consulta', 'Exame', 'Cirurgia'].map((item) => (
            <TypeButton 
              key={item} 
              active={type === item} 
              onPress={() => setType(item)}
            >
              <TypeText active={type === item}>{item}</TypeText>
            </TypeButton>
          ))}
        </PickerContainer>

        <SaveButton onPress={handleSave}>
          <SaveButtonText>Confirmar Agendamento</SaveButtonText>
        </SaveButton>

      </ScrollView>
    </Container>
  );
}