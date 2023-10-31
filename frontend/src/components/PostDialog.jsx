import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, ListItem, Slide, TextField } from '@mui/material'
import React from 'react'
import axios from '../axios.js'

import CheckIcon from '@mui/icons-material/Check';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});

const CreatePostDialog = ({ open, handleClose, pass, setPosts }) => {
    const [text, setText] = React.useState('');
    const [textErr, setTextErr] = React.useState(true);

    const handleChangeText = (e) => {
        const message = e.target.value
        setText(message)
        if(message.length >= 8){
            setTextErr(false)
        } else {
            setTextErr(true)
        }
    }

    const onExit = () => {
        setText('')
        handleClose()
    }

    const updateData = async () => {
        const date = +new Date()
        const fields = {text, pass, date}
        await axios.post('/admi/post',fields).then((data) => {
            setPosts(data.data.reverse())
            onExit()
        }).catch((err)=>{
            console.warn(err)
        });
    }

    return (
        <Dialog
            PaperProps={{ style: { backgroundColor: "#141414" } }}
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={onExit}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>Редактировать</DialogTitle>
            <DialogContent sx={{width:'100%'}}>
            <ListItem
                disableGutters
                secondaryAction={
                <IconButton disabled={textErr} edge="end" onClick={()=>updateData()}>
                    <CheckIcon />
                </IconButton>
                }
            >
                <TextField 
                    multiline
                    fullWidth 
                    rows={6}
                    name='text' 
                    value={text} 
                    onChange={handleChangeText}
                    label='Пост'
                    error={textErr}
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

export default CreatePostDialog

/*
const onEditable = async (values, nickname, email) => {
        const fields = { nickname, email, values }
        await axios.patch(`/auth`,fields).catch((err)=>{
            console.warn(err)
        });
        dispatch(fetchAuthMe())
        handleClose()

    }

    const onSubmit = async (values) => {
        const {nickname, email, ...valuesData} = values;
        const fields = { nickname, email }
        await axios.post(`/check-user`,fields).then((data) => {
            if(data.data.email){setEmailOk(true)} else setEmailOk(false)
            if(data.data.nickname){setNicknameOk(true)} else setNicknameOk(false)
            if(!data.data.email && !data.data.nickname){
                onEditable(valuesData, nickname, email)
            }
        }).catch((err)=>{
            console.warn(err)
        });
    };
*/