import Vue from "vue";
import Vuex from "vuex";
import * as Mut from "./mutationTypes";
import unionWith from "lodash/unionWith";

const debug = process.env.NODE_ENV !== "production";

Vue.use(Vuex);
Vue.config.debug = debug;

const storageService = function(dataService) {
  return store => {
    store.subscribe(mutation => {
      if (mutation.type === "router/ROUTE_CHANGED") {
        if (mutation.payload.name === "element") {
          dataService.get(["element"], [{ "name": mutation.payload.params.name }]);
        }
      } else {
        dataService.process(mutation.type, mutation.payload);
      }
      console.log(mutation);
    });
  };
};

const storagePlugin = storageService();

const store =  new Vuex.Store({
  state: {
    title: {
      full: "Handymap",
      short: "HM"
    },
    menu: [
      ["About", "/about"]
    ],
    dicts: {},
    currentElement: {},
    currentElementId: null,
    defaultElementId: null,
    elements: [],
    collections: [],
    orderedCollections: [],
    user: {}
  },
  mutations: {
    [Mut.SET_ELEMENTS](state, data) {
      state.elements = unionWith(state.elements, data, (currentItem, newItem) => currentItem.id === newItem.id);
    },
    [Mut.SET_ELEMENT](state, data) {
      let elementToSet = state.elements.find((item) => item.id === data.id);
      if (elementToSet) {
        Object.assign(elementToSet, data);
      } else {
        state.elements.push(data);
      }
    },
    [Mut.SET_ELEMENT_SHAPES](state, data) {
      let elementToSet = state.elements.find((item) => item.id === data.id);
      elementToSet.shapes = [];
      elementToSet.shapes.push(data.shapes);
    },
    [Mut.SET_CURRENT_ELEMENT](state, data) {
      state.currentElementId = data.id;
      state.currentElement = Object.assign({}, data);
    },
    [Mut.SET_CURRENT_ELEMENT_ID](state, id) {
      state.currentElementId = id;
    },
    [Mut.SET_DEFAULT_ELEMENT_ID](state, data) {
      state.defaultElementId = data;
    },
    [Mut.SET_DICTS](state, data) {
      state.dicts = Object.assign({}, state.dicts, data);
    }
  },
  modules: {},
  plugins: [storagePlugin],
  strict: debug
});

export default store;
