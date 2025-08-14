import Paper from '@mui/material/Paper';
import Box from '@mui/system/Box';
import { CompaniesTable } from './companies-table';

export function CompaniesListSection() {
    return (
        <Box>
            <Paper
                elevation={24}
                style={{ borderColor: 'blue', borderWidth: 1, borderStyle: 'solid', borderRadius: 10, padding: 10 }}
            >
                <CompaniesTable />
            </Paper>
        </Box>
    );
}
