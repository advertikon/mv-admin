import { Card, CardContent, CardHeader, Divider } from '@mui/material';
import FilterableCollectionsTable from '../../../components/tables/filterable-collections-table/FilterableCollectionsTable';

export function LayeredSearchConfigCollections() {
    return (
        <Card>
            <CardHeader subheader="Select department collections" title="Departments" />
            <Divider />
            <CardContent>
                <FilterableCollectionsTable />
            </CardContent>
        </Card>
    );
}
