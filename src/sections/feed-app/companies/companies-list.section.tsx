import Paper from '@mui/material/Paper';
import Box from '@mui/system/Box';
import styled from '@mui/system/styled';
import { CompaniesTable } from './companies-table';

const ComponentBackground = styled(Paper)(({ theme }) => ({
    borderColor: theme.palette.blue.main,
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 10,
    padding: 10,
}));

export function CompaniesListSection() {
    return (
        <Box>
            <ComponentBackground elevation={24}>
                <CompaniesTable />
            </ComponentBackground>
        </Box>
    );
}
