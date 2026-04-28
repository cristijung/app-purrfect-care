import { theme } from "@/styles/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styled from "styled-components/native";

interface AppointmentProps {
  petName: string;
  service: string;
  date: string;
  time: string;
  status: "confirmed" | "pending" | "completed";
}

const Card = styled.View`
  background-color: ${(props) => props.theme.colors.surface};
  margin: 8px 20px;
  padding: 16px;
  border-radius: 15px;
  flex-direction: row;
  align-items: center;
  border-left-width: 4px;
  border-left-color: ${(props) => props.theme.colors.secondary};
`;

const DateBox = styled.View`
  align-items: center;
  justify-content: center;
  padding-right: 15px;
  border-right-width: 1px;
  border-right-color: ${(props) => props.theme.colors.background};
`;

const TimeText = styled.Text`
  color: ${(props) => props.theme.colors.secondary};
  font-weight: bold;
  font-size: 14px;
`;

const Info = styled.View`
  flex: 1;
  padding-left: 15px;
`;

const PetName = styled.Text`
  color: ${(props) => props.theme.colors.white};
  font-size: 18px;
  font-weight: bold;
`;

const Service = styled.Text`
  color: ${(props) => props.theme.colors.gray};
  font-size: 14px;
`;

export function AppointmentCard({
  petName,
  service,
  date,
  time,
  status,
}: AppointmentProps) {
  return (
    <Card>
      <DateBox>
        <MaterialCommunityIcons name="clock-outline" size={20} color="#fff" />
        <TimeText>{time}</TimeText>
      </DateBox>
      <Info>
        <PetName>{petName}</PetName>
        <Service>
          {service} - {date}
        </Service>
      </Info>

      <MaterialCommunityIcons
        name={status === "completed" ? "check-circle" : "alert-circle"}
        size={24}
        color={status === "confirmed" ? "#4caf50" : theme.colors.accent}
      />
    </Card>
  );
}
