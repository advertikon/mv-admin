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
import { useCallback, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import TablePagination from '@mui/material/TablePagination';
import TableSortLabel from '@mui/material/TableSortLabel';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/system/Grid';
import { Queries } from '../../../query/query-client';

type CompanyType = {
    id: string;
    name: string;
    variants_count: number;
    xml_feeds_count: number;
    gmc_api_profiles_count: number;
    xml_feed_active: boolean;
    gmc_api_active: boolean;
    installed_at: string;
    uninstalled_at?: string;
    last_visited_at: string;
    review_pop_up_shown_at?: string;
    google_credentials: {
        access_token_set: boolean;
        refresh_token_set: boolean;
        scopes: string[];
        expiry_date: number;
        google_merchant_account_id: string;
        google_merchant_account_name: string;
    };
};

export enum CompanyListFilter {
    UNINSTALLED = 'uninstalled',
    REVIEW_SHOWN = 'review_shown',
    REVIEW_NOT_SHOWN = 'review_not_shown',
    HAS_FEED = 'has_feed',
    NO_FEED = 'no_feed',
    ACTIVE_FEED = 'active_feed',
    NO_ACTIVE_FEED = 'no_active_feed',
    GMC_CREDS_OK = 'gmc_creds_ok',
    GMC_CREDS_NOT_OK = 'gmc_creds_not_ok',
}

const headerLabels = {
    name: 'Name',
    installed_at: 'Installed',
    uninstalled_at: 'Uninstalled',
    last_visited_at: 'Last visit',
    review_pop_up_shown_at: 'Review shown',
    variants_count: 'Variants',
    xml_feeds_count: 'Feeds',
    gmc_api_profiles_count: 'GMC APIs',
    google_credentials: 'Google Creds',
};

export function CompaniesTable() {
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState<string>('installed_at');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [currentPage, setCurrentPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [offset, setOffset] = useState(0);
    const [list, setList] = useState<CompanyType[]>([]);
    const [total, setTotal] = useState(0);
    const [filter, setFilter] = useState<CompanyListFilter[]>([]);

    const dateFormatter = React.useMemo(
        () =>
            new Intl.DateTimeFormat(navigator.language, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }),
        []
    );

    const { data } = useQuery<{ list: CompanyType[]; total: number }>({
        queryKey: [Queries.FEED_APP_GET_COMPANIES, limit, offset, sort, sortDirection, filter, search],
    });

    const gmcStatus = useCallback(
        ({
            google_credentials: { access_token_set, refresh_token_set, expiry_date, google_merchant_account_id },
        }: CompanyType) => {
            const status = { status: false, issue: '' };

            if (!access_token_set) {
                status.issue = 'Missing access token';
            } else if (!refresh_token_set) {
                status.issue = 'Missing refresh token';
            } else if (!expiry_date && new Date(expiry_date) < new Date()) {
                status.issue = 'Missing expiry date or expired';
            } else if (!google_merchant_account_id) {
                status.issue = 'Missing Google Merchant Account ID';
            } else {
                status.status = true;
            }

            return status;
        },
        []
    );

    useEffect(() => {
        if (data) {
            setList(data.list);
            setTotal(data.total);
        }
    }, [data]);

    const handleSearchHandler = (event: any) => {
        // @ts-ignore
        setSearch(event.target.value);
    };

    const handleFilterChange = (filterType: CompanyListFilter, status: boolean) => {
        if (status) {
            setFilter(prev => [...prev, filterType]);
        } else {
            setFilter(prev => prev.filter(f => f !== filterType));
        }
    };

    return (
        <Paper sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', paddingBottom: '15px' }}>
                <Grid container style={{ justifyContent: 'center' }}>
                    <Grid size={4} alignSelf="center" justifySelf="center">
                        <FormGroup>
                            <TextField
                                id="outlined-basic"
                                label="Search store by handle"
                                variant="standard"
                                onChange={handleSearchHandler}
                            />
                        </FormGroup>
                    </Grid>
                    <Grid
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                        }}
                    >
                        <FormControlLabel
                            control={
                                <Checkbox
                                    defaultChecked={filter.includes(CompanyListFilter.UNINSTALLED)}
                                    onChange={e => {
                                        handleFilterChange(CompanyListFilter.UNINSTALLED, e.target.checked);
                                    }}
                                />
                            }
                            label="Uninstalled"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    defaultChecked={filter.includes(CompanyListFilter.REVIEW_SHOWN)}
                                    onChange={e => {
                                        handleFilterChange(CompanyListFilter.REVIEW_SHOWN, e.target.checked);
                                    }}
                                />
                            }
                            label="Review shown"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    defaultChecked={filter.includes(CompanyListFilter.REVIEW_NOT_SHOWN)}
                                    onChange={e => {
                                        handleFilterChange(CompanyListFilter.REVIEW_NOT_SHOWN, e.target.checked);
                                    }}
                                />
                            }
                            label="Review not shown"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    defaultChecked={filter.includes(CompanyListFilter.HAS_FEED)}
                                    onChange={e => {
                                        handleFilterChange(CompanyListFilter.HAS_FEED, e.target.checked);
                                    }}
                                />
                            }
                            label="Has feed"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    defaultChecked={filter.includes(CompanyListFilter.NO_FEED)}
                                    onChange={e => {
                                        handleFilterChange(CompanyListFilter.NO_FEED, e.target.checked);
                                    }}
                                />
                            }
                            label="No feeds"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    defaultChecked={filter.includes(CompanyListFilter.ACTIVE_FEED)}
                                    onChange={e => {
                                        handleFilterChange(CompanyListFilter.ACTIVE_FEED, e.target.checked);
                                    }}
                                />
                            }
                            label="Active feed"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    defaultChecked={filter.includes(CompanyListFilter.NO_ACTIVE_FEED)}
                                    onChange={e => {
                                        handleFilterChange(CompanyListFilter.NO_ACTIVE_FEED, e.target.checked);
                                    }}
                                />
                            }
                            label="No active feeds"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    defaultChecked={filter.includes(CompanyListFilter.GMC_CREDS_OK)}
                                    onChange={e => {
                                        handleFilterChange(CompanyListFilter.GMC_CREDS_OK, e.target.checked);
                                    }}
                                />
                            }
                            label="GMC creds"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    defaultChecked={filter.includes(CompanyListFilter.GMC_CREDS_NOT_OK)}
                                    onChange={e => {
                                        handleFilterChange(CompanyListFilter.GMC_CREDS_NOT_OK, e.target.checked);
                                    }}
                                />
                            }
                            label="GMC creds issue"
                        />
                    </Grid>
                </Grid>
            </Box>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {Object.entries(headerLabels).map(([key, label]) => (
                                <TableCell key={key} align="center">
                                    {key !== 'google_credentials' ? (
                                        <TableSortLabel
                                            active={sort === key}
                                            direction={sortDirection}
                                            onClick={() => {
                                                setSort(key);
                                                setSortDirection(direction => (direction === 'asc' ? 'desc' : 'asc'));
                                            }}
                                        >
                                            {label}
                                        </TableSortLabel>
                                    ) : (
                                        label
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {list?.map(row => (
                            // <TableRow hover key={row.name} onClick={() => {}} sx={{ backgroundColor: 'inherit' }}>
                            //     <TableCell>{row.name}</TableCell>
                            //     <TableCell>{dateFormatter.format(new Date(row.installed_at))}</TableCell>
                            //     <TableCell>
                            //         {row.uninstalled_at && dateFormatter.format(new Date(row.uninstalled_at))}
                            //     </TableCell>
                            //     <TableCell>{dateFormatter.format(new Date(row.last_visited_at))}</TableCell>
                            //     <TableCell>
                            //         {row.review_pop_up_shown_at &&
                            //             dateFormatter.format(new Date(row.review_pop_up_shown_at))}
                            //     </TableCell>
                            //     <TableCell>{row.variants_count}</TableCell>
                            //     <TableCell style={{ color: row.xml_feed_active ? 'green' : 'red' }}>
                            //         {row.xml_feeds_count}
                            //     </TableCell>
                            //     <TableCell style={{ color: row.gmc_api_profiles_count ? 'green' : 'red' }}>
                            //         {row.gmc_api_profiles_count}
                            //     </TableCell>

                            //     <TableCell style={{ color: gmcStatus(row).status ? 'green' : 'red' }} align="center">
                            //         {gmcStatus(row).status ? 'Yes' : gmcStatus(row).issue}
                            //     </TableCell>
                            // </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[1, 10, 25, 100]}
                rowsPerPage={limit}
                component="div"
                count={total ?? 0}
                page={currentPage}
                onPageChange={(event, newPage) => {
                    setCurrentPage(newPage);
                    setOffset(newPage * limit);
                }}
                onRowsPerPageChange={event => {
                    const newLimit = parseInt(event.target.value, 10);
                    setCurrentPage(0);
                    setOffset(0);
                    setLimit(newLimit);
                }}
            />
        </Paper>
    );
}
