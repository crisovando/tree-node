const Nodo = require('./treeNode');

const debug = require('debug')('taxonomia:lib:arbol');

function insertarHermano(categorias, dato, nodo, dominio) {
  let hermano = nodo.HermanoDer();
  const categoria = categorias.pop();

  if (hermano && hermano.categoria !== categoria) {
    hermano.__proto__ = Nodo.prototype;
    hermano.HermanoDer(insertarHermano((categorias.push(categoria), categorias), dato, hermano, dominio));
  } else {
    hermano = categorias.length === 0 ? new Nodo(categoria, dato, nodo.Profundidad(), dominio)
                                      : new Nodo(categoria, undefined, nodo.Profundidad(), dominio);
    hermano.HijoIzq(insertarHijo(categorias, dato, hermano));
  }
  return hermano;
}

/**
 * Inserta hijo si no existe
 * @param {string} dominio
 * @param {object} especie
 * @param {object} nodoPadre
 */
function insertarHijo(categorias, dato, nodo, dominio) {
  const categoria = categorias.pop();
  let hijoIzq = nodo.HijoIzq();
  if (hijoIzq) {
    hijoIzq.__proto__ = Nodo.prototype;
    if (hijoIzq.categoria !== categoria) {
      hijoIzq.HermanoDer(insertarHermano((categorias.push(categoria), categorias), dato, hijoIzq, dominio));
    } else {
      hijoIzq.HijoIzq(insertarHijo(categorias, dato, hijoIzq, dominio));
    }
  } else if (categoria) {
    hijoIzq = categorias.length === 0 ? new Nodo(categoria, dato, nodo.Profundidad() + 1, dominio)
                                      : new Nodo(categoria, undefined, nodo.Profundidad() + 1, dominio);
    hijoIzq.HijoIzq(insertarHijo(categorias, dato, hijoIzq));
  }
  return hijoIzq;
}


/**
 *
 */
class Arbol {
  constructor(db) {
    this.db = db;
  }

  /**
   * Agregar un nuevo
   * @param {Array} dominio
   * @param {*} especie
   */
  Agregar(dominio, dato) {
    debug('agregar dato');
    
    return new Promise((resolve, reject) => {
      const stackCategorias = dominio.split('.').reverse();
      const reino = stackCategorias.pop();
      this.db.taxonomia.findOne({ categoria: reino }, (err, doc) => {
        if (err) reject(err);
        const raiz = doc === null ? new Nodo(reino, null, 0) : Object.assign({ __proto__: Nodo.prototype }, doc);
        try {
          raiz.HijoIzq(insertarHijo(stackCategorias, dato, raiz, dominio));
        } catch (error) {
          reject(error);
        }
        resolve(raiz);
      });
    });
  }

  Buscar(nodo, dominio) {
    
  }
}

module.exports = Arbol;
