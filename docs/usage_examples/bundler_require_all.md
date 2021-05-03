
## Using `Bundler.require(:default)` to require all gems in handler.rb by respecting Gemfile.lock

<!-- tabs:start -->

#### ** handler.rb **

```ruby
require 'rubygems'
require 'bundler/setup'
Bundler.require(:default)

def hello(event:, context:)
  body = HTTP.get('https://github.com').body.to_s
  doc = Nokogiri::HTML(body)

  { statusCode: 200, body: doc.title }
end


```

#### ** serverless.yml **

```yml
service: bundler_require_all

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

#### ** Gemfile.lock **

```ruby
GEM
  remote: https://rubygems.org/
  specs:
    httparty (0.18.1)
      mime-types (~> 3.0)
      multi_xml (>= 0.5.2)
    mime-types (3.3.1)
      mime-types-data (~> 3.2015)
    mime-types-data (3.2020.1104)
    mini_portile2 (2.5.1)
    multi_xml (0.6.0)
    nokogiri (1.11.3)
      mini_portile2 (~> 2.5.0)
      racc (~> 1.4)
    racc (1.5.2)

PLATFORMS
  ruby

DEPENDENCIES
  httparty
  nokogiri

BUNDLED WITH
   2.1.4
```

<!-- tabs:end -->


#### Checkout above Example here


```bash
  git clone https://github.com/navarasu/serverless-ruby.git
```
```bash
  cd serverless-ruby/bundler_require_all

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
