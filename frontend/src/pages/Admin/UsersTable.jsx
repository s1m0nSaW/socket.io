import { Button, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import React from "react";

import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

const UsersTable = ({ users, remove, update }) => {
    return (
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
                <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Никнейм</TableCell>
                    <TableCell align="right">Имя</TableCell>
                    <TableCell align="right">Аватар</TableCell>
                    <TableCell align="right">Пол</TableCell>
                    <TableCell align="right">Возраст</TableCell>
                    <TableCell align="right">Город</TableCell>
                    <TableCell align="right">Статус</TableCell>
                    <TableCell align="right">Удалить</TableCell>
                    <TableCell align="right"><MonetizationOnIcon/></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {users.map((user, index) => (
                    <TableRow
                        key={index}
                        sx={{
                            "&:last-child td, &:last-child th":
                                {
                                    border: 0,
                                },
                        }}
                    >
                        <TableCell>{index + 1}</TableCell>
                        <TableCell component="th" scope="row">
                            {user.nickname}
                        </TableCell>
                        <TableCell align="right">
                            {user.fullname}
                        </TableCell>
                        <TableCell align="right">
                            {user.pic === 'none' ? 'Нет' : 'Есть'}
                        </TableCell>
                        <TableCell align="right">
                            {user.gender}
                        </TableCell>
                        <TableCell align="right">
                            {user.age}
                        </TableCell>
                        <TableCell align="right">
                            {user.city}
                        </TableCell>
                        <TableCell align="right">
                            {user.status}
                        </TableCell>
                        <TableCell align="right">
                            <Button
                                onClick={() => remove(user._id)}
                                size="small"
                                variant="outlined"
                                color="inherit"
                            >
                                Удалить
                            </Button>
                        </TableCell>
                        <TableCell align="right">
                            <Button
                                onClick={() => update(user._id)}
                                size="small"
                                variant="outlined"
                                color="inherit"
                                endIcon={<MonetizationOnIcon />}
                            >
                                30 дней
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default UsersTable;