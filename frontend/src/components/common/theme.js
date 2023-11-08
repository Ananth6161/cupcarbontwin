import { createTheme } from '@mui/material'
import { cyan, deepPurple, orange, purple, red, pink, teal, lightBlue } from '@mui/material/colors';
import {responsiveFontSizes} from '@mui/material/styles';

let theme = createTheme({
    palette: {
        primary: lightBlue,
        secondary: red
    },
    typography: {
        fontFamily: ['Poppins', 'MerriweatherSans'].join(','),
        fontWeightLight: 400,
        fontWeightRegular: 500,
        fontWeightMedium: 600,
        fontWeightBold: 700,
        fontSize: 18
    }
})

theme = responsiveFontSizes(theme);

export default theme;