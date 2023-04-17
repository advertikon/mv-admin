import Head from 'next/head';
import { Box, Container, Stack, Typography } from '@mui/material';
import { Layout } from '@layout/dashboard/layout';
import { SettingsPassword } from '@sections/settings/settings-password';

function Page() {
    return (
        <>
            <Head>
                <title>Settings | MV Admin</title>
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
                        {/* <SettingsNotifications /> */}
                        <SettingsPassword />
                    </Stack>
                </Container>
            </Box>
        </>
    );
}

Page.getLayout = page => <Layout>{page}</Layout>;

export default Page;
