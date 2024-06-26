import { createContext, useContext, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AUTH_GET_ME } from '@saga/oauth.saga';
import { getAuth, isAdmin, isLoggedIn, isSuperAdmin } from '@slice/oauth.slice';
import { useRouter } from 'next/router';

const initContext = {
    loading: false,
    loggedIn: false,
    admin: false,
    superAdmin: false,
    uid: '',
    userName: '',
    company: '',
};

export const AuthContext = createContext(initContext);

export function AuthProvider(props) {
    const router = useRouter();
    const { children } = props;
    const dispatch = useDispatch();
    const {
        auth: { uid, permissions, login, company, sub },
        isLoading,
    } = useSelector(getAuth);
    const loggedIn = useSelector(isLoggedIn);
    const admin = useSelector(isAdmin);
    const superAdmin = useSelector(isSuperAdmin);

    const value = useMemo(
        () => ({
            loading: isLoading,
            loggedIn,
            admin,
            superAdmin,
            uid,
            company,
            userName: login,
            ensurePermissions: (perms: string[]) =>
                Array.isArray(permissions) && perms.every(p => permissions.includes(p)),
        }),
        [isLoading, loggedIn]
    );

    useEffect(() => {
        dispatch({ type: AUTH_GET_ME });
    }, []);

    useEffect(() => {
        if (loggedIn && !admin) {
            throw new Error('Not permitted');
        }
    }, [loggedIn, admin]);

    useEffect(() => {
        if (!loggedIn && !isLoading && sub) {
            // dispatch({ type: AUTH_LOGOUT });
            router.push(`${process.env.NEXT_PUBLIC_OAUTH_SERVER}/oauth/session/end`);
        }
    }, [loggedIn, isLoading, uid]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
