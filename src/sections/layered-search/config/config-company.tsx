import { Box, Card, CardContent, CardHeader, Divider, Grid, TextField } from '@mui/material';
import { useSelector } from 'react-redux';
import { getCompany } from '../../../store/slice/oauth.slice';

export function LayeredSearchConfigCompany() {
    const company = useSelector(getCompany);

    return (
        <Card>
            <CardHeader subheader="Company, associated with account" title="Compnay" />
            <Divider />
            <CardContent>
                <Box sx={{ padding: 4 }}>
                    <Grid container spacing={2} marginBottom={2} alignItems="top">
                        <Grid padding={1} item xs={12}>
                            <TextField disabled label="Store" value={company} fullWidth />
                        </Grid>
                    </Grid>
                </Box>
            </CardContent>
        </Card>
    );
}
