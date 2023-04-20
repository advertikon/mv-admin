import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Divider, MenuItem, MenuList, Popover, Typography } from '@mui/material';
import { useAuth } from '../../hooks/use-auth';

export function AccountPopover(props) {
    const { anchorEl, onClose, open } = props;
    const router = useRouter();
    const { userName } = useAuth();

    const handleSignOut = useCallback(() => {
        onClose?.();
        router.push(`${process.env.NEXT_PUBLIC_OAUTH_SERVER}/oauth/session/end`);
    }, []);

    return (
        <Popover
            anchorEl={anchorEl}
            anchorOrigin={{
                horizontal: 'left',
                vertical: 'bottom',
            }}
            onClose={onClose}
            open={open}
            PaperProps={{ sx: { width: 200 } }}
        >
            <Box
                sx={{
                    py: 1.5,
                    px: 2,
                }}
            >
                <Typography variant="overline">Logged in as:</Typography>
                <Typography color="text.secondary" variant="body2">
                    {userName}
                </Typography>
            </Box>
            <Divider />
            <MenuList
                disablePadding
                dense
                sx={{
                    p: '8px',
                    '& > *': {
                        borderRadius: 1,
                    },
                }}
            >
                <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
            </MenuList>
        </Popover>
    );
}
