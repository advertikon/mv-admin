import { useContext } from 'react';
import { AuthContext } from '../contexts/auth-context';
import { Loader } from './loader';

function SplashScreen({ children }) {
    const { loading, loggedIn, admin } = useContext(AuthContext);
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return loading ? <Loader /> : <>{children}</>;
}

export default SplashScreen;
