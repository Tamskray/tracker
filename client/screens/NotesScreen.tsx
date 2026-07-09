import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import moment from "moment";
import { useNotes } from "../context/NotesContext";

interface DayData {
  date: string;
  note: string[];
}

interface RootStackParamList {
  Calendar: undefined;
  Notes: { date: string };
  [key: string]: any;
}

type NotesScreenProps = NativeStackScreenProps<RootStackParamList, "Notes">;

const DEFAULT_FORMAT = "YYYY-MM-DD";

interface NotesScreenComponent {
  (props: NotesScreenProps): React.ReactElement;
}

const NotesScreen: NotesScreenComponent = ({ navigation, route }) => {
  const { date } = route.params;
  const { notes, setNotes } = useNotes();
  const [inputNotes, setInputNotes] = useState<string[]>([]);

  useEffect(() => {
    // Set header title with the date
    navigation.setOptions({
      headerTitle: moment(date).format("MMMM D, YYYY"),
    });

    // Load existing notes for this date
    const dateKey = moment(date).format("YYYY-MM-DD");
    const existingNote = notes.find((n) => n.date === dateKey);
    setInputNotes(existingNote?.note && existingNote.note.length > 0 ? existingNote.note : [""]);
  }, [date, navigation, notes]);

  const handleNoteChange = (index: number, value: string) => {
    setInputNotes((prev) => prev.map((note, i) => (i === index ? value : note)));
  };

  const addNewNoteLine = () => {
    setInputNotes((prev) => [...prev, ""]);
  };

  const saveNote = () => {
    const dateKey = moment(date).format(DEFAULT_FORMAT);
    const newNotes = inputNotes.filter((n) => n.trim() !== "");

    setNotes((prevNotes) => {
      const existing = prevNotes.find((n) => n.date === dateKey);
      if (existing) {
        return prevNotes.map((n) => (n.date === dateKey ? { ...n, note: newNotes } : n));
      } else {
        return [...prevNotes, { date: dateKey, note: newNotes }];
      }
    });

    // Navigate back to calendar
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {inputNotes.map((note, i) => (
          <TextInput
            key={i}
            value={note}
            onChangeText={(text) => handleNoteChange(i, text)}
            placeholder={`Exercise Plan ${i + 1}`}
            style={styles.input}
          />
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.addLineButton} onPress={addNewNoteLine}>
        <Text style={styles.addLineText}>+ Add Line</Text>
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.btn, styles.btnCancel]}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ color: "#333" }}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.btnSave]} onPress={saveNote}>
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Save</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 12,
    marginVertical: 8,
    fontSize: 16,
  },
  addLineButton: {
    marginHorizontal: 20,
    marginBottom: 15,
    backgroundColor: "#eee",
    padding: 12,
    borderRadius: 4,
    alignItems: "center",
  },
  addLineText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 14,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    marginLeft: 10,
  },
  btnCancel: {
    backgroundColor: "#ddd",
  },
  btnSave: {
    backgroundColor: "#15a55b",
  },
});

export default NotesScreen;
