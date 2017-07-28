import Nodo from './nodo';

function Tree(db) {
  this.root = null;
  this.db = db;
}

Tree.prototype.Root = () => this.root;
Tree.prototype.DB = () => this.db;

  /**
   * Inicializa un arbol de un objeto tree enviado
   * @param {Array} dominio
   */
Tree.prototype.Init = (tree) => {
  this.root = tree.Root();
};

  /**
   * Agrega un nodo al arbol
   * @param {Array} dominio
   */
Tree.prototype.Agregar = (dominio, dato, db) => {
  
  const promise = new Promise((resolve, reject) => {
    const stackCategorias = dominio.split('.').reverse();
    const reino = stackCategorias.pop();

    db.taxonomia.findOne({ categoria: reino }, (err, doc) => {
      if (err) reject(err);
      this.raiz = doc === null ? new Nodo(reino) : doc;
      this.raiz.HijoIzq(insertarHijo(stackCategorias, dato, this.raiz));
      resolve(this.raiz);
    });
  });

  return promise;
};

  /**
   * Devuelve un hijo
   * @param {Array} categorias
   * @param {Object} dato
   * @param {Object} nodo
   */
function insertarHijo(categorias, dato, nodo) {
  const categoria = categorias.pop();
  let hijoIzq = Object.create(nodo.HijoIzq());
  if (hijoIzq) {
    if (hijoIzq.categoria !== categoria) {
      hijoIzq.HermanoDer(insertarHermano(categorias, dato, hijoIzq));
    }
  } else {
    hijoIzq = new Nodo(categoria, dato);
    hijoIzq.HijoIzq(insertarHijo(categorias, dato, hijoIzq));
  }
  return hijoIzq;
}

  /**
   * Devuelve un hermano
   * @param {Array} categorias
   * @param {Object} dato
   * @param {Object} nodo
   */
function insertarHermano(categorias, dato, nodo) {
  let hermano = Object.create(nodo.HermanoDer());
  const categoria = categorias[categorias.length - 1];

  if (hermano && hermano.categoria !== categoria) {
    hermano.HermanoDer(insertarHermano(categorias, dato, hermano));
  } else {
    hermano = new Nodo(categoria, dato);
    hermano.HijoIzq(insertarHijo((categorias.pop(), categorias), dato, hermano));
  }
  return hermano;
}

export default Tree;
