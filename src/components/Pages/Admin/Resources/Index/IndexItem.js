import React from 'react'
import { fullBlack } from 'material-ui/styles/colors';
import { ListItem } from 'material-ui/List';
import {fade} from 'material-ui/utils/colorManipulator';
import muiTheme from '../../../../../muiTheme';
import IndexItemActions from './IndexItemActions'
import DragHandleIcon from 'material-ui/svg-icons/editor/drag-handle';

let style = {
  backgroundColor: fade(fullBlack, 0.7)
}

let smallIconStyle = {
  margin: 0,
  padding: '12px'
}

class IndexItem extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      visible: true,
      hoverClass: ''
    }
  }

  showItem(visible = false) {
    this.setState({visible});
  }
  
  getText(){
    return(
      <div className="inner-text" style={{color: muiTheme.palette.textColor}}><strong>{this.props.primary}</strong>{this.props.secondary ? (<span> -&nbsp;{this.props.secondary}</span>) : null}</div>
    )
  }

  renderNestedItems() {
    if(this.props.depth > 2) {
      return null;
    }
    if(this.props.denyNested && this.props.unmovable) {
      return <div className="fake-nested"></div>
    }

    let nestedItems = this.props.childItems.map((child, i) => (
      <IndexItem 
        key={`${this.props.resourceType}-${child.id}`}
        modelId={child.id}
        index={this.props.index + (i + 1)}
        primary={child.primary}
        secondary={child.secondary}
        resourceType={this.props.resourceType}
        deletable={child.deletable}
        childItems={child.children}
        depth={this.props.depth + 1}
        extraData={{...child}}
        unmovable={child.unmovable}
        denyNested={child.denyNested}
        editMode={this.props.editMode}
        previewPath={child.previewPath}
      />
    ))
    return (<div className="nested leaf" data-parentModelId={this.props.modelId}>{nestedItems}</div>);
  }
  renderDragHandle() {
    return (this.props.editMode && !this.props.unmovable) ? 
      <DragHandleIcon className="drag-handle" color="white" style={smallIconStyle}/> 
      : null
  }
  render(){
    if(this.state.visible) {
      style.opacity = 1;
      style.height = null;
      style.padding = '16px 16px 16px ' + (this.props.editMode ? '56px' : '16px')
    } else {
      style.opacity = 0;
      style.height = 0;
      style.padding = 0;
    }

    let queryProps = this.props.extraData

    if(this.props.extraData) {  
      delete queryProps.primary;
    }

    return(
      <div id={this.props.modelId} className={"index-item f-no-select" + (this.props.unmovable ? ' unmovable' : '')}>
        <ListItem
          className="list-item"
          disabled
          leftIcon={this.renderDragHandle()}
          rightIconButton={
            <IndexItemActions 
              resourceType={this.props.resourceType} 
              modelId={this.props.modelId} 
              deleteCallback={ this.props.deletable ? () => this.showItem() : undefined} 
              queryProps={{...queryProps}}
              deletable={this.props.deletable}
              previewPath={this.props.previewPath}
            />
          }
          primaryText={this.getText()}
          style={{...style}}
        /> 
        { this.props.childItems ? this.renderNestedItems() : null }
      </div>
    );
  }
}

export default IndexItem;