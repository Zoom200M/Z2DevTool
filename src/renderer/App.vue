<template>
  <div id="app" class="wrapper">
    <div class="tab-group">
      <div class="tab-item tab-item-fixed"
        :class="{'cur-tag': currentClickTabIndex === -1}"
        @click.stop.prevent="handleReturnHome">
        <span class="icon icon-home"></span>
      </div>
      <div class="tab-item" :key="index" v-for="(item, index) in currentTabs"
        :class="{'cur-tag': currentClickTabIndex === index}"
        @click="handleJumpPage(item, index)">
        {{ item.indexOf('.') > -1 ? item.split('.')[1] : item }}
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
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
  import { remote } from 'electron';
  import TabGroup from 'electron-tabs';
  import Store from 'electron-store';
  // import { constants } from 'http2';
  export default {
    name: 'z2devtool',
    data() {
      return {
        currentTabs: [],
        categories: [],
        currentClickTabIndex: -1,
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
      };
    },
    watch: {
      '$route.query.updateIndex': function (val) {
        if (val) {
          this.currentTabs.splice(this.$route.query.index, 1, this.$route.query.categories);
          // this.store.set('current_tabs', this.currentTabs);
        }
      }
    },
    created() {
      this.store = new Store();
      this.getInitialData();
    },
    methods: {
      getInitialData() {
        const current_tabs = this.store.get('current_tabs');
        this.currentTabs = current_tabs ? current_tabs : [];
        this.categoriesList = this.store.get('categories');
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
        this.currentTabs.push('New Tab');        
        this.$router.push({
          name: 'landing-page',
          query: {
            type: 'newTab',
            index: this.currentTabs.length
          }
        });
        this.currentClickTabIndex = this.currentTabs.length -1;
      },
      handleReturnHome() {
        this.currentClickTabIndex = -1;
        this.$router.push({ path: '/' });
      },
      handleJumpPage(item, index) {
        if (this.currentClickTabIndex !== index) { // 有当前tag时不走这块
          const categories =  item.split('.');
          if (categories[1]) {
            const url = this.categoriesList[categories[0]][categories[1]]['url'];
            this.$router.push({
              name: 'container-info',
              query: {
                url: url
              }
            });
            this.currentClickTabIndex = index;
          } else {
            this.$router.push({
              name: 'landing-page',
              query: {
                type: 'newTab',
                index: index,
                updateIndex: index
              }
            });
          }
        }
      }
    }
  }
</script>

<style>
  /* CSS */
    /* @import './test.css'; */
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body { font-family: 'Source Sans Pro', sans-serif; }

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
    background: #ececec;
  }
  main {
    display: flex;
    justify-content: space-between;
    margin: 1rem;
    width: 100%;
    height: 90%;
  }
  .cur-tag {
    background: #e2e2e2;
  }
  /* main > div { flex-basis: 50%; } */
</style>
