import React from 'react';
import { Link } from 'react-router'
import ActionHome from 'material-ui/svg-icons/action/home';
import RaisedButton from 'material-ui/RaisedButton';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import FrontendPage from '../../../Layout/FrontendPage';
import Helmet from 'react-helmet';
import { siteTitle } from '../../../../../app_config/app'
// Top level styling
import s from '../ErrorPage.scss';

const PageNotFound = () => {

  return( 
    <FrontendPage>
      <Helmet 
        title={`Page Not Found | ${siteTitle}`}
        meta={[
          {property: 'og:title', content: '404 - Page Not Found'}
        ]}
      />
      <div className="page error-page not-found">
        <div className="page-container">
          <div className="title">404 - Page Not Found</div>
          <div className="content">
            Well, that was quite an Adventure! Time to head back home now...
          </div>
          <RaisedButton 
            containerElement={<Link to='/' />}
            label='Head back home'
            primary={true} 
            icon={<ActionHome />}
          />
        </div>
      </div>
    </FrontendPage>
  );
};

export default withStyles(s)(PageNotFound);


