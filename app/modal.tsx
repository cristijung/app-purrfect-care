import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import styled from "styled-components/native";

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.colors.background};
`;

const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${(props) => props.theme.colors.text};
`;

export default function ModalScreen() {
  return (
    <Container>
      <Title>Configurações do Pet</Title>

      {/* Use o status bar para garantir que o modal fique bonito no iOS/Android */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </Container>
  );
}
