import Head from 'next/head';
import { Box, Grid } from '@mui/material';
import { Container, height } from '@mui/system';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Layout } from '../../layouts/dashboard/layout';
import { Queries } from '../../components/query/query-client';
import { ShopifyCategoryStat, ShopifyProductStat } from '../../types';
import { CategoriesTable } from './categories.table';
import { ProductsChart } from './products-chart';

function Page() {
    const [category, setCategory] = useState('');
    const { data } = useQuery<ShopifyCategoryStat[]>({ queryKey: [Queries.SHOPIFY_GET_CATEGORIES_STAT] });
    const { data: products } = useQuery<ShopifyProductStat[]>({
        queryKey: [Queries.SHOPIFY_GET_PRODUCT_STAT, [category]],
        enabled: Boolean(category),
    });

    return (
        <>
            <Head>
                <title>Shopify | Categories Stats</title>
            </Head>
            <Container style={{ border: 'solid 1px black' }} maxWidth="xl" disableGutters>
                <Box sx={{ py: 3 }} style={{ border: 'solid 1px green' }}>
                    <CategoriesTable data={data} setCategory={setCategory} />
                </Box>
                <Box sx={{ py: 3 }} style={{ border: 'solid 1px green', height: '1000px' }}>
                    {products && <ProductsChart products={products} />}
                </Box>
            </Container>
        </>
    );
}

Page.getLayout = page => <Layout>{page}</Layout>;

export default Page;
