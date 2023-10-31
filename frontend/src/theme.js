import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  
  palette: {
    mode:'dark',
    primary: {
      main: '#FF30AB', // устанавливаем новый цвет primary
    },
  },
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
      color: 'white',
      userSelect: 'none'
    },
    body3: {
      fontWeight: 300,
      fontFamily: 'Montserrat',
      color: 'white'
    },
    h61: {
      fontWeight:300,
      fontStyle:'italic',
      fontFamily: 'Montserrat',
    },
    h4: {
      fontWeight: 400,
      fontFamily: 'Russo One',
    },
    h5: {
      fontWeight: 400,
      fontFamily: 'Montserrat',
    },
    h6: {
      fontWeight: 400,
      fontFamily: 'Russo One',
    },
  },
  components:{
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontSize:'15px',
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root:{
          backgroundColor: 'inherit',
          borderColor: '#792C5A',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderRadius: '0px',
        }
      }
    },
    MuiTypography:{
      defaultProps:{
        component: 'span'
      }
    },
    MuiButton: {
      variants: [
        {
          props: { variant: 'contained' },
          style: {
            color: 'white', // устанавливаем цвет текста для варианта 'contained'
            background: 'linear-gradient(to bottom, #FF30AB, #792C5A)',
          },
        },
      ],
    },
  },
});
