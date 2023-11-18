import { Avatar, Card, CardContent, CardHeader, Divider, Grid, List, ListItem, ListItemAvatar, ListItemText, Typography, } from "@mui/material";
import React from "react";

const Situations = () => {
    return (
        <Grid
            item
            xs={12}
            md={8}
            lg={8}
            justifyContent="center"
            alignItems="center"
        >
            <Card sx={{ height: "100%" }} elevation={3}>
                <CardHeader
                    title={
                        <Typography variant="h6">
                            В каких случаях лучше играть?
                        </Typography>
                    }
                    subheader="Сервис основан на концепции многоуровневого маркетинга (Всего 5 уровней)"
                />
                <CardContent>
                    <List>
                        <Divider variant="inset" component="li" />
                        <ListItem disableGutters>
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: "violet" }}>1</Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Typography variant="body1">
                                        <b>Вы покупаете товар</b>
                                        <br />
                                    </Typography>
                                }
                                secondary={
                                    <Typography variant="body2">
                                        - Ваши подписчики (<b>1 уровень</b>)
                                        видят это в своей ленте
                                    </Typography>
                                }
                            />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                        <ListItem disableGutters>
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: "violet" }}>2</Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Typography variant="body1">
                                        <b>1 уровень покупает этот же товар</b>
                                        <br />
                                    </Typography>
                                }
                                secondary={
                                    <Typography variant="body2">
                                        - Их подписчики (<b>2 уровень</b>) видят
                                        это в своей ленте
                                        <br />- Вам начисляется{" "}
                                        <b>вознаграждение</b>
                                    </Typography>
                                }
                            />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                        <ListItem disableGutters>
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: "violet" }}>3</Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Typography variant="body1">
                                        <b>2 уровень покупает этот же товар</b>
                                        <br />
                                    </Typography>
                                }
                                secondary={
                                    <Typography variant="body2">
                                        - Их подписчики (<b>3 уровень</b>) видят
                                        это в своей ленте
                                        <br />- Вам и 1 уровню начисляется{" "}
                                        <b></b>вознаграждение
                                        <br />- 2 уровень становятся вашими
                                        подписчиками
                                    </Typography>
                                }
                            />
                        </ListItem>
                    </List>
                </CardContent>
                <CardContent>
                    <Typography>
                        Размер вознаграждения устанавливает продавец товара
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    );
};

export default Situations;
