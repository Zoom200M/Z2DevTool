<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  import { remote } from 'electron';
  import TabGroup from 'electron-tabs';
  import Store from 'electron-store';
  // import { constants } from 'http2';

  export default {
    name: 'z2devtool'
  }
</script>
<style>
  #app {
    width: 100%;
    height: 100%;
  }
</style>

<style>
  /* CSS */
    /* @import './test.css'; */
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body { font-family: 'Source Sans Pro', sans-serif; }
</style>
