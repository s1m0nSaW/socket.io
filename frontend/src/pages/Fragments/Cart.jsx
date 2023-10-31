import { Stack, Toolbar, Typography } from "@mui/material";
import React from "react";

import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';

const Cart = () => {
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
            <ProductionQuantityLimitsIcon
                color="disabled"
                sx={{ fontSize: 40 }}
            />
            <Typography variant="subtitle1" color='dimgray'>
            Вы пока не добавили товары
            </Typography>
        </Stack>
    );
};

export default Cart;
