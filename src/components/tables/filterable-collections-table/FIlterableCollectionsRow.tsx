import React from 'react';
import { TableCell, TableRow } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';

import { Collection } from '../../../store/types';

type Props = {
    collection: Collection;
    selected: boolean;
    toggleSelection: (item: Collection) => void;
};

function FilterableCollectionsRow({ collection, selected, toggleSelection }: Props) {
    const handleSelect = () => {
        toggleSelection(collection);
    };

    return (
        <TableRow
            hover
            onClick={handleSelect}
            role="checkbox"
            aria-checked={selected}
            tabIndex={-1}
            key={collection.handle}
            selected={selected}
        >
            <TableCell padding="checkbox">
                <Checkbox
                    color="primary"
                    checked={selected}
                    inputProps={{
                        'aria-labelledby': `row-${collection.handle}`,
                    }}
                />
            </TableCell>
            <TableCell component="th" id={`row-${collection.handle}`} scope="row" padding="none">
                {collection.title}
            </TableCell>
        </TableRow>
    );
}

export default FilterableCollectionsRow;
