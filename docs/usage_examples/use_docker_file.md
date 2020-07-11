
##  Using Dockerfile for gems which with other OS linux image or system libraries and utilities

*Add custom config in `serverless.yml`*

```YML
service: basic

plugins:
  - serverless-ruby-layer

custom:
  rubyLayer:
    use_docker: true
    docker_file: Dockerfile

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

