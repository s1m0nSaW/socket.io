import { Divider, ListItem, ListItemText } from "@mui/material";
import React from "react";

const ThemeFromDialog = ({ theme, setTheme }) => {
    return (
        <React.Fragment>
            <ListItem alignItems="flex-start" onClick={()=>setTheme(theme)} >
                <ListItemText
                    primary={theme?.theme}
                    secondary={`Количество вопросов: ${theme?.count}`}
                />
            </ListItem>
            <Divider />
        </React.Fragment>
    );
};

export default ThemeFromDialog;