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
    }, {
      type: 'confirm',
      name: 'withDefaultAdmin',
      message: 'Want a default admin user?',
      when: (res) => {
        return res.withUsers;
      }
    }, {
      type: 'confirm',
      name: 'withDocker',
      message: 'Want Docker structure?'
    }, {
      type: 'confirm',
      name: 'withCi',
      message: 'Want a ci file for gitlab-registry?',
      when: (res) => {
        return res.withDocker;
      }
    }, {
      type: 'confirm',
      name: 'ciRunners',
      message: 'CI -> runner tags: (comma separated)',
      when: (res) => {
        return res.ciRunnerTags;
      }
    }, {
      type: 'confirm',
      name: 'withCiDevTag',
      message: 'CI -> With dev tag?',
      when: (res) => {
        return res.withCi;
      }
    }, {
      type: 'confirm',
      name: 'withTests',
      message: 'Want tests structure?'
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
      envTest: '',
      packagejsonDependences: '',
      packagejsonDevDependences: '',
      packagejsonScripts: '',
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
const scheduleRunner = require('@lib/utils/schedule-runner');`;
      vars.initPostScripts += `
        scheduleRunner();`;
      vars.packagejsonDependences += `,
    "node-schedule": "^2.0.0"`;
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
      vars.packagejsonDependences += `,
    "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^8.5.1"`;
      vars.envDist += `
JWT_SECRET=
JWT_ISSUER=`;
      vars.routesIndexRequires += `
const Auth = require('./auth')`;
      vars.routesIndexExports += `
    Auth`;
      vars.appRequires += `
const publicPaths = require('./config/public-paths');
const extractJwt = require('@lib/utils/extract-jwt');`;
      vars.appAfterInitializePrevRoutes += `
    app.get(publicPaths.regex('get'), extractJwt);
    app.put(publicPaths.regex('put'), extractJwt);
    app.post(publicPaths.regex('post'), extractJwt);
    app.delete(publicPaths.regex('delete'), extractJwt);`;
    }

    // WITH DEFAULT ADMIN USER
    if (this.props.withDefaultAdmin) {
      this.sourceRoot(this.sourceRoot() + '/../04-default-admin');
      this.fs.copyTpl(
        this.templatePath('.'),
        this.destinationPath('.'),
        vars,
        {},
        {globOptions: {dot: true}}
      );
      vars.envDist += `
DEFAULTADMIN_EMAIL=
DEFAULTADMIN_NAME=
DEFAULTADMIN_PASSWORD=`;
      vars.initRequires += `
const createDefaultAdmin = require('./create-default-admin');`;
      vars.initPostScripts += `
        createDefaultAdmin();`;
    }

    // WITH HIROKI
    if (this.props.withHiroki) {
      if (this.props.withUsers) {
        this.sourceRoot(this.sourceRoot() + '/../03-01-hiroki-with-users');
        this.fs.copyTpl(
          this.templatePath('.'),
          this.destinationPath('.'),
          vars,
          {},
          {globOptions: {dot: true}}
        );
        vars.decoratorsIndexRequires += `
const User = require('./user');`;
        vars.decoratorsIndexExports += `
    User`;
      }
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
    "hiroki": "^0.2.9"`;
    }

    // WITH TESTS STRUCTURE
    if (this.props.withTests) {
      vars.envTest += `
JWT_ISSUER=test
JWT_SECRET=test`;
      this.sourceRoot(this.sourceRoot() + '/../07-tests');
      this.fs.copyTpl(
        this.templatePath('./structure/'),
        this.destinationPath('.'),
        vars,
        {},
        {globOptions: {dot: true}}
      );
      if (this.props.withUsers) {
        console.log('Withusers: ', this.props.withUsers);
        this.sourceRoot(this.sourceRoot() + '/../07-tests');
        this.fs.copyTpl(
          this.templatePath('./tests-files/'),
          this.destinationPath('./tests/'),
          vars,
          {},
          {globOptions: {dot: true}}
        );
      }
      vars.packagejsonScripts += `,
      "test-mocha": "mocha tests/**/*"`;
      vars.packagejsonDependences += `,
      "node-schedule": "^1.3.2"`;
      vars.packagejsonDevDependences += `,
    "mocha": "^8.4.0",
    "supertest": "^6.1.3",
    "should": "^13.2.3"`;
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
    this.fs.copy(
      this.templatePath('../_gitignore'),
      this.destinationPath('.gitignore')
    );

    // DOCKER STRUCTURE
    if (this.props.withDocker) {
      vars.dockerComposeEnv = '';
      const env = this.fs.read(this.destinationPath('.env.dist'));
      env.split('\n').filter((line) => {
        return line.length > 0;
      }).forEach((line) => {
        if (line.split('=')[0] === 'MONGODB_HOST') {
          line = `MONGODB_HOST=${vars.appName}-mongo`;
        }
        vars.dockerComposeEnv += `\n      - ${line}`;
      });
      this.sourceRoot(this.sourceRoot() + '/../05-docker');
      this.fs.copyTpl(
        this.templatePath('.'),
        this.destinationPath('.'),
        vars,
        {},
        {globOptions: {dot: true}}
      );
    }

    // CI
    if (this.props.withCi) {
      this.sourceRoot(this.sourceRoot() + '/../06-ci');
      let tmpFolder = 'without-dev';
      if (this.props.withCiDevTag) {
        tmpFolder = 'with-dev';
      }
      vars.ciRunners = '';
      if (this.props.ciRunners && this.props.ciRunners.length > 0) {
        this.props.ciRunners.split(',').forEach((elem) => {
          vars.ciRunners += `\n      - ${elem}`;
        });
      }
      this.fs.copyTpl(
        this.templatePath(tmpFolder),
        this.destinationPath('.'),
        vars,
        {},
        {globOptions: {dot: true}}
      );
    }
  }

  install() {
    this.log('Installing dependencies');
    this.npmInstall();
  }
};
