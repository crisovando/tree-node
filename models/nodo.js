module.exports = (function () {

  /**
   * @class Nodo
   * Representa un nodo del arbol general
   * @param {*} categoria
   * @param {*} path
   * @param {*} dato
   * @param {*} hermanoDer
   * @param {*} hijoIzq
   */
  function Nodo(categoria, dato, hermanoDer, hijoIzq) {
    this.categoria = categoria;
    this.dato = dato;

    /**
     * Hermano derecho del nodo
     * @type {object}
     */
    this.hermanoDer = hermanoDer;

    /**
     * Hijo izquierdo del nodo
     * @type {object}
     */
    this.hijoIzq = hijoIzq;

    /**
     * Profundidad del nodo
     * @type {number}
     */
    this.profundidad = -1;
  }
  //
  // Getters & Setters
  //
  Nodo.prototype.Dato = (dato) => {
    if (dato) {
      this.dato = dato;
      return this.dato;
    }
  };
  Nodo.prototype.HermanoDer = (her) => {
    if (her) this.hermanoDer = her;
    return this.hermanoDer;
  };
  Nodo.prototype.HijoIzq = (hijo) => {
    if (hijo) this.hijoIzq = hijo;
    return this.hijoIzq;
  };
  Nodo.prototype.Profundidad = () => this.profundidad;

  return Nodo;
}());
