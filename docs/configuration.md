# Configuration

The plugin operation can be customized by specifying the `custom` configuration under `rubyLayer`. 

For example,

```yml
custom:
  rubyLayer:
    use_docker: true
    docker_yums:
      - postgresql-devel
    native_libs:
      - /usr/lib64/libpq.so.5
    environment:
      - GIT_AUTH_SECRET=*****
  ```

### Configuration Options


| Option          | Type    |  Default      |      Detail         |
| -------------   |-------- |-------------- | --------------------|
| **use_docker**  | boolean | false         | Set true to use Docker to bundle gems with OS native C extensions or system libraries |
| **docker_yums** | array   | undefined     | List of yum libraries to be preinstalled for gems which require OS native system libraries |
| **native_libs** | array   | undefined     | Paths of the native libraries files that need to be packed in lambda layer along with gems |
| **docker_file** | string  | undefined     | Path of the custom docker file to be used for bundling gems|
| **include_functions** | array | all functions  | List of functions to be configured with the gem layer |
| **exclude_functions** | array | no exclude     | List of functions to be excluded from layer configuration. <br /> **Note:** `exclude_functions`  will be ignored if it is mentioned along with `include_functions`|
| **environment** | array | undefined     | List of environment variables to be passed to the docker (bundler/ Gemfile) / dockerfile|
| **ignore_gemfile_lock**  | boolean | false         | Set true to ignore Gemfile.lock while doing bundle install |
