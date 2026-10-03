import ChartBarIcon from '@heroicons/react/24/solid/ChartBarIcon';
import CogIcon from '@heroicons/react/24/solid/CogIcon';
import BeakerIcon from '@heroicons/react/24/solid/BeakerIcon';
import BoltIcon from '@heroicons/react/24/solid/BoltIcon';
import RectangleStackIcon from '@heroicons/react/24/solid/RectangleStackIcon';
import KeyIcon from '@heroicons/react/24/solid/KeyIcon';
import { SvgIcon } from '@mui/material';
import { ReactElement } from 'react';
import DevicePhoneMobileIcon from '@heroicons/react/24/solid/DevicePhoneMobileIcon';
import CpuChipIcon from '@heroicons/react/24/solid/CpuChipIcon';

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
        title: 'Fitness Tracker',
        icon: (
            <SvgIcon fontSize="small">
                <DevicePhoneMobileIcon />
            </SvgIcon>
        ),
        subItems: [
            {
                title: 'Installations',
                path: '/fitness/installations',
                icon: (
                    <SvgIcon fontSize="small">
                        <DevicePhoneMobileIcon />
                    </SvgIcon>
                ),
            },
            {
                title: 'Model calls',
                path: '/fitness/model-calls',
                icon: (
                    <SvgIcon fontSize="small">
                        <CpuChipIcon />
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
            {
                title: 'Products',
                path: '/shopify/products',
                icon: (
                    <SvgIcon fontSize="small">
                        <RectangleStackIcon />
                    </SvgIcon>
                ),
            },
            {
                title: 'Keywords',
                path: '/shopify/keywords',
                icon: (
                    <SvgIcon fontSize="small">
                        <KeyIcon />
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
