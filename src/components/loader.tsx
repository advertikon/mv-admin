import AutorenewIcon from '@mui/icons-material/Autorenew';
import { Container } from '@mui/material';
import { styled } from '@mui/material/styles';

const IconHolder = styled('div')({
    display: 'flex',
    height: '100vh',
    alignItems: 'center',
    justifyContent: 'center',
});

export function Loader() {
    return (
        <Container>
            <IconHolder>
                <AutorenewIcon sx={{ width: 100, height: 100, animation: 'rotation 2s infinite linear' }} />
            </IconHolder>
        </Container>
    );
}
