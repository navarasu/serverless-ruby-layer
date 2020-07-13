
## Using Docker for gems with OS native C extensions or system libraries

<!-- tabs:start -->

#### ** serverless.yml **

```yml
service: using_docker

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

#### ** Gemfile **

```ruby
source 'https://rubygems.org'
gem 'http'
gem 'nokogiri'
```

#### ** handler.rb **

```ruby
require 'http'
require 'nokogiri'

def hello(event:, context:)
  body = HTTP.get('https://github.com').body.to_s
  doc = Nokogiri::HTML(body)

  { statusCode: 200, body: doc.title }
end


```

<!-- tabs:end -->
