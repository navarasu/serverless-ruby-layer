<h1><div style="height:75px" class="side-bar-logo">&nbsp;</div></h1>

[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com)  [![npm](https://img.shields.io/npm/v/serverless-ruby-layer.svg)](https://www.npmjs.com/package/serverless-ruby-layer) [![Build Status](https://img.shields.io/circleci/build/github/navarasu/serverless-ruby-layer)](https://circleci.com/gh/navarasu/serverless-ruby-layer) [![Coverage Status](https://coveralls.io/repos/github/navarasu/serverless-ruby-layer/badge.svg?branch=master)](https://coveralls.io/github/navarasu/serverless-ruby-layer?branch=master) [![MIT License](https://img.shields.io/npm/l/serverless-ruby-layer)](https://github.com/navarasu/serverless-ruby-layer/blob/master/LICENSE)

A Serverless Plugin which bundles ruby gems from Gemfile and deploys them to the lambda layer automatically while running `serverless deploy`.

It auto-configures the AWS lambda layer and RUBY_PATH to all the functions.

## Install

Install ⚡️ [serverless](https://www.serverless.com/). Refer [here](https://www.serverless.com/framework/docs/getting-started/) for serverless installation instructions.

Navigate to your serverless project and install the plugin

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

Running `sls deploy` automatically deploys the required gems as in Gemfile to AWS lambda layer and make the gems available to the `RUBY_PATH` of the functions `hello.handler`

Refer [example](https://github.com/navarasu/serverless-ruby-layer/blob/master/examples/basic) amd [docs](https://navarasu.github.io/serverless-ruby-layer) for more details

### Customization

The plugin operation can be customized by specifying the `custom` configuration under `rubyLayer`. 

For example, to use docker environment for packing gem, the below configuration is added to `serverless.yml`

```YML
custom:
  rubyLayer:
    use_docker: true
  ```

For more detailse refer the docs [here](https://navarasu.github.io/serverless-ruby-layer/#/configuration)


## Usage

Using the custom configuration, the plugin can be utilized for below cases,
* Using locally installed bundler for gems without any native extensions - [Example](https://github.com/navarasu/serverless-ruby-layer/blob/master/examples/basic) - [Docs](https://navarasu.github.io/serverless-ruby-layer/#/use_local_bundler)
* Using Docker for gems with OS native C extensions or system libraries like `http`, `Nokogiri` - [Example](https://github.com/navarasu/serverless-ruby-layer/blob/master/examples/use-docker) - [Docs](https://navarasu.github.io/serverless-ruby-layer/#/use_docker)
* Preinstall OS packages (yum packages) for gems which requires OS native system libraries like `pg`, `mysql`, `RMagick` - [PG ruby2.5 Example](https://github.com/navarasu/serverless-ruby-layer/blob/master/examples/use-docker-with-yums-pg-ruby2-5) , [PG ruby2.7 Example](https://github.com/navarasu/serverless-ruby-layer/blob/master/examples/use-docker-with-yums-pg-ruby2-7) - [Docs](https://navarasu.github.io/serverless-ruby-layer/#/use_docker_with_yums)
* Using Docker with environment variable passthrough - [Example](https://github.com/navarasu/serverless-ruby-layer/blob/master/examples/use-docker-with-env-passthrough) - [Docs](https://navarasu.github.io/serverless-ruby-layer/#/use_docker_with_env_passthrough)
* Using Dockerfile for gems which with other OS Linux image or system libraries and utilities -  [Example](https://github.com/navarasu/serverless-ruby-layer/blob/master/examples/use-docker-file) - [Docs](https://navarasu.github.io/serverless-ruby-layer/#/use_docker_file)
* Using Dockerfile with custom build args -  [Example](https://github.com/navarasu/serverless-ruby-layer/blob/master/examples/use-docker-file-with-build-args) - [Docs](https://navarasu.github.io/serverless-ruby-layer/#/use_docker_file_with_build_args)
* Include / Exclude specific functions from layer configuration - [Include Example](https://github.com/navarasu/serverless-ruby-layer/blob/master/examples/include-functions) , [Exclude Example](https://github.com/navarasu/serverless-ruby-layer/blob/master/examples/exclude-functions) - [Docs](https://navarasu.github.io/serverless-ruby-layer/#/include_exclude)
* Exclude test and development related gems from layer  - [Example](https://github.com/navarasu/serverless-ruby-layer/blob/master/examples/exclude-dev-test-gems) - [Docs](https://navarasu.github.io/serverless-ruby-layer/#/exclude_dev_test_gems)
* Using `Bundler.require(:default)` to require all gems in handler.rb by respecting Gemfile.lock  - [Example](https://github.com/navarasu/serverless-ruby-layer/blob/master/examples/bundler-require-all) - [Docs](https://navarasu.github.io/serverless-ruby-layer/#/bundler_require_all)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update the tests as appropriate.

Refer [Guidelines](https://github.com/navarasu/serverless-ruby-layer/blob/master/CONTRIBUTING.md)  for more information.

## License

[MIT](https://choosealicense.com/licenses/mit/)
