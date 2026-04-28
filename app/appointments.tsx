import { theme } from "@/styles/theme";
import { Stack } from "expo-router";
import React from "react";
import { FlatList } from "react-native";
import styled from "styled-components/native";
import { AppointmentCard } from "./../components/Pets/AppointmentCard";

interface Appointment {
  id: string;
  petName: string;
  service: string;
  date: string;
  time: string;
  status: "confirmed" | "pending" | "completed";
}

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${(props) => props.theme.colors.background};
`;

const APPOINTMENTS: Appointment[] = [
  {
    id: "1",
    petName: "Seth",
    service: "Vacinação Anual",
    date: "15/05",
    time: "14:30",
    status: "confirmed",
  },
  {
    id: "2",
    petName: "Grogu",
    service: "Check-up",
    date: "20/05",
    time: "11:30",
    status: "pending",
  },
  {
    id: "3",
    petName: "Mina",
    service: "Ecografia",
    date: "08/05",
    time: "15:00",
    status: "confirmed",
  },
  {
    id: "4",
    petName: "Kirara",
    service: "Limpeza de Tártaro",
    date: "24/05",
    time: "17:30",
    status: "pending",
  },
];

export default function AppointmentScreen() {
  return (
    <Container>
      <Stack.Screen
        options={{
          title: "Minha Agenda",
          headerShown: true,
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.secondary,
        }}
      />
      
      <FlatList
        data={APPOINTMENTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AppointmentCard
            petName={item.petName}
            service={item.service}
            date={item.date}
            time={item.time}
            status={item.status}
          />
        )}
        contentContainerStyle={{
          paddingVertical: 20,
          paddingHorizontal: 16, 
          flexGrow: 1,
        }}
      />
    </Container>
  );
}
