import React from 'react'
import { fullBlack } from 'material-ui/styles/colors';
import { ListItem } from 'material-ui/List';
import {fade} from 'material-ui/utils/colorManipulator';
import muiTheme from '../../../../../muiTheme';
import IndexItemActions from './IndexItemActions'
import DragHandleIcon from 'material-ui/svg-icons/editor/drag-handle';
import { connect } from 'react-redux';

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
    this.renderNestedItems = this.renderNestedItems.bind(this);
  }

  showItem(visible = false) {
    this.setState({visible});
  }
  
  getText(){
    return(
      <div className="inner-text" style={{color: muiTheme.palette.textColor}}><strong className="item-primary">{this.props.primary}</strong>{this.props.secondary ? (<span>&nbsp;-&nbsp;<span className="item-text-secondary">{this.props.secondary}</span></span>) : null}</div>
    )
  }

  shouldComponentUpdate(nextProps, nextState) {
    let shouldUpdate = false;
    if(nextProps.secondary !== this.props.secondary) {
      shouldUpdate = true;
    } else if (nextProps.editMode !== this.props.editMode) {
      shouldUpdate = true;
    }
    return shouldUpdate;
  }

  renderNestedItems() {
    // if(this.props.depth > 2) {
    //   return null;
    // }
    if(this.props.denyNested && this.props.unmovable) {
      return <div className="fake-nested"></div>
    }

    let nestedItems = this.props.childIndexes.map((childIndex, i) => (
      <IndexItem 
        key={`${this.props.resourceType}-${i}`}
        modelId={this.props.nodeArray[childIndex].node.item_id}
        primary={this.props.nodeArray[childIndex].node.primary}
        secondary={this.props.nodeArray[childIndex].node.secondary}
        resourceType={this.props.resourceType}
        deletable={this.props.nodeArray[childIndex].node.deletable}
        childIndexes={this.props.nodeArray[childIndex].childIndexes}
        depth={this.props.depth + 1}
        extraData={{...this.props.nodeArray[childIndex].node}}
        unmovable={this.props.nodeArray[childIndex].node.unmovable}
        denyNested={this.props.nodeArray[childIndex].node.denyNested}
        editMode={this.props.editMode}
        previewPath={this.props.nodeArray[childIndex].node.previewPath}
        nodeArray={this.props.nodeArray}
      />
    ))
    return (<div className="nested leaf" 
      data-parentModelId={this.props.modelId}>{nestedItems}</div>);
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
    console.log(this.props.childIndexes);
    return(
      <div id={this.props.modelId} className={"index-item card-swipe f-no-select" + (this.props.unmovable ? ' unmovable' : '')} >
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
        { this.props.childIndexes ? this.renderNestedItems() : null }
      </div>
    );
  }
}


const mapStateToProps = (state, ownProps) => {
  return {
    nodeArray: state.tree.indexTree.nodeArray
  }
}

export default connect(
  mapStateToProps,
  null
)(IndexItem)