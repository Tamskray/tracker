import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import moment from "moment";
import { useNotes } from "../context/NotesContext";
import { sendTestNotification } from "../utils/notifications";

interface DayData {
  date: string;
  note: string[];
}

interface RootStackParamList {
  Calendar: undefined;
  Notes: { date: string };
  [key: string]: any;
}

type CalendarScreenProps = NativeStackScreenProps<RootStackParamList, "Calendar">;

const DEFAULT_FORMAT = "YYYY-MM-DD";

interface CalendarScreenComponent {
  (props: CalendarScreenProps): React.ReactElement;
}

const CalendarScreen: CalendarScreenComponent = ({ navigation }) => {
  const { notes } = useNotes();
  const [currentDate, setCurrentDate] = useState<moment.Moment>(moment());

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
          onPress={() => navigation.navigate("Notes", { date: currentTargetDate })}
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

      {/* Test Notification Button */}
      <TouchableOpacity style={styles.notificationBtn} onPress={sendTestNotification}>
        <Text style={styles.notificationBtnText}>📢 Test Notification</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

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
  notificationBtn: {
    marginHorizontal: 20,
    marginVertical: 15,
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  notificationBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CalendarScreen;
