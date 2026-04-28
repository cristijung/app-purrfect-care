import { AddPetModal } from "@/components/Pets/AddPetModal";
import { PetCard } from "@/components/Pets/PetsCard";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
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
  z-index: 10;
`;

export default function TabTwoScreen() {
  // estado para controlar a visibilidade do modal
  const [isModalVisible, setModalVisible] = useState(false);

  // estado da lista inicial com os cats
  const [myCats, setMyCats] = useState([
    { id: "1", name: "Seth", breed: "SRD", age: "6 anos" },
    { id: "2", name: "Grogu", breed: "SRD", age: "5 anos" },
    { id: "3", name: "Mina", breed: "SRD", age: "4 anos" },
    { id: "4", name: "Kirara", breed: "SRD", age: "3 anos" },
    { id: "5", name: "Frajola", breed: "SRD", age: "8 anos" },
    { id: "6", name: "Mafalda", breed: "Siamês", age: "18 anos" },
  ]);

  // fn para add o novo pet na lista
  const handleAddNewPet = (name: string, breed: string, age: string) => {
    const newPet = {
      id: Math.random().toString(), // gerando um ID temporário único
      name,
      breed,
      age,
    };

    // add o novo gato no topo da lista
    setMyCats((currentCats) => [newPet, ...currentCats]);
  };

  return (
    <Container>
      <Header>
        <Title>Meus Gatos</Title>
      </Header>

      <FlatList
        data={myCats}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <PetCard
            name={item.name}
            breed={item.breed}
            age={item.age}
            isFirst={index === 0}
          />
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* btn q abre o modal */}
      <AddButton activeOpacity={0.8} onPress={() => setModalVisible(true)}>
        <MaterialCommunityIcons name="plus" size={35} color="#FFF" />
      </AddButton>

      {/* componente do modal de cadastro */}
      <AddPetModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={handleAddNewPet}
      />
    </Container>
  );
}
