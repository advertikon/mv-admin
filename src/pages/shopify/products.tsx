import Head from 'next/head';
import { Box, CircularProgress, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { Container } from '@mui/system';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Layout } from '../../layouts/dashboard/layout';

import { ProductsChart } from '../../sections/shopify/product-chart';
import { ProductsTable } from '../../sections/shopify/products-table';
import { ShopifyProductStat } from '../../types';
import { Queries } from '../../query/query-client';

function Page() {
    const [category, setCategory] = useState('');
    const [chartProducts, setChartsProducts] = useState<ShopifyProductStat[]>([]);

    const { data: categories, isLoading: loadingCategories } = useQuery<string[]>({
        queryKey: [Queries.SHOPIFY_GET_CATEGORIES_LIST],
    });

    const { data: products, isLoading: productsLoading } = useQuery<ShopifyProductStat[]>({
        queryKey: [Queries.SHOPIFY_GET_PRODUCT_STAT, [category]],
        enabled: Boolean(category),
    });

    const changeCategoryHandler = (event: any) => {
        setCategory(event.target.value);
        setChartsProducts([]);
    };

    const changeProductHandler = (productNames: string[]) => {
        setChartsProducts(products?.filter(p => productNames.includes(p.name)) || []);
    };

    return (
        <>
            <Head>
                <title>Shopify | Products Stats</title>
            </Head>
            <Container style={{ border: 'solid 0px black' }} maxWidth="xl" disableGutters>
                <Box sx={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                    <FormControl sx={{ minWidth: 120 }}>
                        <InputLabel id="demo-simple-select-helper-label">Select category</InputLabel>
                        <Select
                            id="demo-simple-select-standard"
                            labelId="demo-simple-select-helper-label"
                            label="Select category"
                            value={category}
                            onChange={changeCategoryHandler}
                            disabled={loadingCategories}
                        >
                            {categories?.map(c => (
                                <MenuItem value={c} key={c}>
                                    <em>{c}</em>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                <Box sx={{ py: 3 }} style={{ border: 'solid 0px green', minHeight: '440px', position: 'relative' }}>
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
                    {products && (
                        <ProductsTable
                            data={products}
                            setProduct={changeProductHandler}
                            activeProduct={chartProducts.map(p => p.name)}
                        />
                    )}
                </Box>
                <Box
                    sx={{ py: 3, marginBottom: '10px' }}
                    style={{ border: 'solid 0px green', height: '600px', position: 'relative' }}
                >
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
                    <ProductsChart products={chartProducts} detailedStats={false} />
                </Box>
            </Container>
        </>
    );
}

Page.getLayout = page => <Layout>{page}</Layout>;

export default Page;
