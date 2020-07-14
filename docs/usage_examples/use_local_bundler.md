
##  Using locallly installed bundler for gems which native  extensions 

<!-- tabs:start -->

#### ** serverless.yml **

```yml
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

#### ** Gemfile **

```ruby
source 'https://rubygems.org'
gem 'httparty'
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
