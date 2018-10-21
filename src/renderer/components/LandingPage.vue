<template>
  <div class="wrapper">
    <div class="tab-group">
      <!-- <div class="tab-item tab-item-fixed"
        :class="{'cur-tag': currentTabIndex === -1}"
        @click.stop.prevent="handleReturnHome">
        <span class="icon icon-home"></span>
      </div> -->
      <div class="tab-item" :key="index" v-for="(item, index) in currentTabs"
        :class="{'cur-tag': currentTabIndex === index}"
        @click="handleJumpPage(item, index)">
        {{ item.name }}
        <span class="icon icon-cancel icon-close-tab" @click.stop.prevent="deleteTable(index)"></span>
      </div>
      <div class="tab-item tab-item-fixed" @click="addTable">
        <span class="icon icon-plus"></span>
      </div>
      <div class="tab-item tab-item-fixed" @click="popupAppMenu">
        <span class="icon icon-menu"></span>
      </div>
    </div>
    <main>
      <system-information
        @changeTabs="changeTabs"
        :currentTabs="currentTabs" 
        :currentTabIndex="currentTabIndex">
      </system-information>
    </main>
    <!-- <webview id="foo" src="https://www.github.com/" style="display:inline-block; width:1240px; height:480px"></webview> -->
  </div>
</template>

<script>
  import { remote } from 'electron';
  import TabGroup from 'electron-tabs';
  import Store from 'electron-store';
  // import { constants } from 'http2';
  import SystemInformation from './LandingPage/SystemInformation'

  export default {
    name: 'landing-page',
    components: { SystemInformation },
    data() {
      return {
        currentTabs: [],
        categories: [],
        currentTabIndex: -1,
        categoriesList: {},
        store: null,
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
        curTab: '',
      };
    },
    watch: {
    },
    created() {
      this.store = new Store();
      this.getInitialData();
    },
    methods: {
      changeTabs(index, tabs) {
        this.currentTabs = tabs;
        console.log('tabs906',  typeof(tabs));
        this.$set(this.currentTabs, index, this.currentTabs[index]);
        this.store.set("current_tabs", this.currentTabs);
      },
      getInitialData() {
        const current_tabs = this.store.get('current_tabs');
        console.log('ss', current_tabs);
        this.currentTabs = current_tabs ? current_tabs : [];
        if (this.currentTabs.length === 0) {
          this.addTable();
        }
        console.log('currentTabs', this.currentTabs);
        this.categoriesList = this.store.get('categories');
        console.log('666categoriesList', this.categoriesList);
        for (let i in this.categoriesList) {
          this.categories.push(i);
        }
      },
      deleteTable(index) {
        this.currentTabs.splice(index, 1);
        this.store.set('current_tabs', this.currentTabs);
      },
      popupAppMenu() {
        const menu = remote.Menu.buildFromTemplate(this.menuTemplate);
        menu.popup();
      },
      addTable() {
        this.currentTabs.push({
          name: 'blank',
          url: '/',
          type: 'local'
        });     
        this.store.set("current_tabs", this.currentTabs);
        this.currentTabIndex = this.currentTabs.length -1;
      },
      handleReturnHome() {
        console.log('store', this.currentTabs);
        this.currentTabIndex = -1;
        this.currentTabIndex = this.currentTabs.length -1;
      },
      handleJumpPage(item, index) {
        this.currentTabIndex = index;
        console.log('item', item);
      }
    }
  }
</script>

<style>
  /* CSS */
    /* @import './test.css'; */
  #wrapper {
    background:
      radial-gradient(
        ellipse at top left,
        rgba(255, 255, 255, 1) 40%,
        rgba(229, 229, 229, .9) 100%
      );
    height: 100vh;
    /* padding: 60px 80px; */
    width: 100vw;
  }

  #logo {
    height: auto;
    margin-bottom: 20px;
    width: 420px;
  }
  #app {
    width: 100%;
    height: 100%;
    background: #fff;
  }
  main {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 90%;
  }
  .cur-tag {
    background: #e2e2e2;
  }
  /* main > div { flex-basis: 50%; } */
</style>
