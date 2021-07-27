
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
    docker_file: Dockerfile
    native_libs:
      - /var/task/test_arg_dummy
      - /var/task/test_arg_present
    docker_build_args:
      - SERVERLESS_RUBY_LAYER_TEST_ARG=test-value

provider:
  name: aws
  runtime: ruby2.5

functions:
  hello:
    handler: handler.hello
  ```

#### ** Dockerfile **

```docker
FROM lambci/lambda:build-ruby2.5 AS base

ARG SERVERLESS_RUBY_LAYER_TEST_ARG
ENV SERVERLESS_RUBY_LAYER_TEST_ENV_VAR=${SERVERLESS_RUBY_LAYER_TEST_ARG}

RUN gem update bundler

RUN echo "a dummy file that we generate every time" > ./test_arg_dummy

RUN if [[ -z "$SERVERLESS_RUBY_LAYER_TEST_ARG" ]] ; then echo "Argument not provided" ; else echo "Argument is $SERVERLESS_RUBY_LAYER_TEST_ARG"; echo "Argument is $SERVERLESS_RUBY_LAYER_TEST_ARG" > ./test_arg_present ; fi

CMD "/bin/bash"
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
