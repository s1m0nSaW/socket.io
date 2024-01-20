import { Button, Checkbox, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Slide, TextField } from '@mui/material';
import React from 'react';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});

const NewRating = ({ open, handleClose, newRaiting, ratings, handleDelete }) => {
    const [theme, setTheme] = React.useState('');
    const [forSponsor, setForSponsor] = React.useState(false);

    const handleChangeTheme = (e) => {
        const message = e.target.value
        setTheme(message)
    }

    const handleChangeForSponsor = (event) => {
        setForSponsor(event.target.checked);
      };

    const onExit = () => {
        setTheme('');
        handleClose();
    }

    const updateData = async () => {
        const fields = {
            theme: theme,
            forSponsor,
        }
        newRaiting(fields)
        setTheme('');
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
            <DialogTitle>Новый рейтинг</DialogTitle>
            {ratings && <>{ratings.map((raiting, index) =>
                    <Chip key={index} label={raiting.theme} onDelete={()=>handleDelete(raiting._id)} sx={{margin:'5px'}}/>
                )}</>}
            <DialogContent sx={{width:'100%'}}>
                <TextField 
                    fullWidth 
                    name='theme' 
                    value={theme} 
                    onChange={handleChangeTheme}
                    label='Тема'
                />
                <FormControlLabel
                    label="Платная тема"
                    control={
                        <Checkbox
                            checked={forSponsor}
                            onChange={handleChangeForSponsor}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />
                    }
                />
            </DialogContent>
            <DialogActions>
                <Button
                    disabled={theme===''}
                    onClick={updateData}
                >
                    ok
                </Button>
                <Button
                    onClick={onExit}
                >
                    Отмена
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default NewRating