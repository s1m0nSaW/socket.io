import { Dialog, DialogContent, DialogTitle, IconButton, Paper, Slide, Typography } from "@mui/material";
import React from "react";

import CancelIcon from '@mui/icons-material/Cancel';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});

const ConnectionDialog = ({ open, handleClose}) => {
    return (
        <Dialog
            fullWidth
            maxWidth={"xs"}
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
        >
            <IconButton
                color="primary"
                sx={{ position: "fixed", right: "15px", top: "15px" }}
                onClick={handleClose}
            >
                <CancelIcon />
            </IconButton>
            <DialogTitle>Знакомства</DialogTitle>
            <DialogContent>
                <Paper sx={{padding:'10px', borderColor:'red'}} variant="outlined">
                    <Typography align='center' variant='body2'>
                    В настоящее время функция знакомства находится в процессе создания, однако сейчас вы можете приглашать своих друзей, знакомых и коллег. Так вы сможете познакомиться с теми, кого пригласили они.
                    </Typography>
                </Paper>
            </DialogContent>
            <DialogContent>
                <Typography variant='body2'>
                    Наша миссия:<br/>
                    Способствовать созданию более глубоких и качественных отношений между людьми, помогая им лучше узнать друг друга и преодолеть барьеры в общении.<br/><br/>
                    Вы можете оказать нам поддержку, став нашим спонсором.
                </Typography>
            </DialogContent>
        </Dialog>
    );
};

export default ConnectionDialog;
