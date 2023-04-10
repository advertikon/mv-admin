import React from 'react';
import { IconButton, TableCell, TableRow } from '@mui/material';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { useDispatch, useSelector } from 'react-redux';
import { getIsWebhookLoading, Webhook } from '../../../store/slice/webhook.slice';
import { WEBHOOKS_CREATE } from '../../../store/saga/webhook.saga';
import { usePermissions } from '../../../store/hooks/permission.hook';

type Props = { webhook: Webhook };

function WebhookRowEmpty({ webhook }: Props) {
    const dispatch = useDispatch();
    const isLoading = useSelector(getIsWebhookLoading);
    const [isSuperAdmin] = usePermissions();
    const createWebhookHandler = () => {
        dispatch({ type: WEBHOOKS_CREATE, payload: webhook.topic });
    };

    return (
        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
            <TableCell>{webhook.topic}</TableCell>
            <TableCell />
            <TableCell />
            <TableCell>
                <IconButton
                    color="success"
                    onClick={createWebhookHandler}
                    disabled={isLoading}
                    sx={{ display: isSuperAdmin ? 'block' : 'none' }}
                >
                    <AddBoxIcon />
                </IconButton>
            </TableCell>
        </TableRow>
    );
}

export default WebhookRowEmpty;
