import { style } from "@vanilla-extract/css";

export const playerContainer = style({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#F8F8F8",
  color: "#383838",
  padding: "20px",
  borderRadius: "20px",
  fontFamily: '"Comic Sans MS", cursive, sans-serif',
});

export const fileInputLabel = style({
  marginBottom: "10px",
  backgroundColor: "#FFB6C1",
  color: "#FFFFFF",
  padding: "10px",
  borderRadius: "10px",
  cursor: "pointer",
  ":hover": {
    backgroundColor: "#FF69B4",
  },
});

export const fileInput = style({
  display: "none",
});

export const musicInfo = style({
  marginTop: "10px",
  marginBottom: "10px",
  fontWeight: "bold",
  marginRight: "10px",
});

export const seekBarContainer = style({
  display: "flex",
  alignItems: "center",
  width: "100%",
  marginBottom: "20px",
  justifyContent: "space-between",
});

export const seekBar = style({
  appearance: "none",
  width: "90%",
  height: "5px",
  borderRadius: "5px",
  backgroundColor: "#c0c0c0",
  outline: "none",
  transition: "opacity .2s",
  cursor: "pointer",
  "::-webkit-slider-thumb": {
    appearance: "none",
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    backgroundColor: "#FF69B4",
    cursor: "pointer",
  },
});

export const duration = style({
  marginLeft: "10px",
  marginTop: "10px",
  marginBottom: "10px",
  fontWeight: "bold",
});

export const playPauseButton = style({
  padding: "10px 20px",
  backgroundColor: "#70a1ff",
  color: "white",
  borderRadius: "20px",
  border: "none",
  cursor: "pointer",
  ":hover": {
    backgroundColor: "#3498db",
  },
});

export const volumeContainer = style({
  display: "flex",
  alignItems: "center",
  width: "100%",
  marginBottom: "20px",
  justifyContent: "space-between",
});

export const volumeIcon = style({
  width: "20px",
  height: "20px",
  marginLeft: "10px",
  marginRight: "10px",
  marginTop: "20px",
  cursor: "pointer",
});

export const volumeBar = style({
  appearance: "none",
  width: "100%",
  height: "5px",
  marginTop: "20px",
  borderRadius: "5px",
  backgroundColor: "#D0D0D0",
  outline: "none",
  transition: "opacity .2s",
  cursor: "pointer",
  "::-webkit-slider-thumb": {
    appearance: "none",
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    backgroundColor: "#FF69B4",
    cursor: "pointer",
  },
});

export const optionContainer = style({
  display: "flex",
  alignItems: "center",
  width: "100%",
  marginBottom: "20px",
  justifyContent: "center",
});

export const repeatButton = style({
  backgroundColor: "#F8F8F8",
  color: "white",
  border: "none",
  cursor: "pointer",
});

export const repeatIcon = style({
  width: "20px",
  height: "20px",
  marginLeft: "10px",
  marginRight: "10px",
  marginTop: "20px",
  cursor: "pointer",
});

export const trackListContainer = style({
  backgroundColor: "#FFE0F0",
  borderRadius: "20px",
  padding: "20px",
});

export const trackListTitle = style({
  color: "#FFB6C1",
  fontSize: "24px",
  fontWeight: "bold",
  marginBottom: "20px",
  textAlign: "center",
  textTransform: "uppercase",
  letterSpacing: "2px",
  textShadow: "1px 1px 1px #FF69B4",
});

export const trackList = style({
  listStyle: "none",
  padding: "0",
  margin: "0",
});

export const trackListItem = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: "#FFB6C1",
  borderRadius: "10px",
  padding: "10px",
  marginBottom: "10px",
});

export const trackListItemTextContainer = style({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
});

export const trackListItemText = style({
  color: "#383838",
  textOverflow: "ellipsis",
  overflow: "hidden",
  whiteSpace: "nowrap",
  marginRight: "auto",
});

export const trackListItemButton = style({
  backgroundColor: "#FF69B4",
  color: "#FFFFFF",
  border: "none",
  cursor: "pointer",
  borderRadius: "10px",
  padding: "5px 10px",
  marginRight: "10px",
  width: "200px",
});

export const trackListItemButtonPlaying = style({
  backgroundColor: "#FF4500",
  color: "#FFFFFF",
  border: "none",
  cursor: "default",
  borderRadius: "10px",
  padding: "5px 10px",
  marginRight: "10px",
  width: "200px",
});

export const trackListItemButtonSelected = style({
  backgroundColor: "#FF1493",
  color: "#FFFFFF",
  border: "none",
  cursor: "default",
  borderRadius: "10px",
  padding: "5px 10px",
  marginRight: "10px",
  width: "200px",
});
