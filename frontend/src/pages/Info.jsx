import {
    FormControlLabel,
    Grid,
    Paper,
    Radio,
    RadioGroup,
    Stack,
    Toolbar,
} from "@mui/material";
import React from "react";
import { Header } from "../components/Header";

import {Offer} from "./Info/Offer.jsx";
import {Privacy} from "./Info/Privacy.jsx";
import {Reff} from "./Info/Reff.jsx";
import {Terms} from "./Info/Terms.jsx";

export const Info = () => {
    const [value, setValue] = React.useState("privacy");

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    return (
        <>
            <Header />
            <Grid container spacing={2}>
            <Paper sx={{ width: "100%", marginBottom:'15px' }}>
                <Stack
                    sx={{ width: "100%" }}
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
                                label="Политика в отношении обработки данных"
                            />
                            <FormControlLabel
                                value="terms"
                                control={<Radio />}
                                label="Условия использования партнёрской сети"
                            />
                            <FormControlLabel
                                value="reff"
                                control={<Radio />}
                                label="Правила реферальной программы"
                            />
                            <FormControlLabel
                                value="offer"
                                control={<Radio />}
                                label="Договор-оферта на оказание услуг по привлечению клиентов"
                            />
                        </RadioGroup>
                </Stack>
                </Paper>
                {value === 'privacy' && <Privacy/>}
                {value === 'terms' && <Terms/>}
                {value === 'reff' && <Reff/>}
                {value === 'offer' && <Offer/>}
                <Toolbar/>
            </Grid>
        </>
    );
};
