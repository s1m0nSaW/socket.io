import React from "react";
import { Tab, Tabs} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import FriendsList from "./Friends/FriendsList";
import SearchPage from "./Friends/SearchPage";
import SuccessSnack from "../components/SuccessSnack";
import { fetchAuthMe, authStatus, selectIsAuth } from "../redux/slices/auth";

const Friends = () => {
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
                <Tab value="four" label="Поиск" />
                <Tab value="one" label="Друзья" />
                <Tab value="two" label="Входящие заявки" />
                <Tab value="three" label="Отправленные заявки" />
            </Tabs>
            {user && <>
            {value === 'one' && <FriendsList content={user.friends} page={'main'} onSuccess={handleSuccessOpen}/>}
            {value === 'two' && <FriendsList content={user.reqIn} page={'reqIn'} onSuccess={handleSuccessOpen}/>}
            {value === 'three' && <FriendsList content={user.reqOut} page={'reqOut'} onSuccess={handleSuccessOpen}/>}
            {value === 'four' && <SearchPage onSuccess={handleSuccessOpen}/>}
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

export default Friends;
