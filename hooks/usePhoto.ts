import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

export const usePhoto = () => {
  const takePhoto = async () => {
    // permissão para usar a câmera
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permissão necessária",
        "Precisamos de acesso à câmera para o perfil do pet.",
      );
      return null;
    }

    // abre a câmera
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true, // permite cortar a foto
      aspect: [4, 3],
      quality: 0.7, // reduz o tamanho para não pesar no upload
    });

    if (!result.canceled) {
      return result.assets[0].uri; // retorna o caminho da foto no celular
    }
    return null;
  };

  return { takePhoto };
};
