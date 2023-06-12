import { style } from '@vanilla-extract/css';

export const playerContainer = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#F8F8F8',
  color: '#383838',
  padding: '20px',
  borderRadius: '20px',
  fontFamily: '"Comic Sans MS", cursive, sans-serif',
});

export const fileInputLabel = style({
  marginBottom: '10px',
  backgroundColor: '#FFB6C1',
  color: '#FFFFFF',
  padding: '10px',
  borderRadius: '10px',
  cursor: 'pointer',
  ':hover': {
    backgroundColor: '#FF69B4',
  },
});

export const fileInput = style({
  display: 'none',
});

export const musicInfo = style({
  marginTop: '10px',
  marginBottom: '10px',
  fontWeight: 'bold',
});

export const seekBarBox = style({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  marginBottom: '20px',
  justifyContent: 'space-between',
});

export const seekBar = style({
  appearance: 'none',
  width: '90%',
  height: '5px',
  borderRadius: '5px',
  backgroundColor: '#c0c0c0',
  outline: 'none',
  transition: 'opacity .2s',
  cursor: 'pointer',
  '::-webkit-slider-thumb': {
    appearance: 'none',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: '#FF69B4',
    cursor: 'pointer',
  },
});

export const duration = style({
  marginLeft: '10px',
  marginTop: '10px',
  marginBottom: '10px',
  fontWeight: 'bold',
});

export const playPauseButton = style({
  padding: '10px 20px',
  backgroundColor: '#70a1ff',
  color: 'white',
  borderRadius: '20px',
  border: 'none',
  cursor: 'pointer',
  ':hover': {
    backgroundColor: '#3498db',
  },
});

export const volumeContainer = style({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  marginBottom: '20px',
  justifyContent: 'space-between',
});

export const volumeIcon = style({
  width: '20px',
  height: '20px',
  marginLeft: '10px',
  marginRight: '10px',
  marginTop: '20px',
  cursor: 'pointer',
});

export const volumeBar = style({
  appearance: 'none',
  width: '100%',
  height: '5px',
  marginTop: '20px',
  borderRadius: '5px',
  backgroundColor: '#D0D0D0',
  outline: 'none',
  transition: 'opacity .2s',
  cursor: 'pointer',
  '::-webkit-slider-thumb': {
    appearance: 'none',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: '#FF69B4',
    cursor: 'pointer',
  },
});
