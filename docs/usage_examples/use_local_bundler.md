
##  Using locallly installed bundler for gems which native  extensions 

*`serverless.yml`*

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
