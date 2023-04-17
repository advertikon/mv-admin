import { useContext } from 'react';
import { AuthContext } from '@context/auth-context';
import { Loader } from './loader';

function SplashScreen({ children }) {
    const { loading } = useContext(AuthContext);
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return loading ? <Loader /> : <>{children}</>;
}

export default SplashScreen;
