import { Stack, Toolbar, Typography } from "@mui/material";
import React from 'react'

import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

const Home = () => {
    return (
        <Stack
            direction="column"
            justifyContent="space-evenly"
            alignItems="center"
            spacing={1}
            sx={{ width: '100vw'}}
        >
            <Toolbar />
            <Toolbar />
            <Toolbar />
            <RemoveCircleOutlineIcon
                color="disabled"
                sx={{ fontSize: 40 }}
            />
            <Typography variant="subtitle1" color='dimgray'>
            Товаров пока нет
            </Typography>
        </Stack>
    )
}

export default Home