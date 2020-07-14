<h1><div style="height:75px" class="side-bar-logo">&nbsp;</div></h1>


[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com)  [![npm](https://img.shields.io/npm/v/serverless-ruby-layer.svg)](https://www.npmjs.com/package/serverless-ruby-layer) [![Build Status](https://img.shields.io/circleci/build/github/navarasu/serverless-ruby-layer)](https://circleci.com/gh/navarasu/serverless-ruby-layer) [![Coverage Status](https://coveralls.io/repos/github/navarasu/serverless-ruby-layer/badge.svg?branch=master)](https://coveralls.io/github/navarasu/serverless-ruby-layer?branch=master) [![MIT License](https://img.shields.io/npm/l/serverless-ruby-layer)](https://github.com/navarasu/serverless-ruby-layer/blob/master/LICENSE)

A Serverless Plugin to bundle ruby gems from Gemfile and deploy it to the lambda layer automatically while running `serverless deploy`.

It auto-configures the AWS lambda layer and RUBY_PATH to all the functions.

## Install

```
sls plugin install -n serverless-ruby-layer
```

*This will add the plugin to `package.json` and the plugins section of `serverless.yml`.*

## Documentation

Check out the documentation [here](https://navarasu.github.io/serverless-ruby-layer) for,

* [Quick Start](https://navarasu.github.io/serverless-ruby-layer/#/quickstart)
* [Usage and Examples](https://navarasu.github.io/serverless-ruby-layer/#/usage_examples)
* [Configuration](https://navarasu.github.io/serverless-ruby-layer/#/configuration)
* [Release Notes](https://navarasu.github.io/serverless-ruby-layer/#/release_notes)

## Getting Started

### Simple Usage

*`serverless.yml`*

```yml
service: basic

plugins:
  - serverless-ruby-layer

provider:
  name: aws
  runtime: ruby2.5

functions:
  hello:
    handler: handler.hello
  ```

*`Gemfile`*

```ruby
  source 'https://rubygems.org'
  gem 'httparty'
```

Running `serverless deploy` automatically deploys the required gems as in Gemfile to AWS lambda layer and make the gems available to the `RUBY_PATH` of the functions `hello.handler`

Refer [example](https://github.com/navarasu/serverless-ruby-layer/blob/master/examples/basic) amd [docs](https://navarasu.github.io/serverless-ruby-layer) for more details

### Customization

The plugin operation can be customized by specifying the `custom` configuration under `rubyLayer`. 

For example, to use docker environment for packing gem, the below configuration is added to `serverless.yml`

```YML
custom:
  rubyLayer:
    use_docker: true
  ```

For more details, refer the docs [here](https://navarasu.github.io/serverless-ruby-layer/configuration)


## Usage

Using the custom configuration, the plugin can be utilized for below cases,
* Using locallly installed bundler for gems which native  extensions  - [Example](https://github.com/navarasu/serverless-ruby-layer/blob/master/examples/basic) - [Docs](https://navarasu.github.io/serverless-ruby-layer/use_docker)
* Using Docker for gems with OS native C extensions or system libraries like `http`, `Nokogiri` - [Example](https://github.com/navarasu/serverless-ruby-layer/blob/master/examples/use_docker) - [Docs](https://navarasu.github.io/serverless-ruby-layer/use_docker)
* Preinstall OS packages (yum packages) for gems which requires OS native system libraries like `pg`, `mysql`, `RMagick` - [Example](https://github.com/navarasu/serverless-ruby-layer/blob/master/examples/use_docker_with_yums) - [Docs](https://navarasu.github.io/serverless-ruby-layer/use_docker_with_yums)
* Using Dockerfile for gems which with other OS Linux image or system libraries and utilities -  [Example](https://github.com/navarasu/serverless-ruby-layer/blob/master/examples/use_docker_file) - [Docs](https://navarasu.github.io/serverless-ruby-layer/use_docker_file)


## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update the tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)