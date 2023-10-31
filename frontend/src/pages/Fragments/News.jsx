import { Avatar, Button, Card, CardActions, CardContent, CardHeader, Grid, Stack, Toolbar, Typography } from "@mui/material";
import React from "react";
import { useSelector } from 'react-redux';
import axios from '../../axios.js'

import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';

import avatar from '../../img/logo512.png';

const Reaction = ({ post, handlePositive, handleNegative }) => {
    const user = useSelector((state) => state.auth.data)
    const [isPositive, setIsPositive] = React.useState();
    const [isNegative, setIsNegative] = React.useState();

    React.useEffect(()=>{
        if(user) {
            if(post.positive.includes(user._id)) setIsPositive(true)
            if(post.negative.includes(user._id)) setIsNegative(true)
        }
    },[user, post])

    return (
        <>
        {isPositive || isNegative ?
            <CardContent>
                <Stack
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
                spacing={2}
                ><ThumbUpOffAltIcon fontSize="small" />&nbsp; {post.positive.length} 
                </Stack>
            </CardContent>
             :
            <CardActions>
                <Button size="small" variant="outlined" onClick={()=>handlePositive(post._id)}>
                    <ThumbUpAltIcon />
                </Button>
                <Button size="small" variant="outlined" onClick={()=>handleNegative(post._id)}>
                    <ThumbDownAltIcon />
                </Button>
            </CardActions>
        }
        </>
    )
}

const News = () => {
    const user = useSelector((state) => state.auth.data)
    const [ posts, setPosts ] = React.useState();

    const formatDate = (milliseconds) => {
        const dt = new Date(milliseconds);
        const formattedDate = dt.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit'
        });
        return formattedDate;
    }

    const updatePosts = async () => {
        await axios.get('/posts').then((data) => setPosts(data.data.reverse())).catch(err => console.warn(err))
    }
    
    const handlePositive = async (_id) => {
        const fields = {
            reaction: 'positive',
            id: user._id,
        };
        await axios.post(`/reaction/${_id}`, fields).then((data) => {if(data) updatePosts()}).catch(err => console.warn(err))
    }
      
    const handleNegative = async (_id) => {
        const fields = {
            reaction: 'negative',
            id: user._id,
        };
        await axios.post(`/reaction/${_id}`, fields).then((data) => {if(data) updatePosts()}).catch(err => console.warn(err))
    }

    React.useEffect(()=>{
        const getPosts = async () => {
            await axios.get('/posts').then((data) => setPosts(data.data.reverse())).catch(err => console.warn(err))
        }
        getPosts()
    },[])

    return (
        <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        >
            {posts?.map((post, index) => (
                <Card key={index} sx={{ margin:'10px', width:'90%'}}>
                    <CardHeader
                        avatar={
                            <Avatar
                                src={avatar}
                            >
                            </Avatar>
                        }
                        title="CommunicationCompass"
                        subheader={formatDate(post.date)}
                    />
                    <CardContent>
                        <Typography variant="body2" color="text.secondary">
                            {post.text}
                        </Typography>
                    </CardContent>
                    <Reaction post={post} handlePositive={handlePositive} handleNegative={handleNegative}/>
                </Card>
            ))}
            <Toolbar/>
        </Grid>
    );
};

export default News;
