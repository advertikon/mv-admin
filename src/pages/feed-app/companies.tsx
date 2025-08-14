import Head from 'next/head';
import { Box, Container, Stack } from '@mui/material';
import { Layout } from '@layout/dashboard/layout';
import { CompaniesListSection } from '../../sections/feed-app/companies/companies-list.section';

function Page() {
    return (
        <>
            <Head>
                <title>Companies | Feed app</title>
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8,
                }}
            >
                <Container>
                    <Stack spacing={3}>
                        <CompaniesListSection />
                    </Stack>
                </Container>
            </Box>
        </>
    );
}

Page.getLayout = page => <Layout>{page}</Layout>;

export default Page;
