import { Card, Grid, IconButton, Paper, Stack, TextField } from "@mui/material";
import React from "react";

import SendIcon from '@mui/icons-material/Send';

const Chat = ({ messages, user, game }) => {
    const [ value, setValue ] = React.useState('');


    const sendMessage = () => {
    }

    return (
        <Card sx={{ width:'100%', height:'100%', flexGrow:1}}>
            <Grid
                sx={{ width:'100%', height:'100%'}}
                container
                direction="column"
                justifyContent="flex-end"
            >
                {messages?.map(message =>
                    <div style={{
                        margin: 10,
                        border: user._id === message.senderId ? '2px solid green' : '2px dashed red',
                        marginLeft: user._id === message.senderId ? 'auto' : '10px',
                        width: 'fit-content',
                        padding: 5,
                    }}>
                        <div>{message.content}</div>
                    </div>
                )}
                <Paper sx={{ margin:'10px', padding:'10px'}}>
                    <Stack 
                        direction='row'
                        justifyContent="space-evenly"
                        alignItems="center"
                        spacing={1}
                    >
                        <TextField
                            fullWidth   
                            size="small"
                            variant={"outlined"}
                            value={value}
                            onChange={e => setValue(e.target.value)}
                        />
                        <IconButton disabled={value === ''} size='small' onClick={()=>sendMessage()}><SendIcon/></IconButton>
                    </Stack>
                </Paper>
            </Grid>
        </Card>
    );
};

export default Chat;
