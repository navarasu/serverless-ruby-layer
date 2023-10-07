
##  Using Dockerfile for gems which requires other system libraries and configuration


<!-- tabs:start -->

#### ** serverless.yml **

```yml
service: use-docker-file

plugins:
  - serverless-ruby-layer

custom:
  rubyLayer:
    use_docker: true
    docker_file: Dockerfile
    native_bins:
      - /usr/bin/pdfinfo
    native_libs:
      - /usr/lib64/libpq.so.5
      - /usr/lib64/libldap_r-2.4.so.2
      - /usr/lib64/liblber-2.4.so.2
      - /usr/lib64/libsasl2.so.3
      - /usr/lib64/libssl3.so
      - /usr/lib64/libsmime3.so
      - /usr/lib64/libnss3.so

provider:
  name: aws
  runtime: ruby3.2

functions:
  hello:
    handler: handler.hello
  ```

#### ** Dockerfile **
```docker
FROM public.ecr.aws/sam/build-ruby3.2:latest-x86_64

RUN yum install -y amazon-linux-extras
RUN amazon-linux-extras enable postgresql10
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
