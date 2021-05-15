<!-- # Customization -->

##  Preinstall yum packages for gems which requires OS native system libraries

### Example to deploy pg using Ruby 2.7

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
      - /usr/lib64/libldap_r-2.4.so.2
      - /usr/lib64/liblber-2.4.so.2
      - /usr/lib64/libsasl2.so.3
      - /usr/lib64/libssl3.so
      - /usr/lib64/libsmime3.so
      - /usr/lib64/libnss3.so

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


### Example to deploy pg using Ruby 2.5

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

#### Checkout above Example here


```bash
  git clone https://github.com/navarasu/serverless-ruby.git
```
*Ruby 2.7*

```bash
  cd serverless-ruby/deploy_pg_gem_2-7

  sls plugin install -n serverless-ruby-layer

```

*Ruby 2.5*

```bash
  cd serverless-ruby/deploy_pg_gem_2-5

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
