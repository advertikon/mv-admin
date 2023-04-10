import React, { useEffect, useState } from 'react';
import { Box, Table, TableBody, TableContainer } from '@mui/material';
import Paper from '@mui/material/Paper';
import { useDispatch, useSelector } from 'react-redux';
import lodash from 'lodash';
import WebhookHead from './WebhooksHead';
import { WEBHOOKS_GET } from '../../../store/saga/webhook.saga';
import { getWebhooks, Webhook } from '../../../store/slice/webhook.slice';
import WebhookRow from './WebhookRow';
import WebhookRowEmpty from './WebhookRowEmpty';
import { WebhookTopic } from '../../../types';

const missingWebhooks: { id: number; topic: WebhookTopic }[] = [
    {
        id: 1,
        topic: 'products/create',
    },
    {
        id: 2,
        topic: 'products/update',
    },
    {
        id: 3,
        topic: 'products/delete',
    },
    {
        id: 4,
        topic: 'collections/create',
    },
    {
        id: 5,
        topic: 'collections/update',
    },
    {
        id: 6,
        topic: 'collections/delete',
    },
];

function WebhooksTable() {
    const dispatch = useDispatch();
    const registeredWebhooks = useSelector(getWebhooks);
    const [webhooks, setWebhooks] = useState<Webhook[]>([]);

    useEffect(() => {
        if (registeredWebhooks.length === 0) {
            dispatch({ type: WEBHOOKS_GET });
        }
    }, []);

    useEffect(() => {
        setWebhooks(
            (registeredWebhooks || []).concat(
                lodash.differenceBy(missingWebhooks as Webhook[], registeredWebhooks, 'topic')
            )
        );
    }, [registeredWebhooks]);

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <TableContainer>
                    <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
                        <WebhookHead />
                        <TableBody>
                            {webhooks.map(w =>
                                w.created_at ? (
                                    <WebhookRow key={w.id} webhook={w} />
                                ) : (
                                    <WebhookRowEmpty key={w.id} webhook={w} />
                                )
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
}

export default WebhooksTable;
