import * as React from 'react';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { Button, TextField } from '@mui/material';
import { ulid } from 'ulid';
import { toast } from 'react-toastify';
import { useCallback, useState } from 'react';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

type Props = {
    items: string[];
    setParentList: (list: string[]) => void;
};

export default function MultipleSelectChip({ items = [], setParentList }: Readonly<Props>) {
    const [list, setList] = useState<string[]>(items);
    const [selectedItems, setSelectedItems] = useState<string[]>(items);
    const [id] = React.useState<string>(ulid());
    const [newItem, setNewItem] = useState<string>('');

    const handleChange = (event: SelectChangeEvent<string[]>) => {
        const {
            target: { value },
        } = event;
        setSelectedItems(value as string[]);
        setParentList(value as string[]);
    };

    const newItemChangeHandler = event => {
        setNewItem(event.target.value);
    };

    const addItemHandler = () => {
        if (!newItem) {
            toast.error('Please enter a value');
            return;
        }

        if (list.includes(newItem)) {
            toast.error('Value already exists');
            return;
        }

        setList([...list, newItem]);
        setSelectedItems([...selectedItems, newItem]);
        setParentList([...selectedItems, newItem]);
        setNewItem('');
    };

    const getStyles = useCallback(
        (name: string) => {
            return {
                fontWeight: selectedItems.includes(name) ? '600' : '400',
                color: selectedItems.includes(name) ? 'black' : 'gray',
            };
        },
        [selectedItems]
    );

    return (
        <div>
            <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id={`${id}-select-label`}>Selected items</InputLabel>
                <Select
                    labelId={`${id}-select-label`}
                    id={`${id}-select`}
                    multiple
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    value={selectedItems}
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    onChange={handleChange}
                    input={<OutlinedInput id={`${id}-chip`} label="Selected items" />}
                    renderValue={selected => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {(selected as unknown as string[]).map(value => (
                                <Chip key={value} label={value} />
                            ))}
                        </Box>
                    )}
                    MenuProps={MenuProps}
                >
                    {list.map(name => (
                        <MenuItem key={name} value={name} style={getStyles(name)}>
                            {name}
                        </MenuItem>
                    ))}
                </Select>
                <Box style={{ marginTop: 5, display: 'flex' }}>
                    <TextField
                        id={`${id}-input`}
                        label="Add new value"
                        variant="outlined"
                        value={newItem}
                        onChange={newItemChangeHandler}
                    />
                    <Button variant="contained" onClick={addItemHandler}>
                        ADD
                    </Button>
                </Box>
            </FormControl>
        </div>
    );
}
