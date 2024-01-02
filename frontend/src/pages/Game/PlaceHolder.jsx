import { CircularProgress, Grid, Toolbar, Typography } from "@mui/material";
import React from "react";

const PlaceHolder = () => {
    return (
        <Grid
            container
            direction="column"
            justifyContent='center' 
            alignItems="center"
            spacing={2}
            sx={{ height: '100vh'}}
            >
            <Typography variant="h3" sx={{ color: 'primary.main' }}>
                Ochem!
            </Typography>
            <Toolbar/>
            <CircularProgress/>
        </Grid>
    );
};

export default PlaceHolder;
