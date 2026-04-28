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

// Interface para o objeto do gato
interface Cat {
  id: string;
  name: string;
  breed: string;
  age: string;
}

export default function TabTwoScreen() {
  const [isModalVisible, setModalVisible] = useState(false);

  // Estado para saber qual gato estamos editando (null se for um novo)
  const [selectedCat, setSelectedCat] = useState<Cat | null>(null);

  const [myCats, setMyCats] = useState<Cat[]>([
    { id: "1", name: "Seth", breed: "SRD", age: "6 anos" },
    { id: "2", name: "Grogu", breed: "SRD", age: "5 anos" },
    { id: "3", name: "Mina", breed: "SRD", age: "4 anos" },
    { id: "4", name: "Kirara", breed: "SRD", age: "3 anos" },
    { id: "5", name: "Frajola", breed: "SRD", age: "8 anos" },
    { id: "6", name: "Mafalda", breed: "Siamês", age: "18 anos" },
  ]);

  // Função para abrir o modal em modo de criação
  const handleOpenAddModal = () => {
    setSelectedCat(null);
    setModalVisible(true);
  };

  // Função para abrir o modal em modo de edição
  const handleOpenEditModal = (cat: Cat) => {
    setSelectedCat(cat);
    setModalVisible(true);
  };

  const handleSavePet = (name: string, breed: string, age: string) => {
    if (selectedCat) {
      // MODO EDIÇÃO: Atualiza o gato existente
      setMyCats((current) =>
        current.map((cat) =>
          cat.id === selectedCat.id ? { ...cat, name, breed, age } : cat,
        ),
      );
    } else {
      // MODO CRIAÇÃO: Adiciona novo gato
      const newPet = { id: Math.random().toString(), name, breed, age };
      setMyCats((current) => [newPet, ...current]);
    }
    setModalVisible(false);
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
            onPress={() => handleOpenEditModal(item)} // Ao clicar no card, edita
          />
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <AddButton activeOpacity={0.8} onPress={handleOpenAddModal}>
        <MaterialCommunityIcons name="plus" size={35} color="#FFF" />
      </AddButton>

      <AddPetModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={handleSavePet}
        initialData={selectedCat} // Passamos os dados do gato para o modal
      />
    </Container>
  );
}
