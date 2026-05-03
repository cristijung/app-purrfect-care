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

  // estados para controlar os campos do formulário
  const [petName, setPetName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("Consulta");

  /**
   * fn para salvar o agendamento no SQLite
   * utilizando withTransactionAsync para evitar o erro de "prepareAsync" ou "database locked"
   */
  const handleSave = async () => {
    // validação simples para garantir que nenhum campo está vazio
    if (!petName.trim() || !ownerName.trim() || !date.trim()) {
      Alert.alert(
        "Campos obrigatórios",
        "Por favor, preencha todos os dados antes de confirmar.",
      );
      return;
    }

    try {
      // abre a conexão com o banco de dados
      const db = await SQLite.openDatabaseAsync("purrfectcare.db");

      /**
       * o segredo --> Transação Atômica.
       * Ela "tranca" o banco temporariamente, executa o comando e libera.
       * Isso impede que registros sucessivos (como o 3º ou 4º) deem erro de conexão.
       */
      await db.withTransactionAsync(async () => {
        // garante que a tabela exista e esteja atualizada com o modo WAL --> Write-Ahead Logging
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

        // insere os dados informados no formulário
        await db.runAsync(
          "INSERT INTO appointments (pet_name, owner_name, type, date, synced) VALUES (?, ?, ?, ?, ?)",
          [petName, ownerName, type, date, 0], // synced inicia sempre como 0 (local)
        );
      });

      // feedback de sucesso e retorno para a tela anterior
      Alert.alert("Sucesso! 🐾", `Agendamento de ${petName} salvo localmente.`);
      router.back();
    } catch (error) {
      // log detalhado no console para ajudar no debug se algo falhar
      console.error("Erro completo ao salvar agendamento:", error);
      Alert.alert(
        "Erro no Banco",
        "Não foi possível salvar. Tente reiniciar o app.",
      );
    }
  };

  return (
    <Container>
      {/* config da barra superior da tela */}
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
          placeholder="Ex: Mimi"
          placeholderTextColor="#666"
          value={petName}
          onChangeText={setPetName}
        />

        <Label>Nome do Tutor</Label>
        <Input
          placeholder="Ex: Paula"
          placeholderTextColor="#666"
          value={ownerName}
          onChangeText={setOwnerName}
        />

        <Label>Data e Hora</Label>
        <Input
          placeholder="Ex: 10/05 16h"
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

        <SaveButton onPress={handleSave} activeOpacity={0.8}>
          <SaveButtonText>Confirmar Agendamento</SaveButtonText>
        </SaveButton>
      </ScrollView>
    </Container>
  );
}
