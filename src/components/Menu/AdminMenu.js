import React from 'react';
import { Link } from 'react-router';
import Divider from 'material-ui/Divider';
import LeftNavMenuItem from './LeftNavMenuItem';
import Gravatar from './Gravatar';
import ListItem from 'material-ui/List/ListItem';

function pageIsActive(router, url, indexOnly = false) {
  return router.isActive({pathname: url}, indexOnly)
}

const AdminMenu = (props, context) => {

  let menuItems = [
    (<ListItem
      key="user-avatar"
      disabled={true}
      leftAvatar={
        <Gravatar style={{position: 'absolute', top: '8px', left: '18px'}} email={props.currentUser.email} diameter='50' />
      }
      primaryText={<Link to="/admin/settings">{props.currentUser.name}</Link>}
      style={{color: 'white', backgroundColor: context.muiTheme.palette.primary1Color}}
    />)
  ];

  menuItems.push((<Divider key="avatar-divider" />));

  if(props.currentUser.isAdmin) {
    // For an admin, build a menu that contains all items in routesOptions
    //
    Object.keys(props.routeOptions).forEach((route, i) => {
      menuItems.push(<LeftNavMenuItem 
        key={'left-nav-link-' + i} 
        linkText={props.routeOptions[route].linkText} 
        url={props.routeOptions[route].url} 
        isActive={pageIsActive(context.router, props.routeOptions[route].url, true)}/>)
      return 1;
    })
  } else {
    // For a standard user, build the menu so that it contains the dashboard
    // as well as items that correspond to their permissions.
    menuItems.push((<LeftNavMenuItem 
        key={'left-nav-link-dashboard'} 
        linkText={props.routeOptions.dashboard.linkText} 
        url={props.routeOptions.dashboard.url} 
        isActive={pageIsActive(context.router, props.routeOptions.dashboard.url, true)}/>));

    props.currentUser.menuList.forEach((menuItem, i) => {
      menuItems.push(<LeftNavMenuItem 
        key={'left-nav-link-' + i} 
        linkText={props.routeOptions[menuItem].linkText} 
        url={props.routeOptions[menuItem].url} 
        isActive={pageIsActive(context.router, props.routeOptions[menuItem].url, true)}/>)
      return 1;
    })
  }

  return (
    <div className="admin-menu">
      {menuItems}
    </div>
  );
}

AdminMenu.contextTypes = {
  router: React.PropTypes.object.isRequired,
  muiTheme: React.PropTypes.object.isRequired,
}

export default AdminMenu;