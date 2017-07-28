module.exports = (function () {
  // ------------------------------------
  // Basic Setup
  // ------------------------------------

  /**
   * @class TreeNode
   * @classdesc Represents a node in the tree.
   * @constructor
   * @param {object} data - that is to be stored in a node
   */
  function TreeNode(categoria, data, profundidad) {
    /**
     * Represents the parent node
     *
     * @property _parentNode
     * @type {object}
     * @default "null"
     */
    this.hermanoDer = null;

    /**
     * Represents the child nodes
     *
     * @property _childNodes
     * @type {array}
     * @default "[]"
     */
    this.hijoIzq = null;

    /**
     * Represents the data node has
     *
     * @property _data
     * @type {object}
     * @default "null"
     */
    this._data = data;

    /**
     * Represents the category node has
     *
     * @property _categoria
     * @type {object}
     * @default "null"
     */
    this.categoria = categoria;

    /**
     * Depth of the node represents level in hierarchy
     *
     * @property _depth
     * @type {number}
     * @default -1
     */
    this.profundidad = profundidad >= 0 ? profundidad : -1;
  }

  // ------------------------------------
  // Getters and Setters
  // ------------------------------------

  /**
   * Returns a parent node of current node
   *
   * @method parentNode
   * @memberof TreeNode
   * @instance
   * @return {TreeNode} - parent of current node
   */
  TreeNode.prototype.HermanoDer = function (hermanoDer) {
    if (hermanoDer) this.hermanoDer = hermanoDer;
    return this.hermanoDer;
  };

  /**
   * Returns an array of child nodes
   *
   * @method childNodes
   * @memberof TreeNode
   * @instance
   * @return {array} - array of child nodes
   */
  TreeNode.prototype.HijoIzq = function (hijoIzq) {
    if (hijoIzq) this.hijoIzq = hijoIzq;
    return this.hijoIzq;
  };

  /**
   * Sets or gets the data belonging to this node. Data is what user sets using `insert` and `insertTo` methods.
   *
   * @method data
   * @memberof TreeNode
   * @instance
   * @param {object | array | string | number | null} data - data which is to be stored
   * @return {object | array | string | number | null} - data belonging to this node
   */
  TreeNode.prototype.data = function (data) {
    if (arguments.length > 0) {
      this._data = data;
    } else {
      return this._data;
    }
  };

  /**
   * Depth of the node. Indicates the level at which node lies in a tree.
   *
   * @method depth
   * @memberof TreeNode
   * @instance
   * @return {number} - depth of node
   */
  TreeNode.prototype.Profundidad = function (prof) {
    if (prof) this.profundidad = prof;
    return this.profundidad;
  };

  // ------------------------------------
  // Methods
  // ------------------------------------

  /**
   * Indicates whether this node matches the specified criteria. It triggers a callback criteria function that returns something.
   *
   * @method matchCriteria
   * @memberof TreeNode
   * @instance
   * @param {function} callback - Callback function that specifies some criteria. It receives {@link TreeNode#_data} in parameter and expects different values in different scenarios.
   * `matchCriteria` is used by following functions and expects:
   * 1. {@link Tree#searchBFS} - {boolean} in return indicating whether given node satisfies criteria.
   * 2. {@link Tree#searchDFS} - {boolean} in return indicating whether given node satisfies criteria.
   * 3. {@link Tree#export} - {object} in return indicating formatted data object.
   */
  TreeNode.prototype.matchCriteria = function (criteria) {
    return criteria(this._data);
  };


  /**
   * Finds distance of node from root node
   *
   * @method distanceToRoot
   * @memberof TreeNode
   * @instance
   * @return {array} - array of instances of {@link TreeNode}
   */
  TreeNode.prototype.distanceToRoot = function () {
    // Initialize Distance and Node
    let distance = 0,
      node = this;

    // Loop Over Ancestors
    while (node.parentNode()) {
      distance++;
      node = node.parentNode();
    }

    // Return
    return distance;
  };

  /**
   * Exports the node data in format specified. It maintains herirachy by adding
   * additional "children" property to returned value of `criteria` callback.
   *
   * @method export
   * @memberof TreeNode
   * @instance
   * @param {TreeNode~criteria} criteria - Callback function that receives data in parameter
   * and MUST return a formatted data that has to be exported. A new property "children" is added to object returned
   * that maintains the heirarchy of nodes.
   * @return {object} - {@link TreeNode}.
   * @example
   *
   * var rootNode = tree.insert({
   *   key: '#apple',
   *   value: { name: 'Apple', color: 'Red'}
   * });
   *
   * tree.insert({
   *   key: '#greenapple',
   *   value: { name: 'Green Apple', color: 'Green'}
   * });
   *
   * tree.insertToNode(rootNode,  {
   *  key: '#someanotherapple',
   *  value: { name: 'Some Apple', color: 'Some Color' }
   * });
   *
   * // Export the tree
   * var exported = rootNode.export(function(data){
   *  return { name: data.value.name };
   * });
   *
   * // Result in `exported`
   * {
   * "name": "Apple",
   * "children": [
   *   {
   *     "name": "Green Apple",
   *     "children": []
   *   },
   *   {
   *     "name": "Some Apple",
   *     "children": []
   *  }
   * ]
   *}
   *
   */
  TreeNode.prototype.export = function (criteria) {
    // Check if criteria is specified
    if (!criteria || typeof criteria !== 'function') { throw new Error('Export criteria not specified'); }

    // Export every node recursively
    var exportRecur = function (node) {
      const exported = node.matchCriteria(criteria);
      if (!exported || typeof exported !== 'object') {
        throw new Error('Export criteria should always return an object and it cannot be null.');
      } else {
        exported.children = [];
        node._childNodes.forEach((_child) => {
          exported.children.push(exportRecur(_child));
        });

        return exported;
      }
    };

    return exportRecur(this);
  };

  // ------------------------------------
  // Export
  // ------------------------------------

  return TreeNode;
}());
