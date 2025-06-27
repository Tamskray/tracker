// import type { FC } from "react";
import { useState, useEffect } from "react";
import moment from "moment";

import { calendarGrid, dayCell, modalBackdrop, modalBox } from "./styles";

interface DayData {
  date: string;
  note: string[];
}

// interface CalendarProps {}

const Calendar = () => {
  //
  // const [selectedDate, setSelectedDate] = useState<moment.Moment | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [notes, setNotes] = useState<DayData[]>([]);
  const [inputNotes, setInputNotes] = useState<string[]>([]);

  // const today = moment().add(1, "month"); // or subtract

  const today = moment();
  const startOfMonth = today.clone().startOf("month");
  const endOfMonth = today.clone().endOf("month");
  const startDate = startOfMonth.clone().startOf("week");
  const endDate = endOfMonth.clone().endOf("week");

  const handleNoteChange = (index: number, value: string) => {
    const updated = [...inputNotes];
    updated[index] = value;
    setInputNotes(updated);
  };

  const addNewNoteLine = () => {
    setInputNotes((prev) => [...prev, ""]);
  };

  const saveNote = () => {
    if (!selectedDate) return;

    const dateKey = moment(selectedDate).format("YYYY-MM-DD");

    const newNotes = [...inputNotes];

    setNotes((prevNotes) => {
      const existing = prevNotes.find((n) => n.date === dateKey);

      if (existing) {
        return prevNotes.map((n) =>
          n.date === dateKey
            ? {
                ...n,
                note: [...n.note, ...newNotes],
              }
            : n
        );
      } else {
        return [...prevNotes, { date: dateKey, note: newNotes }];
      }
    });

    setSelectedDate(null);
    setInputNotes([""]);
  };

  const renderDays = () => {
    const days = [];
    const day = startDate.clone();

    while (day.isSameOrBefore(endDate, "day")) {
      const dateKey = day.format("YYYY-MM-DD");

      const currentNote = notes.find((n) => n.date === dateKey);
      const hasData =
        currentNote && currentNote.note.some((n) => n.trim() !== "");

      const isCurrentMonth = day.month() === today.month();

      days.push(
        <div
          key={dateKey}
          style={{
            ...dayCell,
            backgroundColor: !isCurrentMonth
              ? "#f0f0f0"
              : hasData
              ? "#15a55b"
              : "#fff",
            color: !isCurrentMonth ? "#aaa" : "#000",
          }}
          // onClick={() => setSelectedDate(day.clone())}
          onClick={() => {
            console.log("Selected date:", dateKey);
            setSelectedDate(dateKey);
          }}
        >
          {day.date()}
        </div>
      );

      day.add(1, "day");
    }

    return days;
  };

  useEffect(() => {
    if (selectedDate) {
      const dateKey = moment(selectedDate).format("YYYY-MM-DD");
      const day = notes.find((n) => n.date === dateKey);
      setInputNotes(day?.note ?? [""]);
    }
  }, [selectedDate, notes]);

  // console.log(notes);

  return (
    <div style={{ padding: "16px" }}>
      <h1 style={{ textAlign: "center", fontSize: "20px" }}>
        Exercise Tracker
      </h1>

      <div style={calendarGrid}>{renderDays()}</div>

      {selectedDate && (
        <div style={modalBackdrop}>
          <div style={modalBox}>
            <h3>Notes for {moment(selectedDate).format("MMMM D, YYYY")}</h3>

            {inputNotes.map((note, i) => (
              <input
                key={i}
                value={note}
                onChange={(e) => handleNoteChange(i, e.target.value)}
                placeholder={`Note ${i + 1}`}
                style={{
                  width: "100%",
                  marginTop: "8px",
                  padding: "6px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            ))}

            <button
              onClick={addNewNoteLine}
              style={{
                marginTop: "10px",
                backgroundColor: "#eee",
                border: "none",
                padding: "6px 10px",
                cursor: "pointer",
              }}
            >
              + Add Line
            </button>

            <div style={{ marginTop: "12px", textAlign: "right" }}>
              <button
                onClick={() => setSelectedDate(null)}
                style={{ marginRight: "8px" }}
              >
                Cancel
              </button>
              <button onClick={saveNote}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
