
const debug = require('debug')('taxonomia:controllers:especie');

function Especie(main) {
  debug('init...');

  return {
    insert: (req, res, next) => {
      debug('.especie.insert called: ', +JSON.stringify(req.swagger.params));

      const parametros = {
        dominioTaxonomico: req.swagger.params.dominioTaxonomico.value,
        especie: req.swagger.params.especie.value,
      };

      main.libs.especie.insert(parametros)
      .then((especie) => {
        res.json(especie);
      })
      .catch(err => next(err));
    },
    find: (req, res, next) => {
      debug('.especie.find called');

      const dominio = req.swagger.params.dominioTaxonomico ? req.swagger.params.dominioTaxonomico.value : null;
      const nivel = req.swagger.params.nivel ? req.swagger.params.nivel.value : null;

      main.libs.especie.find(dominio, nivel)
        .then((especie) => {
          res.json(especie);
        })
        .catch(err => next(err));
    },
    remove: (req, res, next) => {
      debug('.especie.remove called');

      const dominio = req.swagger.params.dominioTaxonomico.value;

      main.libs.especie.remove(dominio)
        .then((result) => {
          res.json(result);
        })
        .catch(err => next(err));
    },
  };
}

module.exports = Especie;
