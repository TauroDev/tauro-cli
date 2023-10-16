const {entryPointNext} = require('./Next.ctrl');
const {entryPointReact} = require('./React.ctrl');
const {entryPointVanilla} = require('./Vanilla.ctrl');
const {entryPointVue} = require('./Vue.ctrl');

module.exports = {
  NextCtrl: entryPointNext,
  ReactCtrl: entryPointReact,
  VanillaCtrl: entryPointVanilla,
  VueCtrl: entryPointVue,
};
