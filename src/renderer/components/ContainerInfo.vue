
<template>
  <div class="container">
    <webview :src="pageUrl" httpreferrer="http://cheng.guru"></webview>
    <!-- <webview id="foo" src="https://www.baidu.com/" style="display:inline-block; width:1240px; height:100px"></webview> -->
  </div>
</template>

<script>
  import { remote } from 'electron';
  import TabGroup from 'electron-tabs';
  export default {
    name: 'container-info',
    // components: { SystemInformation },
    data() {
      return {
        tabList: [
          'tab1',
          'tab2',
          'tab3',
          'tab1',
          'tab2',
          'tab3'            
        ],
        menuTemplate: [
          { label: '设置', accelerator: 'Command+,', selector: 'orderFrontStandardAboutPanel:' },
          { type: 'separator' },
          { label: '关于', selector: 'orderFrontStandardAboutPanel:' },
          { type: 'separator' },
          { label: '退出', accelerator: 'Command+Q', click: () => { remote.app.quit(); } }
        ],
      };
    },
    computed: {
      pageUrl() {
        return this.$route.query.url;
      }
    },
    mounted() {
      // this.getGroup();
    },
    methods: {
    }
  }
</script>

<style>
  /* @import './test.css'; */

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body { font-family: 'Source Sans Pro', sans-serif; }

  main {
    display: flex;
    justify-content: space-between;
  }
  /*
  * 中间内容区域样式
  */
  .container {
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    flex: 1;
  }
  webview {
    width: 100%;
    height: 100%;
  }
</style>
