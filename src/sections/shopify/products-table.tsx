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
import { ShopifyProductStat } from '../../types';

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
    const handleProductsSelection = (product: string) => {
        if (activeProduct.includes(product)) {
            setProduct(activeProduct.filter(item => item !== product));
        } else {
            setProduct([...activeProduct, product]);
        }
    };

    return (
        <Paper sx={{ width: '100%' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Name</TableCell>
                            <TableCell align="center">Avg Total</TableCell>
                            <TableCell align="center">Avg 1month</TableCell>
                            <TableCell align="center">Avg 2month</TableCell>
                            <TableCell align="center">Avg 3month</TableCell>
                            <TableCell align="center">Created</TableCell>
                            <TableCell align="center">Developer</TableCell>
                            <TableCell align="center">Price</TableCell>
                            <TableCell align="center">Store</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map(row => (
                            <TableRow
                                hover
                                key={row._id}
                                onClick={() => handleProductsSelection(row.name)}
                                sx={{ backgroundColor: activeProduct.includes(row.name) ? '#79b3ff' : 'inherit' }}
                            >
                                <TableCell sx={{ fontWeight: activeProduct.includes(row.name) ? 600 : 400 }}>
                                    {row.name}
                                </TableCell>
                                <TableCell>{round(row.avgReviews)}</TableCell>
                                <TableCell>{round(row.pastMonthReviews)}</TableCell>
                                <TableCell>{round(row.past2MonthReviews)}</TableCell>
                                <TableCell>{round(row.past3MonthReviews)}</TableCell>
                                <TableCell>{row.created_at}</TableCell>
                                <TableCell>{row.developer}</TableCell>
                                <TableCell>
                                    {row.stats[row.stats.length - 1]?.pricing_plans?.join(', ') ?? ''}
                                </TableCell>
                                <TableCell>
                                    <a href={row.url} target="_blank" rel="noreferrer">
                                        Open
                                    </a>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}
