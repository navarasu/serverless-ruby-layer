<!-- # Customization -->

##  Preinstall yum packages for gems which requires OS native system libraries


<!-- tabs:start -->

#### ** serverless.yml **

```yml
service: using-docker-yums

plugins:
  - serverless-ruby-layer

custom:
  rubyLayer:
    use_docker: true
    docker_yums:
      - postgresql-devel
    native_libs:
      - /usr/lib64/libpq.so.5

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