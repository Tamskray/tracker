import type { CSSProperties } from "react";

export const calendarGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(7, 1fr)",
  gap: "4px",
  marginTop: "16px",
};

export const dayCell: CSSProperties = {
  border: "1px solid #ddd",
  padding: "8px",
  textAlign: "center",
  cursor: "pointer",
  borderRadius: "4px",
};

export const modalBackdrop: CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

export const modalBox: CSSProperties = {
  backgroundColor: "black",
  padding: "16px",
  borderRadius: "6px",
  width: "300px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
};
