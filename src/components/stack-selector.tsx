import * as React from 'react';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Alert } from '@mui/material';
import lodash from 'lodash';
import { getAvailableVehicleStacks } from '../store/slice/vehicle.slice';
import { getIsVehicleStackLoading, getVehicleStack } from '../store/slice/config.slice';
import { VEHICLE_GET_STACKS } from '../store/saga/vehicle.saga';
import { CONFIG_GET_VEHICLE_STACK, CONFIG_SET_VEHICLE_STACK } from '../store/saga/config.saga';
import ProgressOverlay from './progress-overlay';
import { useAuthContext } from '../contexts/auth-context';

function not(a: readonly string[], b: readonly string[]) {
    return a.filter(value => b.indexOf(value) === -1);
}

function intersection(a: readonly string[], b: readonly string[]) {
    return a.filter(value => b.indexOf(value) !== -1);
}

export default function StackSelector() {
    const dispatch = useDispatch();
    const availableStacks = useSelector(getAvailableVehicleStacks);
    const configStack = useSelector(getVehicleStack);
    const isAvailableStackLoading = useSelector(getIsVehicleStackLoading);
    const isConfigStackLoading = useSelector(getIsVehicleStackLoading);
    const [checked, setChecked] = useState<readonly string[]>([]);
    const [left, setLeft] = useState<readonly string[]>([]);
    const [right, setRight] = useState<readonly string[]>([]);
    const [error, setError] = useState('');
    const auth = useAuthContext();

    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    useEffect(() => {
        if (availableStacks.length === 0) {
            dispatch({ type: VEHICLE_GET_STACKS });
        }
        if (configStack.length === 0) {
            dispatch({ type: CONFIG_GET_VEHICLE_STACK });
        }
    }, []);

    useEffect(() => {
        setLeft(lodash.difference(availableStacks, right));
    }, [availableStacks]);

    useEffect(() => {
        setRight(configStack);
        setLeft(state => lodash.difference(state, configStack));
    }, [configStack]);

    useEffect(() => {
        setError('');
        if (lodash.difference(configStack, right).length > 0 || lodash.difference(right, configStack).length > 0) {
            if (right.length > 0) {
                dispatch({ type: CONFIG_SET_VEHICLE_STACK, payload: right });
            } else {
                setError('Stack may not be empty');
            }
        }
    }, [right]);

    const handleToggle = (value: string) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const handleAllRight = () => {
        setRight(right.concat(left));
        setLeft([]);
    };

    const handleCheckedRight = () => {
        setRight(right.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };

    const handleAllLeft = () => {
        setLeft(left.concat(right));
        setRight([]);
    };

    const customList = (items: readonly string[]) => (
        <Paper sx={{ width: 200, height: 230, overflow: 'auto' }}>
            <List dense component="div" role="list">
                {items.map((value: string) => {
                    const labelId = `transfer-list-item-${value}-label`;

                    return (
                        <ListItem key={value} role="listitem" onClick={handleToggle(value)}>
                            <ListItemIcon sx={{ display: auth.superAdmin ? 'block' : 'none' }}>
                                <Checkbox
                                    checked={checked.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{
                                        'aria-labelledby': labelId,
                                    }}
                                    disabled={isConfigStackLoading || isAvailableStackLoading}
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={value.toUpperCase()} />
                        </ListItem>
                    );
                })}
            </List>
        </Paper>
    );

    return (
        <Grid container spacing={2} justifyContent="center" alignItems="center">
            {error && (
                <Grid size={{ xs: 12 }}>
                    <Alert severity="error">{error}</Alert>
                </Grid>
            )}
            <Grid sx={{ position: 'relative', display: auth.superAdmin ? 'block' : 'none' }}>
                {customList(left)}
                {isAvailableStackLoading && <ProgressOverlay />}
            </Grid>
            <Grid sx={{ display: auth.superAdmin ? 'block' : 'none' }}>
                <Grid container direction="column" alignItems="center">
                    <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleAllRight}
                        disabled={left?.length === 0 || isConfigStackLoading || isAvailableStackLoading}
                        aria-label="move all right"
                    >
                        ≫
                    </Button>
                    <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedRight}
                        disabled={leftChecked?.length === 0 || isConfigStackLoading || isAvailableStackLoading}
                        aria-label="move selected right"
                    >
                        &gt;
                    </Button>
                    <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedLeft}
                        disabled={rightChecked?.length === 0 || isConfigStackLoading || isAvailableStackLoading}
                        aria-label="move selected left"
                    >
                        &lt;
                    </Button>
                    <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleAllLeft}
                        disabled={right?.length === 0 || isConfigStackLoading || isAvailableStackLoading}
                        aria-label="move all left"
                    >
                        ≪
                    </Button>
                </Grid>
            </Grid>
            <Grid sx={{ position: 'relative' }}>
                {customList(right)}
                {isConfigStackLoading && <ProgressOverlay />}
            </Grid>
        </Grid>
    );
}
