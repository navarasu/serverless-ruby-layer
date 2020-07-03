'use strict';
const Promise = require('bluebird');
const { bundleGems } = require('./lib/bundle');

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

    const packRubyLayer  = () =>  {
      return Promise.bind(this)
                     .then(bundleGems);
    } 

    this.hooks = {
      'after:package:createDeploymentArtifacts': packRubyLayer,
      'rubylayer:pack': packRubyLayer,
    };

  }

}

module.exports = ServerlessRubyBundler;
