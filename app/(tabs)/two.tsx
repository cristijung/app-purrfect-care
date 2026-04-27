import { PetCard } from "@/components/Pets/PetsCard";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { FlatList } from "react-native";
import styled from "styled-components/native";

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${(props) => props.theme.colors.background};
`;

const Header = styled.View`
  padding: 20px;
  padding-bottom: 10px;
`;

const Title = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: ${(props) => props.theme.colors.primary};
`;

const AddButton = styled.TouchableOpacity`
  position: absolute;
  right: 20px;
  bottom: 20px;
  width: 60px;
  height: 60px;
  border-radius: 30px;
  background-color: ${(props) => props.theme.colors.primary};
  align-items: center;
  justify-content: center;
  elevation: 5;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.3;
  shadow-radius: 3px;
`;

const MY_CATS = [
  { id: "1", name: "Seth", breed: "SRD", age: "6 anos" },
  { id: "2", name: "Grogu", breed: "SRD", age: "5 anos" },
  { id: "3", name: "Mina", breed: "SRD", age: "4 anos" },
  { id: "4", name: "Kirara", breed: "SRD", age: "3 anos" },
  { id: "5", name: "Frajola", breed: "SRD", age: "8 anos" },
  { id: "6", name: "Mafalda", breed: "Siamês", age: "18 anos" },
];

export default function TabTwoScreen() {
  return (
    <Container>
      <Header>
        <Title>Meus Gatos</Title>
      </Header>

      <FlatList
        data={MY_CATS}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <PetCard
            name={item.name}
            breed={item.breed}
            age={item.age}
            isFirst={index === 0} // o 1º cats ganha o destaque laranja que configuramos no componente
          />
        )}        
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <AddButton activeOpacity={0.8}>
        <MaterialCommunityIcons name="plus" size={35} color="#FFF" />
      </AddButton>
    </Container>
  );
}
