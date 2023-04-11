import { Box, Card, CardContent, CardHeader, Divider, Grid, Typography } from '@mui/material';
import StackSelector from './stack-selector';

function StackComponent() {
    return (
        <Card>
            <CardHeader subheader="Vehicle sources info stack" title="Stack" />
            <Divider />
            <CardContent>
                <Box sx={{ padding: 4 }}>
                    <Grid container spacing={2} marginBottom={2} alignItems="top">
                        <Grid xs={12} item>
                            <StackSelector />
                        </Grid>
                    </Grid>
                </Box>
            </CardContent>
        </Card>
    );
}

export default StackComponent;
