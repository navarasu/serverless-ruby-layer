
##  Exclude test and development related gems

<!-- tabs:start -->

#### ** Gemfile **

```ruby
source 'https://rubygems.org'
gem 'httparty'

group :development do
  gem 'rubocop'
end

group :test do
  gem 'rspec'
end

```

#### ** serverless.yml **

```yml
service: basic

plugins:
  - serverless-ruby-layer

provider:
  name: aws
  runtime: ruby2.7

functions:
  hello:
    handler: handler.hello
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
Running `sls deploy` automatically deploys the required gems as in Gemfile by excluding the test and development related gems by default to AWS lambda layer 

