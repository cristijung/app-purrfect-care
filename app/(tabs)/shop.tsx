import { ProductCard } from "@/components/Shop/ProductCard";
import { theme } from "@/styles/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
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

const Title = styled.Text`
  color: ${(props) => props.theme.colors.primary};
  font-size: 28px;
  font-weight: bold;
`;

const Subtitle = styled.Text`
  color: ${(props) => props.theme.colors.gray};
  font-size: 14px;
  margin-top: 2px;
`;

const PRODUCTS = [
  {
    id: "1",
    name: "Ração Royal Canin Renal",
    price: "199,99",
    category: "Ração",
  },
  {
    id: "2",
    name: "Antipulgas Bravecto",
    price: "145,99",
    category: "Remédios",
  },
  {
    id: "3",
    name: "Areia Sanitária Pipicat",
    price: "42,90",
    category: "Higiene",
  },
  {
    id: "4",
    name: "Vitaminas Gatos Sênior",
    price: "224,99",
    category: "Remédios",
  },
  {
    id: "5",
    name: "Champú Seco",
    price: "99,99",
    category: "Higiene",
  },
];

export default function ShopScreen() {
  const router = useRouter();

  return (
    <Container>
      <Header>
        <View>
          <Title>Pet Shop</Title>
          <Subtitle>Cuidado e saúde para seus pets</Subtitle>
        </View>

        {/* ícone para abrir o modal de carrinho */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.push("/cart")}
        >
          <MaterialCommunityIcons
            name="cart"
            size={30}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      </Header>

      <FlatList
        data={PRODUCTS}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{
          paddingHorizontal: 10,
          paddingBottom: 100,
        }}
        renderItem={({ item }) => (
          <ProductCard
            id={item.id}
            name={item.name}
            price={item.price}
            category={item.category}
            onPress={() => {
              /* no futuro ....: ir para detalhes do produto */
            }}
          />
        )}
      />
    </Container>
  );
}
