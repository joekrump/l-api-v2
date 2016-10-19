import React from 'react';
import ResourceForm from './ResourceForm';
import { connect } from 'react-redux'

class ResetPassword extends React.Component {
  loginNewUser(user, token){
    // this.props.loginUser(user, token, '/admin');
    // TODO:
    // 
    // run some process that will log the user into the system
    // resetting the password will log the user in on the server 
    // and should return a token and the logged in user's data.
  }

  render() {
    return (
      <ResourceForm 
        formName="resetPasswordForm" 
        resourceURL="auth/reset-password"
        resourceId={null}
        editContext="new"
        loginCallback={(user, token) => this.loginNewUser()}
        buttonText="Reset Password"
      />
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  console.log('Params:', this.props.params)
  return {
    loginUser: (user, token, redirectPath) => {
      dispatch ({
        type: 'USER_LOGGED_IN',
        user,
        token,
        redirectPath
      })
    }
  }
}

export default connect(null,
  mapDispatchToProps
)(ResetPassword)