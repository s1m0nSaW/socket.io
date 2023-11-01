import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  
  typography: {
    button: {
      textTransform: "none",
      fontWeight: 300,
    },
    body1: {
      fontWeight: 300,
      fontFamily: 'Montserrat',
      userSelect: 'none'
    },
    body2: {
      fontWeight: 300,
      fontFamily: 'Montserrat',
      userSelect: 'none'
    },
    h61: {
      fontWeight:300,
      fontStyle:'italic',
      fontFamily: 'Montserrat',
    },
    h4: {
      fontFamily: 'Henny Penny',
    },
    h5: {
      fontWeight: 400,
      fontFamily: 'Montserrat',
    },
    h6: {
      fontWeight: 400,
      fontFamily: 'Montserrat',
    },
  },
});
