import { style } from "@vanilla-extract/css";

export const playerContainer = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "16px",
  backgroundColor: "#1c1c1e",
  color: "#fff",
  height: "100vh",
  fontFamily: "San Francisco, Helvetica Neue, Helvetica, Arial, sans-serif",
  padding: "20px",
});

export const fileInput = style({
  display: "none",
});

export const fileInputLabel = style({
  display: "inline-block",
  backgroundColor: "#3c3c3e",
  color: "#fff",
  padding: "10px 20px",
  borderRadius: "20px",
  fontSize: "15px",
  textTransform: "uppercase",
  letterSpacing: "1px",
  cursor: "pointer",
  transition: "background-color 0.2s ease-in-out",
  ":hover": {
    backgroundColor: "#007BFF",
  },
  maxWidth: "80%",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const playPauseButton = style({
  display: "inline-block",
  backgroundColor: "#007BFF",
  color: "#fff",
  padding: "10px 20px",
  borderRadius: "20px",
  fontSize: "15px",
  textTransform: "uppercase",
  letterSpacing: "1px",
  cursor: "pointer",
  transition: "background-color 0.2s ease-in-out",
  ":hover": {
    backgroundColor: "#004999",
  },
  ":disabled": {
    backgroundColor: "#3c3c3e",
    cursor: "not-allowed",
  },
});

export const seekBar = style({
  width: "80%",
  cursor: "pointer",
});

export const musicInfo = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
});
