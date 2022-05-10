## Passing environment variable

###  Using Docker with environment

<!-- tabs:start -->

#### ** serverless.yml **

```yml
service: use-docker-with-enviornment

plugins:
  - serverless-ruby-layer

custom:
  rubyLayer:
    use_docker: true
    environment:
      - USE_HTTPARTY
      - NOKOGIRI_VERSION=1.10.10

provider:
  name: aws
  runtime: ruby2.7

functions:
  hello:
    handler: handler.hello
```

#### ** Gemfile **

```ruby
source 'https://rubygems.org'
if ENV['USE_HTTPARTY']
  gem 'httparty', '0.18.1'
else
  gem 'http'
end
if ENV['NOKOGIRI_VERSION']
  gem 'nokogiri', ENV['NOKOGIRI_VERSION']
else
  gem 'nokogiri'
end
```

#### ** handler.rb **

```ruby
require 'httparty'

def hello(event:, context:)
  body = HTTParty.get("https://github.com").body

  { statusCode: 200, body: body }
end
```
<!-- tabs:end -->

###  Using Dockerfile with environment

<!-- tabs:start -->

#### ** serverless.yml **

```yml
service: use-docker-with-enviornment

plugins:
  - serverless-ruby-layer

custom:
  rubyLayer:
    use_docker: true
    environment:
      - USE_HTTPARTY
      - NOKOGIRI_VERSION=1.10.10

provider:
  name: aws
  runtime: ruby2.7

functions:
  hello:
    handler: handler.hello
```

#### ** Dockerfile **
```docker
FROM lambci/lambda:build-ruby2.7

RUN gem update bundler

ARG USE_HTTPARTY
ENV USE_HTTPARTY=${USE_HTTPARTY}
ARG NOKOGIRI_VERSION
ENV NOKOGIRI_VERSION=${NOKOGIRI_VERSION}

CMD "/bin/bash"
```

#### ** Gemfile **

```ruby
source 'https://rubygems.org'
if ENV['USE_HTTPARTY']
  gem 'httparty', '0.18.1'
else
  gem 'http'
end
if ENV['NOKOGIRI_VERSION']
  gem 'nokogiri', ENV['NOKOGIRI_VERSION']
else
  gem 'nokogiri'
end
```

#### ** handler.rb **

```ruby
require 'httparty'

def hello(event:, context:)
  body = HTTParty.get("https://github.com").body

  { statusCode: 200, body: body }
end
```
<!-- tabs:end -->

