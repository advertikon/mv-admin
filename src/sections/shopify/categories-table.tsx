/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import { ShopifyCategoryStat } from '../../types';

type Props = {
    data: ShopifyCategoryStat[];
    setCategory: (category: string) => void;
    activeCategory?: string;
};

function round(value: number | string): number | string {
    return typeof value === 'string' ? value : Math.round(value);
}

export function CategoriesTable({ data = [], setCategory, activeCategory }: Readonly<Props>) {
    const [search, setSearch] = useState('');
    const [filteredData, setFilteredData] = useState<ShopifyCategoryStat[]>([]);

    const handleSearchHandler = (event: any) => {
        // @ts-ignore
        setSearch(event.target.value);
    };

    useEffect(() => {
        if (search) {
            setFilteredData(data.filter(row => row.name.toLowerCase().includes(search.toLowerCase())));
        } else {
            setFilteredData(data);
        }
    }, [search]);

    useEffect(() => {
        setFilteredData(data);
    }, [JSON.stringify(data)]);

    return (
        <Paper sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', paddingBottom: '15px' }}>
                <TextField
                    id="outlined-basic"
                    label="Search category"
                    variant="standard"
                    onInput={handleSearchHandler}
                />
            </Box>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Name</TableCell>
                            <TableCell align="center">AvgPaid</TableCell>
                            <TableCell align="center">SumPaid</TableCell>
                            <TableCell align="center">CountPaid</TableCell>
                            <TableCell align="center">AvgFree</TableCell>
                            <TableCell align="center">SumFree</TableCell>
                            <TableCell align="center">CountFree</TableCell>
                            <TableCell align="center">StdDev</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.map(row => (
                            <TableRow
                                hover
                                key={row.name}
                                onClick={() => setCategory(row.name)}
                                sx={{
                                    backgroundColor: activeCategory === row.name ? '#79b3ff' : 'inherit',
                                }}
                            >
                                <TableCell sx={{ fontWeight: activeCategory === row.name ? 'bold' : 'normal' }}>
                                    {activeCategory === row.name ? `👉 ${row.name}` : row.name}
                                </TableCell>
                                <TableCell>{round(row.avgPaid)}</TableCell>
                                <TableCell>{round(row.paidSum)}</TableCell>
                                <TableCell>{row.paidCount}</TableCell>
                                <TableCell>{round(row.avgFree)}</TableCell>
                                <TableCell>{round(row.freeSum)}</TableCell>
                                <TableCell>{row.freeCount}</TableCell>
                                <TableCell>{round(row.stdDev)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            /> */}
        </Paper>
    );
}
