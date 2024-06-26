import { useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { styled } from '@mui/material/styles';
import { AuthProvider } from '@context/auth-context';
import { ToastContainer } from 'react-toastify';
import { SideNav } from './side-nav';
import { TopNav } from './top-nav';
import SplashScreen from '../../components/splash-screen';

import 'react-toastify/dist/ReactToastify.css';
import { SseProvider } from '../../contexts/sse-context';

const SIDE_NAV_WIDTH = 280;

const LayoutRoot = styled('div')(({ theme }) => ({
    display: 'flex',
    flex: '1 1 auto',
    maxWidth: '100%',
    [theme.breakpoints.up('lg')]: {
        paddingLeft: SIDE_NAV_WIDTH,
    },
}));

const LayoutContainer = styled('div')({
    display: 'flex',
    flex: '1 1 auto',
    flexDirection: 'column',
    width: '100%',
});

export function Layout(props) {
    const { children } = props;
    const pathname = usePathname();
    const [openNav, setOpenNav] = useState(false);

    const handlePathnameChange = useCallback(() => {
        if (openNav) {
            setOpenNav(false);
        }
    }, [openNav]);

    useEffect(
        () => {
            handlePathnameChange();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [pathname]
    );

    return (
        <AuthProvider>
            <SseProvider>
                <SplashScreen>
                    <TopNav onNavOpen={() => setOpenNav(true)} />
                    <SideNav onClose={() => setOpenNav(false)} open={openNav} />
                    <LayoutRoot>
                        <LayoutContainer>{children}</LayoutContainer>
                        <ToastContainer />
                    </LayoutRoot>
                </SplashScreen>
            </SseProvider>
        </AuthProvider>
    );
}
