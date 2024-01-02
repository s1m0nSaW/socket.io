import { Button, CardContent, Dialog, DialogActions, DialogTitle, Slide, Typography } from "@mui/material";
import React from "react";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});

const AddApp = ({ open, handleClose }) => {

    return (
        <Dialog
            fullWidth
            maxWidth={'xs'}
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
        >
            <DialogTitle sx={{ m: 0, p: 2 }}>
            Как добавить сайт на главный экран?
            </DialogTitle>
            <CardContent>
                <Typography>
                    Как создать ярлык сайта на домашнем экране iPhone или
                    iPad:
                    <br />
                    <br />
                    1. Откройте на своем iOS-устройстве браузер Safari.
                    <br />
                    2. Зайдите на интересный для вас сайт.
                    <br />
                    3. Нажмите на кнопку Поделиться (если вы не видите
                    нижнего меню, нажмите внизу экрана).
                    <br />
                    4. В появившемся меню выберите На экран «Домой».
                    <br />
                    5. На следующем экране вы сможете дать своему шорткату
                    подходящее название и проверить веб-адрес.
                    <br />
                    6. Нажмите кнопку Добавить. На экране вашего iPhone или
                    iPad появится ярлык добавленного веб-ресурса.
                    <br />
                    <br />
                    Шаги для добавления сайта на рабочий стол Android в
                    Google Chrome будут следующими:
                    <br />
                    <br />
                    1. Откройте нужный сайт в Google Chrome и нажмите по
                    кнопке меню — три точки в правом верхнем углу.
                    <br />
                    2. Нажмите по пункту «Добавить на главный экран».
                    <br />
                    3. Нажмите «Установить», процесс может занять некоторое
                    время.
                </Typography>
            </CardContent>
            <DialogActions>
                <Button autoFocus onClick={handleClose}>
                    Закрыть
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddApp;
