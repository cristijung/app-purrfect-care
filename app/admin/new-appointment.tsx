import { theme } from "@/styles/theme";
import { Stack, useRouter } from "expo-router";
import * as SQLite from "expo-sqlite";
import React, { useState } from "react";
import { Alert, ScrollView } from "react-native";
import styled from "styled-components/native";

const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.colors.background};
  padding: 20px;
`;

const Label = styled.Text`
  color: white;
  font-size: 16px;
  margin-bottom: 8px;
  margin-top: 15px;
  font-weight: bold;
`;

const Input = styled.TextInput`
  background-color: ${(props) => props.theme.colors.surface};
  color: white;
  padding: 15px;
  border-radius: 10px;
  font-size: 16px;
  border: 1px solid ${(props) => props.theme.colors.primary}30;
`;

const PickerContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 10px;
`;

const TypeButton = styled.TouchableOpacity<{ active: boolean }>`
  background-color: ${(props) =>
    props.active ? props.theme.colors.primary : props.theme.colors.surface};
  padding: 12px;
  border-radius: 8px;
  width: 31%;
  align-items: center;
  border: 1px solid
    ${(props) => (props.active ? props.theme.colors.primary : "#333")};
`;

const TypeText = styled.Text<{ active: boolean }>`
  color: ${(props) => (props.active ? "white" : props.theme.colors.gray)};
  font-weight: bold;
  font-size: 13px;
`;

const SaveButton = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.colors.primary};
  padding: 18px;
  border-radius: 15px;
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
  const [petName, setPetName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("Consulta");

  const handleSave = async () => {
    if (!petName.trim() || !ownerName.trim() || !date.trim()) {
      Alert.alert("Campos vazios", "Por favor, preencha todos os dados.");
      return;
    }

    try {
      const db = await SQLite.openDatabaseAsync("purrfectcare.db");

      // configuração e garantia da Tabela
      await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS appointments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          remote_id TEXT,
          pet_name TEXT NOT NULL,
          owner_name TEXT NOT NULL,
          type TEXT NOT NULL,
          date TEXT NOT NULL,
          status TEXT DEFAULT 'Agendado',
          synced INTEGER DEFAULT 0
        );
      `);

      // inserção dos dados
      await db.runAsync(
        "INSERT INTO appointments (pet_name, owner_name, type, date, synced) VALUES (?, ?, ?, ?, ?)",
        [petName, ownerName, type, date, 0],
      );

      Alert.alert(
        "Sucesso! 🐾",
        `${type} para ${petName} agendada com sucesso.`,
      );
      router.back();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      Alert.alert("Erro", "Não foi possível salvar no banco local.");
    }
  };

  return (
    <Container>
      <Stack.Screen
        options={{
          title: "Novo Agendamento",
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.primary,
          headerShadowVisible: false,
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Label>Nome do Pet</Label>
        <Input
          placeholder="Ex: Bolinha"
          placeholderTextColor="#666"
          value={petName}
          onChangeText={setPetName}
        />

        <Label>Nome do Tutor</Label>
        <Input
          placeholder="Ex: Ana Banana"
          placeholderTextColor="#666"
          value={ownerName}
          onChangeText={setOwnerName}
        />

        <Label>Data e Hora</Label>
        <Input
          placeholder="Ex: 06/05 10h"
          placeholderTextColor="#666"
          value={date}
          onChangeText={setDate}
        />

        <Label>Tipo de Procedimento</Label>
        <PickerContainer>
          {["Consulta", "Exame", "Cirurgia"].map((item) => (
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
