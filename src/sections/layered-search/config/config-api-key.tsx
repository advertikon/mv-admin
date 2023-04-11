import { Box, Card, CardActions, CardContent, CardHeader, Divider, Grid, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import { getApiKey, getApiKeyError, getIsApiKeyLoading } from '../../../store/slice/config.slice';
import { CONFIG_GET_API_KEY, CONFIG_SET_API_KEY } from '../../../store/saga/config.saga';

export function LayeredSearchConfigApiKey() {
    const API_KEY_REQUIRED_ERROR_MESSAGE = 'API Key required';

    const dispatch = useDispatch();
    const apiKey = useSelector(getApiKey);
    const apiKeyError = useSelector(getApiKeyError);
    const isApiKeyLoading = useSelector(getIsApiKeyLoading);
    const [apiKeyText, setApiKeyText] = useState('');
    const [saveApiKeyButtOnIsDisabled, setSaveApiKeyButtOnIsDisabled] = useState(true);
    const [apiKeyErrorMessage, setApiKeyErrorMessage] = useState(API_KEY_REQUIRED_ERROR_MESSAGE);

    useEffect(() => {
        if (!apiKey) {
            dispatch({ type: CONFIG_GET_API_KEY });
        }
    }, []);

    useEffect(() => {
        if (apiKeyError) {
            setApiKeyErrorMessage(apiKeyError);
            setSaveApiKeyButtOnIsDisabled(true);
        }
    }, [apiKeyError]);

    useEffect(() => {
        if (apiKey) {
            setApiKeyText(apiKey);
            setApiKeyErrorMessage('');
        }
    }, [apiKey]);

    const handleApiKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setApiKeyText(value);
        setApiKeyErrorMessage(value ? '' : API_KEY_REQUIRED_ERROR_MESSAGE);
        setSaveApiKeyButtOnIsDisabled(!value);
    };

    const handelApiKeySet = () => {
        dispatch({ type: CONFIG_SET_API_KEY, payload: apiKeyText });
    };

    return (
        <Card>
            <CardHeader subheader="Set API Key for the app" title="API Key" />
            <Divider />
            <CardContent>
                <Box sx={{ padding: 4 }}>
                    <Grid container spacing={2} marginBottom={2} alignItems="top">
                        <Grid item xs={12}>
                            <TextField
                                error={Boolean(apiKeyErrorMessage)}
                                helperText={apiKeyErrorMessage}
                                label="Api Key"
                                value={apiKeyText}
                                disabled={isApiKeyLoading}
                                fullWidth
                                onInput={handleApiKeyChange}
                                type="password"
                            />
                        </Grid>
                    </Grid>
                </Box>
            </CardContent>
            <Divider />
            <CardActions sx={{ justifyContent: 'flex-end' }}>
                <LoadingButton
                    loading={isApiKeyLoading}
                    loadingPosition="start"
                    startIcon={<SaveIcon />}
                    variant="contained"
                    disabled={saveApiKeyButtOnIsDisabled}
                    sx={{ marginTop: 1 }}
                    onClick={handelApiKeySet}
                >
                    Set
                </LoadingButton>
            </CardActions>
        </Card>
    );
}
