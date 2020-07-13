const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs-extra');
const Promise = require('bluebird');
var JSZip = require('jszip');
Promise.promisifyAll(fs);

function runCommand(cmd,args,options,cli) {
  const ps = spawnSync(cmd, args,options);
  cli.log(ps.stdout.toString())
  if (ps.error  && ps.error.code != 'ENOENT') {
      cli.log(ps.stderr.toString())
    throw new Error(ps.error);
  } else if (ps.status !== 0) {
      cli.log(ps.stderr.toString())
    throw new Error(ps.stderr);
  }
  return ps;
}

function docker(args, options,cli){
    return runCommand("docker",args,options,cli)
}

function cleanBuild(){
  this.cli = this.serverless.cli
  this.cli.log("Cleaning ruby layer build")
  this.ruby_layer = path.join(this.servicePath,'.serverless','ruby_layer')
  if (fs.pathExistsSync(this.ruby_layer)){
    fs.rmdirSync(this.ruby_layer,  { recursive: true }) 
  }
}
function bundleInstall(){
  this.cli.log(this.ruby_layer)
  const gem_path = path.join(this.ruby_layer,'Gemfile')
  fs.copySync(path.join(this.servicePath,'Gemfile'), gem_path )
  const bundle_args = ['bundle', 'install', '--path=build','--without', 'test', 'development']
  const options={cwd : this.ruby_layer, encoding : 'utf8'}
  this.build_path = path.join(this.ruby_layer, 'build')
  fs.mkdirSync(this.build_path)
  if (this.options.use_docker) {
    docker_name = 'lambci/lambda:build-'+this.serverless.service.provider.runtime
    ps=docker(['version'], options,this.cli)
    if (ps.error && ps.error.code === 'ENOENT') {
      throw new Error('docker command not found');
    }
    if (this.options.docker_file) {
      fs.copySync(path.join(this.servicePath, this.options.docker_file),
                  path.join(this.ruby_layer,'Dockerfile'))
      docker_name ='ruby-layer:docker'
      docker(['build', '-t', docker_name, '-f', 'Dockerfile', '.'], options,this.cli)
    }
    if (this.options.native_libs) {
      ps=docker(['run', '-d', docker_name, 'false'], options,this.cli)
      container_id = ps.stdout.toString().trim()
      const lib_path = path.join(this.build_path,'lib')
      fs.mkdirSync(lib_path)
      this.options.native_libs.forEach(lib_to_copy => {
        ps=docker(['cp','-L', container_id+':'+lib_to_copy, lib_path],options,this.cli)
      })
    }
    args=['run','--rm', '-i','-v', `${this.ruby_layer}:/var/gem_build`, '-w', '/var/gem_build']
    args.push(docker_name)
    docker(args.concat(bundle_args), options,this.cli)
  } else {
    ps = runCommand("bundle",['-v'],options,this.cli)
    if (ps.error && ps.error.code === 'ENOENT') {
       throw new Error('bundle command not found in local');
    }
    this.cli.log(bundle_args.slice(1,bundle_args.length))
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
  fs.rmdirSync(path.join(this.build_path,'ruby',this.gem_folder,'cache'),{ recursive: true })
  const platform = process.platform == 'win32' ? 'DOS' : 'UNIX'
  return zipDir(this.build_path,
                path.join(this.ruby_layer, 'gemLayer.zip'),
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
  this.serverless.service.package["exclude"].push("node_modules/**", "vendor/**",
                                                  "Gemfile", "Gemfile.lock")
}

function configureLayer() {
  if (!this.serverless.service.layers) {
    this.serverless.service.layers = {};
  }
  this.serverless.service.layers['gemLayer'] = Object.assign(
    {
      package:  {artifact: path.join(this.ruby_layer, 'gemLayer.zip')},
      name: `${
        this.serverless.service.service
      }-${this.serverless.providers.aws.getStage()}-ruby-bundle`,
      description:
        'Ruby gem generated by serverless-ruby-bundler',
      compatibleRuntimes: [this.serverless.service.provider.runtime]
    },
    this.options.layer
  );

  Object.keys(this.serverless.service.functions).forEach(funcName => {
    const function_ = this.serverless.service.getFunction(funcName)
    function_.environment={}
    function_.environment["GEM_PATH"]="/opt/ruby/"+this.gem_folder
    function_.layers = [{"Ref":"GemLayerLambdaLayer"}]
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
