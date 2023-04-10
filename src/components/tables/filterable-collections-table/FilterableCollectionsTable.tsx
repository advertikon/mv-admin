import Paper from '@mui/material/Paper';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { Box, Table, TableBody, TableContainer, TablePagination } from '@mui/material';
import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { EnhancedTableHead } from './FilterableCollectionsHead';
import { EnhancedTableToolbar } from './FilterableCollectionsToolbar';
import FilterableCollectionsRow from './FIlterableCollectionsRow';
import { CONFIG_ADD_FILTERABLE_COLLECTIONS, CONFIG_GET_FILTERABLE_COLLECTIONS } from '../../../store/saga/config.saga';
import { getFilterableCollections, getIsFilterableCollectionsLoading } from '../../../store/slice/config.slice';
import { Collection } from '../../../store/types';

export default function FilterableCollectionsTable() {
    const dispatch = useDispatch();
    const collections = useSelector(getFilterableCollections);
    const isConfigLoading = useSelector(getIsFilterableCollectionsLoading);
    const [page, setPage] = React.useState(0);
    const dense = true;
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [selected, setSelected] = useState<readonly Collection[]>([]);
    const [rows, setRows] = useState<readonly Collection[]>([]);

    useEffect(() => {
        if (collections.length === 0) {
            dispatch({ type: CONFIG_GET_FILTERABLE_COLLECTIONS });
        }
    }, []);

    useEffect(() => {
        // remove deleted items from array of selected items
        const missingSelections = _.differenceBy(selected, collections, 'handle');

        if (missingSelections.length) {
            setSelected(state => _.differenceBy(state, missingSelections, 'handle'));
        }
    }, [isConfigLoading]);

    useEffect(() => {
        const start = page * rowsPerPage;
        const end = start + rowsPerPage;
        setRows(collections.slice(start, end));
    }, [collections, rowsPerPage, page]);

    const handleSelectAllClick = (isSelected: boolean) => {
        if (isSelected) {
            setSelected([...collections]);
        } else {
            setSelected([]);
        }
    };

    const addCollectionHandler = (collection: Collection) => {
        dispatch({ type: CONFIG_ADD_FILTERABLE_COLLECTIONS, payload: [...collections, collection] });
    };

    const deleteCollections = () => {
        dispatch({ type: CONFIG_ADD_FILTERABLE_COLLECTIONS, payload: _.differenceBy(collections, selected, 'handle') });
    };

    // filters out saved collections
    const filterCollections = (collectionsToShow: Collection[]): Collection[] => {
        return _.differenceBy(collectionsToShow, collections, 'handle');
    };

    const toggleSelection = (collection: Collection) => {
        if (selected.find(c => c.handle === collection.handle)) {
            setSelected(state => state.filter(c => c.handle !== collection.handle));
        } else {
            setSelected(state => [...state, collection]);
        }
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <EnhancedTableToolbar
                    numSelected={selected.length}
                    addCollectionHandler={addCollectionHandler}
                    deleteCollections={deleteCollections}
                    filterCollections={filterCollections}
                />
                <TableContainer>
                    <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}>
                        <EnhancedTableHead
                            numSelected={selected.length}
                            onSelectAllClick={handleSelectAllClick}
                            rowCount={collections.length}
                        />
                        <TableBody>
                            {rows.map(collection => (
                                <FilterableCollectionsRow
                                    key={collection.handle}
                                    collection={collection}
                                    selected={Boolean(selected.find(s => s.handle === collection.handle))}
                                    toggleSelection={toggleSelection}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={collections.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    );
}
