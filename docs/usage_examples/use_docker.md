
## Using Docker for gems with C extensions or system libraries

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


#### Checkout above Example here


```bash
  git clone https://github.com/navarasu/serverless-ruby-examples.git
```
```bash
  cd serverless-ruby-examples/deploy_http_nokogiri

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
