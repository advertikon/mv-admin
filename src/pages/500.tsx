import Head from 'next/head';
import NextLink from 'next/link';
import ArrowLeftIcon from '@heroicons/react/24/solid/ArrowLeftIcon';
import { Box, Button, Container, SvgIcon, Typography } from '@mui/material';

function Page() {
    return (
        <>
            <Head>
                <title>Error | MV Admin</title>
            </Head>
            <Box
                component="main"
                sx={{
                    alignItems: 'center',
                    display: 'flex',
                    flexGrow: 1,
                    minHeight: '100%',
                }}
            >
                <Container maxWidth="md">
                    <Box
                        sx={{
                            alignItems: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <Box
                            sx={{
                                mb: 3,
                                textAlign: 'center',
                            }}
                        >
                            <img
                                alt="Under development"
                                src="/assets/errors/error-500.png"
                                style={{
                                    display: 'inline-block',
                                    maxWidth: '100%',
                                    width: 400,
                                }}
                            />
                        </Box>
                        <Typography align="center" sx={{ mb: 3 }} variant="h3">
                            Whoops, we have an error :(
                        </Typography>
                        <Typography align="center" color="text.secondary" variant="body1" />
                        <Button
                            component={NextLink}
                            href="/"
                            startIcon={
                                <SvgIcon fontSize="small">
                                    <ArrowLeftIcon />
                                </SvgIcon>
                            }
                            sx={{ mt: 3 }}
                            variant="contained"
                        >
                            Go back to dashboard
                        </Button>
                    </Box>
                </Container>
            </Box>
        </>
    );
}

export default Page;
