import { usePhoto } from "@/hooks/usePhoto"; // hook de fotos
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { Camera, ChevronLeft, Save } from "lucide-react-native";
import React, { useState } from "react";
import { Alert, TouchableOpacity } from "react-native";
import styled, { useTheme } from "styled-components/native";

// --- Estilização seguindo o padrão PurrfectCare ---
const Container = styled.ScrollView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 20px;
  padding-top: 60px;
`;

const Title = styled.Text`
  font-size: 22px;
  font-weight: bold;
  margin-left: 10px;
  color: ${({ theme }) => theme.colors.text};
`;

const PhotoSection = styled.View`
  align-items: center;
  margin-vertical: 20px;
`;

const PhotoButton = styled.TouchableOpacity`
  width: 150px;
  height: 150px;
  border-radius: 75px;
  background-color: ${({ theme }) => theme.colors.secondary};
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border-width: 2px;
  border-color: ${({ theme }) => theme.colors.primary};
  border-style: dashed;
`;

const PreviewImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const PlaceholderPhoto = styled.View`
  align-items: center;
`;

const PlaceholderText = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text};
  margin-top: 8px;
`;

const Form = styled.View`
  padding-horizontal: 20px;
`;

const Label = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 6px;
  margin-top: 16px;
`;

const StyledInput = styled.TextInput`
  background-color: ${({ theme }) => theme.colors.primary};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.text};
  border-radius: 8px;
  padding: 12px;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
`;

const SaveButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.primary};
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 16px;
  border-radius: 12px;
  margin-top: 32px;
  gap: 10px;
`;

const SaveButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

export default function NewAppointment() {
  const router = useRouter();
  const db = useSQLiteContext();
  const theme = useTheme(); // acessa as cores do tema
  const { takePhoto } = usePhoto(); // usando o hook

  // estados do formulário
  const [petName, setPetName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [appointmentType, setAppointmentType] = useState("");
  const [date, setDate] = useState(new Date().toLocaleDateString("pt-BR"));
  const [photoUri, setPhotoUri] = useState<string | null>(null); // o estado começa vazio

  /**
   * dispara o fluxo de captura de imagem.
   * aguarda a resolução da URI local pelo hook 'usePhoto' e, caso a captura
   * não seja cancelada pelo usuário, atualiza o estado 'photoUri' para
   * refletir a prévia na interface e preparar o dado para persistência no SQLite.
   */
  const handleCapturePhoto = async () => {
    const uri = await takePhoto(); // executa a lógica de permissão
    if (uri) setPhotoUri(uri); // atualiza a UI reativamente se houver nova foto
  };

  const saveAppointment = async () => {
    if (!petName || !ownerName || !appointmentType) {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      // usando withTransactionAsync para garantir atomicidade e evitar bloqueios de banco
      await db.withTransactionAsync(async () => {
        await db.runAsync(
          `INSERT INTO appointments (pet_name, owner_name, type, date, pet_photo, synced) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [petName, ownerName, appointmentType, date, photoUri, 0],
        );
      });

      Alert.alert(
        "Sucesso",
        "Agendamento salvo localmente! A sincronização ocorrerá em breve.",
      );
      router.back();
    } catch (error) {
      console.error("Erro ao salvar no SQLite:", error);
      Alert.alert("Erro", "Não foi possível salvar o agendamento.");
    }
  };

  return (
    <Container contentContainerStyle={{ paddingBottom: 40 }}>
      {/* header */}
      <Header>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft color={theme.colors.primary} size={28} />
        </TouchableOpacity>
        <Title>Novo Agendamento</Title>
      </Header>

      {/* seção de foto */}
      <PhotoSection>
        <PhotoButton onPress={handleCapturePhoto}>
          {photoUri ? (
            <PreviewImage source={{ uri: photoUri }} />
          ) : (
            <PlaceholderPhoto>
              <Camera color={theme.colors.text} size={40} />
              <PlaceholderText>Tirar foto do Pet</PlaceholderText>
            </PlaceholderPhoto>
          )}
        </PhotoButton>
      </PhotoSection>

      {/* campos do form */}
      <Form>
        <Label>Nome do Pet *</Label>
        <StyledInput
          placeholder="Ex: Seth, Mimi..."
          placeholderTextColor={theme.colors.text}
          value={petName}
          onChangeText={setPetName}
        />

        <Label>Nome do Tutor *</Label>
        <StyledInput
          placeholder="Nome do proprietário"
          placeholderTextColor={theme.colors.text}
          value={ownerName}
          onChangeText={setOwnerName}
        />

        <Label>Tipo de Serviço *</Label>
        <StyledInput
          placeholder="Ex: Consulta, Vacina, Banho"
          placeholderTextColor={theme.colors.text}
          value={appointmentType}
          onChangeText={setAppointmentType}
        />

        <Label>Data do Agendamento</Label>
        <StyledInput
          value={date}
          onChangeText={setDate}
          placeholderTextColor={theme.colors.text}
        />

        <SaveButton onPress={saveAppointment}>
          <Save color="white" size={20} />
          <SaveButtonText>Salvar Agendamento</SaveButtonText>
        </SaveButton>
      </Form>
    </Container>
  );
}
