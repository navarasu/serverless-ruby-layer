'use strict';
const { bundleGems, excludePackage } = require('./lib/bundle');
const path = require('path');

class ServerlessRubyBundler {
  get options() {
    const options = Object.assign(
      {
        use_docker: false,
        ignore_gemfile_lock: false,
        docker_image_name: 'ruby-layer:docker'
      },
      (this.serverless.service.custom &&
        this.serverless.service.custom.rubyLayer) ||
        {}
    );
    return options;
  }
  constructor(serverless) {
    this.serverless = serverless;
    this.servicePath = this.serverless.config.servicePath;
    this.warningLogged = false;
    this.changed = true;
    this.ruby_layer = path.join(this.servicePath,'.serverless','ruby_layer')
    this.cli = this.serverless.cli

    this.commands = {
      rubylayer: {
        lifecycleEvents: ['pack',],
        },
    };

    this.hooks = {
      'before:package:createDeploymentArtifacts': excludePackage.bind(this),
      'after:package:createDeploymentArtifacts': bundleGems.bind(this),
      'rubylayer:pack': bundleGems.bind(this),
    };

  }

}

module.exports = ServerlessRubyBundler;
