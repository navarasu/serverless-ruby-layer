
##  Using Dockerfile with custom build args

<!-- tabs:start -->

#### ** serverless.yml **

```yml
service: use-docker-file-with-build-args

plugins:
  - serverless-ruby-layer

custom:
  rubyLayer:
    use_docker: true
    docker_env_variable:
      - SERVERLESS_RUBY_LAYER_TEST_ARG

provider:
  name: aws
  runtime: ruby2.5

functions:
  hello:
    handler: handler.hello
  ```

#### ** Gemfile **

```ruby
source 'https://rubygems.org'
gem 'uuidtools'
```

#### ** handler.rb **

```ruby
require 'uuidtools'

def hello(event:, context:)
  { statusCode: 200, body: {
    "random_uuid": UUIDTools::UUID.random_create.to_s
    }
  }
end

```

<!-- tabs:end -->
