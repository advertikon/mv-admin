import Head from 'next/head';
import { Box, Container, Button, Grid, Stack } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { Layout } from '../../layouts/dashboard/layout';
import { Mutations, Queries, queryClient } from '../../query/query-client';
import { AppHandlerStat } from '../../sections/shopify/keywords/app-handler-stat';
import { isKeywordFetchError, isKeywordFetchEvent, SseContext } from '../../contexts/sse-context';
import { KeywordGroups } from '../../sections/shopify/keywords/keyword-group';

function Page() {
    const [refetchInProgress, setRefetchInProgress] = useState(false);
    const refetchKeywordsToastId = useRef(null);
    const { onMessage, offMessage, onError, offError } = useContext(SseContext);

    const { mutate: refetchKeywords } = useMutation({
        mutationKey: [Mutations.SHOPIFY_REFETCH_KEYWORDS],
    });

    const sseEventsListener = useCallback(message => {
        if (isKeywordFetchEvent(message)) {
            const { finished, keyword, progress } = message;
            if (!refetchKeywordsToastId.current) {
                refetchKeywordsToastId.current = toast.loading('Refetching keywords...', { type: 'info' });
            }
            if (finished) {
                toast.update(refetchKeywordsToastId.current, {
                    render: 'Keywords re-fetched',
                    type: 'success',
                    isLoading: false,
                    autoClose: 2000,
                    progress: 1,
                });
                queryClient.invalidateQueries({ queryKey: [Queries.SHOPIFY_GET_KEYWORDS_STATS_HISTORY] });
                queryClient.invalidateQueries({ queryKey: [Queries.SHOPIFY_GET_KEYWORDS_STATS_LATEST] });
                setRefetchInProgress(false);
            } else {
                toast.update(refetchKeywordsToastId.current, { render: `Processing: ${keyword}`, progress });
            }
        }
    }, []);

    const sseErrorListener = useCallback(message => {
        if (isKeywordFetchError(message)) {
            const { error } = message;
            if (!refetchKeywordsToastId.current) {
                refetchKeywordsToastId.current = toast.loading('Refetching keywords...', { type: 'info' });
            }
            toast.update(refetchKeywordsToastId.current, {
                render: `Error: ${error}`,
                type: 'error',
                isLoading: false,
                autoClose: 10000,
            });
            setRefetchInProgress(false);
        }
    }, []);

    useEffect(() => {
        onMessage(sseEventsListener);
        onError(sseErrorListener);
        return () => {
            offMessage(sseEventsListener);
            offError(sseErrorListener);
        };
    }, []);

    const refetchKeywordsHandler = () => {
        refetchKeywordsToastId.current = toast.loading('Refetching keywords...', { type: 'info' });
        refetchKeywords();
        setRefetchInProgress(true);
    };

    return (
        <>
            <Head>
                <title>Shopify | Keywords</title>
            </Head>
            <Container style={{ border: 'solid 0px black' }} maxWidth="xl" disableGutters>
                <Grid container spacing={2}>
                    <Grid size={12}>
                        <KeywordGroups />
                    </Grid>
                    <Grid size={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                            <Stack direction="row" spacing={2}>
                                <Button
                                    variant="contained"
                                    onClick={refetchKeywordsHandler}
                                    disabled={refetchInProgress}
                                >
                                    Refetch keywords
                                </Button>
                            </Stack>
                        </Box>
                    </Grid>
                    <Grid size={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                            <AppHandlerStat />
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
}

Page.getLayout = page => <Layout>{page}</Layout>;

export default Page;
