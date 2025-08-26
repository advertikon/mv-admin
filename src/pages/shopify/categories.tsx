import Head from 'next/head';
import { Box, CircularProgress } from '@mui/material';
import { Container } from '@mui/system';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Layout } from '../../layouts/dashboard/layout';

import { ShopifyCategoryStat, ShopifyProductStat } from '../../types';
import { CategoriesTable } from '../../sections/shopify/categories-table';
import { ProductsChart } from '../../sections/shopify/product-chart';
import { Queries } from '../../query/query-client';

function Page() {
    const [category, setCategory] = useState('');

    const { data: categories, isLoading: loadingCategories } = useQuery<ShopifyCategoryStat[]>({
        queryKey: [Queries.SHOPIFY_GET_CATEGORIES_STAT],
    });

    const { data: products, isLoading: productsLoading } = useQuery<{
        products: ShopifyProductStat[];
        totalCount: number;
    }>({
        queryKey: [Queries.SHOPIFY_GET_PRODUCT_STAT, [category]],
        enabled: Boolean(category),
    });

    return (
        <>
            <Head>
                <title>Shopify | Categories Stats</title>
            </Head>
            <Container style={{ border: 'solid 1px black' }} maxWidth="xl" disableGutters>
                <Box sx={{ py: 3 }} style={{ border: 'solid 1px green', position: 'relative', minHeight: '440px' }}>
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            zIndex: 3,
                            backgroundColor: 'rgba(0, 0, 0, 0.3)',
                            display: loadingCategories || productsLoading ? 'flex' : 'none',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <CircularProgress />
                    </div>
                    <CategoriesTable setCategory={setCategory} data={categories} activeCategory={category} />
                </Box>
                <Box sx={{ py: 3 }} style={{ border: 'solid 1px green', height: '800px' }}>
                    {products && <ProductsChart products={products.products} />}
                </Box>
            </Container>
        </>
    );
}

Page.getLayout = page => <Layout>{page}</Layout>;

export default Page;
