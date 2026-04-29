import { MaterialCommunityIcons } from "@expo/vector-icons";
import styled from "styled-components/native";

interface ProductProps {
  name: string;
  price: string; //ver aqui depois
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

const Price = styled.Text`
  color: ${(props) => props.theme.colors.secondary};
  font-size: 16px;
  font-weight: bold;
`;

export function ProductCard({ name, price, category, onPress }: ProductProps) {
  return (
    <Card activeOpacity={0.8} onPress={onPress}>
      <ImagePlaceholder>
        <MaterialCommunityIcons
          name="pill"
          size={40}
          color={
            category === "Remédios"
              ? "rgb(216, 33, 33)" 
              : category === "Higiene"
                ? "rgb(33, 150, 243)" 
                : "rgb(248, 172, 57)" 
          }
        />
      </ImagePlaceholder>
      <ProductName numberOfLines={2}>{name}</ProductName>
      <Price>R$ {price}</Price>
    </Card>
  );
}
