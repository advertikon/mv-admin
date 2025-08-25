/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable indent */
import dynamic from 'next/dynamic';
import { ShopifyProductStat } from '../../types';

type Props = {
    products: ShopifyProductStat[];
    detailedStats?: boolean;
};

const ApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
    loading: () => null,
});

const formatSeries = (products: ShopifyProductStat[]) => {
    return products.map(product => {
        return {
            name: product.name,
            data: product.stats.map(stat => ({ x: new Date(stat.date).getTime(), y: stat.reviews })),
        };
    });
};

export function ProductsChart({ products = [], detailedStats = true }: Readonly<Props>) {
    const labelFormatter = (value, { seriesIndex }) => {
        if (!detailedStats) {
            return value;
        }

        const product = products[seriesIndex];
        return `<table>
                    <tr><td>value</td><td>${value}</td></tr>
                    <tr><td>avg total</td><td>${Math.round(product?.avgReviews ?? 0)}</td></tr>
                    <tr><td>avg 1month</td><td>${Math.round(product?.pastMonthReviews ?? 0)}</td></tr>
                    <tr><td>avg 2month</td><td>${Math.round(product?.past2MonthReviews ?? 0)}</td></tr>
                    <tr><td>avg 3month</td><td>${Math.round(product?.past3MonthReviews ?? 0)}</td></tr>
                    <tr><td colspan="1">${product?.created_at ?? ''}</td></tr>
                    <tr><td colspan="1">${product?.developer ?? ''}</td></tr>
                    <tr><td colspan="1">${
                        product?.stats?.length ? product.stats[product.stats.length - 1].price ?? '' : ''
                    }</td></tr>
                </table>`;
    };

    const options = {
        chart: {
            id: 'basic-bar',
            animations: {
                animateGradually: {
                    enabled: false,
                },
            },
        },
        xaxis: {
            type: 'datetime',
        },
        tooltip: {
            y: {
                formatter: labelFormatter,
            },
        },
    };

    // @ts-ignore
    return <ApexChart options={options} series={formatSeries(products)} type="line" width="100%" height="100%" />;
}
