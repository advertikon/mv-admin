import ArrowDownIcon from '@heroicons/react/24/solid/ArrowDownIcon';
import ArrowUpIcon from '@heroicons/react/24/solid/ArrowUpIcon';
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography } from '@mui/material';
import { ReactElement } from 'react';

type Props = {
    difference?: number;
    sx?: any;
    value: number;
    icon?: ReactElement;
    iconColor?: string;
    title: string;
    differenceTitle?: string;
};
export function OverviewNumber(props: Props) {
    const {
        title,
        difference,
        value,
        icon,
        iconColor = 'error.main',
        differenceTitle = 'since last month',
        sx = {},
    } = props;

    return (
        <Card sx={sx}>
            <CardContent>
                <Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={3}>
                    <Stack spacing={1}>
                        <Typography color="text.secondary" variant="overline">
                            {title}
                        </Typography>
                        <Typography variant="h4">{new Intl.NumberFormat().format(value)}</Typography>
                    </Stack>
                    {icon && (
                        <Avatar
                            sx={{
                                backgroundColor: iconColor,
                                height: 56,
                                width: 56,
                            }}
                        >
                            {icon}
                        </Avatar>
                    )}
                </Stack>
                {difference && (
                    <Stack alignItems="center" direction="row" spacing={2} sx={{ mt: 2 }}>
                        <Stack alignItems="center" direction="row" spacing={0.5}>
                            <SvgIcon color={value > difference ? 'success' : 'error'} fontSize="small">
                                {value > difference ? <ArrowUpIcon /> : <ArrowDownIcon />}
                            </SvgIcon>
                            <Typography color={value > difference ? 'success.main' : 'error.main'} variant="body2">
                                {difference}%
                            </Typography>
                        </Stack>
                        <Typography color="text.secondary" variant="caption">
                            {differenceTitle}
                        </Typography>
                    </Stack>
                )}
            </CardContent>
        </Card>
    );
}
