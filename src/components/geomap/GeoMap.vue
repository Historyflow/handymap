<template>
<div>
  <gl-map :accessToken="accessToken"
          :map-style="mapSource"
          :center="[8.3221, 46.5928]"
          :maxZoom="6"
          :minZoom="1.76"
          :zoom="3"
          :hash="true"
  >
    <nav-control></nav-control>
    <element-shape v-for="element of dataset" :key="element.id" :element="element"></element-shape>
  </gl-map>
</div>
</template>

<script>
import {
  MglMap,
  MglNavigationControl
} from 'vue-mapbox';

import {MAP_SOURCE, MAPBOX_ACCESS_TOKEN} from '../../config';
import api from '../../api';
import ElementShape from './ElementShape.vue';

export default {
  name: 'GeoMap',
  components: {
    GlMap: MglMap,
    NavControl: MglNavigationControl,
    ElementShape
  },

  data() {
    return {
      map: null,
      accessToken: MAPBOX_ACCESS_TOKEN,
      mapSource: MAP_SOURCE
    };
  },

  computed: {
    currentElement() { return this.$store.getters.currentElement; },
    dataset() {
      let dataset = this.$store.getters.commonDataset;
      return dataset;
    }
  }
};

</script>

<style lang="scss" scoped>
  #map {
    position: absolute;
    top: 57px;
    left: 0;
    height: calc(100vh - 57px);
    width: 100vw;
  }
</style>
