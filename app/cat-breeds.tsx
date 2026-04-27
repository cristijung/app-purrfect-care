import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList } from "react-native";
import styled from "styled-components/native";
import { BreedCard } from "../components/Pets/BreedCard";
import { getCatBreeds } from "../services/catApi";
import { theme } from "../styles/theme";

interface CatBreed {
  id: string;
  name: string;
  origin: string;
  temperament: string;
  reference_image_id?: string;
}

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${(props) => props.theme.colors.background};
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.colors.background};
`;

export default function CatBreedsScreen() {
  // tipando o estado como um array de CatBreed
  const [breeds, setBreeds] = useState<CatBreed[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBreeds() {
      try {
        const data = await getCatBreeds();
        setBreeds(data);
      } catch (error) {
        console.error("Erro ao carregar raças:", error);
      } finally {
        setLoading(false);
      }
    }

    loadBreeds();
  }, []);

  return (
    <Container>
      {/* configuração do Header da Stack para manter a identidade visual */}
      <Stack.Screen
        options={{
          title: "Explorar Raças",
          headerShown: true,
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.primary,
          headerShadowVisible: false, // aqui removemos a linha feia do header no Android
        }}
      />

      {loading ? (
        <LoadingContainer>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </LoadingContainer>
      ) : (
        <FlatList
          data={breeds}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <BreedCard
              name={item.name}
              origin={item.origin}
              temperament={item.temperament}
              // montando da URL da imagem usando o ID de referência da API
              imageUri={
                item.reference_image_id
                  ? `https://cdn2.thecatapi.com/images/${item.reference_image_id}.jpg`
                  : undefined
              }
            />
          )}
          contentContainerStyle={{ paddingVertical: 10 }}
        />
      )}
    </Container>
  );
}
