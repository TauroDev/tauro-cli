#!/usr/bin/env node
import { program } from "commander";
import { Config } from "../lib/Configurations";
import { CommandLoader } from "../Command/command.loader";

const initTauroCli = async () => {
  program
    .version(
      `Version App: ${Config.versionApp}`,
      "-v, --version",
      "Output the current version."
    )
    .usage("<command> [options]");

  await CommandLoader.load(program);

  program.parse(process.argv);
};

initTauroCli();
