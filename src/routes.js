import Page from './components/Pages/Page/Page';
import Dashboard from './components/Pages/Admin/Dashboard/Dashboard';
import SignUp from './components/Pages/Auth/SignUp/SignUp';
import UserSettings from './components/Pages/Admin/User/Settings/Settings';
import ForgotPassword from './components/Pages/Auth/ForgotPassword/ForgotPassword';
import App from './components/App';
import auth from './auth';
import { replace, push } from 'react-router-redux'
import APIClient from './http/requests'
import getAdminRoutes from './routes/admin/routes'

/**
 * onEnter callback method for admin routesq
 * @param  {object} nextState [description]
 * @param  {object} store     redux store
 * @param  {string} pageType  admin page type that user is on. ex. 'index', 'edit', 'new', 'dashboard', 'settings'
 * @return undefined
 */
const onAdminEnterHandler = (nextState, store, pageType) => {
  if(!auth.loggedIn()) {
    redirectNoneAdmin(store);
  } else {
    let resourceNamePlural = nextState.params.resourceNamePlural || '';
    const storeState = store.getState();
    // only update if it needs to be done.
    if((storeState.admin.resource.name.plural !== resourceNamePlural)
      || (storeState.admin.pageType !== pageType)) {
      setResourceNamePlural(resourceNamePlural, store, pageType);
    }
  }
}

export {onAdminEnterHandler};

/**
 * Returns the routes in the app
 * @param  {object} store - The redux store for the app`
 * @return {object}       - the routes for the app
 */
const getRoutes = (store) => {
  let adminRoutes = getAdminRoutes(store);
  let routes = {
    path: '/',
    component: App,
    indexRoute: { component: Page },
    childRoutes: [
      { path: 'login', component: Page, onEnter: () => allowLoginAccess(store) },
      { path: 'signup', component: SignUp, onEnter: () => allowSignupAccess(store) },
      { path: 'forgot-password', component: ForgotPassword },
      { 
        path: 'admin',
        indexRoute: { component: Dashboard, onEnter: (nextState) => onAdminEnterHandler(nextState, store, 'dashboard') },
        childRoutes: [
          { path: 'settings', 
            component: UserSettings,
            onEnter: (nextState) => onAdminEnterHandler(nextState, store, 'settings')
          },
          adminRoutes
        ]
      },
      // PageRoutes,
      { path: '*', component: Page }
    ]
  }
  return routes;
}

export default getRoutes;

/**
 * Redirects user to /login if they try to access a route that should only be 
 * accessible to a user who is authenticated (logged in)
 * @return undefined
 */
function redirectNoneAdmin(store) {
  store.dispatch(push('/login'))
}

function setResourceNamePlural(namePlural, store, pageType) {
  store.dispatch({
    type: 'UPDATE_CURRENT_RESOURCE_NAME',
    namePlural,
    pageType
  })
}
/**
 * Allow user to access SignUp page, or redirect.
 * @return undefined
 */
function allowSignupAccess(store) {
  getUserCount(store).then((count) => {
    if(count > 0) {
      store.dispatch(replace('/login'));
    }
  }).catch((error) => {
    console.warn('Error: ', error)
  })
}

/**
 * Check to see if /login should be accessible.
 * @return undefined
 */
function allowLoginAccess(store) {

  if(auth.loggedIn()) {
    store.dispatch(replace('/admin'))
  } else {
    getUserCount(store).then((count) => {
      if(count === 0) {
        console.log('replace')
        store.dispatch(replace('/signup'));
      }
    }).catch((error) => {
      console.log('Error: ', error)
    })
  }
}

/**
 * Return a Promise that will be resolved once GET request for 
 * user count is completed.
 * @return Promise
 */
function getUserCount(nextState, replace, store) {
  return new Promise((resolve, reject) => {
    let client = new APIClient(store);
    client.get('users/count', false)
    .then((res) => {
      if(res.statusCode !== 200) {
        reject(-1);
      } else {
        resolve(res.body.count);
      }
    })
    .catch((res) => {
      reject(-1);
    })
  })
}