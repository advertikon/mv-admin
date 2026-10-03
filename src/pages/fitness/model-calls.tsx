import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import {
    Box,
    Card,
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import { format } from 'date-fns';
import { Layout } from '../../layouts/dashboard/layout';
import { getFitnessModelCalls } from '../../services/fitness-usage.service';

function date(value?: string | null) {
    return value ? format(new Date(value), 'yyyy-MM-dd HH:mm:ss') : '-';
}

function Page() {
    const router = useRouter();
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(25);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [responseCacheHit, setResponseCacheHit] = useState('');
    const [installationId, setInstallationId] = useState('');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    useEffect(() => {
        if (!router.isReady) return;
        const installationIdValue = router.query.installationId;
        const statusValue = router.query.status;
        if (typeof installationIdValue === 'string') setInstallationId(installationIdValue);
        if (typeof statusValue === 'string') setStatus(statusValue);
    }, [router.isReady, router.query.installationId, router.query.status]);
    const { data, isLoading } = useQuery({
        queryKey: ['fitness-model-calls', page, pageSize, search, status, responseCacheHit, installationId, from, to],
        queryFn: () =>
            getFitnessModelCalls({ page, pageSize, search, status, responseCacheHit, installationId, from, to }),
    });

    return (
        <>
            <Head>
                <title>Fitness Tracker | Model Calls</title>
            </Head>
            <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
                <Container maxWidth="xl">
                    <Stack spacing={3}>
                        <Typography variant="h4">Fitness Tracker model calls</Typography>
                        <Card sx={{ p: 2 }}>
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                                <TextField
                                    label="Search request, operation, model, installation"
                                    value={search}
                                    onChange={e => {
                                        setPage(0);
                                        setSearch(e.target.value);
                                    }}
                                    fullWidth
                                />
                                <FormControl sx={{ minWidth: 140 }}>
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        value={status}
                                        label="Status"
                                        onChange={e => {
                                            setPage(0);
                                            setStatus(e.target.value);
                                        }}
                                    >
                                        <MenuItem value="">All</MenuItem>
                                        <MenuItem value="consumed">Consumed</MenuItem>
                                        <MenuItem value="failed">Failed</MenuItem>
                                        <MenuItem value="rejected">Rejected</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl sx={{ minWidth: 160 }}>
                                    <InputLabel>Cache hit</InputLabel>
                                    <Select
                                        value={responseCacheHit}
                                        label="Cache hit"
                                        onChange={e => {
                                            setPage(0);
                                            setResponseCacheHit(e.target.value);
                                        }}
                                    >
                                        <MenuItem value="">All</MenuItem>
                                        <MenuItem value="true">Cache hit</MenuItem>
                                        <MenuItem value="false">Not cache hit</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField
                                    label="Installation ID"
                                    value={installationId}
                                    onChange={e => {
                                        setPage(0);
                                        setInstallationId(e.target.value);
                                    }}
                                    sx={{ minWidth: 250 }}
                                />
                                <TextField
                                    label="From"
                                    type="date"
                                    value={from}
                                    onChange={e => {
                                        setPage(0);
                                        setFrom(e.target.value);
                                    }}
                                    InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                    label="To"
                                    type="date"
                                    value={to}
                                    onChange={e => {
                                        setPage(0);
                                        setTo(e.target.value);
                                    }}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Stack>
                        </Card>
                        <Card>
                            <Box sx={{ overflowX: 'auto' }}>
                                <Table sx={{ minWidth: 1450 }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Date</TableCell>
                                            <TableCell>Model</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Request</TableCell>
                                            <TableCell>Input</TableCell>
                                            <TableCell>Cached</TableCell>
                                            <TableCell>Cache write</TableCell>
                                            <TableCell>Output</TableCell>
                                            <TableCell>Total</TableCell>
                                            <TableCell>Price</TableCell>
                                            <TableCell>Cache hit</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {isLoading && (
                                            <TableRow>
                                                <TableCell colSpan={11}>Loading...</TableCell>
                                            </TableRow>
                                        )}
                                        {!isLoading && !data?.modelCalls?.length && (
                                            <TableRow>
                                                <TableCell colSpan={11}>No model calls found.</TableCell>
                                            </TableRow>
                                        )}
                                        {data?.modelCalls?.map(item => (
                                            <TableRow hover key={item.id}>
                                                <TableCell>{date(item.createdAt)}</TableCell>
                                                <TableCell>{item.model || '-'}</TableCell>
                                                <TableCell>{item.status}</TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                                        {item.requestId}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{item.inputTokens}</TableCell>
                                                <TableCell>{item.cachedTokens}</TableCell>
                                                <TableCell>{item.cacheWriteTokens}</TableCell>
                                                <TableCell>{item.outputTokens}</TableCell>
                                                <TableCell>{item.totalTokens}</TableCell>
                                                <TableCell>${item.actualCostUsd.toFixed(6)}</TableCell>
                                                <TableCell>{item.responseCacheHit ? 'Yes' : 'No'}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                            <TablePagination
                                component="div"
                                count={data?.totalCount || 0}
                                page={page}
                                rowsPerPage={pageSize}
                                rowsPerPageOptions={[25, 50, 100]}
                                onPageChange={(_, value) => setPage(value)}
                                onRowsPerPageChange={e => {
                                    setPage(0);
                                    setPageSize(Number(e.target.value));
                                }}
                            />
                        </Card>
                    </Stack>
                </Container>
            </Box>
        </>
    );
}

Page.getLayout = page => <Layout>{page}</Layout>;
export default Page;
