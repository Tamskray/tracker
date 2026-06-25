import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  SafeAreaView,
} from "react-native";
import moment from "moment";

interface DayData {
  date: string;
  note: string[];
}

const DEFAULT_FORMAT = "YYYY-MM-DD";

export default function App() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [notes, setNotes] = useState<DayData[]>([]);
  const [inputNotes, setInputNotes] = useState<string[]>([]);
  const [currentDate, setCurrentDate] = useState<moment.Moment>(moment());

  const handleNoteChange = (index: number, value: string) => {
    setInputNotes((prev) => prev.map((note, i) => (i === index ? value : note)));
  };

  const addNewNoteLine = () => {
    setInputNotes((prev) => [...prev, ""]);
  };

  const saveNote = () => {
    if (!selectedDate) return;

    const dateKey = moment(selectedDate).format(DEFAULT_FORMAT);
    const newNotes = inputNotes.filter((n) => n.trim() !== "");

    setNotes((prevNotes) => {
      const existing = prevNotes.find((n) => n.date === dateKey);
      if (existing) {
        return prevNotes.map((n) => (n.date === dateKey ? { ...n, note: newNotes } : n));
      } else {
        return [...prevNotes, { date: dateKey, note: newNotes }];
      }
    });

    setSelectedDate(null);
    setInputNotes([""]);
  };

  const renderDays = () => {
    const days = [];

    // Calculate start and end of the month grid view
    const startOfMonth = currentDate.clone().startOf("month");
    const endOfMonth = currentDate.clone().endOf("month");
    const startDate = startOfMonth.clone().startOf("week");
    const endDate = endOfMonth.clone().endOf("week");

    const day = startDate.clone();

    while (day.isSameOrBefore(endDate, "day")) {
      const dateKey = day.format(DEFAULT_FORMAT);
      const currentNote = notes.find((n) => n.date === dateKey);
      const hasData = currentNote && currentNote.note.some((n) => n.trim() !== "");
      const isCurrentMonth = day.month() === currentDate.month();

      // Store local copy of dateKey for the closure
      const currentTargetDate = dateKey;

      days.push(
        <TouchableOpacity
          key={dateKey}
          style={[
            styles.dayCell,
            {
              backgroundColor: !isCurrentMonth ? "#f0f0f0" : hasData ? "#15a55b" : "#fff",
            },
          ]}
          onPress={() => setSelectedDate(currentTargetDate)}
        >
          <Text style={{ color: !isCurrentMonth ? "#aaa" : "#000", fontWeight: "500" }}>
            {day.date()}
          </Text>
        </TouchableOpacity>,
      );

      day.add(1, "day");
    }

    return days;
  };

  useEffect(() => {
    if (selectedDate) {
      const dateKey = moment(selectedDate).format(DEFAULT_FORMAT);
      const day = notes.find((n) => n.date === dateKey);
      setInputNotes(day?.note && day.note.length > 0 ? day.note : [""]);
    }
  }, [selectedDate, notes]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Exercise Tracker</Text>

      {/* Month Navigation */}
      <View style={styles.navContainer}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => setCurrentDate(currentDate.clone().subtract(1, "month"))}
        >
          <Text style={styles.navButtonText}>◀</Text>
        </TouchableOpacity>
        <Text style={styles.monthTitle}>{currentDate.format("MMMM YYYY")}</Text>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => setCurrentDate(currentDate.clone().add(1, "month"))}
        >
          <Text style={styles.navButtonText}>▶</Text>
        </TouchableOpacity>
      </View>

      {/* Grid Header */}
      <View style={styles.weekHeader}>
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <Text key={d} style={styles.weekDayText}>
            {d}
          </Text>
        ))}
      </View>

      {/* Calendar Grid */}
      <ScrollView contentContainerStyle={styles.calendarGrid}>{renderDays()}</ScrollView>

      {/* Entry Modal */}
      <Modal visible={!!selectedDate} animationType="slide" transparent={true}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              Notes for {selectedDate ? moment(selectedDate).format("MMMM D, YYYY") : ""}
            </Text>

            <ScrollView style={{ maxHeight: 200 }}>
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

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.btn, styles.btnCancel]}
                onPress={() => setSelectedDate(null)}
              >
                <Text style={{ color: "#333" }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.btnSave]} onPress={saveNote}>
                <Text style={{ color: "#fff", fontWeight: "bold" }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
    paddingTop: 40,
  },
  header: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 10,
  },
  navContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  navButton: {
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 5,
  },
  navButtonText: {
    fontSize: 16,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  weekHeader: {
    flexDirection: "row",
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  weekDayText: {
    width: "14.28%",
    textAlign: "center",
    fontWeight: "bold",
    color: "#666",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 10,
  },
  dayCell: {
    width: "14.28%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#e0e0e0",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginTop: 8,
  },
  addLineButton: {
    marginTop: 12,
    backgroundColor: "#eee",
    padding: 8,
    borderRadius: 4,
    alignItems: "center",
  },
  addLineText: {
    color: "#333",
    fontWeight: "600",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
  },
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 15,
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
