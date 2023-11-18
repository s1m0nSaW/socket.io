import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, ListItem, Slide, TextField } from '@mui/material';
import React from 'react';

import CheckIcon from '@mui/icons-material/Check';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});

const NewQuestion = ({ open, handleClose, newQuestion }) => {
    const [theme, setTheme] = React.useState('');
    const [text, setText] = React.useState('');
    const [answer1, setAnswer1] = React.useState('');
    const [answer2, setAnswer2] = React.useState('');
    const [answer3, setAnswer3] = React.useState('');
    const [answer4, setAnswer4] = React.useState('');

    const handleChangeTheme = (e) => {
        const message = e.target.value
        setTheme(message)
    }

    const handleChangeText = (e) => {
        const message = e.target.value
        setText(message)
    }

    const handleChangeAnswer1 = (e) => {
        const message = e.target.value
        setAnswer1(message)
    }

    const handleChangeAnswer2 = (e) => {
        const message = e.target.value
        setAnswer2(message)
    }

    const handleChangeAnswer3 = (e) => {
        const message = e.target.value
        setAnswer3(message)
    }

    const handleChangeAnswer4 = (e) => {
        const message = e.target.value
        setAnswer4(message)
    }

    const onExit = () => {
        setTheme('');
        setText('');
        setAnswer1('');
        setAnswer2('');
        setAnswer3('');
        setAnswer4('');
        handleClose();
    }

    const updateData = async () => {
        setTheme('');
        setText('');
        setAnswer1('');
        setAnswer2('');
        setAnswer3('');
        setAnswer4('');
        const fields = {
            theme: theme,
            text: text,
            answer1: answer1,
            answer2: answer2,
            answer3: answer3,
            answer4: answer4,
        }
        newQuestion(fields)
    }

    return (
        <Dialog
            fullWidth
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={onExit}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>Новый вопрос</DialogTitle>
            <DialogContent sx={{width:'100%'}}>
                <TextField 
                    fullWidth 
                    name='theme' 
                    value={theme} 
                    onChange={handleChangeTheme}
                    label='Тема'
                />
                <TextField 
                    fullWidth 
                    name='answer1' 
                    value={answer1} 
                    onChange={handleChangeAnswer1}
                    label='ответ 1'
                />
                <TextField 
                    fullWidth 
                    name='answer2' 
                    value={answer2} 
                    onChange={handleChangeAnswer2}
                    label='ответ 2'
                />
                <TextField 
                    fullWidth 
                    name='answer3' 
                    value={answer3} 
                    onChange={handleChangeAnswer3}
                    label='ответ 3'
                />
                <TextField
                    fullWidth 
                    name='answer4' 
                    value={answer4} 
                    onChange={handleChangeAnswer4}
                    label='ответ 4'
                />
                <ListItem
                    disableGutters
                    secondaryAction={
                    <IconButton edge="end" onClick={()=>updateData()}>
                        <CheckIcon />
                    </IconButton>
                    }
                >
                    <TextField 
                        multiline
                        fullWidth 
                        rows={3}
                        name='text' 
                        value={text} 
                        onChange={handleChangeText}
                        label='Пост'
                    />
                </ListItem>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={onExit}
                >
                    Отмена
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default NewQuestion