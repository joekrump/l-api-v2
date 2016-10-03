export default class TreeHelper {
  constructor(nestedArray, existingTree) {

    // An array to hold objects representing nodes in a tree.
    this.richNodeArray          = [];
    // will contain only item_ids of items stored in richNodeArray for quick lookup.
    this.lookupArray            = []; 
    this.addNewTreeNode         = this.addNewTreeNode.bind(this);
    this.walk                   = this._walk.bind(this);
    this.updateTree             = this.updateTree.bind(this);
    this.contains               = this._contains.bind(this);
    this.decrementParentIndexes = this.decrementParentIndexes.bind(this);
    this.decrementChildIndexes  = this.decrementChildIndexes.bind(this);
    this.incrementParentIndexes = this.incrementParentIndexes.bind(this);
    this.incrementChildIndexes  = this.incrementChildIndexes.bind(this);
    this.removeFromParent       = this.removeFromParent.bind(this);
    this.removeItem             = this.removeItem.bind(this);
    this.addItem                = this.addItem.bind(this);
    this.appendItem             = this.appendItem.bind(this);
    this.injectItem             = this.injectItem.bind(this);
    this.getIndexFromId         = this.getIndexFromId.bind(this);
    this.getIdFromIndex         = this.getIdFromIndex.bind(this);
    this.getNumToRemove         = this.getNumToRemove.bind(this);
    this.addChildToParent       = this.addChildToParent.bind(this);
    this.increaseChildDepth     = this.increaseChildDepth.bind(this);
    this.updateSecondaryText    = this.updateSecondaryText.bind(this);
    this.removeFromTreeByItemId = this.removeFromTreeByItemId.bind(this);

    if(existingTree) {
      this.richNodeArray = nestedArray;
      nestedArray.forEach((node) => {
        this.lookupArray.push(node.item_id);
      })
    } else {
      // push the root item to the richNodeArray
      // 
      this.richNodeArray.push({item_id: -1, depth: -1, node: {children: []}, childIndexes: []});
      // push the root item item_id value. Use -1 as it is not a possible natural 
      // id that a model instance could have as their ids are all positive.
      // 
      this.lookupArray.push(-1); 

      if(nestedArray && nestedArray.length > 0) {
        // build a flat array that represents the order that the nodes display in.
        this.walk(nestedArray, 0, -1);
      }
    }
  }

  removeFromTreeByItemId(item_id) {
    // TODO:
    // 
    // Find the instance of the node that has a item_id that matches the one provided.
    // 
    let nodeIndex = this.getIndexFromId(item_id);
    let siblingItemId = null;
    // remove it from the tree
    // 
    let item = this.richNodeArray[nodeIndex];
    let parentNode = this.richNodeArray[item.parentIndex]
    let childIndex = parentNode.childIndexes.indexOf(nodeIndex);

    // if not the last child then it has a sibling
    if(childIndex !== (parentNode.childIndexes.length - 1)) {
      siblingItemId = this.richNodeArray[parentNode.childIndexes[childIndex + 1]].item_id
    }

    let itemsRemoved = this.removeItem(nodeIndex, item).slice(1); // remove the first element as it is the item being removed.


    this.updateTree(siblingItemId, parentNode.item_id)

    item.childIndexes = item.childIndexes.map((index) => {
      return --index;
    });
    // remove references to it from its parent
    // 

    parentNode.childIndexes.splice(childIndex, 1, ...item.childIndexes);
  }

  /**
   * Create a 2D array representation of a tree structure.
   * @param  {Array<Object>} treeNodes  - an array of nodes from the tree object used 
   *                                      to create this instance.
   * @param  {int} parentIndex          - The index of the entry in the richNodeArray
   *                                      that corresponds to where this nodes parent is.
   * @param  {int} depth                - The tree depth to insert at.                                     
   * @return undefined
   */
  _walk(treeNodes, parentIndex, depth) { 
    treeNodes.forEach((treeNode, i) => {
      this.addNewTreeNode(treeNode, parentIndex, depth);
      if(treeNode.children && (treeNode.children.length > 0)) {
        this.walk(treeNode.children, (parentIndex + (i + 1)), (depth + 1));
      }
    });
  }

  /**
   * Insert a minimal representation of a tree node into 
   * a 2D array.
   * @param  {object} treeNode    - The object to insert into richNodeArray
   * @param  {int} parentIndex    - The index for the parent that treeNode is a child of.
   * @return {int}                - The in richNodeArray that the item was inserted at.
   */
  addNewTreeNode(treeNode, parentIndex, parentDepth){
    let nodeArrayItem = {};
    let nodeItemIndex = 0;

    treeNode.depth = parentDepth + 1;
    nodeArrayItem.item_id = treeNode.id;
    nodeArrayItem.childIndexes = [];
    nodeArrayItem.depth = treeNode.depth;
    // if this object has a parent then assign 
    if (parentIndex) {
      nodeArrayItem.parentIndex = parentIndex;
    } else {
      nodeArrayItem.parentIndex = 0;
    }

    nodeArrayItem.node = treeNode;
    // push this node to the large array of all nodes.
    this.richNodeArray.push(nodeArrayItem);
    this.lookupArray.push(treeNode.id);

    nodeItemIndex = this.richNodeArray.length - 1;

    // push this item's parent childIndexes array.
    this.richNodeArray[parentIndex].childIndexes.push(nodeItemIndex);
    // push children for artificial root if necessary.
    if(parentDepth == -1) {
      this.richNodeArray[parentIndex].node.children.push(treeNode);
    }

    return nodeItemIndex;
  }

  /**
   * Slice an item from both the lookupArray and richNodeArray at a specific 
   * index.
   * @param  {int} index - The index at which the item is to be removed.
   * @return {Object}    - A minimal representation of the the item that was removed
   *                       from the richNodeArray.
   */
  removeItem(index, item) {
    this.removeFromParent(index);

    // get the number of items to remove. so that parents and children are all move together.
    let numToRemove = this.getNumToRemove(item);

    let richItems  = this.richNodeArray.splice(index, numToRemove);

    let idsRemoved = this.lookupArray.splice(index, numToRemove);

    let startingIndex = index + (idsRemoved.length - 1);

    // update the childIndexes references and parentIndex references
    this.decrementParentIndexes(startingIndex, removedData.ids.length);
    this.decrementChildIndexes(startingIndex, removedData.ids.length);

    // Adjust indexes of items in the array of items being moved.
    richItems = this.decrementParentIndexes(startingIndex, removedData.ids.length, removedData.richItems);
    richItems = this.decrementChildIndexes(startingIndex, removedData.ids.length, removedData.richItems);

    return {richItems: richItems, ids: idsRemoved};
  }

  removeFromParent(index) {
    let item = this.richNodeArray[index];
    let parentNode = this.richNodeArray[item.parentIndex];
    let childPosition = parentNode.childIndexes.indexOf(index);

    parentNode.childIndexes.splice(index, 1);
  }

  getNumToRemove(item) {
    let numToRemove = 1;
    // if the item does not have any childIndexes, return early.
    if(item.childIndexes.length == 0) {
      return numToRemove;
    }

    item.childIndexes.forEach((childIndex) => {
      numToRemove += this.getNumToRemove(this.richNodeArray[childIndex]);
    })
    return numToRemove;
  }

  appendItem(removedData){
    this.richNodeArray.push(...removedData.richItems);
    this.lookupArray.push(...removedData.ids);
  }

  injectItem(index, removedData) {
    this.richNodeArray.splice(index, 0, ...removedData.richItems);
    this.lookupArray.splice(index, 0, ...removedData.ids);
  }

  addItem(removedData, index, nextIndex) {
    let moveItemRoot = removedData.richItems[0];
    // add the item into its parent's childIndexes array.
    // if the nextIndex is -1 it indicates that the item
    // is the last child of its parent.
    if(nextIndex === -1 && moveItemRoot.parentIndex === 0){
      this.appendItem(removedData);
    } else if(nextIndex === -1) {
      this.injectItem(index, removedData);
    } else {
      this.injectItem(index, removedData);
    }

    this.addChildToParent(moveItemRoot, index, nextIndex);
  }

  increaseChildDepth(moveItemRoot, parentNode) {
    // update depth to be one more than that of its parent
    moveItemRoot.depth = parentNode.depth + 1;
  }
  updateSecondaryText(moveItemRoot, parentNode) {
    let parentSecondary = parentNode.node.secondary ? 
      parentNode.node.secondary : '';
    let slashIndex = moveItemRoot.node.secondary.lastIndexOf('/');
    let originalPath = moveItemRoot.node.secondary.substr(slashIndex);
    moveItemRoot.node.secondary = `${parentSecondary}${originalPath}`

    this.increaseChildDepth(moveItemRoot, parentNode);

    if(moveItemRoot.childIndexes.length > 0) {
      moveItemRoot.childIndexes.forEach((childIndex) => {
        this.updateSecondaryText(this.richNodeArray[childIndex], moveItemRoot);
        this.increaseChildDepth(this.richNodeArray[childIndex], moveItemRoot);
      })
    }
  }

  addChildToParent(moveItemRoot, index, nextIndex){

    let parentNode = this.richNodeArray[moveItemRoot.parentIndex];
    
    if(moveItemRoot.node.children && moveItemRoot.node.secondary) {
      // update secondary text
      this.updateSecondaryText(moveItemRoot, parentNode);
    } else {
      this.increaseChildDepth(moveItemRoot, parentNode);
    }

    if(nextIndex === -1 && moveItemRoot.parentIndex === 0){
      parentNode.childIndexes.push(index);
      // parentNode.node.children.push(moveItemRoot.node);
    } else if(nextIndex === -1) {
      parentNode.childIndexes.push(index);
      // parentNode.node.children.push(moveItemRoot.node);
    } else {
      // otherwise splice the item into the array at the index where the
      // nextIndex sibling previously was.
      let childIndexes = parentNode.childIndexes;
      let siblingIndex = childIndexes.indexOf(nextIndex);
      parentNode.childIndexes.splice(siblingIndex, 0, index);
      // parentNode.node.children.splice(siblingIndex, 0, moveItemRoot.node);
    }
  }

  /**
   * Updates child item parentIndex values for items that have parentIndex values
   * that are greater than the startingIndex value provided.
   * @param  {int} startingIndex - The index value to compare parentIndexes against.
   * @param  {boolean} increase  - Determines whether parentIndexes that are > than
   *                               startingIndex should be increased or decreased.
   * @return undefined
   */
  decrementParentIndexes(startingIndex, amt, arrayofItems = this.richNodeArray){
    // start from index 1 because the root at index 0 does not have a parent.
    for(let i = 1; i < arrayofItems.length; i++){
      if(arrayofItems[i].parentIndex > startingIndex){
        arrayofItems[i].parentIndex -= amt;
      }
    }
    return arrayofItems;
  }

  decrementChildIndexes(startingIndex, amt, arrayofItems = this.richNodeArray){
    for(let i = 0; i < arrayofItems.length; i++){
      if(arrayofItems[i].childIndexes.length > 0){
        for(let j = 0; j < arrayofItems[i].childIndexes.length; j++){
          if(arrayofItems[i].childIndexes[j] > startingIndex){
            arrayofItems[i].childIndexes[j] -= amt;
          }
        }
      }
    }
    return arrayofItems;
  }

  incrementParentIndexes(startingIndex, amt, arrayofItems = this.richNodeArray) {
    for(let i = 1; i < arrayofItems.length; i++){
      if(arrayofItems[i].parentIndex >= startingIndex){
        arrayofItems[i].parentIndex += amt;
      }
    }
    return arrayofItems;
  }

  incrementChildIndexes(startingIndex, amt, arrayofItems = this.richNodeArray) {
    for(let i = 0; i < arrayofItems.length; i++){
      if(arrayofItems[i].childIndexes.length > 0){
        for(let j = 0; j < arrayofItems[i].childIndexes.length; j++){
          if(arrayofItems[i].childIndexes[j] >= startingIndex){
            arrayofItems[i].childIndexes[j] += amt;
          }
        }
      }
    }
    return arrayofItems;
  }

  /**
   * Get the index that an item is located based on its item_id
   * @param  {int} id - The item_id of the item to get the index of.
   * @return {int}    - The index of the item.
   */
  getIndexFromId(id) {
    return ((id === null) ? -1 :this.lookupArray.indexOf(id));
  }

  /**
   * Get the item_id of an item that is found at a specific index.
   * @param  {int} index - The index of the item that item_id is being retrieved for.
   * @return {int}       - The item_id of the item at the index.
   */
  getIdFromIndex(index) {
    return this.richNodeArray[index].item_id;
  }

  /**
   * Updates the position of an item that is being moved.
   * @param  {int} movedItemId Unique id of the item that is being moved.
   * @param  {int or null} nextItemId  Unique id of the item that below where the item was moved to.
   * @param  {int} targetParentId  Unique id of the parent that moveItem will belong to.
   * @return undefined
   */
  updateTree(movedItemId, nextItemId, targetParentId) {

    // find the item in the lookup
    let originalItemIndex = this.getIndexFromId(movedItemId);
    let originalMovedItem = this.richNodeArray[originalItemIndex];
    // find the index of the next item in the lookup if one is provided, otherwise assign default of -1
    let nextItemIndex = this.getIndexFromId(nextItemId);
    let newItemIndex;
    // if no targetParentId was provided...
    if(typeof(targetParentId) === 'undefined') {
      // if item has no sibling, only assumption that can be made is that the target is the root.
      // Otherwise, the parent is the parent of the sibling.
      targetParentId = nextItemId === null ? -1 : this.getIdFromIndex(this.richNodeArray[nextItemIndex].parentIndex);
    }

    // Get the parent that the item is moving to.
    let parentItemIndex = this.getIndexFromId(targetParentId);

    // remove the item from the richNodeArray
    let removedData = this.removeItem(originalItemIndex, originalMovedItem);
    
    if(nextItemIndex > originalItemIndex) {
      nextItemIndex -= removedData.ids.length;
    }
    // update the first item that was removed. It is the parent of any other items that were updated.
    // therefore it is safe to update its parentIndex to the current value of parentItemIndex.
    removedData.richItems[0].parentIndex = parentItemIndex;
    // if the moved item has an item after it, then insert the item at the next item index
    // 
    if(nextItemIndex !== -1){
      newItemIndex = nextItemIndex; 
    } else {
      // otherwise, add in right after the parent
      newItemIndex = parentItemIndex + 1;
    }
    // items that have indexes great than or equal to the index that the item
    // is being moved to, will be pushed up by the amount equal to the number
    // of items that were removed, therefore update all reference
    // indexes that are >= the newItemIndex
    this.incrementParentIndexes(newItemIndex, removedData.ids.length);
    this.incrementChildIndexes(newItemIndex, removedData.ids.length);

    let moveAmt = (newItemIndex - originalItemIndex)

    removedData.richItems = this.incrementParentIndexes(originalItemIndex, moveAmt, removedData.richItems);
    removedData.richItems = this.incrementChildIndexes(originalItemIndex, moveAmt, removedData.richItems);
    // if the item being moved has a sibling then make sure
    // that the index reference to it is alos incremented in order
    // to reflect the changes after increment emthods have run.
    if(nextItemIndex !== -1){
      nextItemIndex += removedData.ids.length;
    }
    this.addItem(removedData, newItemIndex, nextItemIndex);
  }

  // http://ejohn.org/blog/comparing-document-position/
  _contains(a, b){
    return a.contains ?
      a != b && a.contains(b) :
      !!(a.compareDocumentPosition(b) & 16);
  }
}
