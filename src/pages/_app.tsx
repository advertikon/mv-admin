import Head from 'next/head';
import { CacheProvider } from '@emotion/react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import 'simplebar-react/dist/simplebar.min.css';
import { createEmotionCache } from '../utils/create-emotion-cache';
import { AuthConsumer, AuthProvider } from '../contexts/auth-context';
import { createTheme } from '../theme/index';
import { useNProgress } from '../hooks/use-nprogress';
import SplashScreen from '../components/splash-screen';
import '../base.css';

const clientSideEmotionCache = createEmotionCache();

function App(props) {
    const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

    useNProgress();

    const getLayout = Component.getLayout ?? (page => page);

    const theme = createTheme();

    return (
        <CacheProvider value={emotionCache}>
            <Head>
                <title>MV Admin</title>
                <meta name="viewport" content="initial-scale=1, width=device-width" />
            </Head>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <AuthProvider>
                    <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <AuthConsumer>
                            {auth => (true ? <SplashScreen /> : getLayout(<Component {...pageProps} />))}
                        </AuthConsumer>
                    </ThemeProvider>
                </AuthProvider>
            </LocalizationProvider>
        </CacheProvider>
    );
}

export default App;
