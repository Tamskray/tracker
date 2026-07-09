import React, { createContext, useState } from "react";

interface DayData {
  date: string;
  note: string[];
}

interface NotesContextType {
  notes: DayData[];
  setNotes: React.Dispatch<React.SetStateAction<DayData[]>>;
}

export const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<DayData[]>([]);

  return <NotesContext.Provider value={{ notes, setNotes }}>{children}</NotesContext.Provider>;
};

export const useNotes = () => {
  const context = React.useContext(NotesContext);
  if (!context) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  return context;
};
