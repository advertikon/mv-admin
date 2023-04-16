import ChartBarIcon from '@heroicons/react/24/solid/ChartBarIcon';
import CogIcon from '@heroicons/react/24/solid/CogIcon';
import DocumentMagnifyingGlassIcon from '@heroicons/react/24/solid/DocumentMagnifyingGlassIcon';
import ShoppingBagIcon from '@heroicons/react/24/solid/ShoppingBagIcon';
import UserIcon from '@heroicons/react/24/solid/UserIcon';
import WrenchIcon from '@heroicons/react/24/solid/WrenchIcon';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import MagnifyingGlassCircleIcon from '@heroicons/react/24/solid/MagnifyingGlassCircleIcon';
import { SvgIcon } from '@mui/material';
import { ReactElement } from 'react';

export type SideBarItem = {
    disabled?: boolean;
    external?: boolean;
    icon: ReactElement;
    iconRight?: ReactElement;
    path?: string;
    title: string;
    subItems?: SideBarItem[] | null;
    onClick?: () => void;
};

export const items: SideBarItem[] = [
    {
        title: 'Overview',
        path: '/',
        icon: (
            <SvgIcon fontSize="small">
                <ChartBarIcon />
            </SvgIcon>
        ),
    },
    {
        title: 'Layered search',
        icon: (
            <SvgIcon fontSize="small">
                <MagnifyingGlassCircleIcon />
            </SvgIcon>
        ),
        subItems: [
            {
                title: 'Config',
                path: '/layered-search/config',
                icon: (
                    <SvgIcon fontSize="small">
                        <WrenchIcon />
                    </SvgIcon>
                ),
            },
            {
                title: 'Indexing',
                path: '/layered-search/indexing',
                icon: (
                    <SvgIcon fontSize="small">
                        <DocumentMagnifyingGlassIcon />
                    </SvgIcon>
                ),
            },
        ],
    },
    {
        title: 'Settings',
        path: '/settings',
        icon: (
            <SvgIcon fontSize="small">
                <CogIcon />
            </SvgIcon>
        ),
    },
];
