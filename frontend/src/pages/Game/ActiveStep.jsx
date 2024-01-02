import { Button, CardContent, CardHeader, Divider, Grid, List, ListItem, ListItemAvatar, ListItemText, Stack, Typography } from "@mui/material";
import React from "react";
import UserAvatar from "../../components/UserAvatar";

const ActiveStep = ({ question, answered, user, game, friend, updateAnswered, next, rateTheGame, questions }) => {
    const [ variant, setVariant ] = React.useState(0);

    const handleClick = (i) => {
        if(variant === 0){
            setVariant(i)
            if(i === 1)updateAnswered(user._id, question.answer1)
            if(i === 2)updateAnswered(user._id, question.answer2)
            if(i === 3)updateAnswered(user._id, question.answer3)
            if(i === 4)updateAnswered(user._id, question.answer4)
        }
    }

    const nextStep = () => {
        setVariant(0);
        next()
    }

    React.useEffect(()=>{
        if(user._id === answered.user1){
            if(answered.answer1 === question.answer1) setVariant(1)
            if(answered.answer1 === question.answer2) setVariant(2)
            if(answered.answer1 === question.answer3) setVariant(3)
            if(answered.answer1 === question.answer4) setVariant(4)
        } else if (user._id === answered.user2){
            if(answered.answer2 === question.answer1) setVariant(1)
            if(answered.answer2 === question.answer2) setVariant(2)
            if(answered.answer2 === question.answer3) setVariant(3)
            if(answered.answer2 === question.answer4) setVariant(4)
        } 

        if(answered.answer1 === 'none' && answered.answer2 === 'none') setVariant(0)
    },[answered, question, user])

    return (<>{answered.answer1 !== 'none' && answered.answer2 !== 'none' ? 
        <Grid item>
            {game.turn === user._id ?
                <>
                {answered.answer1 === answered.answer2 ?
                    <CardHeader
                    title={<Typography variant="h6">{friend.nickname} отгадал</Typography>}
                    subheader={<Typography variant="body1">Вопрос: {question?.text}</Typography>}
                />:
                <CardHeader
                    title={<Typography variant="h6">{friend.nickname} не отгадал</Typography>}
                    subheader={<Typography variant="body1">Вопрос: {question?.text}</Typography>}
                />
                }
                </>:<>
                {answered.answer1 === answered.answer2 ?
                    <CardHeader
                    title={<Typography variant="h6">Вы отгадали</Typography>}
                    subheader={<Typography variant="body1">Вопрос: {question?.text}</Typography>}
                />:
                <CardHeader
                    title={<Typography variant="h6">Вы не отгадали</Typography>}
                    subheader={<Typography variant="body1">Вопрос: {question?.text}</Typography>}
                />
                }
                </>
            }
            <CardContent>
            {answered.user1 === user._id ? 
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                    <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                        {user && <UserAvatar user={user}/>}
                        </ListItemAvatar>
                        <ListItemText
                        primary={user?.nickname}
                        secondary={`Ответ: ${answered?.answer1}`}
                        />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                    <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                        {friend && <UserAvatar user={friend}/>}
                        </ListItemAvatar>
                        <ListItemText
                        primary={friend?.nickname}
                        secondary={`Ответ: ${answered?.answer2}`}
                        />
                    </ListItem>
                </List>:
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                    <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                        {friend && <UserAvatar user={friend}/>}
                        </ListItemAvatar>
                        <ListItemText
                        primary={friend?.nickname}
                        secondary={answered?.answer1}
                        />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                    <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                        {user && <UserAvatar user={user}/>}
                        </ListItemAvatar>
                        <ListItemText
                        primary={user?.nickname}
                        secondary={answered?.answer2}
                        />
                    </ListItem>
                </List>}
            </CardContent>
            {game.activeStep + 1 === questions.length ?
                <Stack justifyContent='center' alignItems='center' sx={{ margin:'10px'}}>
                <Button variant="contained" onClick={rateTheGame}>Результаты</Button>
                </Stack>
                :
                <Stack justifyContent='center' alignItems='center' sx={{ margin:'10px'}}>
            {game.user1 === user._id && 
                <Button variant="contained" onClick={nextStep}>Следующий вопрос</Button>}
            </Stack>}
        </Grid>:
        <Grid item>
            {user && friend && <>{game.turn === user._id ? 
            <CardHeader
                title={<Typography variant="h6">Вы отвечаете</Typography>}
                subheader={<Typography variant="body1">{friend.nickname} отгадывает</Typography>}
            />:
            <CardHeader
                title={<Typography variant="body1">{friend.nickname} отвечает</Typography>}
                subheader={<Typography variant="h6">Вы отгадываете</Typography>}
            />
            }</>}
            <CardContent>
                <Typography variant="body1">
                {question.text}
                </Typography>
            </CardContent>
            <CardContent>
                <Stack
                    direction="column"
                    justifyContent="center"
                    alignItems="stretch"
                    spacing={1}
                >
                    <Button 
                    disabled={variant!==0 && variant!==1} 
                    onClick={()=>handleClick(1)}
                    variant={variant===1 ? "contained":'outlined'} 
                    color={variant===1 ? "success":'primary'}>
                    {question.answer1}
                    </Button>
                    <Button 
                    disabled={variant!==0 && variant!==2} 
                    onClick={()=>handleClick(2)}
                    variant={variant===2 ? "contained":'outlined'} 
                    color={variant===2 ? "success":'primary'}>
                    {question.answer2}
                    </Button>
                    {question.answer3 && <Button 
                    disabled={variant!==0 && variant!==3} 
                    onClick={()=>handleClick(3)}
                    variant={variant===3 ? "contained":'outlined'} 
                    color={variant===3 ? "success":'primary'}>
                    {question.answer3}
                    </Button>}
                    {question.answer4 && <Button 
                    disabled={variant!==0 && variant!==4} 
                    onClick={()=>handleClick(4)}
                    variant={variant===4 ? "contained":'outlined'} 
                    color={variant===4 ? "success":'primary'}>
                    {question.answer4}
                    </Button>}
                </Stack>
            </CardContent>
        </Grid>}
        </>
    );
};

export default ActiveStep;
