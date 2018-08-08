<template>
  <div class="container">
    <div class="container-box" :key="index" v-for="(item, index) in tabList"
      @click.stop.prevent="$router.push({ path: '/container' })">
        <p>{{ index }}</p>
    </div>
  </div>
      <!-- <webview id="foo" src="https://www.github.com/" style="display:inline-block; width:1240px; height:480px"></webview> -->
</template>

<script>
  export default {
    name: 'landing-page',
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
    created() {
      // this.getGroup();
    },
    mounted() {
      // this.getGroup();
    },
    methods: {
      deleteTable(index) {
        console.log('deleteTable');
        this.tabList.splice(index, 1);
      },
      popupAppMenu() {
        const menu = remote.Menu.buildFromTemplate(this.menuTemplate);
        menu.popup();
      },
      addTable() {
        console.log('addTable');
        this.tabList.push('tab5');
      },
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      getGroup() {
        let tabGroup = new TabGroup({
          newTab: {
              title: 'New Tab'
          }
        });
        tabGroup.addTab({
            title: 'Google',
            src: '/',
        });
        tabGroup.addTab({
            title: "Electron",
            src: "/",
            visible: true,
            active: true
        });
      }
    }
  }
</script>

<style>

  /* .container-box {
    width: 100%;
    display: flex;
  } */
  .container-box {
    width: 20%;
    height: 6rem;
    margin: 10px;
    position: relative;
    border: 1px solid #dedddd;
    box-shadow: 0px 0px 10px #dedddd;
  }
</style>
