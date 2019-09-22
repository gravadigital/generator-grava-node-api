'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const replace = require('replace-in-file');

module.exports = class extends Generator {
  prompting() {
    this.log(
      yosay(`Welcome to the terrific ${chalk.red('generator-grava-api')} generator!`)
    );

    const prompts = [{
      type: 'input',
      name: 'appName',
      message: 'Project name:'
    }];

    return this.prompt(prompts).then((props) => {
      this.props = props;
    });
  }

  writing() {
    this.destinationRoot(this.props.appName);
    this.sourceRoot(this.sourceRoot() + '/../00-basic');
    this.fs.copyTpl(
      this.templatePath('.'),
      this.destinationPath('.'),
      {
        appName: this.props.appName
      }
    );
    replace.sync({
      files: `${this.destinationPath()}/**/*`,
      from: new RegExp('[\/]{2}[*]{2}[\/]{2}.*[\/]{2}[*]{2}[\/]{2}', 'img'),
      to: ''
    });
  }

  install() {
    this.log('Installing dependencies');
    this.npmInstall();
  }
};
