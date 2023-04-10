import React from 'react';
import { TableCell, TableHead, TableRow } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import TableSortLabel from '@mui/material/TableSortLabel';

interface Props {
    onSelectAllClick: (selected: boolean) => void;
    numSelected: number;
    rowCount: number;
}

export function EnhancedTableHead({ onSelectAllClick, numSelected, rowCount }: Props) {
    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        onSelectAllClick(event.target.checked);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={handleSelectAll}
                        inputProps={{
                            'aria-label': 'select all departments',
                        }}
                    />
                </TableCell>
                <TableCell>
                    <TableSortLabel>selected Departments</TableSortLabel>
                </TableCell>
            </TableRow>
        </TableHead>
    );
}
