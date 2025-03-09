import Head from 'next/head';
import { Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { Container } from '@mui/system';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import _ from 'lodash';
import { Layout } from '../../layouts/dashboard/layout';

import { ProductsChart } from '../../sections/shopify/product-chart';
import { ProductsTable } from '../../sections/shopify/products-table';
import { ShopifyProductStat } from '../../types';
import { Queries } from '../../query/query-client';

function Page() {
    const [category, setCategory] = useState('');
    const [chartProducts, setChartsProducts] = useState<ShopifyProductStat[]>([]);
    const [productFilter, setProductFilter] = useState('');
    const [productFilterValue, setProductFilterValue] = useState('');
    const [searchString, setSearchString] = useState('');
    const [searchStringValue, setSearchStringValue] = useState('');

    const { data: categories, isLoading: loadingCategories } = useQuery<string[]>({
        queryKey: [Queries.SHOPIFY_GET_CATEGORIES_LIST],
    });

    const { data: products, isLoading: productsLoading } = useQuery<ShopifyProductStat[]>({
        queryKey: [Queries.SHOPIFY_GET_PRODUCT_STAT, [category, productFilter, searchString]],
        enabled: Boolean(category) || Boolean(productFilter) || Boolean(searchString),
    });

    const changeCategoryHandler = (event: any) => {
        setCategory(event.target.value);
        setChartsProducts([]);
    };

    const changeProductHandler = (productNames: string[]) => {
        setChartsProducts(products?.filter(p => productNames.includes(p.name)) || []);
    };

    const changeProductFilterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setProductFilter(event.target.value);
    };

    const changeSearchStringHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchString(event.target.value);
    };

    const resetFiltersHandler = () => {
        setCategory('');
        setProductFilter('');
        setProductFilterValue('');
        setSearchString('');
        setSearchStringValue('');
    };

    return (
        <>
            <Head>
                <title>Shopify | Products Stats</title>
            </Head>
            <Container style={{ border: 'solid 0px black' }} maxWidth="xl" disableGutters>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        padding: '20px',
                        backgroundColor: 'rgba(255, 60, 0, 0.4)',
                        borderRadius: '10px',
                        border: 'solid 1px #000',
                    }}
                >
                    <FormControl sx={{ minWidth: 120 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px' }}>
                            <div>
                                <InputLabel
                                    id="demo-simple-select-helper-label"
                                    style={{ fontWeight: 'bold', color: '#000' }}
                                >
                                    Select category
                                </InputLabel>
                                <Select
                                    id="demo-simple-select-standard"
                                    labelId="demo-simple-select-helper-label"
                                    label="Select category"
                                    value={category}
                                    onChange={changeCategoryHandler}
                                    disabled={loadingCategories}
                                    fullWidth
                                >
                                    {categories?.map(c => (
                                        <MenuItem value={c} key={c}>
                                            <em>{c}</em>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </div>
                            <div style={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
                                <TextField
                                    id="filter-products"
                                    value={productFilterValue}
                                    onChange={v => {
                                        _.debounce(changeProductFilterHandler, 1000)(v);
                                        setProductFilterValue(v.target.value);
                                    }}
                                    disabled={loadingCategories}
                                    type="text"
                                    variant="outlined"
                                    placeholder="Filter products"
                                />
                            </div>
                            <div style={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
                                <TextField
                                    id="search-products"
                                    value={searchStringValue}
                                    onChange={v => {
                                        _.debounce(changeSearchStringHandler, 2000)(v);
                                        setSearchStringValue(v.target.value);
                                    }}
                                    disabled={loadingCategories}
                                    type="text"
                                    variant="outlined"
                                    placeholder="Search in Shopify"
                                />
                            </div>
                            <div style={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={resetFiltersHandler}
                                    disabled={loadingCategories}
                                    fullWidth
                                >
                                    Reset filters
                                </Button>
                            </div>
                        </div>
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
