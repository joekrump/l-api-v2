import React from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from './Menu/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Divider from 'material-ui/Divider';
import AppConfig from '../../app_config/app';
import { cyan500 } from 'material-ui/styles/colors';
import { Link } from 'react-router';

import LeftNavMenuItem from './Nav/LeftNavMenuItem';
import Gravatar from './Nav/Gravatar';

import auth from '../auth';

import { connect } from 'react-redux';

import ListItem from 'material-ui/List/ListItem';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      menu: {
        isOpen: false
      }
    }
  }
  updateAuth(loggedIn) {
    if(!loggedIn && auth.getUser() && auth.getToken()) {
      this.props.loginUser(auth.getUser(), (typeof sessionStorage !== 'undefined' ? sessionStorage.laravelAccessToken : null));      
    }
  }
  handleToggleMenu() {
    let previousState = this.state;
    previousState.menu.isOpen = !previousState.menu.isOpen;
    this.setState(previousState);
  }
  closeMenu() {
    this.setState({menu: {isOpen: false}});
  }
  componentDidMount() {
    // Do something when the app first mounts
  }
  componentWillMount() {
    auth.onChange = () => this.updateAuth()
    if((typeof sessionStorage !== 'undefined') && sessionStorage.laravelAccessToken){
      auth.login(null, null, null, this.context.store)
    }
  }
  componentWillReceiveProps(nextProps){

    if(nextProps.location.pathname !== this.props.location.pathname){
      this.closeMenu(); 
    }
  }
  pageIsActive(url, indexOnly = false){
    return this.context.router.isActive({pathname: url}, indexOnly)
  }
  getLeftMenuItems() {
    let staticNavLinks = [];
    let menuItems = [];

    if(this.props.loggedIn){
      if(this.props.user) {
        menuItems = [
          (<ListItem
            key="user-avatar"
            disabled={true}
            leftAvatar={
              <Gravatar style={{position: 'absolute', top: '8px', left: '18px'}} email={this.props.user.email} diameter='50' />
            }
            primaryText={<Link to="/admin/settings">{this.props.user.name}</Link>}
            style={{color: 'white', backgroundColor: cyan500}}
          />)
        ]
      }
      menuItems.push((<Divider key="avatar-divider" />));
    }

    if (this.props.loggedIn){
      staticNavLinks = AppConfig.adminRouteLinks
    } else {
      staticNavLinks = AppConfig.publicRouteLinks
    }

    staticNavLinks.forEach((routeSettings, i) => {
      menuItems.push(<LeftNavMenuItem key={'left-nav-link-' + i} linkText={routeSettings.linkText} url={routeSettings.url} isActive={this.pageIsActive(routeSettings.url, true)}/>)
      return 1;
    })
    return menuItems
  }
  handleLogout(e){
    e.preventDefault();
    
    auth.logout(() => {
      // dispatch an action if the server has successfully logged out the user.
      this.props.logoutUser('/login');
    }, this.context.store);
  }
  render() {
    
    var iconElementRight = null;
    if(this.props.loggedIn) {
      iconElementRight = (
        <IconMenu
          iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
          targetOrigin={{horizontal: 'right', vertical: 'top'}}
          anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
        >
          <MenuItem primaryText="Settings" containerElement={<Link to="/admin/settings"/>} />
          <MenuItem primaryText="Log Out" onTouchTap={(event) => this.handleLogout(event, this)} />
        </IconMenu>
      )
    }

    return (
      <div>
        <Drawer 
          open={this.state.menu.isOpen}
          docked={false} 
          onRequestChange={() => this.handleToggleMenu()}
        >
          {this.getLeftMenuItems()}
        </Drawer>
        <header>
          {/*TODO: put site title in a NODE config file of some-sort. */}
          <AppBar 
            title='React CMS' 
            onLeftIconButtonTouchTap={() => this.handleToggleMenu()} 
            style={{position: 'fixed'}}
            iconElementRight={iconElementRight}
          />
        </header>
        <div className="page-container">
          {this.props.children}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    loggedIn: state.auth.logged_in,
    user: state.auth.user,
    token: state.auth.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loginUser: (user, token, redirectPath) => {
      dispatch ({
        type: 'USER_LOGGED_IN',
        user,
        token,
        redirectPath
      })
    },
    logoutUser: (redirectPath) => {
      dispatch ({
        type: 'USER_LOGGED_OUT',
        redirectPath
      })
    }
  };
}

App.contextTypes = {
  router: React.PropTypes.object.isRequired,
  store: React.PropTypes.object.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);