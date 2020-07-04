'use strict';
const Promise = require('bluebird');
const { bundleGems, excludePackage } = require('./lib/bundle');

class ServerlessRubyBundler {
  get options() {
    const options = Object.assign(
      {
        use_docker: false
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
