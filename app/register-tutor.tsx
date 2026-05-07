import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useState } from "react";
import { Alert, ScrollView } from "react-native";
import styled from "styled-components/native";
import { theme } from "../styles/theme";

/* imports de auth */
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebaseConfig";

/* import do orquestrador de sincronização */
import { runGlobalSync } from "../services/syncManager";

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

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

  const handleGetLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted")
        return Alert.alert("Ops!", "Permita o acesso ao GPS.");

      // Accuracy.Balanced é mais rápido e estável para emuladores
      let loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setCoords({ lat: loc.coords.latitude, lng: loc.coords.longitude });

      let response = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      if (response.length > 0) {
        const item = response[0];
        setAddress(
          `${item.street || ""}, ${item.streetNumber || ""} - ${item.subregion || ""}`,
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert(
        "GPS Indisponível",
        "Não conseguimos detectar sua localização. Verifique se o GPS do emulador está ativo ou digite o endereço manualmente.",
      );
    }
  };

  const handleSave = async () => {
    if (!fullName || !email || !password) {
      return Alert.alert(
        "Erro",
        "Preencha os campos obrigatórios (Nome, E-mail e Senha).",
      );
    }

    setLoading(true);
    try {
      // Firebase Auth: criação da conta
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const uid = userCredential.user.uid;

      // SQLite: persistência local vinculada ao firebase_uid
      await db.runAsync(
        `INSERT INTO users (firebase_uid, full_name, address, latitude, longitude, profile_photo, synced) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          uid,
          fullName,
          address || "Endereço não detectado",
          coords?.lat ?? 0, // fallback crítico para o emulador
          coords?.lng ?? 0, // fallback crítico para o emulador
          photo || "",
          0,
        ],
      );

      Alert.alert(
        "Sucesso!",
        "Cadastro VIP realizado! Seus dados serão sincronizados em breve.",
        [
          {
            text: "OK",
            onPress: () => {
              // dispara a sincronização global imediatamente após fechar o alerta
              runGlobalSync();
              router.replace("/tutor");
            },
          },
        ],
      );
    } catch (e: any) {
      console.error(e);
      let errorMsg = "Não foi possível realizar o cadastro.";
      if (e.code === "auth/email-already-in-use")
        errorMsg = "Este e-mail já está cadastrado.";
      if (e.code === "auth/weak-password")
        errorMsg = "A senha deve ter pelo menos 6 caracteres.";

      Alert.alert("Erro", errorMsg);
    } finally {
      setLoading(false);
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
            placeholder="Ex: Cristina Jung"
            placeholderTextColor={theme.colors.gray}
            value={fullName}
            onChangeText={setFullName}
          />

          <Label>E-mail *</Label>
          <Input
            placeholder="tutor@exemplo.com"
            placeholderTextColor={theme.colors.gray}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Label>Senha *</Label>
          <Input
            placeholder="Mínimo 6 caracteres"
            placeholderTextColor={theme.colors.gray}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Label>Localização</Label>
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

          <Button onPress={handleSave} disabled={loading}>
            <ButtonText>
              {loading ? "Cadastrando..." : "Finalizar Cadastro VIP"}
            </ButtonText>
          </Button>
        </Form>
      </ScrollView>
    </Container>
  );
}
