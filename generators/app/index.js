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
    }];

    return this.prompt(prompts).then((props) => {
      this.props = props;
    });
  }

  writing() {
    this.destinationRoot(this.props.appName);
    const vars = {
      appName: this.props.appName,
      appAfterInitialize: '',
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
      vars.appAfterInitialize += `
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
