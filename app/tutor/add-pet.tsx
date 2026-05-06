import { theme } from "@/styles/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import styled from "styled-components/native";

/* imports de Auth e Sync */
import { auth } from "@/config/firebaseConfig";
import { runGlobalSync } from "@/services/syncManager";

const Container = styled.KeyboardAvoidingView`
  flex: 1;
  background-color: ${(props) => props.theme.colors.background};
`;

const Header = styled.View`
  padding: 40px 20px 20px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${(props) => props.theme.colors.secondary};
`;

const Form = styled.View`
  padding: 20px;
`;

const Label = styled.Text`
  color: ${(props) => props.theme.colors.white};
  margin-bottom: 8px;
  font-weight: 600;
`;

const Input = styled.TextInput`
  background-color: ${(props) => props.theme.colors.surface};
  color: ${(props) => props.theme.colors.white};
  padding: 15px;
  border-radius: 12px;
  margin-bottom: 20px;
  border: 1px solid ${(props) => props.theme.colors.secondary}40;
`;

const PhotoContainer = styled.TouchableOpacity`
  width: 120px;
  height: 120px;
  border-radius: 20px;
  background-color: ${(props) => props.theme.colors.surface};
  align-self: center;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
  border: 2px dashed ${(props) => props.theme.colors.secondary};
  overflow: hidden;
`;

const PreviewImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const TypeContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const TypeButton = styled.TouchableOpacity<{ active: boolean }>`
  background-color: ${(props) => props.active ? props.theme.colors.secondary : props.theme.colors.surface};
  flex: 0.48;
  padding: 15px;
  border-radius: 12px;
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

const TypeText = styled.Text<{ active: boolean }>`
  color: white;
  font-weight: bold;
  margin-left: 8px;
`;

const SaveButton = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.colors.secondary};
  padding: 18px;
  border-radius: 12px;
  align-items: center;
  margin-top: 10px;
`;

const SaveButtonText = styled.Text`
  color: white;
  font-weight: bold;
  font-size: 16px;
`;

export default function AddPet() {
  const router = useRouter();
  const db = useSQLiteContext();
  const user = auth.currentUser;

  const [name, setName] = useState("");
  const [species, setSpecies] = useState<"Cão" | "Gato">("Cão");
  const [breed, setBreed] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled) setPhoto(result.assets[0].uri);
  };

  const handleSavePet = async () => {
    if (!name || !user) {
      return Alert.alert("Erro", "O nome do pet é obrigatório.");
    }

    setLoading(true);
    try {
      // persistência Local no SQLite
      await db.runAsync(
        `INSERT INTO pets (firebase_uid, name, species, breed, birth_date, photo, synced) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [user.uid, name, species, breed, birthDate, photo || "", 0]
      );

      Alert.alert("Sucesso!", `${name} foi cadastrado localmente.`, [
        {
          text: "OK",
          onPress: () => {
            runGlobalSync(); // dispara a sincronização
            router.back();
          },
        },
      ]);
    } catch (error) {
      console.error("❌ Erro ao salvar pet no SQLite:", error);
      Alert.alert("Erro", "Não foi possível salvar o pet localmente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container behavior="padding">
      <Header>
        <Title>Novo Pet</Title>
        <MaterialCommunityIcons
          name="close"
          size={28}
          color={theme.colors.gray}
          onPress={() => router.back()}
        />
      </Header>

      <ScrollView>
        <Form>
          <PhotoContainer onPress={handlePickImage}>
            {photo ? (
              <PreviewImage source={{ uri: photo }} />
            ) : (
              <MaterialCommunityIcons
                name="paw"
                size={40}
                color={theme.colors.secondary}
              />
            )}
          </PhotoContainer>

          <Label>Nome do Pet *</Label>
          <Input
            placeholder="Ex: Seth"
            placeholderTextColor={theme.colors.gray}
            value={name}
            onChangeText={setName}
          />

          <Label>Espécie</Label>
          <TypeContainer>
            <TypeButton 
              active={species === "Cão"} 
              onPress={() => setSpecies("Cão")}
            >
              <MaterialCommunityIcons name="dog" size={20} color="white" />
              <TypeText active={species === "Cão"}>Cão</TypeText>
            </TypeButton>

            <TypeButton 
              active={species === "Gato"} 
              onPress={() => setSpecies("Gato")}
            >
              <MaterialCommunityIcons name="cat" size={20} color="white" />
              <TypeText active={species === "Gato"}>Gato</TypeText>
            </TypeButton>
          </TypeContainer>

          <Label>Raça</Label>
          <Input
            placeholder="Ex: Border Collie ou SRD"
            placeholderTextColor={theme.colors.gray}
            value={breed}
            onChangeText={setBreed}
          />

          <Label>Data de Nascimento (Opcional)</Label>
          <Input
            placeholder="Ex: 12/05/2022"
            placeholderTextColor={theme.colors.gray}
            value={birthDate}
            onChangeText={setBirthDate}
          />

          <SaveButton onPress={handleSavePet} disabled={loading}>
            <SaveButtonText>
              {loading ? "Salvando..." : "Cadastrar Pet"}
            </SaveButtonText>
          </SaveButton>
        </Form>
      </ScrollView>
    </Container>
  );
}