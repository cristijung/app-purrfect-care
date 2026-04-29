import { useCartStore } from "@/store/cartStore";
import { theme } from "@/styles/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import * as SQLite from "expo-sqlite";
import React from "react";
import { Alert, FlatList, TouchableOpacity } from "react-native";
import styled from "styled-components/native";

const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.colors.background};
`;

const CartItem = styled.View`
  background-color: ${(props) => props.theme.colors.surface};
  padding: 15px;
  border-radius: 12px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 5px 20px;
  border: 1px solid ${(props) => props.theme.colors.primary}15;
`;

const ItemInfo = styled.View`
  flex: 1;
`;

const ItemName = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

const ItemPrice = styled.Text`
  color: ${(props) => props.theme.colors.secondary};
  margin-top: 4px;
`;

const QuantityContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

const QtyText = styled.Text`
  color: white;
  font-size: 14px;
  font-weight: bold;
`;

const Footer = styled.View`
  padding: 20px;
  background-color: ${(props) => props.theme.colors.surface};
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;
  elevation: 10;
  shadow-color: #000;
  shadow-offset: 0px -2px;
  shadow-opacity: 0.3;
  shadow-radius: 4px;
`;

const TotalText = styled.Text`
  color: white;
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
`;

const CheckoutButton = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.colors.primary};
  padding: 18px;
  border-radius: 15px;
  align-items: center;
`;

const ButtonText = styled.Text`
  color: white;
  font-weight: bold;
  font-size: 18px;
`;

const EmptyContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const EmptyText = styled.Text`
  color: ${(props) => props.theme.colors.gray};
  font-size: 16px;
  margin-top: 10px;
  text-align: center;
`;

export default function CartModal() {
  const { items, removeItem, clearCart } = useCartStore();
  const router = useRouter();

  // cálculo do total: garante que trata corretamente vírgulas e pontos
  const total = items.reduce((acc, item) => {
    const priceValue = parseFloat(
      item.price.replace(".", "").replace(",", "."),
    );
    return acc + priceValue * item.quantity;
  }, 0);

  const handleCheckout = async () => {
    if (items.length === 0) return;

    try {
      // abre o banco de dados
      const db = await SQLite.openDatabaseAsync("purrfectcare.db");

      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS orders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          product_names TEXT NOT NULL,
          total_price REAL NOT NULL,
          date TEXT NOT NULL
        );
      `);

      const productNames = items
        .map((i) => `${i.quantity}x ${i.name}`)
        .join(", ");
      const date = new Date().toLocaleDateString("pt-BR");

      // insere o pedido
      await db.runAsync(
        "INSERT INTO orders (product_names, total_price, date) VALUES (?, ?, ?)",
        [productNames, total, date],
      );

      // aqui o alert p depois trocar por um toast
      Alert.alert("Sucesso!", "Sua compra foi registada no histórico.");
      clearCart();
      router.back();
    } catch (error) {
      console.error("Erro no SQLite:", error);
      Alert.alert(
        "Erro",
        "Não foi possível guardar o seu pedido no banco de dados.",
      );
    }
  };

  return (
    <Container>
      <Stack.Screen
        options={{
          title: "Seu Carrinho",
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.primary,
          headerTitleStyle: { fontWeight: "bold" },
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <MaterialCommunityIcons
                name="chevron-down"
                size={30}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <FlatList
        data={items}
        keyExtractor={(item, index) =>
          item.id ? item.id.toString() : index.toString()
        }
        renderItem={({ item }) => (
          <CartItem>
            <ItemInfo>
              <ItemName>{item.name}</ItemName>
              <ItemPrice>R$ {item.price}</ItemPrice>
            </ItemInfo>
            <QuantityContainer>
              <QtyText>{item.quantity} un</QtyText>
              <TouchableOpacity onPress={() => removeItem(item.id)}>
                <MaterialCommunityIcons
                  name="trash-can-outline"
                  size={22}
                  color="#FF5555"
                />
              </TouchableOpacity>
            </QuantityContainer>
          </CartItem>
        )}
        ListEmptyComponent={
          <EmptyContainer>
            <MaterialCommunityIcons name="cart-off" size={80} color="#333" />
            <EmptyText>
              Seu carrinho está vazio.{"\n"}Que tal uns mimos para os seus
              gatos?
            </EmptyText>
          </EmptyContainer>
        }
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 20 }}
      />

      {items.length > 0 && (
        <Footer>
          <TotalText>
            Total: R${" "}
            {total.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </TotalText>
          <CheckoutButton activeOpacity={0.8} onPress={handleCheckout}>
            <ButtonText>Finalizar Compra</ButtonText>
          </CheckoutButton>
        </Footer>
      )}
    </Container>
  );
}
