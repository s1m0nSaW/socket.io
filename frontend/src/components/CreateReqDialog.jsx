import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide, TextField } from '@mui/material'
import React from 'react'
import { useDispatch } from 'react-redux'
import { fetchAuthMe } from '../redux/slices/auth.js'
import axios from '../axios.js'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});

const CreateReqDialog = ({ open, handleClose, onSuccess, user }) => {
    const dispatch = useDispatch()
    const [amount, setAmount] = React.useState('');
    const [error, setError] = React.useState(true);

    const handleChangeAmount = (e) => {
        const summa = e.target.value
        setAmount(summa)
        if(summa <= user.balance){
            setError(false)
        } 
        
        if(summa < 2000 || summa === '' || summa > user.balance) {
            setError(true)
        }
    }

    const onClose = () => {
        setAmount('')
        handleClose()
    }

    const updateData = async () => {
        if(Object.keys(user.requisites).length === 0){
            onSuccess('Заполните реквизиты', 'error')
        } else {
            const date = +new Date()
            const fields = {amount, date, requisites: user.requisites}
            await axios.post(`/new-request`,fields).then((data) => {
                if(data){
                    dispatch(fetchAuthMe())
                    onSuccess('Заявка принята к исполнению', 'success')
                    setAmount('')
                    onClose()
                }
            }).catch((err)=>{
                if(err) onSuccess(err.response.data.message, 'error')
            });
        }
    }

    return (
        <Dialog
            PaperProps={{ style: { backgroundColor: "#141414" } }}
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={onClose}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>Создать заявку</DialogTitle>
            <DialogContent sx={{width:'100%'}}>
                <TextField 
                    name='amount' 
                    value={amount} 
                    onChange={handleChangeAmount}
                    label="Сумма выплаты"
                    error={error}
                    type='number'
                    helperText='Сумма не должна быть меньше 2000 ₽'
                />
            </DialogContent>
            <DialogActions>
                <Button
                    disabled={error}
                    onClick={updateData}
                >
                    Отправить
                </Button>
                <Button
                    onClick={()=>onClose()}
                >
                    Отмена
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default CreateReqDialog

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