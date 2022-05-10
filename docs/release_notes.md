# Release notes

### [1.6.0](https://www.npmjs.com/package/serverless-ruby-layer/v/1.6.0)
### Environment Release
* Pass environment variable to docker for bundler/ Gemfile
* Pass environment variable to dockerfile as build args
* Updated examples for ruby2.7 runtime
* Fixed bug in clearing cache folder inside gems folder

### [1.5.0](https://www.npmjs.com/package/serverless-ruby-layer/v/1.5.0)
### Gemfile.lock Release
* Used `Gemfile.lock` is used for bundle install if the file present
* ` ignore_gemfile_lock: true` to ignore `Gemfile.lock` usage for bundle install
* Added pg deploy example for ruby2.7 runtime

### [1.4.0](https://www.npmjs.com/package/serverless-ruby-layer/v/1.4.0)
### Docker Inside Docker Release
* Replaced docker volume mount with docker cp to support CI (Docker inside Docker) environment.
* Handled the bundle flag deprecated for bundler version greater than 2.1
* Added docker related test case to run in circle-ci
* Improved test coverage to 88 %
* Documented exclude test and development gem example

### [1.3.0](https://www.npmjs.com/package/serverless-ruby-layer/v/1.3.0)
#### Specify Functions Release
* Option to include / exlude functions from attaching layers
* To reduce layer zip size, the gem cache files are excluded in zipping than removing it from the bundle folder
 (To avoid unnecessary error while removing and also for upcoming reuse gem options)

### [1.2.1](https://www.npmjs.com/package/serverless-ruby-layer/v/1.2.0)
#### Validated Release
* Fixed issue in removing Cache dir #17
* Handled all edge-case errors and thrown user informative message
* Added logs message for future issue debugging
* Added issue template with necessary details

### [1.2.0](https://www.npmjs.com/package/serverless-ruby-layer/v/1.2.0)
#### Native Libs Release
* Specify yums to be preinstalled before doing a bundle install for gems with os native extension like pg, mysql.
* Pack and Deploy native library files to the lambda layer along with gems. for e.g to pack /usr/lib64/libpq.so.5 file for pg.
* Use docker file to specify custom installation and configuration
* Added docs and examples

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
