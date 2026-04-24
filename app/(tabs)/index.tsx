import React from 'react';
import styled from 'styled-components/native';
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { theme } from '../../styles/theme';

// Container principal usando SafeAreaView para evitar o "notch" do celular
const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${(props) => props.theme.colors.background};
`;

// Header com logo e texto lado a lado
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

// Corpo da tela com os cards
const Content = styled.View`
  flex: 1;
  padding: 20px;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap; /* Permite que os cards quebrem de linha se necessário */
`;

const Card = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.colors.surface};
  width: 47%;
  height: 150px;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  border: 1px solid ${(props) => props.theme.colors.primary}40; /* 40 é 25% de opacidade */
`;

const CardText = styled.Text`
  color: ${(props) => props.theme.colors.white};
  margin-top: 12px;
  font-size: 16px;
  font-weight: 600;
`;

export default function HomeScreen() {
  return (
    <Container>
      <Header>
        {/* Usando a imagem da splash que você já tem no projeto */}
        <Logo 
          source={require('../../assets/images/splash-icon.png')} 
          resizeMode="contain" 
        />
        <HeaderTextContainer>
          <Title>PurrfectCare</Title>
          <Subtitle>Clínica Felina</Subtitle>
        </HeaderTextContainer>
      </Header>

      <Content>
        <Card activeOpacity={0.7}>
          <MaterialCommunityIcons 
            name="cat" 
            size={45} 
            color={theme.colors.primary} 
          />
          <CardText>Meus Gatos</CardText>
        </Card>

        <Card activeOpacity={0.7}>
          <FontAwesome 
            name="calendar-check-o" 
            size={40} 
            color={theme.colors.secondary} 
          />
          <CardText>Consultas</CardText>
        </Card>
      </Content>
    </Container>
  );
}