import {
    Divider,
    FormControlLabel,
    Grid,
    Paper,
    Radio,
    RadioGroup,
    Stack,
    Toolbar,
} from "@mui/material";
import React from "react";

import {Offer} from "./Info/Offer.jsx";
import {Privacy} from "./Info/Privacy.jsx";
import Header from "../components/Header.jsx";

export const Info = () => {
    const [value, setValue] = React.useState("privacy");

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    return (
        <>
        <Header profile={true} back={false}/>
        <Toolbar/>
            <Grid container spacing={2}>
            <Paper sx={{ width: "100%", marginBottom:'15px' }}>
                <Stack
                    sx={{ width: "100%", padding: "15px" }}
                    alignItems="center"
                    justifyContent="center"
                >
                        <RadioGroup
                            sx={{ padding: "15px" }}
                            value={value}
                            onChange={handleChange}
                        >
                            <FormControlLabel
                                value="privacy"
                                control={<Radio />}
                                label="ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ ПЕРСОНАЛЬНЫХ ДАННЫХ"
                            />
                            <Divider/>
                            <FormControlLabel
                                value="offer"
                                control={<Radio />}
                                label="ДОГОВОР-ОФЕРТА О ПРЕДОСТАВЛЕНИИ ИНФОРМАЦИОННЫХ УСЛУГ"
                            />
                        </RadioGroup>
                </Stack>
                </Paper>
                {value === 'privacy' && <Privacy/>}
                {value === 'offer' && <Offer/>}
                <Toolbar/>
            </Grid>
        </>
    );
};
