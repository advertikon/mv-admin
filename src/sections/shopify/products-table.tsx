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
import { TablePagination, TableSortLabel, TextField } from '@mui/material';
import dayjs from 'dayjs';
import { ShopifyProductStat } from '../../types';
import { Mutations } from '../../query/query-client';

type Props = {
    data: ShopifyProductStat[];
    setProduct: (product: string[]) => void;
    activeProduct?: string[];
    limit: number;
    offset: number;
    setLimit: (limit: number) => void;
    setOffset: (offset: number) => void;
    totalCount: number;
    sortOrder: 'asc' | 'desc';
    sortBy: '1month' | '2month' | '3month' | 'avg';
    setSortOrder: (order: 'asc' | 'desc') => void;
    setSortBy: (by: '1month' | '2month' | '3month' | 'avg') => void;
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

function getRowBackgroundColor(product: ShopifyProductStat) {
    const lastStat = product.stats[product.stats.length - 1];

    if (product.is_404) {
        return 'rgba(114, 114, 114, 1)';
    }

    if (product.is_unavailable) {
        return 'rgba(156, 163, 114, 1)';
    }

    if (dayjs().diff(lastStat.date, 'day') > 60) {
        return 'rgba(255, 74, 74, 1)';
    }

    if (dayjs().diff(lastStat.date, 'day') > 31) {
        return 'rgba(255, 136, 0, 1)';
    }

    if (dayjs().diff(lastStat.date, 'day') > 16) {
        return 'rgba(253, 255, 113, 0.86)';
    }

    return 'inherit';
}

export function ProductsTable({
    data = [],
    setProduct,
    activeProduct,
    limit,
    offset,
    setLimit,
    setOffset,
    totalCount,
    sortOrder,
    sortBy,
    setSortOrder,
    setSortBy,
}: Readonly<Props>) {
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
            <TableContainer sx={{ height: 650 }}>
                <Table stickyHeader aria-label="sticky table" size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Name</TableCell>
                            <TableCell align="center">
                                <TableSortLabel
                                    active={sortBy === 'avg'}
                                    direction={sortOrder}
                                    onClick={() => {
                                        if (sortBy !== 'avg') {
                                            setSortBy('avg');
                                            setSortOrder('desc');
                                        } else {
                                            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                                        }
                                    }}
                                >
                                    Avg Total
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="center">
                                <TableSortLabel
                                    active={sortBy === '1month'}
                                    direction={sortOrder}
                                    onClick={() => {
                                        if (sortBy !== '1month') {
                                            setSortBy('1month');
                                            setSortOrder('desc');
                                        } else {
                                            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                                        }
                                    }}
                                >
                                    Avg 1month
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="center">
                                <TableSortLabel
                                    active={sortBy === '2month'}
                                    direction={sortOrder}
                                    onClick={() => {
                                        if (sortBy !== '2month') {
                                            setSortBy('2month');
                                            setSortOrder('desc');
                                        } else {
                                            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                                        }
                                    }}
                                >
                                    Avg 2month
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="center">
                                <TableSortLabel
                                    active={sortBy === '3month'}
                                    direction={sortOrder}
                                    onClick={() => {
                                        if (sortBy !== '3month') {
                                            setSortBy('3month');
                                            setSortOrder('desc');
                                        } else {
                                            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                                        }
                                    }}
                                >
                                    Avg 3month
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="center">Total reviews</TableCell>
                            <TableCell align="center">Created</TableCell>
                            <TableCell>Developer</TableCell>
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
                                    onClick={e => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleProductsSelection(row.name);
                                    }}
                                    sx={{
                                        backgroundColor: activeProduct.includes(row.name)
                                            ? '#79b3ff'
                                            : getRowBackgroundColor(row),
                                        '&:last-child td, &:last-child th': { border: 0 },
                                    }}
                                >
                                    <TableCell
                                        sx={{ fontWeight: activeProduct.includes(row.name) ? 600 : 400 }}
                                        title={row._id}
                                        padding="none"
                                    >
                                        {row.name}
                                    </TableCell>
                                    <TableCell padding="none">{round(row.avgReviews)}</TableCell>
                                    <TableCell padding="none">{round(row.pastMonthReviews)}</TableCell>
                                    <TableCell padding="none">{round(row.past2MonthReviews)}</TableCell>
                                    <TableCell padding="none">{round(row.past3MonthReviews)}</TableCell>
                                    <TableCell padding="none">
                                        {row.stats[row.stats.length - 1]?.reviews ?? 'n/a'}
                                    </TableCell>
                                    <TableCell padding="none">{row.created_at}</TableCell>
                                    <TableCell padding="none">{row.developer}</TableCell>
                                    <TableCell padding="none">
                                        {row.stats[row.stats.length - 1]?.pricing_plans?.join(', ') ||
                                            row.stats[row.stats.length - 1]?.price ||
                                            'N/A'}
                                    </TableCell>
                                    <TableCell padding="none" onClick={e => e.stopPropagation()}>
                                        <a href={row.url} target="_blank" rel="noreferrer">
                                            Open
                                        </a>
                                    </TableCell>
                                    <TableCell padding="none">
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
            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50, 100, 200]}
                component="div"
                count={totalCount}
                rowsPerPage={limit}
                page={Math.floor(offset / limit)}
                onPageChange={(e, page) => {
                    setOffset(page * limit);
                }}
                onRowsPerPageChange={event => {
                    setLimit(Number(event.target.value) || 1);
                    setOffset(0);
                }}
            />
            <Snackbar open={Boolean(toastText)} autoHideDuration={6000} onClose={handleClose} message={toastText} />
        </Paper>
    );
}
