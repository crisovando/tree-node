

/**
 * @class Nodo
 * Representa un nodo del arbol general
 * @param {*} categoria
 * @param {*} path
 * @param {*} dato
 * @param {*} hermanoDer
 * @param {*} hijoIzq
 */
function Nodo(categoria, path, dato, hermanoDer, hijoIzq) {
  this.categoria = categoria;
  this.dato = dato;
  this.path = path;

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
  if (dato) this.dato = dato;
  else return this.dato;
};
Nodo.prototype.HermanoDer = (her) => {
  if (her) this.hermanoDer = her;
  else return this.hijo;
};
Nodo.prototype.HijoIzq = (hijo) => {
  if (hijo) this.hijoIzq = hijo;
  else return this.hijo;
};
Nodo.prototype.Profundidad = () => this.profundidad;


module.exports = Nodo;
