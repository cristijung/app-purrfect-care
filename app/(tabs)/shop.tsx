import { ProductCard } from "@/components/Shop/ProductCard";
import React from "react";
import { FlatList } from "react-native";
import styled from "styled-components/native";

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${(props) => props.theme.colors.background};
  justify-content: center;
  align-items: center;
`;

const Header = styled.View`
  padding: 20px;
`;

const Title = styled.Text`
  color: ${(props) => props.theme.colors.primary};
  font-size: 28px;
  font-weight: bold;
`;

const Subtitle = styled.Text`
  color: ${(props) => props.theme.colors.gray};
  font-size: 14px;
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
    price: "145.99",
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
    name: "Vitaminas Gatos Sênios",
    price: "224,99",
    category: "Remédios",
  },
  { id: "5", name: "Champú Seco", price: "99,99", category: "Higiene" },
  {
    id: "6",
    name: "Ração úmida Royal Canin",
    price: "59,99",
    category: "Ração",
  },
];

export default function ShopScreen() {
  return (
    <Container>
      <Header>
        <Title>Pet Shop</Title>
        <Subtitle>Produtos selecionados para o bem-estar felino</Subtitle>
      </Header>

      <FlatList
        data={PRODUCTS}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 100 }}
        renderItem={({ item }) => (
          <ProductCard
            name={item.name}
            price={item.price}
            category={item.category}
          />
        )}
      />
    </Container>
  );
}
