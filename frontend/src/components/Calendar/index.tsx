// import type { FC } from "react";
import { useState, useEffect } from "react";
import moment from "moment";

import { getCalendarRange } from "../../utils/date";
import { DEFAULT_FORMAT } from "../../constants/date";

import { calendarGrid, dayCell, modalBackdrop, modalBox } from "./styles";

interface DayData {
  date: string;
  note: string[];
}

// interface CalendarProps {}

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [notes, setNotes] = useState<DayData[]>([]);
  const [inputNotes, setInputNotes] = useState<string[]>([]);

  const [currentDate, setCurrentDate] = useState<moment.Moment>(moment());
  const { startDate, endDate } = getCalendarRange(currentDate);

  const handleNoteChange = (index: number, value: string) => {
    setInputNotes((notes) =>
      notes.map((note, i) => (i === index ? value : note))
    );
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
        return prevNotes.map((n) =>
          n.date === dateKey ? { ...n, note: newNotes } : n
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
      const dateKey = day.format(DEFAULT_FORMAT);

      const currentNote = notes.find((n) => n.date === dateKey);
      const hasData =
        currentNote && currentNote.note.some((n) => n.trim() !== "");

      const isCurrentMonth = day.month() === currentDate.month();

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
          onClick={() => setSelectedDate(dateKey)}
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
      const dateKey = moment(selectedDate).format(DEFAULT_FORMAT);
      const day = notes.find((n) => n.date === dateKey);
      setInputNotes(day?.note ?? []);
    }
  }, [selectedDate, notes]);

  return (
    <>
      <div style={{ padding: "16px" }}>
        <h1 style={{ textAlign: "center", fontSize: "20px" }}>
          Exercise Tracker
        </h1>
        <span
          onClick={() =>
            setCurrentDate(currentDate.clone().subtract(1, "month"))
          }
        >
          -
        </span>
        <span
          onClick={() => setCurrentDate(currentDate.clone().add(1, "month"))}
        >
          +
        </span>
        <div style={calendarGrid}>{renderDays()}</div>

        {selectedDate && (
          <div style={modalBackdrop}>
            <div style={modalBox}>
              <h3>Notes for {moment(selectedDate).format("MMMM D, YYYY")}</h3>

              {inputNotes.length ? (
                <>
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
                </>
              ) : (
                <>
                  <p>No notes yet</p>
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
                    + Add First Note
                  </button>
                </>
              )}

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
    </>
  );
};

export default Calendar;
