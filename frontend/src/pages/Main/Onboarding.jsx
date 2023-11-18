import { Box, Button, MobileStepper, Paper, Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles';
import SwipeableViews from 'react-swipeable-views-react-18-fix';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

import React from 'react'

import registration from '../../img/registration.png'
import lk1 from '../../img/lk1.png'
import lk2 from '../../img/lk2.png'
import lk3 from '../../img/lk3.png'
import lk4 from '../../img/lk4.png'
import lk5 from '../../img/lk5.png'
import lk6 from '../../img/lk6.png'

const images = [
    {
        label: 'Зарегистрируйтесь',
        imgPath: registration,
    },
    {
        label: 'Оплатите для полного доступа',
        imgPath: lk1,
    },
    {
        label: 'Нажмите на иконку меню',
        imgPath: lk2,
    },
    {
        label: 'Скопируйте ссылку и отправьте друзьям',
        imgPath: lk3,
    },
    {
        label: 'Укажите свои реквизиты для получения вознаграждения через меню',
        imgPath: lk6,
    },
    {
        label: 'Вознаграждения зачислятся после оплаты доступа другом',
        imgPath: lk4,
    },
    {
        label: 'Создайте заявку на зачисление вознаграждения по реквизитам',
        imgPath: lk5,
    },
];

function Onboarding() {
    const theme = useTheme();
    const [activeStep, setActiveStep] = React.useState(0);
    const maxSteps = images.length;

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStepChange = (step) => {
        setActiveStep(step);
    };

    return (
        <Paper elevation={0}>
            <Stack sx={{width:'100%', margin:'15px'}}>  
            <Typography variant='h6'>{images[activeStep].label}</Typography>
            </Stack>
            <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={activeStep}
                onChangeIndex={handleStepChange}
                enableMouseEvents
            >
                {images.map((step, index) => (
                    <div key={step.label}>
                        {Math.abs(activeStep - index) <= 2 ? (
                            <Box
                                component="img"
                                sx={{
                                    marginLeft: 'auto',
                                    marginRight: 'auto',
                                    display: 'block',
                                    overflow: 'hidden',
                                    width: {xs:'75%', md:'25%', lg:'25%'}
                                }}
                                src={step.imgPath}
                                alt={step.label}
                            />
                        ) : null}
                    </div>
                ))}
            </SwipeableViews>
            <MobileStepper
                sx={{ backgroundColor: "inherit", borderRadius: 2 }}
                variant="text"
                steps={maxSteps}
                position="static"
                activeStep={activeStep}
                nextButton={
                    <Button
                        size="small"
                        onClick={handleNext}
                        disabled={activeStep === maxSteps - 1}
                    >
                       
                        {theme.direction === 'rtl' ? (
                            <KeyboardArrowLeft />
                        ) : (
                            <KeyboardArrowRight />
                        )}
                    </Button>
                }
                backButton={
                    <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                        {theme.direction === 'rtl' ? (
                            <KeyboardArrowRight />
                        ) : (
                            <KeyboardArrowLeft />
                        )}
                       
                    </Button>
                }
            />
        </Paper>
    )
}

export default Onboarding