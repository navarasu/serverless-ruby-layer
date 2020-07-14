# Release notes

### [1.1.0](https://www.npmjs.com/package/serverless-ruby-layer/v/1.1.0)
#### Use-Docker Release
* Added option to use docker to bundle gem with os specific C extensions
* Auto excluded node_modules and vendor folder, Gemfile and Gemfile.lock from being deployed to function
* Configured test and improved test coverage


### [0.1.0](https://www.npmjs.com/package/serverless-ruby-layer/v/0.1.0)

#### First Release
* Auto deploy the gems to AWS layer while doing serverless deploy
* Also configure the layer to make the gem available to all functions declared in the serverless.yml
* Uses local bundler to install the gem