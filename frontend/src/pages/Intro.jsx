import { CircularProgress, Grid } from "@mui/material";
import React from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuth, authStatus } from "../redux/slices/auth";

const Intro = () => {
    const isAuth = useSelector(selectIsAuth);
    const status = useSelector(authStatus);
    const navigate = useNavigate();
    const { referal } = useParams()
    const user = useSelector((state) => state.auth.data);

    React.useEffect(() => {
        if (status !== 'loading') {
            if (!isAuth) {
                if(referal){
                    navigate(`/main/${referal}`);
                } else {
                    navigate(`/main`);
                }
            } else {
                navigate(`/prfl/${user.nickname}`)
            }
        }
    }, [user, status, isAuth, navigate, referal]);

    return (
        <Grid
            container
            direction="column"
            justifyContent='center' 
            alignItems="center"
            spacing={2}
            sx={{ height: '100vh'}}
        >
            <CircularProgress/>
        </Grid>
    );
};

export default Intro;
