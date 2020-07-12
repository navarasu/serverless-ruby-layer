# Quick Start

## Install

```bash
sls plugin install -n serverless-ruby-layer
```

*This will add the plugin to `package.json` and the plugins section of `serverless.yml`.*

## Simple Usage

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

Running `servleress deploy` automatically deploys the required gems as in Gemfile to AWS lambda layer and make the gems available to the `RUBY_PATH` of the functions `hello.handler`

Refer [here](https://github.com/navarasu/serverless-ruby-layer/blob/master/examples/basic) for example.
