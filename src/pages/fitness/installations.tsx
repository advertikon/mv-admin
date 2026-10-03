import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
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
    Button,
} from '@mui/material';
import { format } from 'date-fns';
import { Layout } from '../../layouts/dashboard/layout';
import { getFitnessInstallations } from '../../services/fitness-usage.service';

function date(value?: string | null) {
    return value ? format(new Date(value), 'yyyy-MM-dd HH:mm') : '-';
}

function Page() {
    const router = useRouter();
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(25);
    const [search, setSearch] = useState('');
    const [platform, setPlatform] = useState('');
    const [status, setStatus] = useState('');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const { data, isLoading } = useQuery({
        queryKey: ['fitness-installations', page, pageSize, search, platform, status, from, to],
        queryFn: () => getFitnessInstallations({ page, pageSize, search, platform, status, from, to }),
    });

    return (
        <>
            <Head>
                <title>Fitness Tracker | Installations</title>
            </Head>
            <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
                <Container maxWidth="xl">
                    <Stack spacing={3}>
                        <Typography variant="h4">Fitness Tracker installations</Typography>
                        <Card sx={{ p: 2 }}>
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                                <TextField
                                    label="Search ID, version, platform"
                                    value={search}
                                    onChange={e => {
                                        setPage(0);
                                        setSearch(e.target.value);
                                    }}
                                    fullWidth
                                />
                                <FormControl sx={{ minWidth: 150 }}>
                                    <InputLabel>Platform</InputLabel>
                                    <Select
                                        value={platform}
                                        label="Platform"
                                        onChange={e => {
                                            setPage(0);
                                            setPlatform(e.target.value);
                                        }}
                                    >
                                        <MenuItem value="">All</MenuItem>
                                        <MenuItem value="android">Android</MenuItem>
                                        <MenuItem value="ios">iOS</MenuItem>
                                        <MenuItem value="other">Other</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl sx={{ minWidth: 150 }}>
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
                                        <MenuItem value="active">Active</MenuItem>
                                        <MenuItem value="inactive">Inactive</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField
                                    label="Seen from"
                                    type="date"
                                    value={from}
                                    onChange={e => {
                                        setPage(0);
                                        setFrom(e.target.value);
                                    }}
                                    InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                    label="Seen to"
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
                                <Table sx={{ minWidth: 1100 }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Installation</TableCell>
                                            <TableCell>Platform</TableCell>
                                            <TableCell>Version</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>First seen</TableCell>
                                            <TableCell>Last seen</TableCell>
                                            <TableCell>Requests</TableCell>
                                            <TableCell>AI calls</TableCell>
                                            <TableCell>Cost</TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {isLoading && (
                                            <TableRow>
                                                <TableCell colSpan={10}>Loading...</TableCell>
                                            </TableRow>
                                        )}
                                        {!isLoading && !data?.installations?.length && (
                                            <TableRow>
                                                <TableCell colSpan={10}>No installations found.</TableCell>
                                            </TableRow>
                                        )}
                                        {data?.installations?.map(item => (
                                            <TableRow hover key={item.id}>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                                        {item.id}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{item.platform}</TableCell>
                                                <TableCell>{item.appVersion || '-'}</TableCell>
                                                <TableCell>{item.status}</TableCell>
                                                <TableCell>{date(item.firstSeenAt)}</TableCell>
                                                <TableCell>{date(item.lastSeenAt)}</TableCell>
                                                <TableCell>{item.requests}</TableCell>
                                                <TableCell>{item.aiCalls}</TableCell>
                                                <TableCell>${item.costUsd.toFixed(6)}</TableCell>
                                                <TableCell>
                                                    <Button
                                                        size="small"
                                                        onClick={() =>
                                                            router.push({
                                                                pathname: '/fitness/model-calls',
                                                                query: { installationId: item.id },
                                                            })
                                                        }
                                                    >
                                                        View calls
                                                    </Button>
                                                </TableCell>
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
