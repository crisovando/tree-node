const Nodo = require('./treeNode');

const debug = require('debug')('taxonomia:lib:arbol');

function insertarHermano(categorias, dato, nodo) {
  let hermano = nodo.HermanoDer();
  const cats = Object.assign([], categorias);
  const categoria = cats.shift();

  if (hermano && hermano.categoria !== categoria) {
    hermano.__proto__ = Nodo.prototype;
    hermano.HermanoDer(insertarHermano((categorias), dato, hermano));
  } else {
    hermano = cats.length === 0 ? new Nodo(categoria, dato, nodo.Profundidad())
                                : new Nodo(categoria, undefined, nodo.Profundidad());
    // hermano.hermanoLeft = nodo;
    hermano.HijoIzq(insertarHijo(cats, dato, hermano));
  }
  return hermano;
}

/**
 * Inserta hijo si no existe
 * @param {string} dominio
 * @param {object} especie
 * @param {object} nodoPadre
 */
function insertarHijo(categorias, dato, nodo) {
  const cats = Object.assign([], categorias);
  const categoria = cats.shift();
  let hijoIzq = nodo.HijoIzq();
  if (hijoIzq) {
    hijoIzq.__proto__ = Nodo.prototype;
    if (hijoIzq.categoria !== categoria) {
      hijoIzq.HermanoDer(insertarHermano(categorias, dato, hijoIzq));
    } else {
      hijoIzq.HijoIzq(insertarHijo(cats, dato, hijoIzq));
    }
  } else if (categoria) {
    // if cats.length == 0 is true then the node is leaf
    hijoIzq = cats.length === 0 ? new Nodo(categoria, dato, nodo.Profundidad() + 1)
                                : new Nodo(categoria, undefined, nodo.Profundidad() + 1);
    // hijoIzq.parentNode = nodo;
    hijoIzq.HijoIzq(insertarHijo(cats, dato, hijoIzq));
  }
  return hijoIzq;
}

const buscarEspecie = (categorias, nodo) => {
  const cats = Object.assign([], categorias);
  const cat = cats.shift();
  if (nodo && cat) {
    if (nodo.categoria === cat) {
      return cats.length > 0 ? buscarEspecie(cats, nodo.hijoIzq) : nodo;
    }
    return buscarEspecie(categorias, nodo.hermanoDer);
  }
  return null;
};

const obtenerEspecies = (nodo) => {
  const especies = [];
  if (nodo) {
    if (nodo.dato) { especies.push(nodo); }
    especies.push(...obtenerEspecies(nodo.hijoIzq));
    especies.push(...obtenerEspecies(nodo.hermanoDer));
  }
  return especies.filter(x => x !== null);
};

/**
 *
 */
class Arbol {
  constructor(db, root) {
    this.db = db;
    this.root = root;
  }

  /**
   * Agregar un nuevo
   * @param {Array} dominio
   * @param {*} especie
   */
  Agregar(dominio, dato) {
    debug('agregar dato');

    return new Promise((resolve, reject) => {
      const stackCategorias = dominio.split('.');
      const stackCats = Object.assign([], stackCategorias);
      const reino = stackCategorias.shift();
      this.db.taxonomia.findOne({}, (err, doc) => {
        if (err) reject(err);
        const raiz = doc === null ? new Nodo(reino, null, 0) : Object.assign({ __proto__: Nodo.prototype }, doc);
        try {
          if (raiz.categoria !== reino) {
            raiz.HermanoDer(insertarHermano(stackCats, dato, raiz));
          } else {
            raiz.HijoIzq(insertarHijo(stackCategorias, dato, raiz));
          }
        } catch (error) {
          reject(error);
        }
        resolve(raiz);
      });
    });
  }

  ObtenerEspecie(categorias) {
    const especie = buscarEspecie(categorias, this.root);
    return especie || {};
  }
  ObtenerEspecies(nodo) {
    const especies = obtenerEspecies(nodo);
    return especies;
  }
}

module.exports = Arbol;
