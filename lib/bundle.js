const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs-extra');
const rimraf = require('rimraf');
const Promise = require('bluebird');
var JSZip = require('jszip');
Promise.promisifyAll(fs);

function runCommand(cmd,args,options,cli) {
  const ps = spawnSync(cmd, args,options);
  if (ps.stdout && process.env.SLS_DEBUG){
    cli.log(ps.stdout.toString())
  }
  if (ps.stderr){
    cli.log(ps.stderr.toString())
  }
  if (ps.error && ps.error.code == 'ENOENT'){
    return ps;
  }
  if (ps.error) {
    throw new Error(ps.error);
  } else if (ps.status !== 0) {
    throw new Error(ps.stderr);
  }
  return ps;
}

function docker(args, options,cli){
    return runCommand("docker",args,options,cli)
}

function cleanBuild(){
  this.cli.log("Clearing previous build ruby layer build")
  if (fs.pathExistsSync(this.ruby_layer)){
    rimraf.sync(this.ruby_layer)
  }
}

function bundleInstall(){
  const gem_file_path = path.join(this.servicePath,'Gemfile')
  if (!fs.pathExistsSync(gem_file_path)){
    throw new Error("No Gemfile found in the path "+gem_file_path+"\n Please add a Gemfile in the path");
  }

  fs.copySync(path.join(this.servicePath,'Gemfile'), path.join(this.ruby_layer,'Gemfile') )
  const gem_file_lock_path = path.join(this.servicePath,'Gemfile.lock')
  if (this.use_gemfile_lock){
    fs.copySync(gem_file_lock_path, path.join(this.ruby_layer,'Gemfile.lock') )
  }

  fs.mkdirSync(this.build_path)
  const options = {cwd : this.ruby_layer, encoding : 'utf8'}
  if (this.options.use_docker) {
    docker_name = 'lambci/lambda:build-'+this.serverless.service.provider.runtime
    ps=docker(['version'], options,this.cli)
    if (ps.error && ps.error.code === 'ENOENT') {
      throw new Error('docker command not found. Please install docker https://www.docker.com/products/docker-desktop');
    }
    if (this.options.docker_file) {
      const docker_file_path = path.join(this.servicePath, this.options.docker_file)
      if (!fs.pathExistsSync(docker_file_path)){
          throw new Error("No Dockerfile found in the path "+docker_file_path);
      }

      fs.copySync(docker_file_path,
                  path.join(this.ruby_layer,'Dockerfile'))

      // TODO Remove this and use gem
      const rodeo_file_path = path.join(this.servicePath, 'derivative_rodeo')

      fs.copySync(rodeo_file_path,
                  path.join(this.ruby_layer,'derivative_rodeo'))

    }else{
      docker_steps =['FROM lambci/lambda:build-'+this.serverless.service.provider.runtime]
      if (this.options.docker_yums) {
        this.options.docker_yums.forEach(function(package_name) {
          docker_steps.push('RUN yum install -y '+package_name)
        })
      }

      if(this.options.environment){
        this.options.environment.forEach(function(env_arg) {
          env_arg_name = env_arg.split('=')[0]
          docker_steps.push('ARG ' + env_arg_name)
          docker_steps.push('ENV ' + env_arg_name + '=${' + env_arg_name + '}')
        })
      }

      var bundlerVersionToInstall = ''
      var bundlerNumericVersion = 2.1 // If a version is not specified we assume that we're using latest which is >= 2.1
      if(this.use_gemfile_lock){
        const data = fs.readFileSync(gem_file_lock_path).toString().match(/BUNDLED WITH[\r\n]+([^\r\n]+)/)
        bundlerNumericVersion = data[data.length - 1].trim()
        bundlerVersionToInstall = ':' + bundlerNumericVersion
      }
      docker_steps.push('RUN gem install bundler' + bundlerVersionToInstall)

      docker_steps.push('COPY Gemfile* .')

      if(bundlerNumericVersion >= 2.1){
        docker_steps.push('RUN bundle config set --local path build')
        docker_steps.push('RUN bundle config set --local without test development')
        docker_steps.push('RUN bundle install')
      }else{
        docker_steps.push('RUN bundle install --path build --without test development')
      }

      docker_steps.push('CMD "/bin/bash"')
      fs.writeFileSync(path.join(this.ruby_layer,'Dockerfile'),docker_steps.join('\n'))
    }

    this.cli.log("Building docker for bundle install")
    docker_name = this.options.docker_image_name
    docker_args = ['build', '-t', docker_name, '-f', 'Dockerfile']
    if(this.options.docker_build_args){
      this.options.docker_build_args.forEach(function(build_arg) {
        docker_args.push('--build-arg')
        docker_args.push(build_arg)
      })
    }
    if(this.options.environment){
      this.options.docker_environment.forEach(function(env_arg) {
        docker_args.push('--build-arg')
        docker_args.push(env_arg)
      })
    }
    docker_args.push('.')
    docker(docker_args, options,this.cli)

    let docker_id = Date.now().toString(36)  + '-'+Math.random().toString(36).slice(2, 15)
    this.cli.log("docker_id = ", docker_id)
    ps=docker(['run','-it','--name',docker_id,'-d', docker_name,'/bin/bash'], options,this.cli)
    container_id = ps.stdout.toString().trim()
    console.log(container_id)
    if (this.options.native_bins) {
      this.cli.log("Packing the native binraries from the specified path")
      const bin_path = path.join(this.build_path,'bin')
      fs.mkdirSync(bin_path)
      this.options.native_bins.forEach(bin_to_copy => {
        ps=docker(['cp','-L', container_id+':'+bin_to_copy, bin_path],options,this.cli)
      })
    }
    if (this.options.native_libs) {
      this.cli.log("Packing the native libraries from the specified path")
      const lib_path = path.join(this.build_path,'lib')
      fs.mkdirSync(lib_path)
      this.options.native_libs.forEach(lib_to_copy => {
        ps=docker(['cp','-L', container_id+':'+lib_to_copy, lib_path],options,this.cli)
      })
    }
    this.cli.log("Packaging gems from docker bundler")
    this.docker_gem_path = '/var/task'
    docker(['cp', '-L', container_id+':'+this.docker_gem_path+'/build/ruby', this.build_path], options, this.cli)
    docker(['stop', container_id], options, this.cli)
    docker(['rm',docker_id], options, this.cli)
  } else {
    ps = runCommand("bundle",['-v'], options, this.cli)
    bundle_version = ps.stdout.toString()
    if (ps.error && ps.error.code === 'ENOENT') {
       throw new Error('bundle command not found in local. Please install ruby. https://www.ruby-lang.org/en/downloads/');
    }
    bundle_args = setBundleConfig(bundle_version,(args) =>{
      runCommand('bundle', ['config', 'set', '--local'].concat(args),options,this.cli)
    })
    this.cli.log("Installing gem using local bundler")
    if (this.debug) {
      this.cli.log("Ruby layer Path: \n "+ this.ruby_layer)
      ps = runCommand("ruby",['--version'], options, this.cli)
      this.cli.log("Ruby version: "+ ps.stdout.toString().trim())
      this.cli.log("Bundler version: "+ bundle_version)
      this.cli.log(bundle_args.join(" "))
    }
    runCommand(bundle_args[0],bundle_args.slice(1,bundle_args.length),options,this.cli)
  }
}

function setBundleConfig(version, config){
  bundle_args = ['bundle', 'install']
  version = version.trim().match(/\d+\.\d+/g)
  console.log(version)
  if (version.length > 0 &&  !isNaN(parseFloat(version[0])) && parseFloat(version[0]) >= 2.1) {
    [['path','build'] ,['without','test', 'development']].forEach(config)
    return bundle_args
  }
  return bundle_args.concat(['--path=build', '--without', 'test', 'development'])

}


function zipDir(folder_path,targetPath,zipOptions){
  zip = new JSZip()
  return addDirtoZip(zip, folder_path)
          .then(() => {
            return new Promise(resolve =>
                        zip.generateNodeStream(zipOptions)
                           .pipe(fs.createWriteStream(targetPath))
                           .on('finish', resolve))
                           .then(() => null)});
}

function addDirtoZip(zip, dir_path){
  const dir_path_norm = path.normalize(dir_path)
  return fs.readdirAsync(dir_path_norm)
           .map(file_name => {
              return addFiletoZip(zip, dir_path_norm, file_name)
            });
}

function addFiletoZip(zip, dir_path, file_name){
  const filePath = path.join(dir_path, file_name)
  return fs.statAsync(filePath)
          .then(stat => {
            if (stat.isDirectory()){
              if (new RegExp('ruby/[^/]*/cache$').test(filePath)){
                return undefined;
              }
              return addDirtoZip(zip.folder(file_name), filePath);
            } else {
                const file_option = { date: stat.mtime, unixPermissions: stat.mode };
                return fs.readFileAsync(filePath)
                  .then(data => zip.file(file_name, data, file_option));
              }
          });
}

function zipBundleFolder() {
  const platform = process.platform == 'win32' ? 'DOS' : 'UNIX'
  zipping_message = "Zipping the gemfiles"
  if (this.options.native_bins) {
    zipping_message+=" and native bins"
  }
  if (this.options.native_libs) {
    zipping_message+=" and native libs"
  }
  this.cli.log(zipping_message+ ' to '+ this.gemLayer_zip_path)
  return zipDir(this.build_path, this.gemLayer_zip_path,
                { platform: platform, compression: 'DEFLATE',
                compressionOptions: { level: 9 }});
}

function excludePackage(){
  if (!this.serverless.service.package){
    this.serverless.service.package = Object.assign({})
  }
  if (!this.serverless.service.package["exclude"]){
    this.serverless.service.package["exclude"] = Object.assign([])
  }
  this.serverless.service.package["exclude"].push("node_modules/**", "package-lock.json", "package.json",
                                                  "vendor/**")
  this.use_gemfile_lock = !this.options.ignore_gemfile_lock && fs.pathExistsSync(path.join(this.servicePath,'Gemfile.lock'))

  if (!this.use_gemfile_lock) {
    this.serverless.service.package["exclude"].push("Gemfile", "Gemfile.lock")
  }
  if (this.options.docker_file) {
    this.serverless.service.package["exclude"].push(this.options.docker_file)
  }
}

function configureLayer() {
  this.gem_folder= fs.readdirSync(path.join(this.build_path,'ruby'))[0]
  this.cli.log("Configuring Layer and GEM_PATH to the functions")
  if(this.debug){
    this.cli.log("GEM_PATH:" + "/opt/ruby/"+this.gem_folder)
    this.cli.log("Zip Path:" + this.gemLayer_zip_path )
  }
  if (!this.serverless.service.layers) {
    this.serverless.service.layers = {};
  }
  this.serverless.service.layers['gem'] = Object.assign(
    {
      package:  {artifact: this.gemLayer_zip_path },
      name: `${
        this.serverless.service.service
      }-${this.serverless.providers.aws.getStage()}-ruby-bundle`,
      description:
        'Ruby gem generated by serverless-ruby-bundler',
      compatibleRuntimes: [this.serverless.service.provider.runtime]
    },
    this.options.layer
  );
  let functions_to_add = Object.keys(this.serverless.service.functions)

  if (this.options.include_functions){
    functions_to_add = this.options.include_functions
  }else if (this.options.exclude_functions) {
    functions_to_add = functions_to_add.filter(n => !this.options.exclude_functions.includes(n))
  }

  functions_to_add.forEach(funcName => {
    if(this.debug){
      this.cli.log("Configuring Layer for function: " + funcName)
    }
    const function_ = this.serverless.service.getFunction(funcName)
    if (!function_.environment){
      function_.environment={}
    }
    function_.environment["GEM_PATH"]="/opt/ruby/"+this.gem_folder

    if (!function_.layers){
      function_.layers=[]
    }
    function_.layers.push({"Ref":"GemLambdaLayer"})
  })
  return Promise.resolve();
}

function bundleGems()  {

  if(fs.pathExistsSync(path.join(this.ruby_layer, 'gemLayer.zip'))) {
    this.debug && this.cli.log('gemLayer found')
  } else {
    this.reasons.push("gemLayer.zip not found")
  }

  compare('Gemfile', this)
  compare('Gemfile.lock', this)
  compare('Dockerfile', this)

  if (this.reasons.length > 0){
    this.cli.log(this.reasons.join(", ") + ". Re-bundling.")
    return Promise.bind(this)
          .then(cleanBuild)
          .then(bundleInstall)
          .then(zipBundleFolder)
          .then(configureLayer)
  } else {
    return Promise.bind(this)
          .then(configureLayer)
  }
}

function compare(file_name, context) {
  if (fs.pathExistsSync(path.join(context.ruby_layer,file_name))) {
    let current_file = fs.readFileSync(path.join(context.servicePath,file_name)).toString()
    let last_file = fs.readFileSync(path.join(context.ruby_layer,file_name)).toString()
    if(current_file != last_file) {
      context.reasons.push(file_name + " has changed")
    } else {
      this.debug && context.cli.log(file_name + 'found and unchanged')
    }

  } else {
    context.reasons.push(file_name + ' not found')
  }
}

module.exports = { bundleGems, excludePackage };
