import { useCartStore } from "@/store/cartStore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import styled from "styled-components/native";

interface ProductProps {
  id: string;
  name: string;
  price: string; // ver aqui depois
  category: string;
  onPress?: () => void;
}

const Card = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.colors.surface};
  width: 46%;
  margin: 2%;
  padding: 15px;
  border-radius: 15px;
  border: 1px solid ${(props) => props.theme.colors.primary}20;
`;

const ImagePlaceholder = styled.View`
  height: 100px;
  background-color: ${(props) => props.theme.colors.background};
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
`;

const ProductName = styled.Text`
  color: ${(props) => props.theme.colors.white};
  font-size: 14px;
  font-weight: bold;
`;

const Footer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
`;

const Price = styled.Text`
  color: ${(props) => props.theme.colors.secondary};
  font-size: 16px;
  font-weight: bold;
`;

const AddToCartButton = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.colors.primary};
  width: 32px;
  height: 32px;
  border-radius: 16px;
  justify-content: center;
  align-items: center;
`;

export function ProductCard({
  id,
  name,
  price,
  category,
  onPress,
}: ProductProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    // feedback: vibração leve de sucesso
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // add na store do Zustand
    addItem({ id, name, price });
  };

  const categoryColors: Record<string, string> = {
    Remédios: "rgb(216, 33, 33)",
    Higiene: "rgb(33, 150, 243)",
    Ração: "rgb(248, 172, 57)",
  };

  const iconColor = categoryColors[category] || "rgb(248, 172, 57)";

  return (
    <Card activeOpacity={0.8} onPress={onPress}>
      <ImagePlaceholder>
        <MaterialCommunityIcons
          name={
            category === "Remédios"
              ? "pill"
              : category === "Higiene"
                ? "shower"
                : "food-apple"
          }
          size={40}
          color={iconColor}
        />
      </ImagePlaceholder>

      <ProductName numberOfLines={2}>{name}</ProductName>

      <Footer>
        <Price>R$ {price}</Price>
        <AddToCartButton onPress={handleAddToCart}>
          <MaterialCommunityIcons name="cart-plus" size={18} color="white" />
        </AddToCartButton>
      </Footer>
    </Card>
  );
}
