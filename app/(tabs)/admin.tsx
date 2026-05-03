import { theme } from "@/styles/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import * as SQLite from "expo-sqlite";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import styled from "styled-components/native";

// importamos o serviço de sincronização que acabamos de criar
import { syncAppointmentsWithFirebase } from "@/services/syncServices";

// --- estilização --> mantendo seu padrão de Styled Components ---

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

const StatsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  padding: 10px;
  justify-content: space-between;
`;

const StatCard = styled.View`
  background-color: ${(props) => props.theme.colors.surface};
  width: 48%;
  padding: 15px;
  border-radius: 15px;
  margin-bottom: 12px;
  border: 1px solid ${(props) => props.theme.colors.primary}20;
  align-items: center;
`;

const StatNumber = styled.Text`
  color: white;
  font-size: 22px;
  font-weight: bold;
`;

const StatLabel = styled.Text`
  color: ${(props) => props.theme.colors.gray};
  font-size: 10px;
  text-transform: uppercase;
  margin-top: 4px;
`;

const SectionTitle = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: bold;
  margin: 10px 20px;
`;

const ActivityCard = styled.View`
  background-color: ${(props) => props.theme.colors.surface};
  margin: 0 20px 10px 20px;
  padding: 15px;
  border-radius: 12px;
  flex-direction: row;
  align-items: center;
`;

const IconBox = styled.View<{ color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: ${(props) => props.color}20;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
`;

const ActivityInfo = styled.View`
  flex: 1;
`;

const ActivityName = styled.Text`
  color: white;
  font-weight: bold;
`;

const ActivityDetail = styled.Text`
  color: ${(props) => props.theme.colors.gray};
  font-size: 12px;
`;

const Fab = styled.TouchableOpacity`
  position: absolute;
  right: 20px;
  bottom: 20px;
  background-color: ${(props) => props.theme.colors.primary};
  width: 56px;
  height: 56px;
  border-radius: 28px;
  justify-content: center;
  align-items: center;
  elevation: 5;
`;

// badge que indica se o registro está na nuvem ou apenas no celular
const SyncBadge = styled.View<{ synced: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: ${(props) => (props.synced ? "#03DAC6" : "#FFB74D")};
  margin-left: 10px;
`;

// --- interface de dados ---

interface Appointment {
  id: number;
  pet_name: string;
  owner_name: string;
  type: string;
  date: string;
  synced: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [counts, setCounts] = useState({
    consultas: 0,
    exames: 0,
    cirurgias: 0,
  });
  const [isSyncing, setIsSyncing] = useState(false);

  /**
   * Fn p carregar dados do SQLite e disparar sincronização
   */
  const loadData = async () => {
    try {
      const db = await SQLite.openDatabaseAsync("purrfectcare.db");

      // antes de ler, tentamos sincronizar o que estiver pendente
      setIsSyncing(true);
      await syncAppointmentsWithFirebase();
      setIsSyncing(false);

      // garantindo que a tabela exista --> padrão de segurança adotado
      await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS appointments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          remote_id TEXT,
          pet_name TEXT NOT NULL,
          owner_name TEXT NOT NULL,
          type TEXT NOT NULL,
          date TEXT NOT NULL,
          status TEXT DEFAULT 'Agendado',
          synced INTEGER DEFAULT 0
        );
      `);

      // buscando todos os registros para exibir na tela
      const allRows = await db.getAllAsync<Appointment>(
        "SELECT * FROM appointments ORDER BY id DESC",
      );

      setAppointments(allRows);

      // calculando as estatísticas para os cards superiores
      const consultas = allRows.filter((a) => a.type === "Consulta").length;
      const exames = allRows.filter((a) => a.type === "Exame").length;
      const cirurgias = allRows.filter((a) => a.type === "Cirurgia").length;

      setCounts({ consultas, exames, cirurgias });
    } catch (error) {
      console.error("Erro no AdminDashboard:", error);
      setIsSyncing(false);
    }
  };

  /**
   * useFocusEffect garante que os dados recarreguem sempre que
   * o usuário voltar para esta aba (ex: após cadastrar um novo pet)
   */
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

  const getIconConfig = (type: string) => {
    switch (type) {
      case "Consulta":
        return { icon: "stethoscope", color: "#BB86FC" };
      case "Exame":
        return { icon: "test-tube", color: "#03DAC6" };
      case "Cirurgia":
        return { icon: "knife", color: "#CF6679" };
      default:
        return { icon: "calendar", color: theme.colors.gray };
    }
  };

  return (
    <Container>
      <Stack.Screen options={{ headerShown: false }} />

      <Header>
        <View>
          <Title>Painel Admin</Title>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <ActivityDetail>Gestão Híbrida </ActivityDetail>
            {isSyncing && (
              <ActivityIndicator
                size="small"
                color={theme.colors.primary}
                style={{ marginLeft: 5 }}
              />
            )}
          </View>
        </View>
        <MaterialCommunityIcons
          name="shield-check"
          size={32}
          color={theme.colors.primary}
        />
      </Header>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <StatsGrid>
          <StatCard>
            <StatNumber>{counts.consultas}</StatNumber>
            <StatLabel>Consultas</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{counts.exames}</StatNumber>
            <StatLabel>Exames</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{counts.cirurgias}</StatNumber>
            <StatLabel>Cirurgias</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{appointments.length}</StatNumber>
            <StatLabel>Total Geral</StatLabel>
          </StatCard>
        </StatsGrid>

        <SectionTitle>Agenda Recente</SectionTitle>

        {appointments.map((item) => {
          const config = getIconConfig(item.type);
          return (
            <ActivityCard key={item.id.toString()}>
              <IconBox color={config.color}>
                <MaterialCommunityIcons
                  name={config.icon as any}
                  size={22}
                  color={config.color}
                />
              </IconBox>
              <ActivityInfo>
                <ActivityName>
                  {item.pet_name} ({item.type})
                </ActivityName>
                <ActivityDetail>
                  {item.date} • {item.owner_name}
                </ActivityDetail>
              </ActivityInfo>

              {/* círculo visual: Verde = Sincronizado | Laranja = Local */}
              <SyncBadge synced={item.synced === 1} />
            </ActivityCard>
          );
        })}

        {appointments.length === 0 && (
          <ActivityDetail style={{ textAlign: "center", marginTop: 40 }}>
            Nenhum agendamento encontrado localmente.
          </ActivityDetail>
        )}
      </ScrollView>

      {/* btn de ação para cadastrar novo pet */}
      <Fab onPress={() => router.push("/admin/new-appointment")}>
        <MaterialCommunityIcons name="plus" size={32} color="white" />
      </Fab>
    </Container>
  );
}
