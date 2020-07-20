
##  Using locallly installed bundler for gems without any native extensions

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

#### Checkout above Example here


```bash
  git clone https://github.com/navarasu/serverless-ruby.git
```
```bash
  cd serverless-ruby/deploy_http_party

  sls plugin install -n serverless-ruby-layer

```

#### Deploy to AWS

```bash
 sls deploy
```

Running `sls deploy` automatically deploys the required gems as in Gemfile to AWS lambda layer and make the gems available to the `RUBY_PATH` of the functions `hello.handler`


#### Test it

```bash
 sls invoke -f hello

```
