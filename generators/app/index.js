'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {
  prompting() {
    this.log(
      yosay(`Welcome to the terrific ${chalk.red('generator-grava-api')} generator!`)
    );

    const prompts = [{
      type: 'input',
      name: 'appName',
      message: 'Project name:'
    }, {
      type: 'confirm',
      name: 'withHiroki',
      message: 'Want Hiroki?'
    }, {
      type: 'confirm',
      name: 'withSchedule',
      message: 'Want schedule utils?'
    }, {
      type: 'confirm',
      name: 'withUsers',
      message: 'Want users and auth?'
    }];

    return this.prompt(prompts).then((props) => {
      this.props = props;
    });
  }

  writing() {
    this.destinationRoot(this.props.appName);
    const vars = {
      appName: this.props.appName,
      appAfterInitializePrevRoutes: '',
      appAfterInitializeRoutes: '',
      appRequires: '',
      envDist: '',
      packagejsonDependences: '',
      initRequires: '',
      initPostScripts: '',
      modelsIndexRequires: '',
      modelsIndexExports: '',
      routesIndexRequires: '',
      routesIndexExports: '',
      decoratorsIndexRequires: '',
      decoratorsIndexExports: ''
    };

    // WITH SCHEDULE UTILS
    if (this.props.withSchedule) {
      this.sourceRoot(this.sourceRoot() + '/../02-schedule');
      this.fs.copyTpl(
        this.templatePath('.'),
        this.destinationPath('.'),
        vars,
        {},
        {globOptions: {dot: true}}
      );
      vars.initRequires += `
    const scheduleRunner = require('../lib/utils/schedule-runner');`;
      vars.initPostScripts += `
    scheduleRunner();`;
      vars.packagejsonDependences += `,
    "node-schedule": "^1.3.2"`;
    }

    // WITH USER STRUCTURE
    if (this.props.withUsers) {
      this.sourceRoot(this.sourceRoot() + '/../03-users');
      this.fs.copyTpl(
        this.templatePath('.'),
        this.destinationPath('.'),
        vars,
        {},
        {globOptions: {dot: true}}
      );
      vars.modelsIndexRequires += `
const User = require('./user');`;
      vars.modelsIndexExports += `
    User`;
      vars.decoratorsIndexRequires += `
const User = require('./user');`;
      vars.decoratorsIndexExports += `
    User`;
      vars.packagejsonDependences += `,
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^8.5.1"`;
      vars.envDist += `
JWT_SECRET=`;
      vars.routesIndexRequires += `
const Auth = require('./auth')`;
      vars.routesIndexExports += `
    Auth`;
      vars.appRequires += `
const publicPaths = require('./config/public-paths');
const extractJwt = require('./lib/utils/extract-jwt');`;
      vars.appAfterInitializePrevRoutes += `
    app.get(publicPaths.regex('get'), extractJwt);
    app.put(publicPaths.regex('put'), extractJwt);
    app.post(publicPaths.regex('post'), extractJwt);
    app.delete(publicPaths.regex('delete'), extractJwt);`;
    }

    // WITH HIROKI
    if (this.props.withHiroki) {
      this.sourceRoot(this.sourceRoot() + '/../01-hiroki');
      this.fs.copyTpl(
        this.templatePath('.'),
        this.destinationPath('.'),
        vars,
        {},
        {globOptions: {dot: true}}
      );
      vars.appAfterInitializeRoutes += `
    const buildHiroki = require('./build-hiroki');
    app.use(buildHiroki());`;
      vars.packagejsonDependences += `,
      "hiroki": "^0.2.6"`;
    }

    // BASIC STRUCTURE
    this.sourceRoot(this.sourceRoot() + '/../00-basic');
    this.fs.copyTpl(
      this.templatePath('.'),
      this.destinationPath('.'),
      vars,
      {},
      {globOptions: {dot: true}}
    );
  }

  install() {
    this.log('Installing dependencies');
    this.npmInstall();
  }
};
