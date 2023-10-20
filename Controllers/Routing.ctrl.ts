import clear from "clear";
import inquirer from "inquirer";
import Config from "../Helpers/Config.json";
import { EntryReact } from "./Routes";

const { prompt } = inquirer;

const Flows = [
  {
    type: "list",
    name: "framework",
    message: "A que framework deseas crear la ruta?",
    choices: Config["frameworks-front"],
  },
];

const ConfigFramewoks: any = {
  reactjs: EntryReact,
  nextjs: () => console.log("En desarrollo"),
  vanillajs: () => console.log("En desarrollo"),
  vuejs: () => console.log("En desarrollo"),
};

const actionFlows = async () => {
  const answer = await prompt(Flows);
  const parseData = answer.framework.replace(/\s/g, "").toLowerCase();
  return parseData.replace("(endesarrollo)", "");
};

export const InitAddRoute = async () => {
  clear();
  const execAction = ConfigFramewoks[await actionFlows()];
  execAction();
};

