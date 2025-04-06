import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/system';
import { useQuery } from '@tanstack/react-query';
import { Queries } from '../../../query/query-client';

type Props = {
    setShops: (shops: string[]) => void;
};

interface Shop {
    name: string;
}

const SearchField = styled(Autocomplete)(({ theme }) => ({
    borderColor: theme.palette.blue.main,
    borderWidth: 1,
    borderStyle: 'solid',
    minWidth: 120,
    borderRadius: 10,
}));

export default function SearchCompanyInput({ setShops }: Props) {
    const [open, setOpen] = React.useState(false);
    const [queryString, setQueryString] = React.useState('');

    const { data: shops, isLoading } = useQuery<unknown, unknown, Shop[]>({
        queryKey: [Queries.FEED_APP_SEARCH_SHOP, queryString],
        enabled: Boolean(queryString),
    });

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleInputChange = (event: React.SyntheticEvent, value: string) => {
        setQueryString(value);
    };

    const handleOptionChange = (event: React.SyntheticEvent, value: Shop[]) => {
        setShops(value.map(shop => shop.name));
    };

    return (
        <SearchField
            open={open}
            multiple
            fullWidth
            onOpen={handleOpen}
            onClose={handleClose}
            // isOptionEqualToValue={(option, value) => option.title === value.title}
            getOptionLabel={option => (option as any).name}
            options={shops || []}
            loading={isLoading}
            onInputChange={handleInputChange}
            onChange={handleOptionChange}
            renderInput={params => (
                <TextField
                    {...params}
                    label="Search company"
                    slotProps={{
                        input: {
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        },
                    }}
                />
            )}
        />
    );
}
