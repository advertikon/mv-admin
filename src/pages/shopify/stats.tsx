import Head from 'next/head';
import { Box } from '@mui/material';
import { Layout } from '../../layouts/dashboard/layout';

function Page() {
    return (
        <>
            <Head>
                <title>Shopify | Stats</title>
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8,
                }}
            >
                hey
            </Box>
        </>
    );
}

Page.getLayout = page => <Layout>{page}</Layout>;

export default Page;
