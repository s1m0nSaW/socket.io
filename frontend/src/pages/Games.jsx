import React from "react";
import { Tab, Tabs} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import GamesList from "./Games/GamesList";
import SuccessSnack from "../components/SuccessSnack";
import { fetchAuthMe, authStatus, selectIsAuth } from "../redux/slices/auth";

const Games = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const status = useSelector(authStatus);
    const isAuth = useSelector(selectIsAuth);
    const user = useSelector((state) => state.auth.data);
    const [successSnack, setSuccessSnack] = React.useState(false);
    const [successMessage, setSuccessMessage] = React.useState('');
    const [severity, setSeverity] = React.useState('info');
    const [ value, setValue ] = React.useState("one");

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleSuccessOpen = (message, severity) => {
        setSuccessMessage(message);
        setSeverity(severity);
        setSuccessSnack(true);
        dispatch(fetchAuthMe());
    };

    const handleSuccessClose = () => {
        setSuccessSnack(false);
    };

    React.useEffect(()=>{
        if(status !== 'loading'){
            if (!isAuth) {
                navigate(`/main`);
            }
        }
    },[ isAuth, user, navigate, status ])

    return (
        <React.Fragment>
            <Header profile={true}/>
            <Tabs
            value={value}
            onChange={handleChange}
            textColor="secondary"
            indicatorColor="secondary"
            variant="scrollable"
            scrollButtons="auto"
            >
                <Tab value="one" label="Игры" />
                <Tab value="two" label="Входящие заявки" />
                <Tab value="three" label="Отправленные заявки" />
            </Tabs>
            {user && <>
            {value === 'one' && <GamesList content={user.games} page={'games'} onSuccess={handleSuccessOpen}/>}
            {value === 'two' && <GamesList content={user.gamesIn} page={'gamesIn'} onSuccess={handleSuccessOpen}/>}
            {value === 'three' && <GamesList content={user.gamesOut} page={'gamesOut'} onSuccess={handleSuccessOpen}/>}
            </>}
            <SuccessSnack
                open={successSnack}
                handleClose={handleSuccessClose}
                message={successMessage}
                severity={severity}
            />
        </React.Fragment>
    );
};

export default Games;
