<!-- # Customization -->

##  Preinstall OS packages (yum packages) for gems which requires OS native system libraries

*Add custom config in `serverless.yml`*

```YML
service: basic

plugins:
  - serverless-ruby-layer

custom:
  rubyLayer:
    use_docker: true
    docker_yums:
      - postgresql-devel

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
  gem 'pg'
  gem 'nokogiri'
```

