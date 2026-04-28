import React, { useState } from 'react';
import { Modal, Alert } from 'react-native';
import styled from 'styled-components/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ModalContainer = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.background}EE; /* fundo semi-transparente */
  justify-content: center;
  padding: 20px;
`;

const FormCard = styled.View`
  background-color: ${props => props.theme.colors.surface};
  padding: 25px;
  border-radius: 20px;
  border: 1px solid ${props => props.theme.colors.primary}50;
`;

const Title = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 20px;
  text-align: center;
`;

const Input = styled.TextInput.attrs(props => ({
  placeholderTextColor: props.theme.colors.gray
}))`
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.white};
  padding: 12px 15px;
  border-radius: 10px;
  margin-bottom: 15px;
  border: 1px solid ${props => props.theme.colors.surface};
`;

const ButtonGroup = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 10px;
`;

const ActionButton = styled.TouchableOpacity<{ isCancel?: boolean }>`
  background-color: ${props => props.isCancel ? 'transparent' : props.theme.colors.primary};
  padding: 12px;
  border-radius: 10px;
  width: 48%;
  align-items: center;
`;

const ButtonText = styled.Text`
  color: white;
  font-weight: bold;
`;

interface AddPetModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (name: string, breed: string, age: string) => void;
}

export function AddPetModal({ visible, onClose, onAdd }: AddPetModalProps) {
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');

  const handleSave = () => {
    if (!name || !breed || !age) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }
    onAdd(name, breed, age);
    setName(''); setBreed(''); setAge('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <ModalContainer>
        <FormCard>
          <Title>Novo Membro da Família</Title>
          <Input placeholder="Nome do Gato" value={name} onChangeText={setName} />
          <Input placeholder="Raça (ex: SRD)" value={breed} onChangeText={setBreed} />
          <Input placeholder="Idade (ex: 2 anos)" value={age} onChangeText={setAge} />
          
          <ButtonGroup>
            <ActionButton isCancel onPress={onClose}>
              <ButtonText style={{ color: '#999' }}>Cancelar</ButtonText>
            </ActionButton>
            <ActionButton onPress={handleSave}>
              <ButtonText>Adicionar</ButtonText>
            </ActionButton>
          </ButtonGroup>
        </FormCard>
      </ModalContainer>
    </Modal>
  );
}