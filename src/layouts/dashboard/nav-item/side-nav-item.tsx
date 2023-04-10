import { SideBarItem } from '../config';
import { SideNavItemGroup } from './side-nav-group';
import { SideNavItemSingle } from './side-nav-item-single';

export function SideNavItem(props: SideBarItem) {
    return props.subItems ? <SideNavItemGroup {...props} /> : <SideNavItemSingle {...props} />;
}
