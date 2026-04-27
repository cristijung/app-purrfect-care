import React from 'react';
import styled from 'styled-components/native';
//import { theme } from '../../styles/theme';

interface BreedCardProps {
  name: string;
  origin: string;
  temperament: string;
  imageUri?: string;
}

const Card = styled.View`
  background-color: ${props => props.theme.colors.surface};
  margin: 10px 20px;
  border-radius: 20px;
  overflow: hidden; /* Para a imagem respeitar o border-radius */
  flex-direction: row;
  border: 1px solid ${props => props.theme.colors.primary}30;
`;

const BreedImage = styled.Image`
  width: 100px;
  height: 100px;
  background-color: ${props => props.theme.colors.background};
`;

const Info = styled.View`
  flex: 1;
  padding: 12px;
  justify-content: center;
`;

const Name = styled.Text`
  color: ${props => props.theme.colors.primary};
  font-size: 18px;
  font-weight: bold;
`;

const Origin = styled.Text`
  color: ${props => props.theme.colors.secondary};
  font-size: 12px;
  text-transform: uppercase;
  margin-bottom: 4px;
`;

const Description = styled.Text`
  color: ${props => props.theme.colors.gray};
  font-size: 12px;
`;

export function BreedCard({ name, origin, temperament, imageUri }: BreedCardProps) {
  return (
    <Card>
      <BreedImage 
        source={{ uri: imageUri || 'https://via.placeholder.com/100' }} 
      />
      <Info>
        <Origin>{origin}</Origin>
        <Name>{name}</Name>
        <Description numberOfLines={2}>{temperament}</Description>
      </Info>
    </Card>
  );
}