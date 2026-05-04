import { usePhoto } from "@/hooks/usePhoto"; // hook de fotos
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { Camera, ChevronLeft, Save } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function NewAppointment() {
  const router = useRouter();
  const db = useSQLiteContext();
  const { takePhoto } = usePhoto(); // usando o hook

  // estados do formulário
  const [petName, setPetName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [appointmentType, setAppointmentType] = useState("");
  const [date, setDate] = useState(new Date().toLocaleDateString("pt-BR"));
  const [photoUri, setPhotoUri] = useState<string | null>(null); // o estado começa vazio  

  /**
   * dispara o fluxo de captura de imagem.
   * aguarda a resolução da URI local pelo hook 'usePhoto' e, caso a captura 
   * não seja cancelada pelo usuário, atualiza o estado 'photoUri' para 
   * refletir a prévia na interface e preparar o dado para persistência no SQLite.
   */
  const handleCapturePhoto = async () => {
    const uri = await takePhoto(); // executa a lógica de permissão
    if (uri) setPhotoUri(uri); // atualiza a UI reativamente se houver nova foto
  };

  const saveAppointment = async () => {
    if (!petName || !ownerName || !appointmentType) {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      // usando withTransactionAsync para garantir atomicidade e evitar bloqueios de banco
      await db.withTransactionAsync(async () => {
        await db.runAsync(
          `INSERT INTO appointments (pet_name, owner_name, type, date, pet_photo, synced) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [petName, ownerName, appointmentType, date, photoUri, 0],
        );
      });

      Alert.alert(
        "Sucesso",
        "Agendamento salvo localmente! A sincronização ocorrerá em breve.",
      );
      router.back();
    } catch (error) {
      console.error("Erro ao salvar no SQLite:", error);
      Alert.alert("Erro", "Não foi possível salvar o agendamento.");
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft color="#6B21A8" size={28} />
        </TouchableOpacity>
        <Text style={styles.title}>Novo Agendamento</Text>
      </View>

      {/* seção de foto */}
      <View style={styles.photoSection}>
        <TouchableOpacity
          style={styles.photoButton}
          onPress={handleCapturePhoto}
        >
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.previewImage} />
          ) : (
            <View style={styles.placeholderPhoto}>
              <Camera color="#9CA3AF" size={40} />
              <Text style={styles.placeholderText}>Tirar foto do Pet</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* campos do form */}
      <View style={styles.form}>
        <Text style={styles.label}>Nome do Pet *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Seth, Mimi..."
          value={petName}
          onChangeText={setPetName}
        />

        <Text style={styles.label}>Nome do Tutor *</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome do proprietário"
          value={ownerName}
          onChangeText={setOwnerName}
        />

        <Text style={styles.label}>Tipo de Serviço *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Consulta, Vacina, Banho"
          value={appointmentType}
          onChangeText={setAppointmentType}
        />

        <Text style={styles.label}>Data do Agendamento</Text>
        <TextInput style={styles.input} value={date} onChangeText={setDate} />

        <TouchableOpacity style={styles.saveButton} onPress={saveAppointment}>
          <Save color="white" size={20} />
          <Text style={styles.saveButtonText}>Salvar Agendamento</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
  },
  title: { fontSize: 20, fontWeight: "bold", marginLeft: 10, color: "#1F2937" },
  photoSection: { alignItems: "center", marginVertical: 20 },
  photoButton: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#D1D5DB",
    borderStyle: "dashed",
  },
  previewImage: { width: "100%", height: "100%" },
  placeholderPhoto: { alignItems: "center" },
  placeholderText: { fontSize: 12, color: "#9CA3AF", marginTop: 8 },
  form: { paddingHorizontal: 20 },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4B5563",
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#1F2937",
  },
  saveButton: {
    backgroundColor: "#6B21A8",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    marginTop: 32,
    gap: 10,
  },
  saveButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});
