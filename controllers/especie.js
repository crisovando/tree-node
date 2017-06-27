
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
    search: (req, res, next) => {
      debug('.especie.find called');
      // TODO: Realizar el get
    },
  };
}

module.exports = Especie;
