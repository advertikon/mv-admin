import { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AUTH_GET_ME } from '../store/saga/oauth.saga';
import { isAdmin, isLoading, isLoggedIn, isSuperAdmin } from '../store/slice/oauth.slice';

const initContext = {
    loading: false,
    loggedIn: false,
    admin: false,
    superAdmin: false,
};

export const AuthContext = createContext(initContext);

export function AuthProvider(props) {
    const { children } = props;
    const initialized = useRef(false);
    const dispatch = useDispatch();
    const loading = useSelector(isLoading);
    const loggedIn = useSelector(isLoggedIn);
    const admin = useSelector(isAdmin);
    const superAdmin = useSelector(isSuperAdmin);

    const value = useMemo(
        () => ({
            loading,
            loggedIn,
            admin,
            superAdmin,
        }),
        [loading, loggedIn, admin, superAdmin]
    );

    useEffect(() => {
        dispatch({ type: AUTH_GET_ME });
    }, []);

    useEffect(() => {
        if (loggedIn && !admin) {
            throw new Error('Not permitted');
        }
    }, [loggedIn, admin]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
