import React, { useEffect, useState } from "react";
import { Alert, Modal } from "react-native";
import styled from "styled-components/native";

// interface do objeto Cat
interface Cat {
  id: string;
  name: string;
  breed: string;
  age: string;
}

// interface das props do modal
interface AddPetModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (name: string, breed: string, age: string) => void;
  initialData?: Cat | null;
}

const ModalContainer = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.8); /* Fundo escuro com transparência */
  justify-content: center;
  padding: 20px;
`;

const FormCard = styled.View`
  background-color: ${(props) => props.theme.colors.surface};
  padding: 25px;
  border-radius: 20px;
  border: 1px solid ${(props) => props.theme.colors.primary}50;
`;

const Title = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: 20px;
  text-align: center;
`;

const Input = styled.TextInput.attrs((props) => ({
  placeholderTextColor: props.theme.colors.gray,
}))`
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.white};
  padding: 12px 15px;
  border-radius: 10px;
  margin-bottom: 15px;
  border: 1px solid ${(props) => props.theme.colors.surface};
`;

const ButtonGroup = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 10px;
`;

const ActionButton = styled.TouchableOpacity<{ isCancel?: boolean }>`
  background-color: ${(props) =>
    props.isCancel ? "transparent" : props.theme.colors.primary};
  padding: 12px;
  border-radius: 10px;
  width: 48%;
  align-items: center;
`;

const ButtonText = styled.Text`
  color: white;
  font-weight: bold;
`;

export function AddPetModal({
  visible,
  onClose,
  onAdd,
  initialData,
}: AddPetModalProps) {
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");

  // sincronizando com os inputs sempre q o modal abre ou o gato selecionado muda
  useEffect(() => {
    if (visible) {
      if (initialData) {
        setName(initialData.name);
        setBreed(initialData.breed);
        setAge(initialData.age);
      } else {
        // limpando p novo cadastro
        setName("");
        setBreed("");
        setAge("");
      }
    }
  }, [visible, initialData]);

  const handleSave = () => {
    if (!name.trim() || !breed.trim() || !age.trim()) {
      Alert.alert(
        "Campos vazios",
        "Por favor, preencha todas as informações do gatinho.",
      );
      return;
    }

    onAdd(name, breed, age);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <ModalContainer>
        <FormCard>
          <Title>{initialData ? "Editar Gatinho" : "Novo Gatinho"}</Title>

          <Input
            placeholder="Nome do pet"
            value={name}
            onChangeText={setName}
          />
          <Input
            placeholder="Raça (ex: SRD)"
            value={breed}
            onChangeText={setBreed}
          />
          <Input
            placeholder="Idade (ex: 2 anos)"
            value={age}
            onChangeText={setAge}
            keyboardType="default"
          />

          <ButtonGroup>
            <ActionButton isCancel onPress={onClose}>
              <ButtonText style={{ color: "#999" }}>Cancelar</ButtonText>
            </ActionButton>

            <ActionButton onPress={handleSave}>
              <ButtonText>{initialData ? "Salvar" : "Adicionar"}</ButtonText>
            </ActionButton>
          </ButtonGroup>
        </FormCard>
      </ModalContainer>
    </Modal>
  );
}
