import React, { useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    TableCell,
    TableRow,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import { getIsWebhookLoading, Webhook } from '../../../store/slice/webhook.slice';
import { WEBHOOKS_DELETE } from '../../../store/saga/webhook.saga';
import { usePermissions } from '../../../store/hooks/permission.hook';

type Props = { webhook: Webhook };

function WebhookRow({ webhook }: Props) {
    const dispatch = useDispatch();
    const [dialogOpen, setDialogOpen] = useState(false);
    const isLoading = useSelector(getIsWebhookLoading);
    const [isSuperAdmin] = usePermissions();
    const dialogCloseHandle = () => {
        setDialogOpen(false);
    };

    const dialogOpenHandle = () => {
        setDialogOpen(true);
    };

    const deleteWebhookHandle = () => {
        dispatch({ type: WEBHOOKS_DELETE, payload: webhook.topic });
        setDialogOpen(false);
    };

    return (
        <>
            <TableRow>
                <TableCell>{webhook.topic}</TableCell>
                <TableCell>{new Date(webhook.created_at).toLocaleString()}</TableCell>
                <TableCell>{webhook.address}</TableCell>
                <TableCell>
                    <IconButton
                        color="error"
                        onClick={dialogOpenHandle}
                        disabled={isLoading}
                        sx={{ display: isSuperAdmin ? 'block' : 'none' }}
                    >
                        <DeleteIcon />
                    </IconButton>
                </TableCell>
            </TableRow>
            <Dialog
                open={dialogOpen}
                onClose={dialogCloseHandle}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Confirm acton</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">Do you want to delete webhook?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={deleteWebhookHandle}>Yes</Button>
                    <Button onClick={dialogCloseHandle} autoFocus>
                        No
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default WebhookRow;
