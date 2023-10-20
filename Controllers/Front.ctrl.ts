import clear from "clear";
import path from "path";
import inquirer from "inquirer";
const { NextCtrl, ReactCtrl, VanillaCtrl, VueCtrl } = require("./Front");
import Config from "../Helpers/Config.json";

const {prompt} = inquirer

const ConfigFramewoks: any = {
  reactjs: ReactCtrl,
  nextjs: NextCtrl,
  vanillajs: VanillaCtrl,
  vuejs: VueCtrl
}

const route = path.join(__dirname, "../ProyectsBase/base-front-end");


const selecteFramework: any = [
  {
    type: "list",
    name: "framework",
    message: "En que tipo de framework deseas desarrollar?",
    choices: Config["frameworks-front"],
  }
]

const startFront = async () => {
  clear();
  const answer = await prompt(selecteFramework);
  const parseData = answer.framework.replace(/\s/g, "").toLowerCase()
  const execAction = ConfigFramewoks[parseData.replace("(endesarrollo)", '')]
  execAction()
}

module.exports = { startFront };
