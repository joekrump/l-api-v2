import React from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './BasicCardTemplate.scss';

const BasicCardTemplate = (props) => (
  <div className="card basic">
    <div className="card-container">
      <div className="front" data-editable data-name="front_content" data-ce-placeholder="Front Content..." dangerouslySetInnerHTML={{__html: props.back_content}} />
      <div className="back" data-editable data-name="back_content" data-ce-placeholder="Back Content..." dangerouslySetInnerHTML={{__html: props.back_content}} />
    </div>
  </div>
)

export default withStyles(s)(BasicCardTemplate);