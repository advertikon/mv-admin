import { FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { Queries } from '../../../query/query-client';
import { KeywordLatestStat } from '../../../types';

type KeywordItem = { keyword: string; position: number; page: number };

const ApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
    loading: () => null,
});

const radarOptions: ApexOptions = {
    xaxis: {
        labels: {
            show: true,
            style: {
                colors: 'black,'.repeat(50).split(',').filter(Boolean),
                fontSize: '12px',
                fontFamily: 'Arial',
            },
        },
    },
    yaxis: {
        labels: {
            show: true,
            style: {
                colors: ['black'],
                fontSize: '12px',
                fontFamily: 'Arial',
            },
        },
    },
    dataLabels: {
        enabled: true,
        background: {
            enabled: true,
            borderRadius: 2,
        },
    },
    tooltip: {
        enabled: true,
    },
};

function sortRadarItems(a: KeywordItem, b: KeywordItem): number {
    return b.position - a.position;
}

export function AppHandlerStat() {
    const [handlersStat, setHandlersStat] = useState<Record<string, KeywordItem[]>>({});
    const [radarHandler, setRadarHandler] = useState<string>('');
    const [radarLabels, setRadarLabels] = useState<string[]>([]);
    const [radarSeries, setRadarSeries] = useState<ApexOptions['series']>([]);
    const [lineSeries, setLineSeries] = useState<ApexOptions['series']>([]);
    const [extractKeywordsAppHandler, setExtractKeywordsAppHandler] = useState<string>('');

    const { data: statsLatest } = useQuery<unknown, unknown, KeywordLatestStat[]>({
        queryKey: [Queries.SHOPIFY_GET_KEYWORDS_STATS_LATEST],
    });

    const { data: statsHistory } = useQuery<unknown, unknown, Record<string, { date: string; position: number }[]>>({
        queryKey: [Queries.SHOPIFY_GET_KEYWORDS_STATS_HISTORY, radarHandler],
        enabled: !!radarHandler,
    });

    const { data: extractedKeywords } = useQuery<unknown, unknown, string[]>({
        queryKey: [Queries.SHOPIFY_EXTRACT_KEYWORDS, extractKeywordsAppHandler],
        enabled: !!extractKeywordsAppHandler,
    });

    useEffect(() => {
        const aggregated =
            statsLatest?.reduce((acc, stat) => {
                if (!acc[stat.appHandler]) {
                    acc[stat.appHandler] = [];
                }
                acc[stat.appHandler].push({ keyword: stat.keyword, position: stat.position, page: stat.pageNumber });
                return acc;
            }, {}) ?? {};

        setHandlersStat(aggregated);
    }, [statsLatest]);

    useEffect(() => {
        handlersStat[radarHandler]?.sort(sortRadarItems);
        setRadarLabels(handlersStat[radarHandler]?.map(d => d.keyword) ?? []);
        setRadarSeries([
            { data: handlersStat[radarHandler]?.map(d => d.position) ?? [], name: findAppTitle(radarHandler) },
        ]);
    }, [radarHandler]);

    useEffect(() => {
        const series = Object.entries(statsHistory ?? {}).map(([keyword, stats]) => {
            return { data: stats.map(stat => ({ x: stat.date, y: stat.position })), name: keyword };
        });

        setLineSeries(series);
    }, [statsHistory]);

    function findAppTitle(handler: string): string {
        return statsLatest?.find(stat => stat.appHandler === handler && stat.appTitle)?.appTitle ?? '';
    }

    const setRadarDataHandler = (event: SelectChangeEvent<string>) => {
        setRadarHandler(event.target.value);
    };

    const setExtractKeywordsHandler = (event: SelectChangeEvent<string>) => {
        setExtractKeywordsAppHandler(event.target.value);
    };

    return (
        <Grid container alignContent="center" direction="column" rowGap={3}>
            <Grid item textAlign="center" style={{ border: 'solid 1px #ccc', borderRadius: 5 }}>
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="app-handle-select-label">Select App</InputLabel>
                    <Select
                        id="app-handlers-select"
                        labelId="app-handle-select-label"
                        onChange={setRadarDataHandler}
                        value={radarHandler}
                    >
                        {Object.keys(handlersStat).map(handler => (
                            <MenuItem key={handler} value={handler}>
                                {findAppTitle(handler)}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item minWidth="100%" style={{ border: 'solid 1px #ccc', borderRadius: 5 }}>
                <ApexChart
                    options={{ ...radarOptions, labels: radarLabels }}
                    series={radarSeries}
                    type="radar"
                    width="100%"
                    height="auto"
                />
            </Grid>
            <Grid item minWidth="100%" style={{ border: 'solid 1px #ccc', borderRadius: 5 }}>
                <ApexChart options={{}} series={lineSeries} type="line" width="100%" height="auto" />
            </Grid>
            <Grid item textAlign="center" style={{ border: 'solid 1px #ccc', borderRadius: 5 }}>
                <FormControl sx={{ m: 1, minWidth: 300 }}>
                    <InputLabel id="extract-app-handle-select-label">Extract keywords for app</InputLabel>
                    <Select
                        id="extract-app-handlers-select"
                        labelId="extract-app-handle-select-label"
                        onChange={setExtractKeywordsHandler}
                        value={extractKeywordsAppHandler}
                    >
                        {Object.keys(handlersStat).map(handler => (
                            <MenuItem key={handler} value={handler}>
                                {findAppTitle(handler)}
                            </MenuItem>
                        ))}
                    </Select>
                    <TextField
                        type="text"
                        id="extract-keywords-list"
                        label="Extract keywords for app"
                        value={extractedKeywords?.join('\n') ?? []}
                        multiline
                    />
                </FormControl>
            </Grid>
        </Grid>
    );
}
