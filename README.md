<h1><img height="75" src="https://user-images.githubusercontent.com/20145075/86084483-aa2d4b80-baba-11ea-938d-53d6b7e37896.png" alt="iOS resume application project app icon"></h1>

[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com)  [![npm](https://img.shields.io/npm/v/serverless-ruby-layer.svg)](https://www.npmjs.com/package/serverless-ruby-layer)

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
