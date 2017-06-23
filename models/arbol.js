import Nodo from './nodo';

const debug = require('debug')('taxonomia:lib:arbol');

const insertarHermano = (nombre, especie, pNodo, dominioTaxonomico) => {
  const nodo = pNodo;
  const hermano = nodo.hermanoDer;
  const path = dominioTaxonomico.substring(0, dominioTaxonomico.indexOf(nombre));
  if (hermano == null) {
    nodo.hermanoDer = new Nodo(nombre, path, especie);
  } else if (hermano.categoria !== nombre) {
    insertarHermano(nombre, especie, hermano, dominioTaxonomico);
  }
};

/**
 * Inserta hijo si no existe
 * @param {string} dominio
 * @param {object} especie
 * @param {object} nodoPadre
 */
const insertarHijo = (pDominio, especie, nodoPadre, dominioTaxonomico) => {
  debug(`insertar hijo ${JSON.stringify(nodoPadre)}`);

  const categoria = pDominio.substring(0, pDominio.indexOf('.'));
  const path = dominioTaxonomico.substring(0, dominioTaxonomico.indexOf(categoria !== '' ? categoria : pDominio));
  const hijoIzq = nodoPadre.hijoIzq;

    // Si categoria esta vacio es que es la hoja
  if (categoria === '') {
    if (hijoIzq != null) {
      if (hijoIzq.categoria !== pDominio) {
        insertarHermano(pDominio, especie, hijoIzq, dominioTaxonomico);
      }
    } else {
      nodoPadre.hijoIzq = new Nodo(pDominio, path, especie);
    }
  } else {
    const dominio = pDominio.substring(pDominio.indexOf('.') + 1);
    if (hijoIzq) {
      if (hijoIzq.categoria === categoria) {
        insertarHijo(dominio, especie, hijoIzq, dominioTaxonomico);
      } else {
        insertarHermano(dominio, especie, hijoIzq, dominioTaxonomico);
      }
    } else {
      nodoPadre.hijoIzq = new Nodo(categoria, path);
      insertarHijo(dominio, especie, nodoPadre.hijoIzq, dominioTaxonomico);
    }
  }
};

function* postOrden(nodo) {
  if (nodo) {
    yield* postOrden(nodo.hijoIzq);
    yield* postOrden(nodo.hermanoDer);
    debug('yield nodo');
    yield nodo;
  }
}

/**
 *
 */
class Arbol {
  constructor(db) {
    this.raiz = null;
    this.db = db;
  }

    /**
     * Inserta un nuevo nodo con el dato enviado por parametro
     * @param {*int*} dato
     */
  Agregar(dominio, especie) {
    debug('agregar dato');
    const reino = dominio.substring(0, dominio.indexOf('.'));
    if (!this.raiz) {
      this.raiz = new Nodo(reino, null);

      // Se achica el dominio para el siguiente nivel taxonomico
      const newDominio = dominio.substring(dominio.indexOf('.') + 1);
      insertarHijo(newDominio, especie, this.raiz, dominio);

      return this.raiz;
    }
    return this.raiz;
  }

  Guardar() {
    const orden = postOrden(this.raiz);

    return new Promise((resolve, reject) => {
      while (true) {
        const iterator = orden.next();
        if (iterator.done) break;
        const nod = iterator.value;
        debug(`orden.value: ${JSON.stringify(nod)}`);
        this.db.taxonomia.insert(nod, (err) => {
          if (err) reject(err);
        });
      }
      resolve();
    });
  }
}

module.exports = Arbol;
