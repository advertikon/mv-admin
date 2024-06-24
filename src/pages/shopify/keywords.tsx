import Head from 'next/head';
import { Box, Container, Button, Grid, Dialog, DialogTitle, DialogContent, DialogActions, Stack } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Layout } from '../../layouts/dashboard/layout';
import { Mutations, Queries } from '../../query/query-client';
import MultipleSelectChip from '../../sections/shopify/keywords/multiselect-chip';
import { AppHandlerStat } from '../../sections/shopify/keywords/app-handler-stat';

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

    const { data: keywordsList } = useQuery<unknown, unknown, string[]>({
        queryKey: [Queries.SHOPIFY_GET_KEYWORDS_LIST],
    });

    const { data: appHandlersList } = useQuery<unknown, unknown, string[]>({
        queryKey: [Queries.SHOPIFY_GET_APP_HANDLERS_LIST],
    });

    const { mutate: saveKeywordsList } = useMutation<unknown, unknown, string[]>({
        mutationKey: [Mutations.SHOPIFY_SET_KEYWORDS_LIST],
    });

    const { mutate: saveAppHandlersList } = useMutation<unknown, unknown, string[]>({
        mutationKey: [Mutations.SHOPIFY_SET_APP_HANDLERS_LIST],
    });

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
