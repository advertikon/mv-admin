import Head from 'next/head';
import { Box, Container, Stack, Typography } from '@mui/material';
import { Layout } from '../../layouts/dashboard/layout';
import { LayeredSearchConfigCollections } from '../../sections/layered-search/config/config-collections';
import { LayeredSearchConfigWebhooks } from '../../sections/layered-search/config/config-webhooks';
import { LayeredSearchConfigApiKey } from '../../sections/layered-search/config/config-api-key';
import { LayeredSearchConfigCompany } from '../../sections/layered-search/config/config-company';
import StackComponent from '../../components/stackComponent';

function Page() {
    return (
        <>
            <Head>
                <title>Settings | MV Layered search</title>
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8,
                }}
            >
                <Container maxWidth="lg">
                    <Stack spacing={3}>
                        <Typography variant="h4">Settings</Typography>
                        <LayeredSearchConfigCompany />
                        <LayeredSearchConfigApiKey />
                        <LayeredSearchConfigCollections />
                        <LayeredSearchConfigWebhooks />
                        <StackComponent />
                    </Stack>
                </Container>
            </Box>
        </>
    );
}

Page.getLayout = page => <Layout>{page}</Layout>;

export default Page;
