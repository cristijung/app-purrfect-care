import React from 'react';
import styled from 'styled-components/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';

interface PetCardProps {
  name: string;
  breed: string;
  age: string;
  isFirst?: boolean;
}

const CardContainer = styled.TouchableOpacity`
  background-color: ${props => props.theme.colors.surface};
  margin: 10px 20px;
  padding: 15px;
  border-radius: 15px;
  flex-direction: row;
  align-items: center;
  border: 1px solid ${props => props.theme.colors.primary}20;
`;

const AvatarCircle = styled.View<{ isSpecial?: boolean }>`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  background-color: ${props => props.theme.colors.background};
  align-items: center;
  justify-content: center;
  border: 2px solid ${props => props.isSpecial ? props.theme.colors.secondary : props.theme.colors.primary};
`;

const InfoContainer = styled.View`
  margin-left: 15px;
  flex: 1;
`;

const PetName = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${props => props.theme.colors.white};
`;

const PetDetails = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.colors.gray};
  margin-top: 2px;
`;

export function PetCard({ name, breed, age, isFirst }: PetCardProps) {
  return (
    <CardContainer activeOpacity={0.7}>
      <AvatarCircle isSpecial={isFirst}>
        <MaterialCommunityIcons
          name="cat"
          size={35}
          color={isFirst ? theme.colors.secondary : theme.colors.primary}
        />
      </AvatarCircle>

      <InfoContainer>
        <PetName>{name}</PetName>
        <PetDetails>{breed} • {age}</PetDetails>
      </InfoContainer>

      <MaterialCommunityIcons name="chevron-right" size={24} color={theme.colors.gray} />
    </CardContainer>
  );
}