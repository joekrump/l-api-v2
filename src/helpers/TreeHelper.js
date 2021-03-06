import find from 'lodash.find';

export default class TreeHelper {
  constructor(treeData, preformatted) {

    this.addNodes = this.addNodes.bind(this);
    this.getChildNodeIds = this.getChildNodeIds.bind(this);
    this.moveNode = this.moveNode.bind(this);
    this.addNodeToNewLocation = this.addNodeToNewLocation.bind(this);
    this.addToParentNodeChildren = this.addToParentNodeChildren.bind(this);
    this.updateSecondaryText = this.updateSecondaryText.bind(this);

    if(preformatted) {
      this.flatNodes = treeData;
    } else {
      const rootNode = {id: -1, children: treeData, child_ids: this.getChildNodeIds(treeData)};

      this.flatNodes = [rootNode]
      this.addNodes(treeData);
    }
  }

  /**
   * Build an array that contains the model ids of the nodes in the tree.
   * @param  {Array} treeData - A nested array of nodes. 
   * @return undefined
   */
  addNodes(treeData) {
    treeData.forEach((node) => {
      node.parent_id = node.parent_id === null ? -1 : node.parent_id;
      this.flatNodes.push(node);
      if(node.children && (node.children.length > 0)) {
        this.addNodes(node.children);
      }
    })
  }

  getChildNodeIds(children) {
    return children.map((child) => (child.id));
  }

  moveNode(nodeBeingMovedId, siblingNodeId, parentId) {
    let nodeBeingMoved = getNodeFromId(nodeBeingMovedId, this.flatNodes);

    removeNodeFromPreviousLocation(nodeBeingMoved, this.flatNodes);

    this.addNodeToNewLocation(parentId, nodeBeingMoved, siblingNodeId);
  }

  addNodeToNewLocation(parentId, nodeBeingMoved, siblingNodeId) {
    if((parentId === null) || (parentId === undefined)) {
      parentId = -1;
    }

    let parentNode = getNodeFromId(parentId, this.flatNodes);
    // associate the node with its new parent.
    this.addToParentNodeChildren(parentNode, nodeBeingMoved, siblingNodeId);
  }

  addToParentNodeChildren(parentNode, nodeBeingMoved, siblingNodeId) {
    if(nodeBeingMoved.parent_id !== undefined) {
      nodeBeingMoved.parent_id = parentNode.id;
    }

    if(siblingNodeId) {
      let previousIndex = parentNode.child_ids.indexOf(siblingNodeId);
      parentNode.children.splice(previousIndex, 0, nodeBeingMoved);
      parentNode.child_ids.splice(previousIndex, 0, nodeBeingMoved.id);
    } else {
      parentNode.children.push(nodeBeingMoved);
      parentNode.child_ids.push(nodeBeingMoved.id);
    }

    if(nodeBeingMoved.previewPath) {
      console.log('update secondary text')
      this.updateSecondaryText(parentNode, nodeBeingMoved);
    }
    return;
  }

  updateSecondaryText(parentNode, nodeBeingMoved) {
    let parentSecondary = parentNode.secondary ? parentNode.secondary : '';
    let slashIndex = nodeBeingMoved.secondary.lastIndexOf('/');
    let originalPath = nodeBeingMoved.secondary.substr(slashIndex);
    nodeBeingMoved.secondary = `${parentSecondary}${originalPath}`
    
    if(nodeBeingMoved.previewPath) {
      nodeBeingMoved.previewPath = nodeBeingMoved.secondary;
    }

    if(nodeBeingMoved.children.length > 0) {
      nodeBeingMoved.children.forEach((childNode) => {
        this.updateSecondaryText(nodeBeingMoved, childNode);
      })
    }
    return;
  }
}

function removeNodeFromPreviousLocation(nodeBeingMoved, arrayToRemoveFrom) {
  let parentNode;

  if(nodeBeingMoved.parent_id === undefined) {
    // if the node being moved doesn't have a parent_id property then this is a flat
    // array and therefore the only item with children is the root which is at index 0.
    parentNode = arrayToRemoveFrom[0];  
  } else {
    parentNode = getNodeFromId(nodeBeingMoved.parent_id, arrayToRemoveFrom);
  }
  
  let childIndex = parentNode.child_ids.indexOf(nodeBeingMoved.id);
  
  parentNode.child_ids.splice(childIndex, 1);
  parentNode.children.splice(childIndex, 1);
}

// http://ejohn.org/blog/comparing-document-position/
export function _contains(a, b){   
  if(a.contains) {
    return (a !== b) && (!a.contains(b))
  } else {
    return !!(a.compareDocumentPosition(b) & 16);
  } 
}

export function getNodeFromId(nodeId, nodeArray) {
  if(nodeId === null) {
    nodeId = -1;
  }

  return find(nodeArray, (node) => {
    return node.id === nodeId
  });
}

export function makeMinimalArray(arrayOfNodes, minimalArray = []) {
  
  if(!arrayOfNodes) {
    return minimalArray;
  }

  arrayOfNodes.forEach((node, i) => {
    minimalArray.push({id: node.id, parent_id: node.parent_id});
    if(node.children && (node.children.length > 0)) {
      minimalArray = makeMinimalArray(node.children, minimalArray);
    }
  });

  return minimalArray;
}

export function deleteNode(flatNodes, nodeToRemoveId) {
  let nodeToRemove = getNodeFromId(nodeToRemoveId);
  removeNodeFromPreviousLocation(nodeToRemove, flatNodes)
}
