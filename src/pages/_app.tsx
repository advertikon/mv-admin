import Head from 'next/head';
import { CacheProvider } from '@emotion/react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import 'simplebar-react/dist/simplebar.min.css';
import { Provider } from 'react-redux';
import { createEmotionCache } from '../utils/create-emotion-cache';
import { createTheme } from '../theme/index';
import { useNProgress } from '../hooks/use-nprogress';
import '../base.css';
import store from '../store/store';

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
            <Provider store={store}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <ThemeProvider theme={theme}>
                        <CssBaseline />
                        {getLayout(<Component {...pageProps} />)}
                    </ThemeProvider>
                </LocalizationProvider>
            </Provider>
        </CacheProvider>
    );
}

export default App;
