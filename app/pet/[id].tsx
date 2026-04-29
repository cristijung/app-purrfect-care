import React from 'react';
import { useLocalSearchParams, Stack } from 'expo-router';
import styled from 'styled-components/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '@/styles/theme';

const Container = styled.ScrollView`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
`;

const PhotoHeader = styled.View`
  height: 300px;
  background-color: ${props => props.theme.colors.surface};
  justify-content: center;
  align-items: center;
`;

const Content = styled.View`
  padding: 20px;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  background-color: ${props => props.theme.colors.background};
  margin-top: -30px;
`;

const Name = styled.Text`
  font-size: 32px;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
`;

const InfoRow = styled.View`
  flex-direction: row;
  margin-top: 10px;
  gap: 20px;
`;

const InfoBadge = styled.View`
  background-color: ${props => props.theme.colors.surface};
  padding: 8px 15px;
  border-radius: 10px;
`;

const InfoText = styled.Text`
  color: ${props => props.theme.colors.white};
  font-size: 14px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${props => props.theme.colors.secondary};
  margin-top: 30px;
  margin-bottom: 10px;
`;

const Description = styled.Text`
  color: ${props => props.theme.colors.gray};
  line-height: 22px;
  font-size: 16px;
`;

export default function PetDetails() {
  const { id, name, breed, age } = useLocalSearchParams();

  return (
    <Container>
      <Stack.Screen options={{ title: name as string, headerTransparent: true, headerTintColor: theme.colors.primary }} />
      
      <PhotoHeader>
        <MaterialCommunityIcons name="cat" size={120} color={theme.colors.primary} />
      </PhotoHeader>

      <Content>
        <Name>{name}</Name>
        <InfoRow>
          <InfoBadge><InfoText>{breed}</InfoText></InfoBadge>
          <InfoBadge><InfoText>{age}</InfoText></InfoBadge>
        </InfoRow>

        <SectionTitle>Sobre o Pet</SectionTitle>
        <Description>
          Este é o espaço para os detalhes do {name}. Como ainda não temos banco de dados, 
          estamos exibindo os dados passados via rota. Futuramente, aqui ficarão 
          as observações médicas, vacinas e temperamento.
        </Description>

        <SectionTitle>Histórico de Saúde</SectionTitle>
        <Description>- Nenhuma consulta pendente.</Description>
      </Content>
    </Container>
  );
}