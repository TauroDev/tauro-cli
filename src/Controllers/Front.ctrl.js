const clear = require("clear");
const path = require("path");
const { prompt } = require("inquirer");
const { NextCtrl, ReactCtrl, VanillaCtrl, VueCtrl } = require("./Front");
const Config = require("../Helpers/Config.json");

const ConfigFramewoks = {
  reactjs: ReactCtrl,
  nextjs: NextCtrl,
  vanillajs: VanillaCtrl,
  vuejs: VueCtrl
}

const route = path.join(__dirname, "../ProyectsBase/base-front-end");


const selecteFramework = [
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
  const replaceDev = parseData.replace("(endesarrollo)", '');
  const execAction = ConfigFramewoks[replaceDev]
  execAction()
}

module.exports = { startFront };
