/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import ReplayIcon from '@mui/icons-material/Replay';
import { useMutation } from '@tanstack/react-query';
import Snackbar from '@mui/material/Snackbar';
import { useEffect } from 'react';
import { TextField } from '@mui/material';
import { ShopifyProductStat } from '../../types';
import { Mutations } from '../../query/query-client';

type Props = {
    data: ShopifyProductStat[];
    setProduct: (product: string[]) => void;
    activeProduct?: string[];
};

function round(value: number | string): number | string {
    if (typeof value === 'string') {
        return value;
    }

    if (typeof value === 'number') {
        return Math.round(value);
    }

    return 'N/A';
}

export function ProductsTable({ data = [], setProduct, activeProduct }: Readonly<Props>) {
    const [toastText, setToastText] = React.useState('');
    const [productFilter, setProductFilter] = React.useState('');
    const {
        mutate,
        isPending,
        data: { status: resyncStatus } = {},
    } = useMutation<{ status: boolean }, unknown, string>({
        mutationKey: [Mutations.SYNC_PRODUCT],
    });

    const handleProductsSelection = (product: string) => {
        if (activeProduct.includes(product)) {
            setProduct(activeProduct.filter(item => item !== product));
        } else {
            setProduct([...activeProduct, product]);
        }
    };

    const resyncHandler = (productId: string) => {
        mutate(productId);
    };

    const handleClose = () => {
        setToastText('');
    };

    const setProductFilterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setProductFilter(event.currentTarget.value);
    };

    useEffect(() => {
        if (!isPending) {
            if (resyncStatus === true) {
                setToastText('Product stats re-synced');
            } else if (resyncStatus === false) {
                setToastText('Failed to re-sync product stat');
            }
        }
    }, [resyncStatus, isPending]);

    return (
        <Paper sx={{ width: '100%' }}>
            <div style={{ border: 'solid 2px indigo', padding: 1, borderRadius: 5 }}>
                <TextField
                    variant="filled"
                    color="error"
                    placeholder="Filter products"
                    size="small"
                    fullWidth
                    onChange={setProductFilterHandler}
                />
            </div>
            <TableContainer sx={{ height: 800 }}>
                <Table stickyHeader aria-label="sticky table" size="medium">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Name</TableCell>
                            <TableCell align="center">Avg Total</TableCell>
                            <TableCell align="center">Avg 1month</TableCell>
                            <TableCell align="center">Avg 2month</TableCell>
                            <TableCell align="center">Avg 3month</TableCell>
                            <TableCell align="center">Total reviews</TableCell>
                            <TableCell align="center">Created</TableCell>
                            <TableCell align="center">Developer</TableCell>
                            <TableCell align="center">Price</TableCell>
                            <TableCell align="center">Store</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data
                            .filter(v => !productFilter || v.name.toLowerCase().startsWith(productFilter.toLowerCase()))
                            .map(row => (
                                <TableRow
                                    key={row._id}
                                    onClick={() => handleProductsSelection(row.name)}
                                    sx={{
                                        backgroundColor: activeProduct.includes(row.name) ? '#79b3ff' : 'inherit',
                                        '&:last-child td, &:last-child th': { border: 0 },
                                    }}
                                >
                                    <TableCell
                                        sx={{ fontWeight: activeProduct.includes(row.name) ? 600 : 400 }}
                                        title={row._id}
                                    >
                                        {row.name}
                                    </TableCell>
                                    <TableCell>{round(row.avgReviews)}</TableCell>
                                    <TableCell>{round(row.pastMonthReviews)}</TableCell>
                                    <TableCell>{round(row.past2MonthReviews)}</TableCell>
                                    <TableCell>{round(row.past3MonthReviews)}</TableCell>
                                    <TableCell>{row.stats[row.stats.length - 1]?.reviews ?? 'n/a'}</TableCell>
                                    <TableCell>{row.created_at}</TableCell>
                                    <TableCell>{row.developer}</TableCell>
                                    <TableCell>
                                        {row.stats[row.stats.length - 1]?.pricing_plans?.join(', ') ||
                                            row.stats[row.stats.length - 1]?.price ||
                                            'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        <a href={row.url} target="_blank" rel="noreferrer">
                                            Open
                                        </a>
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            aria-label="refetch"
                                            color="success"
                                            disabled={isPending}
                                            onClick={event => {
                                                event.stopPropagation();
                                                resyncHandler(row._id);
                                            }}
                                        >
                                            <ReplayIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Snackbar open={Boolean(toastText)} autoHideDuration={6000} onClose={handleClose} message={toastText} />
        </Paper>
    );
}
