import { useEffect, useRef, useState } from 'react';
import { Button, Card, CardActions, CardContent, CardHeader, Divider, Stack, TextField } from '@mui/material';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { USER_UPDATE_PASSWORD } from '@saga/user.saga';
import { useAuthContext } from '@context/auth-context';
import { isPasswordUpdating, passwordUpdateError } from '@slice/user.slice';

export function SettingsPassword() {
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const dispatch = useDispatch();
    const { uid } = useAuthContext();
    const passwordIsUpdating = useSelector(isPasswordUpdating);
    const updatePasswordError = useSelector(passwordUpdateError);
    const activeToast = useRef(null);

    useEffect(() => {
        if (!passwordIsUpdating && activeToast.current) {
            toast.update(activeToast.current, {
                render: updatePasswordError || 'Password has been updated',
                type: updatePasswordError ? 'error' : 'success',
                isLoading: false,
                autoClose: 5000,
            });
            activeToast.current = null;
        }
    }, [passwordIsUpdating]);

    const handleChange = event => {
        if (event.target.name === 'password') {
            setPassword(event.target.value);
        } else {
            setConfirm(event.target.value);
        }
    };

    const handleSubmit = event => {
        event.preventDefault();
        let error = false;
        if (!password) {
            toast('Password required', { type: 'error', autoClose: 10000 });
            error = true;
        }

        if (!confirm) {
            toast('Password confirm required', { type: 'error', autoClose: 10000 });
            error = true;
        }

        if (password && confirm && password !== confirm) {
            toast('Password does not match confirm string', { type: 'error', autoClose: 10000 });
            error = true;
        }

        if (!error) {
            dispatch({ type: USER_UPDATE_PASSWORD, payload: { uid, password } });
            activeToast.current = toast.loading('Updating...');
        }
    };

    return (
        <Card>
            <CardHeader subheader="Update password" title="Password" />
            <Divider />
            <CardContent>
                <Stack spacing={3} sx={{ maxWidth: 400 }}>
                    <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        onChange={handleChange}
                        type="password"
                        value={password}
                    />
                    <TextField
                        fullWidth
                        label="Password (Confirm)"
                        name="confirm"
                        onChange={handleChange}
                        type="password"
                        value={confirm}
                    />
                </Stack>
            </CardContent>
            <Divider />
            <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button variant="contained" onClick={handleSubmit}>
                    Update
                </Button>
            </CardActions>
        </Card>
    );
}
