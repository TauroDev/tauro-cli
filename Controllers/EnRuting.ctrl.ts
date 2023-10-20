import { startBack } from "./Back.ctrl"
const {startFront} = require("./Front.ctrl")

const HashMapApp: any = {
    "front-end-app": startFront,
    "back-end-app": startBack
}

export const InitProject = (select: {typeApp: string}) => {
    const GoFlow = HashMapApp[select.typeApp]
    GoFlow()
}
