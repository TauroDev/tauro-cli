import Config from "./params.config.json";
import path from "path";

export const routeConfig = path.join(__dirname, "/params.config.json");

export const typeDepartament: any = {
  front: "base-front-end",
  back: "base-back-end",
};

export const typeExtension: any = {
  front: "front",
  back: "back",
};

export const urlRepos: any = {
  front: Config.repoFront,
  back: Config.repoBack,
};
