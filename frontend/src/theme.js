import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  
  typography: {
    button: {
      textTransform: "none",
      fontWeight: 300,
      fontFamily: 'Poiret One',
    },
    body1: {
      fontWeight: 400,
      fontFamily: 'Poiret One, Noto Color Emoji',
      userSelect: 'none'
    },
    body2: {
      fontWeight: 300,
      fontFamily: 'Poiret One',
      userSelect: 'none'
    },
    h3: {
      fontFamily: 'Henny Penny',
      userSelect: 'none',
    },
    h5: {
      fontFamily: 'Henny Penny',
      userSelect: 'none',
    },
    h4: {
      fontWeight: 400,
      fontFamily: 'Comforter Brush',
    },
    h6: {
      fontWeight: 400,
      fontFamily: 'Poiret One',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '@font-face': [
          {
            fontFamily: 'Noto Color Emoji',
            fontStyle: 'normal',
            fontWeight: 400,
            src: `url(https://fonts.gstatic.com/s/noto-coloremji/v8/nKKSrNr_msL9HdM1BArArc-xWDns-A.woff2) format('woff2')`,
          },
        ],
      },
    },
  },
});
