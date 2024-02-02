import { Button, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import React from "react";

const QuestionsTable = ({ questions, getTheme, remove }) => {
    return (
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Тема</TableCell>
                        <TableCell align="right">Вопрос</TableCell>
                        <TableCell align="right">Ответы</TableCell>
                        <TableCell align="right">Правильный</TableCell>
                        <TableCell align="right">Действие</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {questions.map((question, index) => (
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
                                <Typography variant="body2" onClick={()=>getTheme(question.theme)}>
                                    {question.theme}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography variant="body2">
                                {question.text}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography variant="body2">
                                {question.answer1}<br/>
                                {question.answer2}<br/>
                                {question.answer3}<br/>
                                {question.answer4}<br/>
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography variant="body2">
                                {question.correct}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Button
                                    onClick={() => remove(question._id)}
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
        )
    ;
};

export default QuestionsTable;
