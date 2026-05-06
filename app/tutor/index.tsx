import { auth } from "@/config/firebaseConfig";
import { theme } from "@/styles/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import styled from "styled-components/native";

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${(props) => props.theme.colors.background};
`;

const Header = styled.View`
  padding: 20px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
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
`;

const EmptyText = styled.Text`
  color: ${(props) => props.theme.colors.gray};
  text-align: center;
  margin-top: 10px;
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
  const user = auth.currentUser;

  const loadPets = async () => {
    if (!user) return;
    try {
      setLoading(true);
      // busca apenas os pets vinculados ao UID do tutor logado
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

  // recarrega sempre que a tela ganha foco (ex: ao voltar do cadastro de pet)
  useFocusEffect(
    useCallback(() => {
      loadPets();
    }, []),
  );

  return (
    <Container>
      <Stack.Screen options={{ headerShown: false }} />

      <Header>
        <View>
          <WelcomeText>Olá, {user?.email?.split("@")[0]}! 👋</WelcomeText>
          <Subtitle>Gerencie os seus patudos</Subtitle>
        </View>
        <MaterialCommunityIcons
          name="account-circle"
          size={40}
          color={theme.colors.primary}
          onPress={() => auth.signOut().then(() => router.replace("/"))}
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
            <PetCard
              onPress={() => {
                /* aqui futura tela de detalhes */
              }}
            >
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
                  {item.species} • {item.breed || "Raça não definida"}
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
              <EmptyText>
                Ainda não registou nenhum pet. Toque no + para começar!
              </EmptyText>
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
