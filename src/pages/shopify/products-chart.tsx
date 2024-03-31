/* eslint-disable no-underscore-dangle */
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ShopifyProductStat } from '../../types';

type Props = {
    products: ShopifyProductStat[];
};

function formatData(products: ShopifyProductStat[]): Record<string, string | number>[] {
    const formattedData = new Map<string, Record<string, string | number>>();
    products.forEach(product => {
        product.stats.forEach(stat => {
            if (!formattedData.has(stat.date)) {
                // formattedData.set(stat.date, { date: new Date(stat.date).getTime() });
                formattedData.set(stat.date, { date: stat.date });
            }

            formattedData.get(stat.date)[product.name] = stat.reviews;
        });
    });

    return Array.from(formattedData.values()).sort((a, b) => (a.date > b.date ? 1 : -1));
}

export function ProductsChart({ products }: Readonly<Props>) {
    const [activeLine, setActiveLine] = useState<string | null>(null);
    const [hoveredLegend, setHoveredLegend] = useState<string | null>(null);

    const legendOnClickHandler = (e: any) => {
        setActiveLine(e.dataKey);
    };

    const legendOnHoverHandler = (e: any) => {
        setHoveredLegend(e.dataKey);
    };

    const legendOnMouseOutHandler = () => {
        setHoveredLegend(null);
    };

    const renderLabel = () => {
        const product = products.find(p => p.name === hoveredLegend);

        return (
            product && (
                <svg x="0" y="0" width="300" height="120" viewBox="0 0 300 120" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0" y="0" width="200" height="100" stroke="#333333" fill="#98cbf5" strokeWidth="1" />
                    <text x="10" y="20" dy="0" fontSize="12" fill="#333333">
                        avg total: {Math.round(product.avgReviews)}
                    </text>
                    <text x="10" y="35" dy="0" fontSize="12" fill="#333333">
                        avg month: {Math.round(product.pastMonthReviews)}
                    </text>
                    <text x="10" y="50" dy="0" fontSize="12" fill="#333333">
                        avg month2: {Math.round(product.past2MonthReviews)}
                    </text>
                    <text x="10" y="65" dy="0" fontSize="12" fill="#333333">
                        avg month3: {Math.round(product.past3MonthReviews)}
                    </text>
                    <text x="10" y="80" dy="0" fontSize="12" fill="#333333">
                        {product.created_at}
                    </text>
                    <text x="10" y="95" dy="0" fontSize="12" fill="#333333">
                        {product.developer}
                    </text>
                </svg>
            )
        );
    };

    const renderDotLabel = (props: any) => {
        const { x, y, stroke, value } = props;

        return (
            <text x={x} y={y} dy={-10} fill={stroke} fontSize={10} textAnchor="middle">
                {value}
            </text>
        );
    };

    const clickLineHandler = (e: any, a: any, b: any) => {
        console.log('clickLineHandler', a);
    };

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                width={500}
                height={300}
                data={formatData(products)}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" type="category" />
                {/* <XAxis dataKey="date" type="category" scale="time" domain={['dataMin', 'dataMax']} /> */}
                <YAxis />
                <Tooltip content={renderLabel} active={Boolean(hoveredLegend)} position={{ x: 150, y: 250 }} />
                <Legend
                    onClick={legendOnClickHandler}
                    onMouseOver={legendOnHoverHandler}
                    onMouseOut={legendOnMouseOutHandler}
                />
                {products.map(product => (
                    <Line
                        key={product._id}
                        type="monotone"
                        connectNulls
                        dataKey={product.name}
                        stroke={
                            product.name === activeLine ? 'red' : product.name === hoveredLegend ? 'green' : '#8884d8'
                        }
                        strokeWidth={product.name === activeLine || product.name === hoveredLegend ? 4 : 1}
                        label={product.name === activeLine ? renderDotLabel : false}
                        onClick={clickLineHandler}
                    />
                ))}
            </LineChart>
        </ResponsiveContainer>
    );
}
