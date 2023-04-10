import { Box, ButtonBase, Stack, SvgIcon } from '@mui/material';
import { useState } from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import Collapse from '@mui/material/Collapse';
import { usePathname } from 'next/navigation';
import { SideBarItem } from '../config';
import { SideNavItemSingle } from './side-nav-item-single';

export function SideNavItemGroup(props: SideBarItem) {
    const pathname = usePathname();
    const { disabled = false, icon, title, subItems = [] } = props;
    const active = subItems.some(child => child.path === pathname);
    const [open, setOpen] = useState(active);

    const handleCollapseState = () => {
        setOpen(state => !state);
    };

    if (subItems) {
        return (
            <Stack>
                <li>
                    <ButtonBase
                        sx={{
                            alignItems: 'center',
                            borderRadius: 1,
                            display: 'flex',
                            justifyContent: 'flex-start',
                            pl: '16px',
                            pr: '16px',
                            py: '6px',
                            textAlign: 'left',
                            width: '100%',
                            ...(open && {
                                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                            }),
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                            },
                        }}
                        onClick={handleCollapseState}
                    >
                        {icon && (
                            <Box
                                component="span"
                                sx={{
                                    alignItems: 'center',
                                    color: 'neutral.400',
                                    display: 'inline-flex',
                                    justifyContent: 'center',
                                    mr: 2,
                                    ...(active && {
                                        color: 'primary.main',
                                    }),
                                }}
                            >
                                {icon}
                            </Box>
                        )}
                        <Box
                            component="span"
                            sx={{
                                color: 'neutral.400',
                                flexGrow: 1,
                                fontFamily: theme => theme.typography.fontFamily,
                                fontSize: 14,
                                fontWeight: 600,
                                lineHeight: '24px',
                                whiteSpace: 'nowrap',
                                ...(active && {
                                    color: 'common.white',
                                }),
                                ...(disabled && {
                                    color: 'neutral.500',
                                }),
                            }}
                        >
                            {title}
                        </Box>
                        <Box
                            component="span"
                            sx={{
                                alignItems: 'center',
                                color: 'neutral.400',
                                display: 'inline-flex',
                                justifyContent: 'center',
                                mr: 2,
                                ...(active && {
                                    color: 'primary.main',
                                }),
                            }}
                        >
                            <SvgIcon fontSize="small">{open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}</SvgIcon>
                        </Box>
                    </ButtonBase>
                </li>
                <Collapse in={open}>
                    {subItems.map(item => {
                        return (
                            <div style={{ paddingLeft: 10 }}>
                                <SideNavItemSingle
                                    disabled={item.disabled}
                                    external={item.external}
                                    icon={item.icon}
                                    key={item.title}
                                    path={item.path}
                                    title={item.title}
                                />
                            </div>
                        );
                    })}
                </Collapse>
            </Stack>
        );
    }
}
