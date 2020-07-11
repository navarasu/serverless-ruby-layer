
## Using Docker for gems with OS native C extensions or system libraries

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

