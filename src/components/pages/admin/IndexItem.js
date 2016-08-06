import React from 'react'
import { fullBlack } from 'material-ui/styles/colors';
import { ListItem } from 'material-ui/List';
import {fade} from 'material-ui/utils/colorManipulator';
import muiTheme from '../../../muiTheme';
import IndexItemActions from './IndexItemActions'

const IndexItem = (props) => {
  
  let handleMouseEnter = (e) => {

  }

  return(<ListItem
          onMouseEnter={handleMouseEnter}
          rightIconButton={<IndexItemActions />}
          key={props.id}
          primaryText={<div style={{color: muiTheme.palette.textColor}}><strong>{props.primary}</strong> - <span>{props.secondary}</span></div>}
          style={{backgroundColor: fade(fullBlack, 0.7)}}
        />);
}

export default IndexItem;