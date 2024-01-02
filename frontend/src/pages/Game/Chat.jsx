import { Typography } from "@mui/material";
import React from "react";
import ScrollableFeed from "react-scrollable-feed";

const Chat = ({ messages, user }) => {
    const scrollableRef = React.useRef(null);

    /*React.useEffect(() => {
        if (scrollableRef.current) {
        scrollableRef.current.scrollToBottom();
        }
    });*/
    return (
        <ScrollableFeed innerRef={scrollableRef}>
            {messages?.map((message) =>
                <div key={message.date}
                    style={{
                        margin: 5,
                        //backgroundColor: user._id === message.senderId ? 'green' : 'grey',
                        border: user._id === message.senderId ? '1px solid green' : '1px solid grey',
                        borderRadius: user._id === message.senderId ? '10px 10px 0px 10px' : '10px 10px 10px 0px',
                        marginLeft: user._id === message.senderId ? 'auto' : '0px',
                        width: 'fit-content',
                        padding: 5,
                    }}>
                    <Typography>{message.content}</Typography>
                </div>
            )}
        </ScrollableFeed>
    );
};

export default Chat;
