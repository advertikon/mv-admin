import ChartBarIcon from '@heroicons/react/24/solid/ChartBarIcon';
import CogIcon from '@heroicons/react/24/solid/CogIcon';
import DocumentMagnifyingGlassIcon from '@heroicons/react/24/solid/DocumentMagnifyingGlassIcon';
import WrenchIcon from '@heroicons/react/24/solid/WrenchIcon';
import MagnifyingGlassCircleIcon from '@heroicons/react/24/solid/MagnifyingGlassCircleIcon';
import BeakerIcon from '@heroicons/react/24/solid/BeakerIcon';
import BoltIcon from '@heroicons/react/24/solid/BoltIcon';
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
        title: 'Shopify',
        icon: (
            <SvgIcon fontSize="small">
                <BeakerIcon />
            </SvgIcon>
        ),
        subItems: [
            {
                title: 'Categories',
                path: '/shopify/categories',
                icon: (
                    <SvgIcon fontSize="small">
                        <BoltIcon />
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
