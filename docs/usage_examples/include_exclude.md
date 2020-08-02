
##  Include / Exclude specific functions from layer configuration


### Include Specific functions

<!-- tabs:start -->

#### ** serverless.yml **

```yml
service: basic 

plugins:
  - serverless-ruby-layer

provider:
  name: aws
  runtime: ruby2.5

custom:
  rubyLayer:
    include_functions:
      - hello1
      - hello2

functions:
  hello1:
    handler: handler1.hello

  hello2:
    handler: handler2.hello

  hello3:
    handler: handler3.hello
  ```

#### ** Gemfile **

```ruby
source 'https://rubygems.org'
gem 'httparty'
```

#### ** handler1.rb **

```ruby
require 'httparty'

def hello(event:, context:)
  body = HTTParty.get("https://github.com").body

  { statusCode: 200, body: body }
end

```

#### ** handler2.rb **

```ruby
require 'httparty'

def hello(event:, context:)
  body = HTTParty.get("https://github.com/team").body

  { statusCode: 200, body: body }
end

```

#### ** handler3.rb **

```ruby

def hello(event:, context:)

  { statusCode: 200, body: "No depenedency" }
end

```

<!-- tabs:end -->


### Exclude Specific functions

<!-- tabs:start -->

#### ** serverless.yml **

```yml
service: basic 

plugins:
  - serverless-ruby-layer

provider:
  name: aws
  runtime: ruby2.5

custom:
  rubyLayer:
    exclude_functions:
      - hello3

functions:
  hello1:
    handler: handler1.hello

  hello2:
    handler: handler2.hello

  hello3:
    handler: handler3.hello
  ```

#### ** Gemfile **

```ruby
source 'https://rubygems.org'
gem 'httparty'
```

#### ** handler1.rb **

```ruby
require 'httparty'

def hello(event:, context:)
  body = HTTParty.get("https://github.com").body

  { statusCode: 200, body: body }
end

```

#### ** handler2.rb **

```ruby
require 'httparty'

def hello(event:, context:)
  body = HTTParty.get("https://github.com/team").body

  { statusCode: 200, body: body }
end

```

#### ** handler3.rb **

```ruby

def hello(event:, context:)

  { statusCode: 200, body: "No depenedency" }
end

```

<!-- tabs:end -->
