import Toolbar from '@mui/material/Toolbar';
import { alpha, Autocomplete, AutocompleteChangeReason, FilterOptionsState, TextField } from '@mui/material';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GET_COLLECTIONS_AUTOCOMPLETE } from '../../../store/saga/collection.saga';
import { getCollections, getCollectionsIsLoading } from '../../../store/slice/collection.slice';
import { Collection } from '../../../store/types';

interface Props {
    numSelected: number;
    addCollectionHandler: (collection: Collection) => void;
    filterCollections: (collections: Collection[]) => Collection[];
    deleteCollections: () => void;
}

export function EnhancedTableToolbar({
    addCollectionHandler,
    numSelected,
    filterCollections,
    deleteCollections,
}: Props) {
    const dispatch = useDispatch();
    const list = useSelector(getCollections);
    const [inputValue, setInputValue] = useState('');
    const isLoading = useSelector(getCollectionsIsLoading);

    const inputHandler = (event: React.SyntheticEvent, value: string, reason: string) => {
        setInputValue(value);

        if (value && reason === 'input') {
            dispatch({ type: GET_COLLECTIONS_AUTOCOMPLETE, payload: { limit: 20, title: value } });
        }
    };

    const selectHandler = (event: React.SyntheticEvent, value: Collection | null, reason: AutocompleteChangeReason) => {
        if (reason === 'selectOption' && value) {
            addCollectionHandler(value);
        }
    };

    const filterHandler = (collections: Collection[], state: FilterOptionsState<Collection>) => {
        return filterCollections(collections);
    };

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: theme => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
                justifyContent: 'center',
            }}
        >
            {numSelected > 0 ? (
                <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">
                    {numSelected} selected
                </Typography>
            ) : (
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={list}
                    sx={{ padding: 0 }}
                    fullWidth
                    loading={isLoading}
                    inputValue={inputValue}
                    onInputChange={inputHandler}
                    onChange={selectHandler}
                    filterOptions={filterHandler}
                    getOptionLabel={collection =>
                        `${collection.title}${
                            collection.description ? ` (${collection.description.substring(0, 100)})` : ''
                        }`
                    }
                    isOptionEqualToValue={(a, b) => a.handle === b.handle}
                    renderInput={params => <TextField {...params} label="Search collection" />}
                />
            )}
            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton onClick={deleteCollections}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            ) : null}
        </Toolbar>
    );
}
