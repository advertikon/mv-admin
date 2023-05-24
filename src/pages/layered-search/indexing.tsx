import Head from 'next/head';
import { Box, Container, SvgIcon, Unstable_Grid2 as Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { ReactElement, useEffect, useRef, useState } from 'react';
import { Layout } from '@layout/dashboard/layout';
import { OverviewNumber } from '@sections/overview/overview-number';
import { getIndexingStatus } from '@slice/indexing.slice';
import { INDEXING_GET_STATUS, INDEXING_RESUME, INDEXING_START, INDEXING_STOP } from '@saga/indexing.saga';
import RectangleStackIcon from '@heroicons/react/24/solid/RectangleStackIcon';
import HashtagIcon from '@heroicons/react/24/solid/HashtagIcon';
import PlayIcon from '@heroicons/react/24/solid/PlayIcon';
import XMarkIcon from '@heroicons/react/24/solid/XMarkIcon';
import PauseIcon from '@heroicons/react/24/solid/PauseIcon';
import CheckIcon from '@heroicons/react/24/solid/CheckIcon';
import CalendarIcon from '@heroicons/react/24/solid/CalendarIcon';
import { OverviewProgress } from '@sections/overview/overview-progress';
import { OverviewText } from '@sections/overview/overview-text';
import { IndexControls } from '@sections/overview/index-controls';
import { ProductIndexStatus } from '../../types';

function getStatusOverviewProps(status: ProductIndexStatus): { icon: ReactElement; iconColor: string; text: string } {
    if (status.isActive) {
        return {
            icon: (
                <SvgIcon>
                    <PlayIcon />
                </SvgIcon>
            ),
            iconColor: 'success.main',
            text: 'Running',
        };
    }
    if (status.isStuck) {
        return {
            icon: (
                <SvgIcon>
                    <XMarkIcon />
                </SvgIcon>
            ),
            iconColor: 'error.main',
            text: 'Stuck',
        };
    }
    if (status.isCancelled) {
        return {
            icon: (
                <SvgIcon>
                    <PauseIcon />
                </SvgIcon>
            ),
            iconColor: 'warning.main',
            text: 'Paused',
        };
    }

    return {
        icon: (
            <SvgIcon>
                <CheckIcon />
            </SvgIcon>
        ),
        iconColor: 'info.main',
        text: 'Paused',
    };
}

function Page() {
    const dispatch = useDispatch();
    const indexingStatus = useSelector(getIndexingStatus);
    const [runUpdate, setRunUpdate] = useState(false);
    const timer: any = useRef();

    useEffect(() => {
        dispatch({ type: INDEXING_GET_STATUS });
    }, []);

    useEffect(() => {
        setRunUpdate(indexingStatus.isActive);
    }, [indexingStatus]);

    useEffect(() => {
        if (runUpdate) {
            refreshStat();
        } else {
            clearTimeout(timer.current);
        }
        return () => clearTimeout(timer.current);
    }, [runUpdate]);

    const refreshStat = () => {
        clearTimeout(timer.current);
        dispatch({ type: INDEXING_GET_STATUS });
        timer.current = setTimeout(refreshStat, 10000);
    };

    const startHandle = () => {
        dispatch({ type: INDEXING_START });
    };

    const stopHandle = () => {
        dispatch({ type: INDEXING_STOP });
    };

    const resumeHandle = () => {
        dispatch({ type: INDEXING_RESUME });
    };

    return (
        <>
            <Head>
                <title>Indexing | Layered search</title>
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8,
                }}
            >
                <Container maxWidth="xl">
                    <Grid container spacing={3}>
                        <Grid xs={12} sm={6} lg={3}>
                            <OverviewNumber
                                sx={{ height: '100%' }}
                                value={indexingStatus.totalProductsCount}
                                title="Products count"
                                icon={
                                    <SvgIcon>
                                        <RectangleStackIcon />
                                    </SvgIcon>
                                }
                            />
                        </Grid>
                        <Grid xs={12} sm={6} lg={3}>
                            <OverviewProgress
                                sx={{ height: '100%' }}
                                value={(indexingStatus.indexedProductsCount / indexingStatus.totalProductsCount) * 100}
                                title="Indexing coverage"
                                icon={
                                    <SvgIcon>
                                        <HashtagIcon />
                                    </SvgIcon>
                                }
                                iconColor="success.main"
                            />
                        </Grid>
                        <Grid xs={12} sm={6} lg={3}>
                            <OverviewText
                                sx={{ height: '100%' }}
                                title="Status"
                                {...getStatusOverviewProps(indexingStatus)}
                            />
                        </Grid>
                        <Grid xs={12} sm={6} lg={3}>
                            <OverviewText
                                sx={{ height: '100%' }}
                                title="Last run date"
                                icon={
                                    <SvgIcon>
                                        <CalendarIcon />
                                    </SvgIcon>
                                }
                                text={new Date(indexingStatus.lastRun).toLocaleString()}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid xs={12} sm={6} lg={3}>
                            <IndexControls
                                sx={{ height: '100%' }}
                                start={startHandle}
                                stop={stopHandle}
                                resume={resumeHandle}
                                isRunning={indexingStatus.isActive}
                                isStopped={indexingStatus.isStuck || indexingStatus.isCancelled}
                                isFinished={
                                    !indexingStatus.isActive && !indexingStatus.isStuck && !indexingStatus.isCancelled
                                }
                            />
                        </Grid>
                        <Grid xs={12} sm={6} lg={3}>
                            <OverviewNumber
                                sx={{ height: '100%' }}
                                title="Batch size"
                                value={indexingStatus.indexBunchSize}
                            />
                        </Grid>
                        <Grid xs={12} sm={6} lg={3}>
                            <OverviewText
                                sx={{ height: '100%' }}
                                title="Delay"
                                text={`${indexingStatus.indexDelay / 1000} sec`}
                            />
                        </Grid>
                        <Grid xs={12} sm={6} lg={3}>
                            <OverviewNumber
                                sx={{ height: '100%' }}
                                title="Current progress"
                                value={indexingStatus.processedProductsCount}
                            />
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </>
    );
}

Page.getLayout = page => <Layout>{page}</Layout>;

export default Page;
