import React from 'react';

import HomeTemplate from '../Templates/Pages/HomeTemplate'
import ContactTemplate from '../Templates/Pages/ContactTemplate'
import BasicTemplate from '../Templates/Pages/BasicTemplate'
import LoginTemplate from '../Templates/Pages/LoginTemplate'
import PaymentTemplate from '../Templates/Pages/PaymentTemplate'
import SignupTemplate from '../Templates/Pages/SignupTemplate'
import ForgotPasswordTemplate from '../Templates/Pages/ForgotPasswordTemplate'
import ResetPasswordTemplate from '../Templates/Pages/ResetPasswordTemplate'

import PageNotFound from '../Errors/404/404'
import APIClient from '../../../http/requests'
import FrontendPage from '../../Layout/FrontendPage';
import { connect } from 'react-redux';

class Page extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      page: null
    }
  }

  isAdminPage() {
    return (this.props.pathname.substring(1, 6).toLowerCase() === 'admin')
  }

  componentWillMount() {
    if(!this.isAdminPage()) {
      this.loadPageContent(this.props.pathname);
    }
  }

  loadPageContent(pathname) {
    const client = new APIClient(this.props.dispatch);

    client.get('page', false, {params: {fullpath: pathname}}).then((res) => {
      this.resolveDataFetch(res, this.setPreExistingPageData)
    }, this.rejectDataFetch).catch(this.rejectDataFetch)
  }

  setPreExistingPageData = (res) => {
    this.setState({
      page: this.getRenderedPage(
        res.body.data.template_id, 
        res.body.data.content, 
        res.body.data.name
      )
    })
  }

  rejectDataFetch = (res) => {
    if(res.statusCode && res.statusCode >= 300) {
      this.props.updatePageStatusCode(res.statusCode);
    } else {
      console.warn('Error: ', res)
    }
  }

  resolveDataFetch = (res, updateStateCallback) => {
    this.props.updatePageStatusCode(res.statusCode);
    if (res.statusCode === 200) {
      updateStateCallback(res);
    }
  }

  componentWillReceiveProps(nextProps){
    if(this.props.pathname !== nextProps.pathname) {
      this.loadPageContent(nextProps.pathname);
    }
  }

  getRenderedPage(template_id, content, name){
    let page = null;
    // May come in as a string from query params so parse as int.
    template_id = parseInt(template_id, 10);

    switch(template_id) {
      case 1: {
        page = (<BasicTemplate name={name} content={content} pathname={this.props.pathname}/>)
        break;
      }
      case 2: {
        page = (<ContactTemplate name={name} content={content} pathname={this.props.pathname}/>)
        break;
      }
      case 3: {
        page = (<HomeTemplate name={name} content={content} />);
        break;
      }
      case 4: {
        page = (<LoginTemplate name={name} content={content} pathname={this.props.pathname} location={this.props.location}/>);
        break;
      }
      case 5: {
        page = (<PaymentTemplate name={name} content={content} pathname={this.props.pathname} />);
        break;
      }
      case 6: {
        page = (<SignupTemplate name={name} content={content} pathname={this.props.pathname} />);
        break;
      }
      case 7: {
        page = (<ForgotPasswordTemplate name={name} content={content} pathname={this.props.pathname} />);
        break;
      }
      case 8: {
        page = (<ResetPasswordTemplate name={name} content={content} pathname={this.props.pathname} />);
        break;
      }
      default: {
        page = (<BasicTemplate name={name} content={content} pathname={this.props.pathname}/>)
        break;
      }
    }

    return page;
  }

  render() {
    if(this.props.statusCode !== 200) {
      return (<PageNotFound />)
    }
    return (
      <FrontendPage>
        {this.state.page}
      </FrontendPage>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updatePageStatusCode: (statusCode) => {
      dispatch ({
        type: 'UPDATE_PAGE_STATUS_CODE',
        statusCode
      })
    },
    dispatch
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    pathname: state.routing.locationBeforeTransitions.pathname,
    statusCode: state.page.statusCode
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page)
