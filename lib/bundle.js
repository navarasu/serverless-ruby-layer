const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs-extra');
const rimraf = require('rimraf');
const Promise = require('bluebird');
var JSZip = require('jszip');
Promise.promisifyAll(fs);

function runCommand(cmd,args,options,cli) {
  const ps = spawnSync(cmd, args,options);
  if (ps.stdout && this.debug){
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
  this.cli = this.serverless.cli
  this.cli.log("Clearing previous build ruby layer build")
  this.ruby_layer = path.join(this.servicePath,'.serverless','ruby_layer')
  if (fs.pathExistsSync(this.ruby_layer)){
    rimraf.sync(this.ruby_layer)
  }
}

function bundleInstall(){
  this.debug = process.env.SLS_DEBUG;
  const gem_file_path = path.join(this.servicePath,'Gemfile')
  if (!fs.pathExistsSync(gem_file_path)){
    throw new Error("No Gemfile found in the path "+gem_file_path+"\n Please add a Gemfile in the path");
  }

  fs.copySync(path.join(this.servicePath,'Gemfile'), path.join(this.ruby_layer,'Gemfile') )
  const bundle_args = ['bundle', 'install', '--path=build','--without', 'test', 'development']
  this.build_path = path.join(this.ruby_layer, 'build')
  fs.mkdirSync(this.build_path)
  const options = {cwd : this.ruby_layer, encoding : 'utf8'}
  if (this.options.use_docker) {
    docker_name = 'lambci/lambda:build-'+this.serverless.service.provider.runtime
    ps=docker(['version'], options,this.cli)
    if (ps.error && ps.error.code === 'ENOENT') {
      throw new Error('docker command not found. Please install docker https://www.docker.com/products/docker-desktop');
    }
    let buildDocker = false;
    if (this.options.docker_file) {
      const docker_file_path = path.join(this.servicePath, this.options.docker_file)
      if (!fs.pathExistsSync(docker_file_path)){
          throw new Error("No Dockerfile found in the path "+docker_file_path);
      }

      fs.copySync(docker_file_path,
                  path.join(this.ruby_layer,'Dockerfile'))
      buildDocker = true
    }else if (this.options.docker_yums) {
      docker_steps =['FROM lambci/lambda:build-'+this.serverless.service.provider.runtime]
      this.options.docker_yums.forEach(function(package_name) {
        docker_steps.push('RUN yum install -y '+package_name)
      })
      docker_steps.push('RUN gem update bundler')
      docker_steps.push('CMD "/bin/bash"')
      fs.writeFileSync(path.join(this.ruby_layer,'Dockerfile'),docker_steps.join('\n'))
      buildDocker = true
    }
    if (buildDocker) {
      this.cli.log("Building docker for bundle install")
      docker_name ='ruby-layer:docker'
      docker(['build', '-t', docker_name, '-f', 'Dockerfile', '.'], options,this.cli)
    }

    if (this.options.native_libs) {
      this.cli.log("Packing the native libraries from the specified path")
      ps=docker(['run', '-d', docker_name, 'false'], options,this.cli)
      container_id = ps.stdout.toString().trim()
      const lib_path = path.join(this.build_path,'lib')
      fs.mkdirSync(lib_path)
      this.options.native_libs.forEach(lib_to_copy => {
        ps=docker(['cp','-L', container_id+':'+lib_to_copy, lib_path],options,this.cli)
      })
    }

    this.cli.log("Installing gem using docker bundler")
    args=['run','--rm', '-i','-v', `${this.ruby_layer}:/var/gem_build`, '-w', '/var/gem_build']
    args.push(docker_name)

    docker(args.concat(bundle_args), options,this.cli)
  } else {
    ps = runCommand("bundle",['-v'], options, this.cli)
    if (ps.error && ps.error.code === 'ENOENT') {
       throw new Error('bundle command not found in local. Please install ruby. https://www.ruby-lang.org/en/downloads/');
    }
    this.cli.log("Installing gem using local bundler")
    if (this.debug) {
      this.cli.log("Ruby layer Path: \n "+ this.ruby_layer)
      ps = runCommand("ruby",['--version'], options, this.cli)
      this.cli.log("Ruby version: "+ ps.stdout.toString().trim())
      ps = runCommand("bundle",['-v'],options,this.cli)
      this.cli.log("Bundler version: "+ ps.stdout.toString().trim())
      this.cli.log(bundle_args.join(" "))
    }

    runCommand(bundle_args[0],bundle_args.slice(1,bundle_args.length),options,this.cli)
  }
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
              if (new RegExp('ruby/.*/cache$').test(filePath)){
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
  this.gem_folder= fs.readdirSync(path.join(this.build_path,'ruby'))[0]
  const platform = process.platform == 'win32' ? 'DOS' : 'UNIX'
  zipping_message = "Zipping the gemfiles"
  if (this.options.native_libs) {
    zipping_message+=" and native libs"
  }
  this.gemLayer_zip_path = path.join(this.ruby_layer, 'gemLayer.zip')
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
                                                  "vendor/**", "Gemfile", "Gemfile.lock")
}

function configureLayer() {
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
  return Promise.bind(this)
          .then(cleanBuild)
          .then(bundleInstall)
          .then(zipBundleFolder)
          .then(configureLayer)
} 

module.exports = { bundleGems, excludePackage };
