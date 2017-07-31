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
     * Represents the right brother
     *
     * @property hermanoDer
     * @type {object}
     * @default "null"
     */
    this.hermanoDer = null;

    /**
     * Represents the left son
     *
     * @property _childNodes
     * @type {object}
     * @default "null"
     */
    this.hijoIzq = null;

    /**
     * Represents the data node has
     *
     * @property data
     * @type {object}
     * @default "null"
     */
    this.data = data;

    /**
     * Represents the category node has
     *
     * @property categoria
     * @type {object}
     * @default "null"
     */
    this.categoria = categoria;

    /**
     * Depth of the node represents level in hierarchy
     *
     * @property profundidad
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
      this.data = data;
    } else {
      return this.data;
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

  return TreeNode;
}());
