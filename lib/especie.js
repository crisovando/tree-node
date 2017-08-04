
import Tree from '../models/arbol';

const debug = require('debug')('taxonomia:lib:especie');

function Guardar(root) {
  return new Promise((resolve, reject) => {
    this.db.taxonomia.update({ categoria: root.categoria }, root, { upsert: true }, (err, doc) => {
      err ? reject(err) : resolve(doc);
    });
  });
}

const getCategoriasByDominio = dominio => dominio.split('.');
const eliminarNodosVacios = (nodo, categorias) => {
  const cats = Object.assign([], categorias);
  const categoria = cats.shift();
  if (nodo) {
    if (nodo.categoria === categoria) {
      nodo.hijoIzq = eliminarNodosVacios(nodo.hijoIzq, cats);
    } else {
      nodo.hermanoDer = eliminarNodosVacios(nodo.hermanoDer, categorias);
    }
    if (!nodo.hijoIzq && !nodo.hermanoDer) nodo = undefined;
  }

  return nodo;
};

class Especie {
  constructor(main) {
    this.db = main.db;
  }

  insert(data) {
    debug('lib.insert called');

    const arbol = new Tree(this.db);
    return new Promise((resolve, reject) => {
      try {
        arbol.Agregar(data.dominioTaxonomico, data.especie, this.db)
          .then(root => Guardar.call(this, root))
          .then(nodo => resolve(nodo))
          .catch(err => reject(err));
      } catch (error) {
        reject(error);
      }
    });
  }

  find(dominio, nivel) {
    return new Promise((resolve, reject) => {
      if (dominio) {
        const categorias = getCategoriasByDominio(dominio);
        this.db.taxonomia.findOne({}, (err, doc) => {
          if (err) reject(err);

          if (doc) {
            const arbol = new Tree(null, doc);
            const nodo = arbol.ObtenerEspecie(categorias);
            resolve(categorias.length < 6 ? arbol.ObtenerEspecies(nodo.hijoIzq) : nodo.data);
          } else {
            resolve(doc);
          }
        });
      } else if (nivel !== null) {
        this.db.taxonomia.findOne({}, (err, doc) => {
          if (err) reject(err);

          if (doc) {
            const arbol = new Tree(null, doc);
            const categorias = arbol.ObtenerCategoriasXNivel(nivel);
            resolve(categorias);
          } else {
            resolve(doc);
          }
        });
      } else {
        resolve({ error: 'no envio ninguno de los parametros' });
      }
    });
  }

  remove(dominio) {
    const categorias = getCategoriasByDominio(dominio.substring(0, dominio.lastIndexOf('.')));
    return new Promise((resolve, reject) => {
      this.db.taxonomia.findOne({}, (err, doc) => {
        if (err) reject(err);

        if (doc) {
          const nameEspecie = dominio.split('.').pop();
          const arbol = new Tree(null, doc);
          const nodo = arbol.ObtenerEspecie(categorias);
          // Si existe especie actualizo
          if (nodo) {
            let currentEspecie = nodo.hijoIzq;
            let lastEspecie = {};
            // busco la especie
            let encontrado = false;
            if (currentEspecie.categoria.trim() === nameEspecie.trim()) {
              nodo.hijoIzq = currentEspecie.hermanoDer;
              encontrado = true;
            } else {
              while (currentEspecie && currentEspecie.categoria.trim() !== nameEspecie.trim()) {
                lastEspecie = currentEspecie;
                currentEspecie = currentEspecie.hermanoDer;

                if (currentEspecie) {
                  lastEspecie.hermanoDer = currentEspecie.hermanoDer;
                  encontrado = true;
                }
              }
            }
            if (encontrado) {
              eliminarNodosVacios(arbol.root, categorias);
            }
          }
          Guardar.call(this, arbol.root);
        }
        resolve();
      });
    });
  }
}

export default Especie;
