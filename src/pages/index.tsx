import Head from 'next/head';
import Link from 'next/link';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Container,
    Divider,
    Grid,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import { Chart } from '@components/chart';
import { Layout } from '../layouts/dashboard/layout';
import { getFitnessOverview } from '../services/fitness-usage.service';

function date(value?: string | null) {
    return value ? format(new Date(value), 'yyyy-MM-dd HH:mm') : '-';
}

function number(value: number | undefined) {
    return (value ?? 0).toLocaleString();
}

function Metric({ label, value, detail }: { label: string; value: string; detail?: string }) {
    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Typography color="text.secondary" variant="overline">
                    {label}
                </Typography>
                <Typography variant="h4">{value}</Typography>
                {detail && (
                    <Typography color="text.secondary" variant="body2">
                        {detail}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
}

function EmptyRow({ colSpan, text }: { colSpan: number; text: string }) {
    return (
        <TableRow>
            <TableCell colSpan={colSpan}>{text}</TableCell>
        </TableRow>
    );
}

function Page() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['fitness-overview'],
        queryFn: getFitnessOverview,
        refetchInterval: 60_000,
    });
    const summary = data?.summary;
    const daily = data?.daily ?? [];
    const chartOptions = {
        chart: { background: 'transparent', toolbar: { show: false } },
        colors: ['#6366f1', '#14b8a6'],
        dataLabels: { enabled: false },
        grid: { borderColor: '#e5e7eb', strokeDashArray: 3 },
        legend: { position: 'top' as const },
        stroke: { curve: 'smooth' as const, width: 3 },
        xaxis: { categories: daily.map(item => item.day.slice(5)) },
        yaxis: { labels: { formatter: value => Math.round(value).toLocaleString() } },
    };

    return (
        <>
            <Head>
                <title>Fitness Tracker | Overview</title>
            </Head>
            <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
                <Container maxWidth="xl">
                    <Stack spacing={3}>
                        <Stack alignItems="center" direction="row" justifyContent="space-between">
                            <Box>
                                <Typography variant="h4">Fitness Tracker overview</Typography>
                                <Typography color="text.secondary" variant="body2">
                                    Usage, reliability, and AI cost at a glance
                                </Typography>
                            </Box>
                            <Button component={Link} href="/fitness/installations" variant="contained">
                                Installations
                            </Button>
                        </Stack>
                        {isError && <Typography color="error">Unable to load Fitness Tracker usage.</Typography>}
                        {isLoading && <Typography color="text.secondary">Loading usage data...</Typography>}
                        {!isLoading && !isError && (
                            <>
                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <Metric
                                            label="Active installations"
                                            value={number(summary?.activeInstallations)}
                                            detail="Seen in the last 30 days"
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <Metric
                                            label="New installations"
                                            value={number(summary?.newInstallations)}
                                            detail="Added in the last 7 days"
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <Metric label="Requests today" value={number(summary?.requestsToday)} />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <Metric label="AI calls today" value={number(summary?.aiCallsToday)} />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <Metric
                                            label="AI cost today"
                                            value={`$${(summary?.costToday ?? 0).toFixed(4)}`}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <Metric
                                            label="AI cost this month"
                                            value={`$${(summary?.costMonth ?? 0).toFixed(4)}`}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <Metric
                                            label="Cache-hit rate"
                                            value={`${(summary?.cacheHitRate ?? 0).toFixed(1)}%`}
                                            detail="Last 30 days"
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <Metric label="Failed requests today" value={number(summary?.failedToday)} />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <Metric
                                            label="Rejected requests today"
                                            value={number(summary?.rejectedToday)}
                                            detail="Rate or usage limit responses"
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <Metric
                                            label="Average requests"
                                            value={number(summary?.avgRequestsPerActive)}
                                            detail="Per active installation, 30 days"
                                        />
                                    </Grid>
                                </Grid>

                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12 }}>
                                        <Card>
                                            <CardHeader title="Model usage and cost" subheader="Last 30 days" />
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Model</TableCell>
                                                        <TableCell>Calls</TableCell>
                                                        <TableCell>Cost</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {data?.models?.length ? (
                                                        data.models.map(item => (
                                                            <TableRow key={item.model}>
                                                                <TableCell>{item.model}</TableCell>
                                                                <TableCell>{number(item.calls)}</TableCell>
                                                                <TableCell>${item.costUsd.toFixed(4)}</TableCell>
                                                            </TableRow>
                                                        ))
                                                    ) : (
                                                        <EmptyRow colSpan={3} text="No model usage" />
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </Card>
                                    </Grid>
                                </Grid>

                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, lg: 8 }}>
                                        <Card>
                                            <CardHeader title="Requests and AI calls" subheader="Last 30 days" />
                                            <CardContent>
                                                <Chart
                                                    height={320}
                                                    options={chartOptions}
                                                    series={[
                                                        { name: 'Requests', data: daily.map(item => item.requests) },
                                                        { name: 'AI calls', data: daily.map(item => item.aiCalls) },
                                                        {
                                                            name: 'Failed',
                                                            data: daily.map(item => item.failedRequests),
                                                        },
                                                    ]}
                                                    type="line"
                                                    width="100%"
                                                />
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid size={{ xs: 12, lg: 8 }}>
                                        <Card>
                                            <CardHeader
                                                title="Cost and active installations"
                                                subheader="Last 30 days"
                                            />
                                            <CardContent>
                                                <Chart
                                                    height={320}
                                                    options={{
                                                        ...chartOptions,
                                                        colors: ['#f59e0b', '#8b5cf6'],
                                                        yaxis: { labels: { formatter: value => value.toFixed(2) } },
                                                    }}
                                                    series={[
                                                        { name: 'Cost (USD)', data: daily.map(item => item.costUsd) },
                                                        {
                                                            name: 'Active installations',
                                                            data: daily.map(item => item.activeInstallations),
                                                        },
                                                    ]}
                                                    type="line"
                                                    width="100%"
                                                />
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid size={{ xs: 12, lg: 4 }}>
                                        <Card sx={{ height: '100%' }}>
                                            <CardHeader
                                                title="Platform usage"
                                                subheader="Active installations and requests"
                                            />
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Platform</TableCell>
                                                        <TableCell>Installations</TableCell>
                                                        <TableCell>Requests</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {data?.platforms?.length ? (
                                                        data.platforms.map(item => (
                                                            <TableRow key={item.platform}>
                                                                <TableCell>{item.platform}</TableCell>
                                                                <TableCell>{number(item.installations)}</TableCell>
                                                                <TableCell>{number(item.requests)}</TableCell>
                                                            </TableRow>
                                                        ))
                                                    ) : (
                                                        <EmptyRow colSpan={3} text="No platform data" />
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </Card>
                                    </Grid>
                                </Grid>

                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Card>
                                            <CardHeader
                                                title="App versions"
                                                subheader="Most active versions in the last 30 days"
                                            />
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Version</TableCell>
                                                        <TableCell>Installations</TableCell>
                                                        <TableCell>Requests</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {data?.versions?.length ? (
                                                        data.versions.map(item => (
                                                            <TableRow key={item.appVersion}>
                                                                <TableCell>{item.appVersion}</TableCell>
                                                                <TableCell>{number(item.installations)}</TableCell>
                                                                <TableCell>{number(item.requests)}</TableCell>
                                                            </TableRow>
                                                        ))
                                                    ) : (
                                                        <EmptyRow colSpan={3} text="No version data" />
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </Card>
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Card>
                                            <CardHeader title="Most active installations" subheader="Last 30 days" />
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Installation</TableCell>
                                                        <TableCell>Requests</TableCell>
                                                        <TableCell>AI cost</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {data?.topInstallations?.length ? (
                                                        data.topInstallations.map(item => (
                                                            <TableRow key={item.installationId}>
                                                                <TableCell>
                                                                    <Typography
                                                                        sx={{ fontFamily: 'monospace' }}
                                                                        variant="body2"
                                                                    >
                                                                        {item.installationId}
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell>{number(item.requests)}</TableCell>
                                                                <TableCell>${item.costUsd.toFixed(4)}</TableCell>
                                                            </TableRow>
                                                        ))
                                                    ) : (
                                                        <EmptyRow colSpan={3} text="No installation data" />
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </Card>
                                    </Grid>
                                </Grid>

                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Card>
                                            <CardHeader
                                                title="Recent model calls"
                                                action={
                                                    <Button component={Link} href="/fitness/model-calls" size="small">
                                                        View all
                                                    </Button>
                                                }
                                            />
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Date</TableCell>
                                                        <TableCell>Model</TableCell>
                                                        <TableCell>Status</TableCell>
                                                        <TableCell>Cost</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {data?.recentCalls?.length ? (
                                                        data.recentCalls.map(item => (
                                                            <TableRow key={item.id}>
                                                                <TableCell>{date(item.createdAt)}</TableCell>
                                                                <TableCell>{item.model || '-'}</TableCell>
                                                                <TableCell>{item.status}</TableCell>
                                                                <TableCell>${item.costUsd.toFixed(4)}</TableCell>
                                                            </TableRow>
                                                        ))
                                                    ) : (
                                                        <EmptyRow colSpan={4} text="No model calls" />
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </Card>
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Card>
                                            <CardHeader
                                                title="Recent failures"
                                                action={
                                                    <Button
                                                        component={Link}
                                                        href="/fitness/model-calls?status=failed"
                                                        size="small"
                                                    >
                                                        View all
                                                    </Button>
                                                }
                                            />
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Date</TableCell>
                                                        <TableCell>Request</TableCell>
                                                        <TableCell>Installation</TableCell>
                                                        <TableCell>Cost</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {data?.failures?.length ? (
                                                        data.failures.map(item => (
                                                            <TableRow key={item.id}>
                                                                <TableCell>{date(item.createdAt)}</TableCell>
                                                                <TableCell sx={{ fontFamily: 'monospace' }}>
                                                                    {item.requestId}
                                                                </TableCell>
                                                                <TableCell sx={{ fontFamily: 'monospace' }}>
                                                                    {item.installationId || '-'}
                                                                </TableCell>
                                                                <TableCell>${item.costUsd.toFixed(4)}</TableCell>
                                                            </TableRow>
                                                        ))
                                                    ) : (
                                                        <EmptyRow colSpan={4} text="No recent failures" />
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </Card>
                                    </Grid>
                                </Grid>
                                <Divider />
                                <Typography color="text.secondary" variant="caption">
                                    Costs and activity are based on settled usage records. Cache-hit rate covers the
                                    last 30 days.
                                </Typography>
                            </>
                        )}
                    </Stack>
                </Container>
            </Box>
        </>
    );
}

Page.getLayout = page => <Layout>{page}</Layout>;

export default Page;
