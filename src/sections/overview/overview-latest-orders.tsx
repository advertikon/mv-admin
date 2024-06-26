import { format } from 'date-fns';
import ArrowRightIcon from '@heroicons/react/24/solid/ArrowRightIcon';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardHeader,
    Divider,
    SvgIcon,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from '@mui/material';
import { SeverityPill } from '@components/severity-pill';
import { Scrollbar } from '@components/scrollbar';

const statusMap = {
    pending: 'warning',
    delivered: 'success',
    refunded: 'error',
};

export function OverviewLatestOrders(props) {
    const { orders = [], sx } = props;

    return (
        <Card sx={sx}>
            <CardHeader title="Latest Orders" />
            <Scrollbar sx={{ flexGrow: 1 }}>
                <Box sx={{ minWidth: 800 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell />
                                <TableCell>Order</TableCell>
                                <TableCell>Customer</TableCell>
                                <TableCell sortDirection="desc" />
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map(order => {
                                const createdAt = format(order.createdAt, 'dd/MM/yyyy');

                                return (
                                    <TableRow hover key={order.id}>
                                        <TableCell>{order.ref}</TableCell>
                                        <TableCell>{order.customer.name}</TableCell>
                                        <TableCell>{createdAt}</TableCell>
                                        <TableCell>
                                            <SeverityPill color={statusMap[order.status]}>{order.status}</SeverityPill>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </Box>
            </Scrollbar>
            <Divider />
            <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button
                    color="inherit"
                    endIcon={
                        <SvgIcon fontSize="small">
                            <ArrowRightIcon />
                        </SvgIcon>
                    }
                    size="small"
                    variant="text"
                >
                    View all
                </Button>
            </CardActions>
        </Card>
    );
}
