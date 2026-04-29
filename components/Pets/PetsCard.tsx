import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import styled from "styled-components/native";
import { theme } from "../../styles/theme";

// interface das propriedades que o COMPONENTE recebe
interface PetCardProps {
  name: string;
  breed: string;
  age: string;
  isFirst?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
}

// interface específica para o STYLED COMPONENT
interface StyledCardProps {
  isFirst?: boolean;
}

// passando a interface StyledCardProps para o TouchableOpacity
const CardContainer = styled.TouchableOpacity<StyledCardProps>`
  background-color: ${(props) => props.theme.colors.surface};
  margin: 8px 20px;
  padding: 16px;
  border-radius: 15px;
  flex-direction: row;
  align-items: center;
  border-left-width: 4px;
  /* Agora o TS reconhece o isFirst aqui dentro */
  border-left-color: ${(props) =>
    props.isFirst ? props.theme.colors.secondary : "transparent"};
`;

const IconContainer = styled.View`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: ${(props) => props.theme.colors.background};
  align-items: center;
  justify-content: center;
  border: 1px solid ${(props) => props.theme.colors.primary}50;
`;

const Info = styled.View`
  flex: 1;
  margin-left: 15px;
`;

const Name = styled.Text`
  color: ${(props) => props.theme.colors.white};
  font-size: 18px;
  font-weight: bold;
`;

const Details = styled.Text`
  color: ${(props) => props.theme.colors.gray};
  font-size: 14px;
  margin-top: 2px;
`;

export function PetCard({
  name,
  breed,
  age,
  isFirst,
  onPress,
  onLongPress,
}: PetCardProps) {
  return (
    <CardContainer
      activeOpacity={0.7}
      onPress={onPress}
      onLongPress={onLongPress}
      isFirst={isFirst}
    >
      <IconContainer>
        <MaterialCommunityIcons
          name="cat"
          size={30}
          /* isFirst já vem da desestruturação da função, então funciona direto */
          color={isFirst ? theme.colors.secondary : theme.colors.primary}
        />
      </IconContainer>

      <Info>
        <Name>{name}</Name>
        <Details>
          {breed} • {age}
        </Details>
      </Info>

      <MaterialCommunityIcons
        name="chevron-right"
        size={24}
        color={theme.colors.surface}
        style={{ opacity: 0.5 }}
      />
    </CardContainer>
  );
}
