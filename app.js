'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
module.exports = app; // for testing

var config = {
  appRoot: __dirname, // required config
  swaggerFile: __dirname + '/config/swagger.yaml'
};

SwaggerExpress.create(config, function (err, swaggerExpress) {
  if (err) {
    throw err;
  }

  //add swagger UI to /docs
  app.use(swaggerExpress.runner.swaggerTools.swaggerUi({
    apiDocs: '/swagger.json'
    //swaggerUi: '/docs'
  }));


  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 3000;
  app.listen(port);
  console.log('Server listening on port :' + port);

  if (swaggerExpress.runner.swagger.paths['/hello']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott');
  }

});

