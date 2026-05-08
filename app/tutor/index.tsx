import { auth } from "@/config/firebaseConfig";
import { theme } from "@/styles/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, Modal, View } from "react-native";
import styled from "styled-components/native";
import Constants from 'expo-constants';

// --- ESTILOS ---
const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${(props) => props.theme.colors.background};
`;

const Header = styled.View`
  padding: 20px;
  /* Isso soma o tamanho da barra de status + um respiro de 10px */
  padding-top: ${Constants.statusBarHeight + 10}px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) =>
    props.theme.colors.background}; /* Garante que o fundo cubra tudo */
`;

const WelcomeText = styled.Text`
  color: white;
  font-size: 22px;
  font-weight: bold;
`;

const Subtitle = styled.Text`
  color: ${(props) => props.theme.colors.gray};
  font-size: 14px;
`;

const PetCard = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.colors.surface};
  margin: 0 20px 12px 20px;
  padding: 15px;
  border-radius: 16px;
  flex-direction: row;
  align-items: center;
  border: 1px solid ${(props) => props.theme.colors.primary}20;
`;

const PetImage = styled.Image`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  background-color: ${(props) => props.theme.colors.primary}40;
`;

const PetInfo = styled.View`
  flex: 1;
  margin-left: 15px;
`;

const PetName = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: bold;
`;

const PetBreed = styled.Text`
  color: ${(props) => props.theme.colors.gray};
  font-size: 13px;
`;

const SyncIndicator = styled.View<{ synced: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${(props) => (props.synced ? "#03DAC6" : "#FFB74D")};
`;

const Fab = styled.TouchableOpacity`
  position: absolute;
  right: 20px;
  bottom: 20px;
  background-color: ${(props) => props.theme.colors.secondary};
  width: 60px;
  height: 60px;
  border-radius: 30px;
  justify-content: center;
  align-items: center;
  elevation: 5;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
`;

const EmptyState = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 40px;
  margin-top: 50px;
`;

const EmptyText = styled.Text`
  color: ${(props) => props.theme.colors.gray};
  text-align: center;
  margin-top: 10px;
`;

// --- ESTILOS DO MODAL MENU ---
const ModalOverlay = styled.Pressable`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.6);
  justify-content: flex-start;
  align-items: flex-end;
  padding-top: 60px;
  padding-right: 20px;
`;

const MenuContent = styled.View`
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: 20px;
  padding: 8px;
  width: 240px;
  border: 1px solid ${(props) => props.theme.colors.primary}40;
  elevation: 20;
`;

const MenuItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 16px;
  border-bottom-width: 0.5px;
  border-bottom-color: ${(props) => props.theme.colors.gray}30;
`;

const MenuText = styled.Text`
  color: white;
  margin-left: 12px;
  font-size: 16px;
  font-weight: 500;
`;

interface Pet {
  id: number;
  name: string;
  species: string;
  breed: string;
  photo: string | null;
  synced: number;
}

export default function TutorDashboard() {
  const router = useRouter();
  const db = useSQLiteContext();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const user = auth.currentUser;

  const loadPets = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const allRows = await db.getAllAsync<Pet>(
        "SELECT * FROM pets WHERE firebase_uid = ? ORDER BY id DESC",
        [user.uid],
      );
      setPets(allRows);
    } catch (error) {
      console.error("Erro ao carregar pets:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadPets();
    }, []),
  );

  const handleLogout = async () => {
    setMenuVisible(false);
    await auth.signOut();
    router.replace("/");
  };

  return (
    <Container>
      <Stack.Screen options={{ headerShown: false }} />

      {/* MENU MODAL ESTILIZADO */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <ModalOverlay onPress={() => setMenuVisible(false)}>
          <MenuContent>
            <MenuItem
              onPress={() => {
                setMenuVisible(false);
                router.push("/(tabs)");
              }}
            >
              <MaterialCommunityIcons
                name="home-export-outline"
                size={24}
                color={theme.colors.primary}
              />
              <MenuText>Voltar à Home Rosa</MenuText>
            </MenuItem>

            <MenuItem onPress={handleLogout}>
              <MaterialCommunityIcons name="logout" size={24} color="#FF5252" />
              <MenuText style={{ color: "#FF5252" }}>Sair da Conta</MenuText>
            </MenuItem>
          </MenuContent>
        </ModalOverlay>
      </Modal>

      <Header>
        <View>
          <WelcomeText>Olá, {user?.email?.split("@")[0]}! 👋</WelcomeText>
          <Subtitle>Gerencie os seus patudos</Subtitle>
        </View>
        <MaterialCommunityIcons
          name="account-circle"
          size={45}
          color={theme.colors.primary}
          onPress={() => setMenuVisible(true)}
        />
      </Header>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
          style={{ flex: 1 }}
        />
      ) : (
        <FlatList
          data={pets}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <PetCard onPress={() => {}}>
              {item.photo ? (
                <PetImage source={{ uri: item.photo }} />
              ) : (
                <View
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    backgroundColor: theme.colors.surface,
                    justifyContent: "center",
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: theme.colors.primary + "40",
                  }}
                >
                  <MaterialCommunityIcons
                    name={item.species === "Cão" ? "dog" : "cat"}
                    size={30}
                    color={theme.colors.primary}
                  />
                </View>
              )}

              <PetInfo>
                <PetName>{item.name}</PetName>
                <PetBreed>
                  {item.species} • {item.breed || "Sem raça"}
                </PetBreed>
              </PetInfo>

              <SyncIndicator synced={item.synced === 1} />
            </PetCard>
          )}
          ListEmptyComponent={
            <EmptyState>
              <MaterialCommunityIcons
                name="paw-off"
                size={60}
                color={theme.colors.surface}
              />
              <EmptyText>Ainda não registou nenhum pet. Toque no +!</EmptyText>
            </EmptyState>
          }
        />
      )}

      <Fab onPress={() => router.push("/tutor/add-pet")}>
        <MaterialCommunityIcons name="plus" size={32} color="white" />
      </Fab>
    </Container>
  );
}
