import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useState } from "react";
import { Alert, ScrollView } from "react-native";
import styled from "styled-components/native";
import { theme } from "../styles/theme";

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
  color: ${(props) => props.theme.colors.primary};
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
  border: 1px solid ${(props) => props.theme.colors.primary}40;
`;

const PhotoContainer = styled.TouchableOpacity`
  width: 150px;
  height: 150px;
  border-radius: 75px;
  background-color: ${(props) => props.theme.colors.surface};
  align-self: center;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  border: 2px dashed ${(props) => props.theme.colors.primary};
  overflow: hidden;
`;

const PreviewImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const Button = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.colors.primary};
  padding: 18px;
  border-radius: 12px;
  align-items: center;
  margin-top: 10px;
`;

const ButtonText = styled.Text`
  color: ${(props) => props.theme.colors.white};
  font-weight: bold;
  font-size: 16px;
`;

const LocationButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: ${(props) => props.theme.colors.surface};
  padding: 12px;
  border-radius: 12px;
  margin-bottom: 20px;
  border: 1px solid ${(props) => props.theme.colors.secondary}80;
`;

export default function RegisterTutor() {
  const router = useRouter();
  const db = useSQLiteContext();

  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  );

  // fn para selfie ou galeria
  const handlePickImage = async () => {
    Alert.alert("Foto de Perfil", "Escolha uma opção", [
      { text: "Câmera (Selfie)", onPress: () => openCamera() },
      { text: "Galeria", onPress: () => openGallery() },
      { text: "Cancelar", style: "cancel" },
    ]);
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted")
      return Alert.alert("Ops!", "Precisamos da câmera.");

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled) setPhoto(result.assets[0].uri);
  };

  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled) setPhoto(result.assets[0].uri);
  };

  // fn p GPS
  const handleGetLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted")
      return Alert.alert("Ops!", "Permita o acesso ao GPS.");

    let loc = await Location.getCurrentPositionAsync({});
    setCoords({ lat: loc.coords.latitude, lng: loc.coords.longitude });

    // geocodificação reversa para pegar o nome da rua/cidade
    let response = await Location.reverseGeocodeAsync({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    });

    if (response.length > 0) {
      const item = response[0];
      setAddress(`${item.street}, ${item.streetNumber} - ${item.subregion}`);
    }
  };

  const handleSave = async () => {
    if (!fullName || !address)
      return Alert.alert("Erro", "Preencha os campos obrigatórios.");

    try {
      // persistência local seguindo sua arquitetura offline-first
      await db.runAsync(
        `INSERT INTO users (full_name, address, latitude, longitude, profile_photo, synced) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [fullName, address, coords?.lat || 0, coords?.lng || 0, photo || "", 0],
      );

      Alert.alert(
        "Sucesso!",
        "Cadastro realizado localmente. Sincronizando com a nuvem...",
        [{ text: "OK", onPress: () => router.back() }],
      );
    } catch (e) {
      console.error(e);
      Alert.alert("Erro", "Não foi possível salvar os dados.");
    }
  };

  return (
    <Container behavior="padding">
      <Header>
        <Title>Cadastro VIP</Title>
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
                name="camera-plus"
                size={40}
                color={theme.colors.primary}
              />
            )}
          </PhotoContainer>

          <Label>Nome Completo *</Label>
          <Input
            placeholder="Ex: Maria Cristina Jung"
            placeholderTextColor={theme.colors.gray}
            value={fullName}
            onChangeText={setFullName}
          />

          <Label>Endereço</Label>
          <LocationButton onPress={handleGetLocation}>
            <MaterialCommunityIcons
              name="map-marker-radius"
              size={24}
              color={theme.colors.secondary}
            />
            <ButtonText
              style={{
                marginLeft: 10,
                color: theme.colors.white,
                fontSize: 14,
              }}
            >
              {coords ? "Localização Detectada!" : "Detectar pelo GPS"}
            </ButtonText>
          </LocationButton>

          <Input
            placeholder="Endereço completo"
            placeholderTextColor={theme.colors.gray}
            value={address}
            onChangeText={setAddress}
            multiline
          />

          <Button onPress={handleSave}>
            <ButtonText>Finalizar Cadastro VIP</ButtonText>
          </Button>
        </Form>
      </ScrollView>
    </Container>
  );
}
