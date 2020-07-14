
## Usage and Examples

Using the custom configuration, the plugin can be utilized for below cases,
* Using locallly installed bundler for gems which native  extensions [Example](https://github.com/navarasu/serverless-ruby-layer/blob/master/examples/basic) - [Docs](/use_local_bundler)
* Using Docker for gems with OS native C extensions or system libraries like `http`, `Nokogiri` - [Example](https://github.com/navarasu/serverless-ruby-layer/blob/master/examples/use_docker) - [Docs](use_docker)
* Preinstall OS packages (yum packages) for gems which requires OS native system libraries like `pg`, `mysql`, `RMagick` - [Example](https://github.com/navarasu/serverless-ruby-layer/blob/master/examples/use_docker_with_yums) - [Docs](use_docker_with_yums)
* Using Dockerfile for gems which with other OS linux image or system libraries and utilities -  [Example](https://github.com/navarasu/serverless-ruby-layer/blob/master/examples/use_docker_file) - [Docs](use_docker_file)

