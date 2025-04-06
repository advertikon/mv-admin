import Head from 'next/head';
import { Box, Container, Stack } from '@mui/material';
import { Layout } from '@layout/dashboard/layout';
import { SendMessage } from '../../sections/feed-app/messages/send-message.section';

function Page() {
    return (
        <>
            <Head>
                <title>Messages | Feed app</title>
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
                        <SendMessage />
                    </Stack>
                </Container>
            </Box>
        </>
    );
}

Page.getLayout = page => <Layout>{page}</Layout>;

export default Page;
