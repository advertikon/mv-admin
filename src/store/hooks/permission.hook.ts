import { useSelector } from 'react-redux';
import { getPermissions } from '../slice/oauth.slice';

export function usePermissions(requiredPermissions: string[] = ['shop:manage']) {
    const permissions = useSelector(getPermissions);
    const hasPermissions = requiredPermissions.every(rp => permissions.includes(rp));

    return [hasPermissions];
}
