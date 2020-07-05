<h1><img height="75" src="https://user-images.githubusercontent.com/20145075/86084483-aa2d4b80-baba-11ea-938d-53d6b7e37896.png" alt="iOS resume application project app icon"></h1>

[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com)  [![npm](https://img.shields.io/npm/v/serverless-ruby-layer.svg)](https://www.npmjs.com/package/serverless-ruby-layer) [![Build Status](https://img.shields.io/circleci/build/github/navarasu/serverless-ruby-layer)](https://circleci.com/gh/navarasu/serverless-ruby-layer) [![Coverage Status](https://coveralls.io/repos/github/navarasu/serverless-ruby-layer/badge.svg?branch=master)](https://coveralls.io/github/navarasu/serverless-ruby-layer?branch=master) [![MIT License](https://img.shields.io/npm/l/serverless-ruby-layer)](https://github.com/navarasu/serverless-ruby-layer/blob/master/LICENSE)

A Serverless Plugin to bundle ruby gems from Gemfile and deploy it to lambda layer automatically while running `severless deploy`.

It auto configures the lamda layer and RUBY_PATH to the all the functions.

## Install

```shell
npm install serverless-ruby-bundler
```

## Simple Usage

*Include plugin in the `serverless.yml`*

```YML
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

*Gemfile*

```ruby
  source 'https://rubygems.org'
  gem 'httparty'
```

Running `servleress deploy` automatically deploys the required gems as in Gemfile to AWS lambda layer and make the gems available to the `RUBY_PATH` of the functions `hello.handler`

## Customization

### Using docker for gems with OS specific C extentions

*Add custom config in `serverless.yml`*

```YML
service: basic

plugins:
  - serverless-ruby-layer

custom:
  rubyLayer:
    use_docker: true

provider:
  name: aws
  runtime: ruby2.5

functions:
  hello:
    handler: handler.hello
  ```

*Gemfile*

```ruby
  source 'https://rubygems.org'
  gem 'http'
  gem 'nokogiri'
```