const initialState = {
  user: null,
  logged_in: false
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'USER_LOGGED_IN':
      return {
        user: action.user,
        logged_in: true
      }
    default:
      return state;
  }
}

export {userReducer as auth}