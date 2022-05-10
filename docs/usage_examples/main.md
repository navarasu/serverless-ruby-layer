
## Usage and Examples

Using the custom configuration, the plugin can be utilized for below cases,
* Using locally installed bundler for gems without any native extensions - [Example](https://github.com/navarasu/serverless-ruby-layer/blob/master/examples/basic) - [Docs](https://navarasu.github.io/serverless-ruby-layer/#/use_local_bundler)
* Using Docker for gems with OS native C extensions or system libraries like `http`, `Nokogiri` - [Example](https://github.com/navarasu/serverless-ruby-layer/blob/master/examples/use-docker) - [Docs](https://navarasu.github.io/serverless-ruby-layer/#/use_docker)
* Preinstall OS packages (yum packages) for gems which requires OS native system libraries like `pg`, `mysql`, `RMagick` - [PG Example](https://github.com/navarasu/serverless-ruby-layer/blob/master/examples/use-docker-with-yums-pg-old) - [Docs](https://navarasu.github.io/serverless-ruby-layer/#/use_docker_with_yums)
* Using Dockerfile for gems which with other OS Linux image or system libraries and utilities -  [Example](https://github.com/navarasu/serverless-ruby-layer/blob/master/examples/use-docker-file) - [Docs](https://navarasu.github.io/serverless-ruby-layer/#/use_docker_file)
* Using Docker / Dockerfile with environment variable - [Docker Example](https://github.com/navarasu/serverless-ruby-layer/blob/master/examples/use-docker-with-environment) - [DockerFile Example](https://github.com/navarasu/serverless-ruby-layer/blob/master/examples/use-docker-file-with-environment) - [Docs](https://navarasu.github.io/serverless-ruby-layer/#/environment)
* Include / Exclude specific functions from layer configuration - [Include Example](https://github.com/navarasu/serverless-ruby-layer/blob/master/examples/include-functions) , [Exclude Example](https://github.com/navarasu/serverless-ruby-layer/blob/master/examples/exclude-functions) - [Docs](https://navarasu.github.io/serverless-ruby-layer/#/include_exclude)
* Exclude test and development related gems from layer  - [Example](https://github.com/navarasu/serverless-ruby-layer/blob/master/examples/exclude-dev-test-gems) - [Docs](https://navarasu.github.io/serverless-ruby-layer/#/exclude_dev_test_gems)
* Using `Bundler.require(:default)` to require all gems in handler.rb by respecting Gemfile.lock  - [Example](https://github.com/navarasu/serverless-ruby-layer/blob/master/examples/bundler-require-all) - [Docs](https://navarasu.github.io/serverless-ruby-layer/#/bundler_require_all)

