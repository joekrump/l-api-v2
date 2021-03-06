import Page from "./components/Pages/Page/Page";
import Dashboard from "./components/Pages/Admin/Dashboard/Dashboard";
import UserSettings from "./components/Pages/Admin/User/Settings/Settings";
import App from "./components/App";
import auth from "./auth";
import { replace, push } from "react-router-redux"
import { APIClient } from "./http/requests"
import getAdminRoutes from "./routes/admin/routes"
import AccessDeniedPage from "./components/Pages/Errors/401/401";
import EditUser from "./components/Pages/Admin/User/Edit/Edit";
import EditRole from "./components/Pages/Admin/Role/Edit/Edit";

/**
 * onEnter callback method for admin routesq
 * @param  {object} nextState - the updates to state
 * @param  {object} store     redux store
 * @param  {string} pageType  admin page type that user is on. ex. "index", "edit", "new", "dashboard", "settings"
 * @return undefined
 */
const onAdminEnterHandler = (nextState, store, pageType) => {
  let resourceNamePlural = nextState.params.resourceNamePlural || "";
  let resourceId =  nextState.params.resourceId || null;
  let currentUser = auth.getUser();

  if(!auth.loggedIn()) {
    redirectNoneAdmin(store);
  } else if(!currentUser.isAdmin && ((resourceNamePlural !== "") && (currentUser.menuList.indexOf(resourceNamePlural) === -1))) {
    store.dispatch({type: "UPDATE_PAGE_STATUS_CODE", statusCode: 401})
    store.dispatch(push("/admin/401"));
    
  } else {
    const storeState = store.getState();
    // If the admin context has changed make hasChanges as false
    store.dispatch({
      type: "UPDATE_INDEX_HAS_CHANGES", 
      hasChanges: false, 
      resourceNamePlural: storeState.admin.resource.name.plural
    });
    // only update if it needs to be done.
    if((storeState.admin.resource.name.plural !== resourceNamePlural) 
      || (storeState.admin.pageType !== pageType)
      || (storeState.admin.resourceId !== resourceId)) {
      setPageStatusOk(store.dispatch);
      updateAdminState(resourceNamePlural, store.dispatch, pageType, resourceId);
    }
  }
}

export {onAdminEnterHandler};

function setPageStatusOk(dispatch) {
  dispatch({type: "UPDATE_PAGE_STATUS_CODE", statusCode: 200})
}

/**
 * Returns the routes in the app
 * @param  {object} store - The redux store for the app`
 * @return {object}       - the routes for the app
 */
const getRoutes = (store) => {
  let adminRoutes = getAdminRoutes(store);
  let routes = {
    path: "/",
    component: App,
    indexRoute: { 
      component: Page,
      onEnter: () => setPageStatusOk(store.dispatch)
    },
    childRoutes: [
      { path: "login", component: Page, onEnter: () => allowLoginAccess(store.dispatch) },
      { 
        path: "admin",
        indexRoute: { component: Dashboard, onEnter: (nextState) => onAdminEnterHandler(nextState, store, "dashboard") },
        childRoutes: [
          { path: "settings", 
            component: UserSettings,
            onEnter: (nextState) => onAdminEnterHandler(nextState, store, "settings")
          },
          { path: "401", component: AccessDeniedPage },
          { path: "users/new",
            component: EditUser, 
            onEnter: (nextState) => onAdminEnterHandler(nextState, store, "new") 
          },
          { 
            path: "users/:resourceId/edit",
            component: EditUser,
            onEnter: (nextState) => onAdminEnterHandler(nextState, store, "edit") 
          },
          { path: "roles/new",
            component: EditRole, 
            onEnter: (nextState) => onAdminEnterHandler(nextState, store, "new") 
          },
          { 
            path: "roles/:resourceId/edit",
            component: EditRole,
            onEnter: (nextState) => onAdminEnterHandler(nextState, store, "edit") 
          },
          adminRoutes,
        ]
      },
      // PageRoutes,
      { 
        path: "*", 
        component: Page, 
        onEnter: (nextState) => {
          setPageStatusOk(store.dispatch);
          allowSignupAccess(store.dispatch, nextState);
        }
      }
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
  store.dispatch(push("/login"));
}

function updateAdminState(namePlural, dispatch, pageType, resourceId) {
  dispatch({
    type: "UPDATE_ADMIN_STATE",
    namePlural,
    pageType,
    resourceId
  });
}
/**
 * Allow user to access SignUp page, or redirect.
 * @return undefined
 */
function allowSignupAccess(dispatch, nextState) {
  if(nextState.param && nextState.param.splat) {
    let splat = nextState.param.splat.toLowerCase();
    // if the page being visited is the signup page, then run a check
    if((splat === "signup") || (splat === "signup/")) {
      getUserCount(dispatch).then((count) => {
        if(count > 0) {
          dispatch(replace("/login"));
        }
      }).catch((error) => {
        console.warn("Error: ", error)
      });
    }
  }
}

/**
 * Check to see if /login should be accessible.
 * @return undefined
 */
function allowLoginAccess(dispatch) {

  if(auth.loggedIn()) {
    dispatch(replace("/admin"))
  } else {
    getUserCount(dispatch).then((count) => {
      if(count === 0) {
        dispatch(replace("/signup"));
      }
    }).catch((error) => {
      console.error("Error: ", error)
    });
  }
}

/**
 * Return a Promise that will be resolved once GET request for 
 * user count is completed.
 * @return Promise
 */
function getUserCount(nextState, replace, dispatch) {
  return new Promise((resolve, reject) => {
    let client = new APIClient(dispatch);
    client.get("users/count", false)
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
  });
}
