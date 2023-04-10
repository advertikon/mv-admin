import React from 'react';
import { TableCell, TableHead, TableRow, Typography } from '@mui/material';

type Props = {};

function WebhookHead({}: Props) {
    return (
        <TableHead>
            <TableRow>
                <TableCell>
                    <Typography>Topic</Typography>
                </TableCell>
                <TableCell>
                    <Typography>Created date</Typography>
                </TableCell>
                <TableCell>
                    <Typography>Address</Typography>
                </TableCell>
                <TableCell>
                    <Typography>Action</Typography>
                </TableCell>
            </TableRow>
        </TableHead>
    );
}

export default WebhookHead;
