# Boilerplate for backend JS API

Here is the boilerplate we use to start our backend JS API.
Code in model and controllers are here for example and will not work out of the box.

## What's in

- docker
- express
- swagger
- babel
- mysql
- sequelize
- sequelize-fixtures

- mocha
- sinon-stub-promise
- nyc

## How to quickly start

- Create your model
- Define your model in swagger.yaml
- Define your path and action in swagger.yaml
- Create your controller
- Test

## Compile code source

You have to compile your code before running it
The `npm run build` command will compile your src folder to api folder
In developpement you can use the `npm run watch` which will compile on the fly your code source and restart node server

## Docker

The docker-compose allow you to easily start your application under development
Use the `docker-compose up api` to start the application with the watcher.
Use the `docker-compose up sut` to run the tests

## Migrations and seeders

For now we are running the migrations from the docker container


- docker exec -ti containerID bash
- ./node_modules/.bin/sequelize db:migrate
- ./node_modules/.bin/sequelize db:seed:all



## License

(The MIT License)

Copyright (c) 2016 Maple Inside

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.