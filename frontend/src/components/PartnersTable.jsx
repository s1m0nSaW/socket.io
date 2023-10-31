import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React from 'react'

const PartnersTable = ({partners, deletePartner}) => {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Имя</TableCell>
                        <TableCell align="right">Номер</TableCell>
                        <TableCell align="right">E-mail</TableCell>
                        <TableCell align="right">Статус</TableCell>
                        <TableCell align="right">Название</TableCell>
                        <TableCell align="right">Товар</TableCell>
                        <TableCell align="right">Количество</TableCell>
                        <TableCell align="right">Сайт</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {partners.map((partner, index) => (
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
                                {partner.name}
                            </TableCell>
                            <TableCell align="right">
                                {partner.phone}
                            </TableCell>
                            <TableCell align="right">
                                {partner.mail}
                            </TableCell>
                            <TableCell align="right">
                                {partner.status}
                            </TableCell>
                            <TableCell align="right">
                                {partner.shopName}
                            </TableCell>
                            <TableCell align="right">
                                {partner.city}
                            </TableCell>
                            <TableCell align="right">
                                {partner.product}
                            </TableCell>
                            <TableCell align="right">
                                {partner.count}
                            </TableCell>
                            <TableCell align="right">
                                {partner.website}
                            </TableCell>
                            <TableCell align="right">
                                    <Button
                                        onClick={() =>
                                            deletePartner(
                                                partner._id,
                                                "В работе"
                                            )
                                        }
                                        size="small"
                                        variant="outlined"
                                        color="inherit"
                                    >
                                        Удалить
                                    </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default PartnersTable;