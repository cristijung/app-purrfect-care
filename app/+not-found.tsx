import { Link, Stack } from "expo-router";
import styled from "styled-components/native";

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: ${(props) => props.theme.colors.background};
`;

const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${(props) => props.theme.colors.text};
`;

const LinkText = styled.Text`
  font-size: 14px;
  color: ${(props) => props.theme.colors.primary};
  margin-top: 15px;
  text-decoration: underline;
`;

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <Container>
        <Title>Essa tela não existe.</Title>

        <Link href="/">
          <LinkText>Voltar para a tela inicial</LinkText>
        </Link>
      </Container>
    </>
  );
}
