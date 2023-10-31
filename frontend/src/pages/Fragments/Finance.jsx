import React from "react";
import { Button, Collapse, Divider, Grid, List, ListItem, ListItemText, Paper, Toolbar, Typography } from "@mui/material";
import { useSelector } from 'react-redux';

import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';

import CreateReqDialog from "../../components/CreateReqDialog";
import SuccessSnack from "../../components/SuccessSnack";
import axios from "../../axios.js"

const Finance = () => {
    const user = useSelector((state) => state.auth.data)
    const [open,setOpen] = React.useState(0);
    const [openCreateDialog, setOpenCreateDialog] = React.useState(false);
    const [successSnack, setSuccessSnack] = React.useState(false);
    const [successMessage, setSuccessMessage] = React.useState('');
    const [severity, setSeverity] = React.useState('info');
    const [level1, setLevel1] = React.useState(0);
    const [level2, setLevel2] = React.useState(0);
    const [level3, setLevel3] = React.useState(0);
    const [level4, setLevel4] = React.useState(0);
    const [level5, setLevel5] = React.useState(0);
    const [requests, setRequests] = React.useState();

    const closeCreateDialog = () => {
        setOpenCreateDialog(false)
    }

    const handleSuccessOpen = (message, severity) => {
        setSuccessMessage(message)
        setSeverity(severity)
        setSuccessSnack(true)
    }

    const handleSuccessClose = () => {
        setSuccessSnack(false)
    }

    const lastDay = (objects) => {
        if(user){
            const date = +new Date() - 86400000;
            const selectedObjects = objects.filter((obj) => obj.date > date);

            return selectedObjects.length;
        }
    }

    const lastWeek = (objects) => {
        if(user){
            const date = +new Date() - 604800000;
            const selectedObjects = objects.filter((obj) => obj.date > date);

            return selectedObjects.length;
        }
    }

    const getRequests = async () => {
        await axios.get(`/requests`).then((data) => {
            if(data){
                const array = data.data;
                setRequests(array.reverse())
            }
        }).catch((err)=>{
            if(err) console.warn(err)
        });
    }

    React.useEffect(()=>{
        if(user){
            const inviteds = user.inviteds
            setLevel1(inviteds.filter((item)=>item.step === '1'))
            setLevel2(inviteds.filter((item)=>item.step === '2'))
            setLevel3(inviteds.filter((item)=>item.step === '3'))
            setLevel4(inviteds.filter((item)=>item.step === '4'))
            setLevel5(inviteds.filter((item)=>item.step === '5'))
            getRequests()
        }
    },[user])

    return (
        <Grid container sx={{padding:'10px'}}>
            <Paper sx={{width:'100%', borderRadius: "5px", marginBottom:'10px'}}>
                <ListItem
                    secondaryAction={
                        <Button sx={{marginTop:'10px'}} variant='contained' onClick={()=>setOpenCreateDialog(true)}>
                            <AddIcon />
                        </Button>
                    }
                >
                    <ListItemText
                        primary='Заявки на выплату'
                    />
                </ListItem>
                <Divider variant="middle">
                {open === 7 ? <ExpandLess onClick={()=>setOpen(0)}/> : <ExpandMore onClick={()=>setOpen(7)}/>}
                </Divider>
                <Collapse in={open === 7} timeout="auto" unmountOnExit>
                    <List disablePadding sx={{maxHeight:300, position: 'relative', overflow: 'auto',}}>
                        {requests?.map((item, index) => (
                        <ListItem key={index}>
                            <ListItemText primary={`На сумму ${item.amount}`} secondary={item.status}/>
                        </ListItem>
                        ))}
                    </List>
                </Collapse>
            </Paper>
            <Paper sx={{width:'100%', borderRadius: "5px", marginBottom:'10px'}}>
                <ListItem
                    secondaryAction={
                        <Typography
                        variant="h5"
                        >
                        {level5&&<>{(level1.length*500)+(level2.length*200)+(level3.length*100)+(level4.length*100)+(level5.length*100)} ₽</>}
                        </Typography>
                    }
                >
                    <ListItemText
                        primary='Вознаграждения:'
                            
                        secondary='За всех приглашенных'
                    />
                </ListItem>
                <Divider variant="middle">
                {open === 6 ? <ExpandLess onClick={()=>setOpen(0)}/> : <ExpandMore onClick={()=>setOpen(6)}/>}
                </Divider>
                <Collapse in={open === 6} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                    <ListItem divider>
                        <ListItemText secondary="За 24 часа" />
                        {level5 && <>{(lastDay(level1)*500)+(lastDay(level2)*200)+(lastDay(level3)*100)+(lastDay(level4)*100)+(lastDay(level5)*100)} ₽</>}
                    </ListItem>
                    <ListItem divider>
                        <ListItemText secondary="За 7 дней" />
                        {level5 && <>{(lastWeek(level1)*500)+(lastWeek(level2)*200)+(lastWeek(level3)*100)+(lastWeek(level4)*100)+(lastWeek(level5)*100)} ₽</>}
                    </ListItem>
                    </List>
                </Collapse>
            </Paper>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Приглашенные
            </Typography>
            <Paper sx={{width:'100%', borderRadius: "5px", marginBottom:'10px'}}>
                <ListItem
                    secondaryAction={
                        <Typography
                        variant="h5"
                        >
                        {level1.length}
                        </Typography>
                    }
                >
                    <ListItemText
                        primary='1 уровень'
                            
                        secondary='Количество приглашенных:'
                    />
                </ListItem>
                <Divider variant="middle">
                {open === 1 ? <ExpandLess onClick={()=>setOpen(0)}/> : <ExpandMore onClick={()=>setOpen(1)}/>}
                </Divider>
                <Collapse in={open === 1} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                    <ListItem divider>
                        <ListItemText secondary="Новые за 24 часа" />
                        {level1 && <>{lastDay(level1)}</>}
                    </ListItem>
                    <ListItem divider>
                        <ListItemText secondary="Новые за 7 дней" />
                        {level1 && <>{lastWeek(level1)}</>}
                    </ListItem>
                    </List>
                </Collapse>
            </Paper>
            <Paper sx={{width:'100%', borderRadius: "5px", marginBottom:'10px'}}>
                <ListItem
                    secondaryAction={
                        <Typography
                        variant="h5"
                        >
                        {level2.length}
                        </Typography>
                    }
                >
                    <ListItemText
                        primary='2 уровень'
                            
                        secondary='Количество приглашенных:'
                    />
                </ListItem>
                <Divider variant="middle">
                {open === 2 ? <ExpandLess onClick={()=>setOpen(0)}/> : <ExpandMore onClick={()=>setOpen(2)}/>}
                </Divider>
                <Collapse in={open === 2} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                    <ListItem divider>
                        <ListItemText secondary="Новые за 24 часа" />
                        {level2 && <>{lastDay(level2)}</>}
                    </ListItem>
                    <ListItem divider onClick={()=>console.log(lastWeek(level1))} >
                        <ListItemText secondary="Новые за 7 дней" />
                        {level2 && <>{lastWeek(level2)}</>}
                    </ListItem>
                    </List>
                </Collapse>
            </Paper>
            <Paper sx={{width:'100%', borderRadius: "5px", marginBottom:'10px'}}>
                <ListItem
                    secondaryAction={
                        <Typography
                        variant="h5"
                        >
                        {level3.length}
                        </Typography>
                    }
                >
                    <ListItemText
                        primary='3 уровень'
                            
                        secondary='Количество приглашенных:'
                    />
                </ListItem>
                <Divider variant="middle">
                {open === 3 ? <ExpandLess onClick={()=>setOpen(0)}/> : <ExpandMore onClick={()=>setOpen(3)}/>}
                </Divider>
                <Collapse in={open === 3} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                    <ListItem divider>
                        <ListItemText secondary="Новые за 24 часа" />
                        {level3 && <>{lastDay(level3)}</>}
                    </ListItem>
                    <ListItem divider>
                        <ListItemText secondary="Новые за 7 дней" />
                        {level3 && <>{lastWeek(level3)}</>}
                    </ListItem>
                    </List>
                </Collapse>
            </Paper>
            <Paper sx={{width:'100%', borderRadius: "5px", marginBottom:'10px'}}>
                <ListItem
                    secondaryAction={
                        <Typography
                        variant="h5"
                        >
                        {level4.length}
                        </Typography>
                    }
                >
                    <ListItemText
                        primary='4 уровень'
                            
                        secondary='Количество приглашенных:'
                    />
                </ListItem>
                <Divider variant="middle">
                {open === 4 ? <ExpandLess onClick={()=>setOpen(0)}/> : <ExpandMore onClick={()=>setOpen(4)}/>}
                </Divider>
                <Collapse in={open === 4} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                    <ListItem divider>
                        <ListItemText secondary="Новые за 24 часа" />
                        {level4 && <>{lastDay(level4)}</>}
                    </ListItem>
                    <ListItem divider >
                        <ListItemText secondary="Новые за 7 дней" />
                        {level4 && <>{lastWeek(level4)}</>}
                    </ListItem>
                    </List>
                </Collapse>
            </Paper>
            <Paper sx={{width:'100%', borderRadius: "5px", marginBottom:'10px'}}>
                <ListItem
                    secondaryAction={
                        <Typography
                        variant="h5"
                        >
                        {level5.length}
                        </Typography>
                    }
                >
                    <ListItemText
                        primary='5 уровень'
                            
                        secondary='Количество приглашенных:'
                    />
                </ListItem>
                <Divider variant="middle">
                {open === 5 ? <ExpandLess onClick={()=>setOpen(0)}/> : <ExpandMore onClick={()=>setOpen(5)}/>}
                </Divider>
                <Collapse in={open === 5} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                    <ListItem divider>
                        <ListItemText secondary="Новые за 24 часа" />
                        {level5 && <>{lastDay(level5)}</>}
                    </ListItem>
                    <ListItem divider>
                        <ListItemText secondary="Новые за 7 дней" />
                        {level5 && <>{lastWeek(level5)}</>}
                    </ListItem>
                    </List>
                </Collapse>
            </Paper>
            <Toolbar/>
            <CreateReqDialog open={openCreateDialog} handleClose={closeCreateDialog} onSuccess={handleSuccessOpen} user={user}/>
            <SuccessSnack open={successSnack} handleClose={handleSuccessClose} message={successMessage} severity={severity}/>
        </Grid>
    )
};

export default Finance;
