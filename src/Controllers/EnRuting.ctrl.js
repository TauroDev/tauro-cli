const {startBack} = require("./Back.ctrl")
const {startFront} = require("./Front.ctrl")

const HashMapApp = {
    "front-end-app": startFront,
    "back-end-app": startBack
}

const enruting = (select) => {
    const GoFlow = HashMapApp[select.typeApp]
    GoFlow()
}


module.exports = {enruting}