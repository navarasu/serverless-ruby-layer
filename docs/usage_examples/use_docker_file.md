
##  Using Dockerfile for gems which with other OS linux image or system libraries and utilities


<!-- tabs:start -->

#### ** serverless.yml **

```yml
service: using-docker-file

plugins:
  - serverless-ruby-layer

custom:
  rubyLayer:
    use_docker: true
    docker_file: Dockerfile
    native_libs:
      - /usr/lib64/libpq.so.5

provider:
  name: aws
  runtime: ruby2.5

functions:
  hello:
    handler: handler.hello
  ```
#### ** Dockerfile **
```docker
FROM lambci/lambda:build-ruby2.5

RUN yum install -y postgresql-devel
RUN gem update bundler

CMD "/bin/bash"
```

#### ** Gemfile **

```ruby
source 'https://rubygems.org'
gem 'pg'
```

#### ** handler.rb **

```ruby
require 'pg'

def hello(event:, context:)
  { statusCode: 200, body: {
    "pg_version": PG.library_version
    }
  }
end

```

<!-- tabs:end -->