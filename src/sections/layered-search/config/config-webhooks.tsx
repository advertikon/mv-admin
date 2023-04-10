import { Card, CardContent, CardHeader, Divider } from '@mui/material';
import WebhooksTable from '../../../components/tables/webhooks-table/WebhooksTable';

export function LayeredSearchConfigWebhooks() {
    return (
        <Card>
            <CardHeader subheader="List of subscribed topics" title="Webhooks" />
            <Divider />
            <CardContent>
                <WebhooksTable />
            </CardContent>
        </Card>
    );
}
