import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router"; // importar o router
import React from "react";
import styled from "styled-components/native";
import { theme } from "../../styles/theme";

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${(props) => props.theme.colors.background};
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 20px;
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.colors.surface};
`;

const Logo = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 10px;
`;

const HeaderTextContainer = styled.View`
  margin-left: 15px;
`;

const Title = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: ${(props) => props.theme.colors.primary};
`;

const Subtitle = styled.Text`
  font-size: 14px;
  color: ${(props) => props.theme.colors.gray};
`;

const Content = styled.View`
  flex: 1;
  padding: 20px;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const Card = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.colors.surface};
  width: 47%;
  height: 150px;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  border: 1px solid ${(props) => props.theme.colors.primary}40;
`;

/* novo card para Área do Tutor VIP */
const VIPCard = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.colors.surface};
  width: 100%;
  padding: 24px;
  border-radius: 20px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border: 2px solid ${(props) => props.theme.colors.primary};
  margin-bottom: 20px;
`;

const VIPTextContainer = styled.View`
  flex: 1;
`;

const CardText = styled.Text`
  color: ${(props) => props.theme.colors.white};
  margin-top: 12px;
  font-size: 16px;
  font-weight: 600;
`;

const VIPTitle = styled.Text`
  color: ${(props) => props.theme.colors.white};
  font-size: 18px;
  font-weight: bold;
`;

const VIPSubtitle = styled.Text`
  color: ${(props) => props.theme.colors.gray};
  font-size: 13px;
  margin-top: 4px;
`;

export default function HomeScreen() {
  const router = useRouter(); // inicializar o router

  return (
    <Container>
      {/* aqui é o header */}
      <Header>
        <Logo
          source={require("../../assets/images/splash-icon.png")}
          resizeMode="contain"
        />
        <HeaderTextContainer>
          <Title>PurrfectCare</Title>
          <Subtitle>Clínica Felina</Subtitle>
        </HeaderTextContainer>
      </Header>

      {/* aqui vemos o conteúdo da tela */}
      <Content>
        {/* add o onPress apontando para o arquivo cat-breeds.tsx ................. */}
        <Card activeOpacity={0.7} onPress={() => router.push("/cat-breeds")}>
          <MaterialCommunityIcons
            name="cat"
            size={45}
            color={theme.colors.primary}
          />
          <CardText>Meus Gatos</CardText>
        </Card>

        <Card activeOpacity={0.7} onPress={() => router.push("/appointments")}>
          <FontAwesome
            name="calendar-check-o"
            size={40}
            color={theme.colors.secondary}
          />
          <CardText>Consultas</CardText>
        </Card>

        {/* novo card: área do tutor para cadastro e localização GPS */}
        <VIPCard
          activeOpacity={0.8}
          onPress={() => router.push("/register-tutor")}
        >
          <VIPTextContainer>
            <VIPTitle>Área do Tutor</VIPTitle>
            <VIPSubtitle>Cadastre-se para acesso exclusivo e VIP</VIPSubtitle>
          </VIPTextContainer>
          <MaterialCommunityIcons
            name="account-star"
            size={40}
            color={theme.colors.primary}
          />
        </VIPCard>
      </Content>
    </Container>
  );
}
