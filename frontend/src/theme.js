import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  
  typography: {
    button: {
      textTransform: "none",
      fontWeight: 300,
      fontFamily: 'Raleway',
    },
    body1: {
      fontWeight: 400,
      fontFamily: 'Raleway, Noto Color Emoji',
      userSelect: 'none'
    },
    body2: {
      fontWeight: 300,
      fontFamily: 'Raleway',
      userSelect: 'none'
    },
    h3: {
      fontFamily: 'Raleway',
      userSelect: 'none',
    },
    h5: {
      fontFamily: 'Raleway',
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
