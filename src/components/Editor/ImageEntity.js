import React from 'react';
import {getIconColor} from '../../helpers/ImageHelper';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import InlineImageControls from './InlineImageControls';
import Resizable from '../Resizable/Resizable'

import './ImageEntity.css'

const isResizable = {
  top: false, 
  right: false, 
  bottom: false, 
  left: false, 
  topRight: true, 
  bottomRight:true, 
  bottomLeft: true, 
  topLeft: true
}

const handleStyles = {
  bottomRight: {
    position: 'absolute', width: 15, height: 15, right: 0, bottom: 0, cursor: 'se-resize', border: '3px solid #5890ff', opacity: 0
  },
  bottomLeft: {
    position: 'absolute', width: 15, height: 15, left: 0, bottom: 0, cursor: 'ne-resize', border: '3px solid #5890ff', opacity: 0
  },
  topRight: {
    position: 'absolute', width: 15, height: 15, right: 0, top: 0, cursor: 'ne-resize', border: '3px solid #5890ff', opacity: 0
  },
  topLeft: {
    position: 'absolute', width: 15, height: 15, left: 0, top: 0, cursor: 'se-resize', border: '3px solid #5890ff', opacity: 0
  }
}
class ImageEntity extends React.Component {

  state = {
    initWidth: this.props.width,
    initHeight: this.props.height,
    width: 0,
    height: 0,
    alignment: 'left',
    inFocus: false,
    ratio: 1,
    iconColors: {
      resizeHandle: '#000',
      deleteImage: '#000'
    },
    alignmentClass: 'resizable-image left ' + this.props.className
  }
  
  makeAlignmentClass = (alignment, inFocus) => {
    if(alignment === undefined) {
      alignment = this.state.alignment
    }
    if(inFocus === undefined) {
      inFocus = this.state.inFocus
    }
    let className = 'resizable-image ' + alignment + (inFocus ? ' in-focus' : '');
    return className + ' ' + this.props.className;
  }
  onClick = (event) => {
    // if the image is currently in focus and there was a click on something that was not within this component
    // then set inFocus to fasle.
    if(this.state.inFocus && (!this.refs.resizableImage.refs.resizable.contains(event.target))) {
      // remove the 'in-focus' class.
      this.setState({inFocus: false, alignmentClass: this.makeAlignmentClass(this.state.alignment, false)});
    }
  }

  // handleImageResized = (event) => {
  //   // console.log('inner image resized')
  //   // console.log(event.target.width);
  // };

  componentWillUnmount() {
    window.removeEventListener('click', this.onClick);
  }

  componentDidMount() {
    const insertedImage = new Image(),
          resizeIconWidthHeight = 26,
          deleteIconWidthHeight  = 26;
    // Once the image loads get image control icon colors and set proper dimensions for the image
    // 
    insertedImage.addEventListener('load', (event) => {
      const resizeHandleColor = getIconColor(insertedImage, {
        x1: event.target.width - resizeIconWidthHeight, 
        y1: event.target.height - resizeIconWidthHeight,
        x2: event.target.width,
        y2: event.target.height
      });


      const deleteImageIconColor = getIconColor(insertedImage, {
        x1: event.target.width - deleteIconWidthHeight, 
        y1: 0,
        x2: event.target.width,
        y2: deleteIconWidthHeight
      });

      const maxConstraints = this.getMaxConstraints(event.target.width, event.target.height);
      this.setState({
        initWidth: maxConstraints.x,
        initHeight: maxConstraints.y,
        width: maxConstraints.x,
        height: maxConstraints.y,
        ratio: maxConstraints.ratio,
        iconColors: {
          resizeHandle: resizeHandleColor,
          deleteImage: deleteImageIconColor
        }
      });
    }, false);

    insertedImage.src = this.props.src;
    window.addEventListener('click', this.onClick);
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return (nextState.height !== this.state.height) && (nextState.width !== this.state.width)
  // }

  handleImageRemove = () => {
    // const {block} = this.props
    // this.setState({visible: false})
    // let nodeToRemove = ReactDOM.findDOMNode(this.refs.resizableImage);
    // ReactDOM.unmountComponentAtNode(nodeToRemove)
    this.props.removeCallback()
  }

  getMinConstraints() {
    const minSize = 100; // 100px

    if(this.state.ratio > 1) {
      return {
        x: (minSize * this.state.ratio),
        y: minSize
      }
    } else {
      return {
        x: minSize, 
        y: (minSize / this.state.ratio),
      }
    }
  }

  getMaxConstraints(width, height){
    let x, y;
    const ratio = width / height;

    if(ratio > 1) {
      x = this.props.maxWidth > width ? width : this.props.maxWidth
      return {
        x: x,
        y: (x / ratio),
        ratio: ratio
      }
    } else {
      y = this.props.maxHeight > height ? height : this.props.maxHeight
      return {
        x: (y * ratio),
        y: y,
        ratio: ratio
      }
    }
  }

  handleAlign = (alignmentDirection) => {
    this.setState({
      alignment: alignmentDirection,
      alignmentClass: this.makeAlignmentClass(alignmentDirection)
    })
  }
  handleAlignLeft = (e) => {
    e.preventDefault();
    this.handleAlign('left')
  }

  handleAlignRight = (e) => {
    e.preventDefault();
    this.handleAlign('right')
  }

  handleAlignCenter = (e) => {
    e.preventDefault();
    this.handleAlign('center')
  }

  handleImageFocus = (e) => {
    e.preventDefault();
    console.log('handle focus')
    console.log(this.state.alignment)
    if(!this.state.inFocus) {
      this.setState({
        inFocus: true, 
        alignmentClass: this.makeAlignmentClass(this.state.alignment, true)
      });
    }
    
  }

  onResizeStop = (direction, styleSize, clientSize, delta) => {
    this.setState({width: clientSize.width, height: clientSize.height})
  }

  handleBlur = (e) => {
    e.preventDefault();
    console.log('blur')
  }

  render() {
    let minConstraints = this.getMinConstraints();
    console.log(this.state.width);

    return (
      <Resizable
        ref="resizableImage"
        customClass={this.state.alignmentClass}
        width={this.state.initWidth}
        height={this.state.initHeight}
        maxWidth={this.state.initWidth}
        maxHeight={this.state.initHeight}
        minWidth={minConstraints.x}
        minHeight={minConstraints.y}
        isResizable={{ ...isResizable }}
        handleStyle={{ ...handleStyles}}
        onClick= { this.handleImageFocus }
        onBlur={this.handleBlur}
        inFocus= { this.state.inFocus }
        onResizeStop={this.onResizeStop}
        lockRatio={true}
        ratio={this.state.ratio}
      >
        <IconButton 
          className="image-editor-control"
          style={{position: 'absolute', top: 20, right: 18, width: 24, height: 24, padding: 0, zIndex: 40}} 
          tooltipStyles={{zIndex: 100, top: 16, right: 26}}
          tooltipPosition='top-left'
          iconStyle={{color: this.state.iconColors.deleteImage, width: 20, height: 20}}
          tooltip="Remove"
          onTouchTap={this.handleImageRemove}
        >
          <DeleteIcon />
        </IconButton>

        <InlineImageControls
          alignment={this.state.alignment}
          currentImageWidth={ this.state.width }
          handleAlignLeft={ this.handleAlignLeft }
          handleAlignRight={ this.handleAlignRight }
          handleAlignCenter={ this.handleAlignCenter }
        />

        <img src={this.props.src} style={{...this.props.style}}  />
      </Resizable>
    )
  }
}

export default ImageEntity;