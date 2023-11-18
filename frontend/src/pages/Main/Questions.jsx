import { Accordion, AccordionDetails, AccordionSummary, Grid, Typography } from "@mui/material";
import React from "react";

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Questions = () => {
    const [expanded, setExpanded] = React.useState(false);

    const handleChangePanel = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <Grid item xs={12} md={8} lg={8}  justifyContent="center" sx={{ width: "100%" }} >
            <Accordion
                expanded={expanded === "panel1"}
                onChange={handleChangePanel("panel1")}
                elevation={3}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                >
                    <Typography>
                        <b>Это финансовая пирамида?</b>
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Финансовая пирамида — это мошеннический проект, который
                        имитирует выгодные инвестиции. Часто используют систему
                        многоуровневого маркетинга.
                        <br />
                        <br />
                        В России деятельность "Финансовых пирамид" запрещена
                        статьёй 172.2 УК РФ. Организация деятельности по
                        привлечению денежных средств и (или) иного имущества.
                        <br />
                        <br /> В нашей партнерской сети пользователь платит за
                        право на использование программного обеспечения (сайта)
                        для покупки необходимых товаров и получения
                        дополнительного дохода.
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion
                expanded={expanded === "panel2"}
                onChange={handleChangePanel("panel2")}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2bh-content"
                    id="panel2bh-header"
                >
                    <Typography>
                        <b>Что такое многоуровневый маркетинг?</b>
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Многоуровневый маркетинг (англ. multilevel marketing,
                        MLM) — это модель продвижения товаров от производителя к
                        потребителю без привычных посредников в виде розничных
                        магазинов, не использует рекламу, пиар-кампании и другие
                        инструменты продвижения.
                        <br />
                        <br /> Многоуровневый сетевой маркетинг используется
                        такими фирмами, как Amway, Oriflame, Zepter
                        International, Vitamax, Avon Products, Faberlic, Mary
                        Kay и т.д.
                        <br />
                        <br />В нашей партнерской сети нет необходимости
                        продавать товар самостоятельно.
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion
                expanded={expanded === "panel3"}
                onChange={handleChangePanel("panel3")}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel3bh-content"
                    id="panel3bh-header"
                >
                    <Typography>
                        <b>Что будет если никого не пригласить?</b>
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        При регистрации нужно указать никнейм пригласившего.
                        Затем вы станете подписчиком этого человека, а также
                        всех, кто пригласил его на сайт до 5-го уровня, а они
                        вашими.
                        <br />
                        <br /> Количество ваших подписчиков будет увеличиваться
                        по мере увеличения количества покупок, совершенных вами
                        и вашими подписчиками.
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion
                expanded={expanded === "panel4"}
                onChange={handleChangePanel("panel4")}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel4bh-content"
                    id="panel4bh-header"
                >
                    <Typography>
                        <b>Про промокод</b>
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Промокод это ваш никнейм, который необходимо придумать
                        при регистрации.
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion
                expanded={expanded === "panel5"}
                onChange={handleChangePanel("panel5")}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel5bh-content"
                    id="panel5bh-header"
                >
                    <Typography>
                        <b>Как добавить сайт на главный экран?</b>
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Как создать ярлык сайта на домашнем экране iPhone или
                        iPad:
                        <br />
                        <br />
                        1. Откройте на своем iOS-устройстве браузер Safari.
                        <br />
                        2. Зайдите на интересный для вас сайт.
                        <br />
                        3. Нажмите на кнопку Поделиться (если вы не видите
                        нижнего меню, нажмите внизу экрана).
                        <br />
                        4. В появившемся меню выберите На экран «Домой».
                        <br />
                        5. На следующем экране вы сможете дать своему шорткату
                        подходящее название и проверить веб-адрес.
                        <br />
                        6. Нажмите кнопку Добавить. На экране вашего iPhone или
                        iPad появится ярлык добавленного веб-ресурса.
                        <br />
                        <br />
                        Шаги для добавления сайта на рабочий стол Android в
                        Google Chrome будут следующими:
                        <br />
                        <br />
                        1. Откройте нужный сайт в Google Chrome и нажмите по
                        кнопке меню — три точки в правом верхнем углу.
                        <br />
                        2. Нажмите по пункту «Добавить на главный экран».
                        <br />
                        3. Нажмите «Установить», процесс может занять некоторое
                        время.
                    </Typography>
                </AccordionDetails>
            </Accordion>
        </Grid>
    );
};

export default Questions;
