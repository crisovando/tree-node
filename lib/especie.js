import Tree from '../models/tree';

const debug = require('debug')('taxonomia:lib:especie');

function Guardar(root) {
  return new Promise((resolve, reject) => {
    this.db.taxonomia.update({ categoria: root.categoria }, root, { upsert: true }, (err, doc) => {
      err ? reject(err) : resolve(doc);
    });
  });
}

class Especie {
  constructor(main) {
    this.db = main.db;
  }

  insert(data) {
    debug('lib.insert called');

    const arbol = Object.create(Tree(this.db));
    return new Promise((resolve, reject) => {
      try {
        arbol.Agregar(data.dominioTaxonomico, data.especie)
          .then(root => Guardar.call(this, root)
            .then(nodo => resolve(nodo)),
          )
          .catch(err => reject(err));
      } catch (error) {
        reject(error);
      }
    });
  }

  find() {
    // TODO: Implementar find
  }

  remove() {
    // TODO: Implementar remove
  }
}

export default Especie;
