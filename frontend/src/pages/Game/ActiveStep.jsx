import { Button, CardContent, Stack, Typography } from "@mui/material";
import React from "react";

const ActiveStep = ({ question }) => {
    return (
        <>
        <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {question.theme}
            </Typography>
            <Typography variant="body1">
            {question.text}
            </Typography>
        </CardContent>
        <CardContent>
            <Stack
                direction="row"
                justifyContent="space-around"
                alignItems="center"
                spacing={1}
            >
                <Button variant="outlined">{question.answer1}</Button>
                <Button variant="outlined">{question.answer2}</Button>
            </Stack>
            <Stack
                sx={{marginTop:'15px'}}
                direction="row"
                justifyContent="space-around"
                alignItems="center"
                spacing={1}
            >
                <Button variant="outlined">{question.answer3}</Button>
                <Button variant="outlined">{question.answer4}</Button>
            </Stack>
        </CardContent>
        </>
    );
};

export default ActiveStep;
