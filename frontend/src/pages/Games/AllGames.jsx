import React from "react";

import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CancelIcon from '@mui/icons-material/Cancel';

import axios from '../../axios.js'
import { CardContent, Dialog, DialogTitle, Divider, IconButton, List, ListItem, ListItemText, Rating, Slide, Stack, Typography } from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});

const AllGames = () => {
    const [rates, setRates] = React.useState();
    const [themes, setThemes] = React.useState();
    const [openQuestionsDialog, setOpenQuestionsDialog] = React.useState(false);
    const [questions, setQuestions] = React.useState();

    const questionsCount = (t) => {
        const themeObj = themes.filter((obj) => obj.theme === t);
        // Если объект найден, возвращаем значение count, иначе возвращаем null или другое значение по умолчанию
        return themeObj ? themeObj.length : null;
    }

    const handleCloseQuestDialog = () => {
        setOpenQuestionsDialog(false);
        setQuestions();
    }

    const onOpenQuestDialog = (_theme) => {
        if(themes){
            const themeObj = themes.filter((obj) => obj.theme === _theme);
            setQuestions(themeObj.slice(0,5));
            setOpenQuestionsDialog(true)
        }
    }

    React.useEffect(()=>{
        const getRates = async () => {
            try {
                const _rates = await axios.get('/all-rates')
                if(_rates) {
                    setRates(_rates.data)
                }
            } catch (err) {
                console.warn(err)
            }
        }
        const getThemes = async () => {
            await axios.get('/all-quest')
            .then((data) => {
                setThemes(data.data)
            })
            .catch(err => console.warn(err));
        };
        getThemes();
        getRates();

    },[])

    return (
        <List sx={{ width: "100%", overflow: 'auto' }} dense>
            {rates?.map((rate) => (
                <div key={rate._id} onClick={()=>onOpenQuestDialog(rate.theme)}>
                    <ListItem alignItems="flex-start">
                        <ListItemText
                            primary={<Typography>
                                {rate.theme}&nbsp; 
                                {rate.forSponsor && <MonetizationOnIcon fontSize="small" color="primary"/>}
                            </Typography>}
                            secondary={themes && <Typography variant='caption'>Количество вопросов: {questionsCount(rate.theme)}</Typography>}
                        />
                    </ListItem>
                    <Stack direction='row' justifyContent='center' alignItems='flex-start' sx={{ marginBottom:'10px'}}>
                        <Rating name="read-only" value={rate.rating} readOnly size="small"/>
                    </Stack>
                    <Divider />
                </div>
            ))}
            
            <Dialog
            fullWidth
            maxWidth={'xs'}
            open={openQuestionsDialog}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleCloseQuestDialog}
            >
                <IconButton color="primary" sx={{ position: 'fixed', right:'15px', top: '15px'}} onClick={handleCloseQuestDialog}>
                    <CancelIcon />
                </IconButton>
                <DialogTitle>Примеры вопросов</DialogTitle>
                <CardContent>
                    <List sx={{ width: "100%" }} >
                        {questions?.map((quest) => (
                            <div key={quest._id}>
                                <ListItem alignItems="flex-start" disableGutters>
                                    <ListItemText
                                        primary={quest.text}
                                    />
                                </ListItem>
                                <Divider />
                            </div>
                        ))}
                    </List>
                </CardContent>
            </Dialog>
        </List>
    );
};

export default AllGames;
