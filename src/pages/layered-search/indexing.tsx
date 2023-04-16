import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import { Box, Container, SvgIcon, Unstable_Grid2 as Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { ReactElement, useEffect, useRef, useState } from 'react';
import { OverviewTotalCustomers } from '@sections/overview/overview-total-customers';
import { OverviewTasksProgress } from '@sections/overview/overview-tasks-progress';
import { OverviewTotalProfit } from '@sections/overview/overview-total-profit';
import { OverviewSales } from '@sections/overview/overview-sales';
import { OverviewTraffic } from '@sections/overview/overview-traffic';
import { OverviewLatestProducts } from '@sections/overview/overview-latest-products';
import { OverviewLatestOrders } from '@sections/overview/overview-latest-orders';
import { Layout } from '@layout/dashboard/layout';
import { OverviewNumber } from '@sections/overview/overview-number';
import {
    getIndexingStatus,
    getIsIndexingResuming,
    getIsIndexingStarting,
    getIsIndexingStopping,
} from '@slice/indexing.slice';
import { INDEXING_GET_STATUS, INDEXING_RESUME, INDEXING_START, INDEXING_STOP } from '@saga/indexing.saga';
import { useAuthContext } from '@context/auth-context';
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
    const isStatStarting = useSelector(getIsIndexingStarting);
    const isStatStopping = useSelector(getIsIndexingStopping);
    const isStatResuming = useSelector(getIsIndexingResuming);
    const [runUpdate, setRunUpdate] = useState(false);
    let indexingStatusText;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const timer: any = useRef();
    const { superAdmin } = useAuthContext();

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

    if (indexingStatus.isActive) {
        indexingStatusText = 'Running';
    } else if (indexingStatus.isStuck) {
        indexingStatusText = 'Stuck';
    } else if (indexingStatus.isCancelled) {
        indexingStatusText = 'Cancelled';
    } else {
        indexingStatusText = 'Inactive';
    }

    const indexedProgress = Math.ceil((indexingStatus.indexedProductsCount / indexingStatus.totalProductsCount) * 100);
    const processedProgress =
        indexingStatus.isActive || indexingStatus.isStuck || indexingStatus.isCancelled
            ? Math.ceil((indexingStatus.processedProductsCount / indexingStatus.totalProductsCount) * 100)
            : 0;
    const timeToIndexFinish =
        ((indexingStatus.totalProductsCount - indexingStatus.processedProductsCount) / indexingStatus.indexBunchSize) *
        (indexingStatus.indexDelay / 1000);
    console.log(indexingStatus);
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
                                title="Butch size"
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
