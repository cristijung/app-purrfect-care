import { useCartStore } from "@/store/cartStore";
import { theme } from "@/styles/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  // pega a lista de itens do carrinho
  const cartItems = useCartStore((state) => state.items);

  // calcular o total de itens --> quantidades
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.gray,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: `${theme.colors.primary}20`,
          paddingBottom: 5,
          height: 60,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" size={28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="two"
        options={{
          title: "Pets",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="cat" size={28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="shop"
        options={{
          title: "Loja",
          // configura o badge dinâmico
          tabBarBadge: totalItems > 0 ? totalItems : undefined,
          tabBarBadgeStyle: {
            backgroundColor: theme.colors.secondary,
            color: "white",
            fontSize: 12,
          },
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="basket" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
