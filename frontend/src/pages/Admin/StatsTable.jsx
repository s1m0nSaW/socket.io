import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import React from "react";

const StatsTable = ({ stats }) => {

    function countUniqueValues(arr) {
        let uniqueValues = new Set(arr);
        return uniqueValues.size;
    }

    function countStringsByValue(arr) {
        return arr.reduce((count, element) => {
            if (element !== 'none') {
                return count + 1;
            } else {
                return count;
            }
        }, 0);
    }

    function sumArray(arr) {
        return arr.reduce((total, current) => total + current, 0);
      }

    return (
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
                <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Дата</TableCell>
                    <TableCell align="right">Новые юзеры</TableCell>
                    <TableCell align="right">Приглашенные</TableCell>
                    <TableCell align="right">Промоутеры</TableCell>
                    <TableCell align="right">Новые игры</TableCell>
                    <TableCell align="right">Создатели игр</TableCell>
                    <TableCell align="right">Платежи</TableCell>
                    <TableCell align="right">Сумма</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {stats.map((stat, index) => (
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
                            {stat.date}
                        </TableCell>
                        <TableCell align="right">
                            {stat.newUsers.length}
                        </TableCell>
                        <TableCell align="right">
                            {countStringsByValue(stat.newUsers)}
                        </TableCell>
                        <TableCell align="right">
                            {countUniqueValues(stat.newUsers)}
                        </TableCell>
                        <TableCell align="right">
                            {stat.newGames.length}
                        </TableCell>
                        <TableCell align="right">
                            {countUniqueValues(stat.newGames)}
                        </TableCell>
                        <TableCell align="right">
                            {stat.payments.length}
                        </TableCell>
                        <TableCell align="right">
                            {sumArray(stat.payments)}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default StatsTable;
