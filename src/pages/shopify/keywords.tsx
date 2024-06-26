import Head from 'next/head';
import { Box, Container, Button, Grid, Dialog, DialogTitle, DialogContent, DialogActions, Stack } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { Layout } from '../../layouts/dashboard/layout';
import { Mutations, Queries, queryClient } from '../../query/query-client';
import MultipleSelectChip from '../../sections/shopify/keywords/multiselect-chip';
import { AppHandlerStat } from '../../sections/shopify/keywords/app-handler-stat';
import { SseContext } from '../../contexts/sse-context';

function compareLists(list1?: string[], list2?: string[]): boolean {
    if (!list1 || !list2) {
        return false;
    }

    return list1.length === list2.length && list1.every(value => list2.includes(value));
}

function Page() {
    const [openKeywordsListModal, setOpenKeywordsListModal] = useState(false);
    const [selectedKeywords, setSelectedKeywords] = useState<string[] | null>(null);

    const [openAppHandlersListModal, setOpenAppHandlersListModal] = useState(false);
    const [selectedAppHandlers, setSelectedAppHandlers] = useState<string[] | null>(null);

    const [refetchInProgress, setRefetchInProgress] = useState(false);

    const saveAppHandlersToastId = useRef(null);
    const saveKeywordsToastId = useRef(null);
    const refetchKeywordsToastId = useRef(null);

    const { data: keywordsList } = useQuery<unknown, unknown, string[]>({
        queryKey: [Queries.SHOPIFY_GET_KEYWORDS_LIST],
    });

    const { data: appHandlersList } = useQuery<unknown, unknown, string[]>({
        queryKey: [Queries.SHOPIFY_GET_APP_HANDLERS_LIST],
    });

    const { onMessage, offMessage, onError, offError } = useContext(SseContext);

    const {
        mutate: saveKeywordsList,
        isPending: keywordsSaving,
        isError: saveKeywordsError,
        isSuccess: saveKeywordsSuccess,
    } = useMutation<unknown, unknown, string[]>({
        mutationKey: [Mutations.SHOPIFY_SET_KEYWORDS_LIST],
    });

    const {
        mutate: saveAppHandlersList,
        isPending: appHandlesSaving,
        isError: saveAppHandlersError,
        isSuccess: saveAppHandlersSuccess,
    } = useMutation<unknown, unknown, string[]>({
        mutationKey: [Mutations.SHOPIFY_SET_APP_HANDLERS_LIST],
    });

    const { mutate: refetchKeywords } = useMutation({
        mutationKey: [Mutations.SHOPIFY_REFETCH_KEYWORDS],
    });

    const sseEventsListener = useCallback(message => {
        if (message.startsWith('Processing keyword:')) {
            const keyword = message.split(':')[1].trim();
            toast.update(refetchKeywordsToastId.current, { render: `Processing: ${keyword}` });
        } else if (message === 'Finished processing keywords') {
            toast.update(refetchKeywordsToastId.current, {
                render: 'Keywords re-fetched',
                type: 'success',
                isLoading: false,
                autoClose: 2000,
            });

            queryClient.invalidateQueries({ queryKey: [Queries.SHOPIFY_GET_KEYWORDS_STATS_HISTORY] });
            queryClient.invalidateQueries({ queryKey: [Queries.SHOPIFY_GET_KEYWORDS_STATS_LATEST] });
            setRefetchInProgress(false);
        } else if (message.startsWith('Error processing keywords:')) {
            const error = message.split(':')[1].trim();
            toast.update(refetchKeywordsToastId.current, {
                render: `Error: ${error}`,
                type: 'error',
                isLoading: false,
                autoClose: 10000,
            });
            setRefetchInProgress(false);
        }
    }, []);

    const sseErrorListener = useCallback(message => {
        if (message.startsWith('Error processing keywords:')) {
            const error = message.split(':')[1].trim();
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
        if (appHandlesSaving) {
            saveAppHandlersToastId.current = toast.loading('Saving app handlers list...');
        }
    }, [appHandlesSaving]);

    useEffect(() => {
        if (saveAppHandlersError) {
            toast.update(saveAppHandlersToastId.current, {
                render: 'Failed to save app handlers list',
                type: 'error',
                isLoading: false,
            });
        }

        if (saveAppHandlersSuccess) {
            toast.update(saveAppHandlersToastId.current, {
                render: 'App handlers list saved',
                type: 'success',
                isLoading: false,
                autoClose: 5000,
            });
        }
    }, [saveAppHandlersError, saveAppHandlersSuccess]);

    useEffect(() => {
        if (keywordsSaving) {
            saveKeywordsToastId.current = toast.loading('Saving keywords list...');
        }
    }, [keywordsSaving]);

    useEffect(() => {
        if (saveKeywordsError) {
            toast.update(saveKeywordsToastId.current, {
                render: 'Failed to save keywords list',
                type: 'error',
                isLoading: false,
            });
        }

        if (saveKeywordsSuccess) {
            toast.update(saveKeywordsToastId.current, {
                render: 'Keywords list saved',
                type: 'success',
                isLoading: false,
                autoClose: 5000,
            });
        }
    }, [saveKeywordsError, saveKeywordsSuccess]);

    useEffect(() => {
        onMessage(sseEventsListener);
        onError(sseErrorListener);
        return () => {
            offMessage(sseEventsListener);
            offError(sseErrorListener);
        };
    }, []);

    const handleOpenKeywordsListModal = () => {
        setOpenKeywordsListModal(true);
    };

    const handleOpenAppHandlersListModal = () => {
        setOpenAppHandlersListModal(true);
    };

    const handleCloseKeywordsListModal = () => {
        setOpenKeywordsListModal(false);
    };

    const handleCloseAppHandlersListModal = () => {
        setOpenAppHandlersListModal(false);
    };

    const saveKeywordsListHandler = () => {
        if (!selectedKeywords) {
            return;
        }

        saveKeywordsList(selectedKeywords);
    };

    const saveAppHandlersListHandler = () => {
        if (!selectedAppHandlers) {
            return;
        }

        saveAppHandlersList(selectedAppHandlers);
    };

    const refetchKeywordsHandler = () => {
        refetchKeywordsToastId.current = toast.loading('Refetching keywords...');
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
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                            <Stack direction="row" spacing={2}>
                                <Button
                                    variant="contained"
                                    disabled={!keywordsList}
                                    onClick={handleOpenKeywordsListModal}
                                >
                                    Set keywords
                                </Button>

                                <Button
                                    variant="contained"
                                    disabled={!keywordsList}
                                    onClick={handleOpenAppHandlersListModal}
                                >
                                    Set app handlers
                                </Button>

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
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                            <AppHandlerStat />
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            <Dialog open={openKeywordsListModal} onClose={handleCloseKeywordsListModal} maxWidth="xl">
                <DialogTitle id="save-keywords-modal">Update keywords list</DialogTitle>
                <DialogContent>
                    <MultipleSelectChip items={keywordsList} setParentList={setSelectedKeywords} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseKeywordsListModal}>Cancel</Button>
                    <Button
                        onClick={saveKeywordsListHandler}
                        autoFocus
                        disabled={selectedKeywords === null || compareLists(selectedKeywords, keywordsList)}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openAppHandlersListModal} onClose={handleCloseAppHandlersListModal} maxWidth="xl">
                <DialogTitle id="save-app-handlers-modal">Update app handlers list</DialogTitle>
                <DialogContent>
                    <MultipleSelectChip items={appHandlersList} setParentList={setSelectedAppHandlers} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAppHandlersListModal}>Cancel</Button>
                    <Button
                        onClick={saveAppHandlersListHandler}
                        autoFocus
                        disabled={selectedAppHandlers === null || compareLists(selectedAppHandlers, appHandlersList)}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

Page.getLayout = page => <Layout>{page}</Layout>;

export default Page;
