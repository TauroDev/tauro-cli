const clear = require("clear");
const { prompt } = require("inquirer");
const Config = require("../Helpers/Config.json");
const { EntryReact } = require("./Routes");

const Flows = [
  {
    type: "list",
    name: "framework",
    message: "A que framework deseas crear la ruta?",
    choices: Config["frameworks-front"],
  },
];

const ConfigFramewoks = {
  reactjs: EntryReact,
  nextjs: () => console.log("En desarrollo"),
  vanillajs: () => console.log("En desarrollo"),
  vuejs: () => console.log("En desarrollo")
}

const actionFlows = async () => {
  const answer = await prompt(Flows);
  const parseData = answer.framework.replace(/\s/g, "").toLowerCase();
  return parseData.replace("(endesarrollo)", "");
};

const startRoutes = async () => {
  clear();
  const execAction = ConfigFramewoks[await actionFlows()];
  execAction()
};

module.exports = { startRoutes };
