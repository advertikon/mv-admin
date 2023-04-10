import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AUTH_DO_EXCHANGE_CODE } from '../../../store/saga/oauth.saga';
import logger from '../../../modules/logger/logger';
import { Loader } from '../../../components/loader';
import { exchangeCodeError } from '../../../store/slice/oauth.slice';

function Page() {
    const router = useRouter();
    const { error, error_description, code } = router.query;
    const dispatch = useDispatch();
    const exchangeError = useSelector(exchangeCodeError);

    useEffect(() => {
        if (code) {
            dispatch({ type: AUTH_DO_EXCHANGE_CODE, payload: code });
        }
    }, [code]);

    if (error) {
        logger.error(`Exchange code error: ${error} : ${error_description}`);
        throw new Error('OAuth error');
    }

    if (exchangeError) {
        throw exchangeError;
    }

    return <Loader />;
}

export default Page;
