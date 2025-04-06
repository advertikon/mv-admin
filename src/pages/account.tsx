import Head from 'next/head';
import { Box, Container, Stack, Typography, Grid } from '@mui/material';
import { AccountProfile } from '@sections/account/account-profile';
import { AccountProfileDetails } from '@sections/account/account-profile-details';
import { Layout } from '@layout/dashboard/layout';

function Page() {
    return (
        <>
            <Head>
                <title>Account | Devias Kit</title>
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
                        <div>
                            <Typography variant="h4">Account</Typography>
                        </div>
                        <div>
                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12, lg: 4, md: 6 }}>
                                    <AccountProfile />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6, lg: 8 }}>
                                    <AccountProfileDetails />
                                </Grid>
                            </Grid>
                        </div>
                    </Stack>
                </Container>
            </Box>
        </>
    );
}

Page.getLayout = page => <Layout>{page}</Layout>;

export default Page;
