import Vue from 'vue';
import Vuex from 'vuex';

import { DEBUG } from '../config';
import dataHandler from './dataHandler.js';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';


Vue.use(Vuex);
Vue.config.debug = DEBUG;

export default new Vuex.Store({
  state: {
    title: 'HistoryFlow',
    shortTitle: 'HF',

    dicts: {},
    project: {
      name: 'world_history',
      label: 'World History',
      scenarios: [
        { id: 1, name: 'second_punic_war', label: 'Second Punic War' }
      ]
    },

    rootScenario: { // global scenario of the project
      context: {}
      // context: {
      //   name: '',
      //   rootElement: null,
      //   info_fields: [],
      //   start_date: {},
      //   end_date: {},
      //   elements_types: [],
      //   links_types: [],
      //   additional_ids: [],
      //   bbox: [],
      //   step_size: '',
      //   weight: 1,
      //   disable_others: false,
      //   dataset: []
      // }
    },
    scenario: {
      contexts: []
    },
    elements: [],
    shapes: [],
    selectedElementsIds: [],
    currentElementId: ''

  },
  getters,
  mutations,
  actions,
  plugins: [dataHandler],
  strict: DEBUG
});
