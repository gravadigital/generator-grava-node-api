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
  }

  // install() {
  //   this.installDependencies();
  // }
};
