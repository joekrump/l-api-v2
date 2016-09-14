import React from 'react';
import { connect } from 'react-redux';
import APIClient from '../../../http/requests'
import Editor from "../../Editor/Editor"

class PageTemplate extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      content: null,
      name: null,
      submitDisabled: false,
      submitURL: '',
      editor: null
    }
  }

  getPageName(){
    return this.state.name;
  }

  getSubmitURL(){
    return this.state.submitURL
  }

  setSubmitURL(url){
    this.setState({
      submitURL: url
    });
  }

  componentWillUnmount() {
    if(this.state.editor){
      this.state.editor.destroyEditor();
    }
  }

  componentDidMount(){

    this.setState({
      submitURL: this.props.submitUrl
    });

    if(this.props.context === 'edit'){
      let client = new APIClient(this.context.store)
      // if the Context is Edit, then get the existing data for the PageTemplate so it may be loaded into the page.
      client.get(this.props.resourceNamePlural + '/' + this.props.resourceId)
        .then((res) => {
          if (res.statusCode !== 200) {
            // not status OK
            console.log('Could not get data for Page ', res);
          } else {
            // this.setState({existingData: res.body.data})
            client.updateToken(res.header.authorization);
            this.setState({
              content: res.body.data.editor_contents,
              name: res.body.data.name,
              editor: new Editor(this.getPageName, this.getSubmitURL, this.setSubmitURL, this.props.context, this.props.resourceNamePlural)
            })
          }
        })
    } else {
      // If the context is not edit then just load the editor.
      this.setState({
        editor: new Editor(this.getPageName, this.getSubmitURL, this.setSubmitURL, this.props.context, this.props.resourceNamePlural)
      })
    }
  }

  resetForm(){
    this.props.resetForm(this.props.formName)
  }

  handleNameChange(e) {
    this.setState({
      name: e.target.value
    });
  }
  
  render() {
    return (
      <div>
        <div data-editable data-name="name">
          <h1>{this.state.name ? this.state.name : ''}</h1>
        </div>
        <div data-editable data-name="content" dangerouslySetInnerHTML={{__html: this.state.content}} />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    token: state.auth.token,
    snackbar: {
      show: state.notifications.snackbar.show,
      header: state.notifications.snackbar.header,
      content: state.notifications.snackbar.content,
      notificationType: state.notifications.snackbar.notificationType
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateSnackbar: (show, header, content, notificationType) => {
      dispatch ({
        type: 'NOTIFICATION_SNACKBAR_UPDATE',
        show,
        header,
        content,
        notificationType
      })
    }
  }
}

PageTemplate.contextTypes = {
  store: React.PropTypes.object.isRequired
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PageTemplate)