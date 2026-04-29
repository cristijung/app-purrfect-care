import { AddPetModal } from "@/components/Pets/AddPetModal";
import { PetCard } from "@/components/Pets/PetsCard";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList } from "react-native";
import styled from "styled-components/native";

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${(props) => props.theme.colors.background};
`;

const Header = styled.View`
  padding: 20px;
  padding-bottom: 5px;
`;

const Title = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: ${(props) => props.theme.colors.primary};
`;

const InstructionRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 8px;
  padding: 8px 12px;
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: 8px;
  align-self: flex-start;
`;

const InstructionText = styled.Text`
  font-size: 12px;
  color: ${(props) => props.theme.colors.gray};
  margin-left: 6px;
`;

const Highlight = styled.Text`
  color: ${(props) => props.theme.colors.secondary};
  font-weight: bold;
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

interface Cat {
  id: string;
  name: string;
  breed: string;
  age: string;
}

export default function TabTwoScreen() {
  const router = useRouter();
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedCat, setSelectedCat] = useState<Cat | null>(null);

  const [myCats, setMyCats] = useState<Cat[]>([
    { id: "1", name: "Seth", breed: "SRD", age: "6 anos" },
    { id: "2", name: "Grogu", breed: "SRD", age: "5 anos" },
    { id: "3", name: "Mina", breed: "SRD", age: "4 anos" },
    { id: "4", name: "Kirara", breed: "SRD", age: "3 anos" },
    { id: "5", name: "Frajola", breed: "SRD", age: "8 anos" },
    { id: "6", name: "Mafalda", breed: "Siamês", age: "18 anos" },
  ]);

  const handleOpenAddModal = () => {
    setSelectedCat(null);
    setModalVisible(true);
  };

  const handleOpenEditModal = (cat: Cat) => {
    setSelectedCat(cat);
    setModalVisible(true);
  };

  const handleSavePet = (name: string, breed: string, age: string) => {
    if (selectedCat) {
      setMyCats((current) =>
        current.map((cat) =>
          cat.id === selectedCat.id ? { ...cat, name, breed, age } : cat,
        ),
      );
    } else {
      const newPet = { id: Math.random().toString(), name, breed, age };
      setMyCats((current) => [newPet, ...current]);
    }
    setModalVisible(false);
  };

  const handleViewDetails = (cat: Cat) => {
    router.push({
      pathname: "/pet/[id]",
      params: {
        id: cat.id,
        name: cat.name,
        breed: cat.breed,
        age: cat.age,
      },
    });
  };

  return (
    <Container>
      <Header>
        <Title>Meus Gatos</Title>

        {/* Feedback visual para o usuário */}
        <InstructionRow>
          <MaterialCommunityIcons
            name="gesture-tap-hold"
            size={16}
            color={myCats.length > 0 ? "#FF9500" : "#999"}
          />
          <InstructionText>
            Toque para <Highlight>ver</Highlight> ou segure para{" "}
            <Highlight>editar</Highlight>
          </InstructionText>
        </InstructionRow>
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
            onPress={() => handleViewDetails(item)}
            onLongPress={() => handleOpenEditModal(item)}
          />
        )}
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
      />

      <AddButton activeOpacity={0.8} onPress={handleOpenAddModal}>
        <MaterialCommunityIcons name="plus" size={35} color="#FFF" />
      </AddButton>

      <AddPetModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={handleSavePet}
        initialData={selectedCat}
      />
    </Container>
  );
}
