<template>
  <div class="container-main">
    <nav class="nav-group" v-if="!isTabInfo">
      <!-- <h5 class="nav-group-title">Favorites</h5>
      <a class="nav-group-item active" 
        @click.stop.prevent="$router.push({ path: '/' })">
        <span class="icon icon-home"></span>
        connors
      </a> -->
      <span class="nav-group-item"
        :class="{'cur-categories': curCategoriesIndex === index}"
        @click="handleChangeCategorie(index)"
        v-for="(item, index) in categories" :key="index">
        <span class="icon icon-cloud"></span>
        {{ item }}
      </span>
      <span @click="updateSettingInfo">修改配置文件</span>
    </nav>
    <div :class="[isTabInfo ? 'container-right-webview' : 'container-right']">
      <div class="container" v-show="!isTabInfo">
        <div class="container-box" :key="name" v-for="(item, name) in curCategorie"
          @click.stop.prevent="openTab(item, name)">
            <a class="box-title">
              <div class="box-title-inner">
                <div class="box-icon">
                  <p class="box-favicon">{{ name.slice(0,1) }}</p>
                </div>
                <div class="box-title-container">{{ name }}</div>
              </div>
            </a>
            <button @click.stop.prevent="changeInfo(item, name)" class="box-menu box-edit-menu" title="修改快捷方式" aria-label="修改快捷方式 百度一下，你就知道"></button>
        </div>
        <div class="container-box">
            <a class="box-title"  @click.stop.prevent="addShortcut">
              <div class="box-title-inner">
                <div class="box-icon">
                  <p class="plus-icon"></p>
                </div>
                <div class="box-title-container">添加快捷方式</div>
              </div>
            </a>
        </div>
      </div>
      <div class="container webview-container" v-show="isTabInfo">
        <webview v-for="(item, index) in currentTabs" v-show="pageUrl === item.url" :key="index" :src="item.url" httpreferrer="http://cheng.guru"></webview>
        <!-- <webview id="foo" src="https://www.baidu.com/" style="display:inline-block; width:1240px; height:100px"></webview> -->
      </div>
      <dialog v-show="showDialog" class="edit-link-dialog" open="">
        <div class="dialog-title">修改快捷方式</div>
        <form action="">
          <div class="field-container">
            <label id="title-field-name" class="field-title">名称</label>
            <div class="input-container">
              <input v-model="info.name" id="title-field" value="" class="field-input" type="text" autocomplete="off" tabindex="0">
              <div class="underline"></div>
            </div>
          </div>
          <div id="url" class="field-container">
            <label id="url-field-name" class="field-title">网址</label>
            <div class="input-container">
              <input id="url-field" v-model="info.url" class="field-input" type="text" autocomplete="off" spellcheck="false" tabindex="0" required="">
              <div class="underline"></div>
            </div>
          </div>
          <div id="url" class="field-container">
            <label id="url-field-name" class="field-title">网址类型</label>
            <div class="input-container">
              <select v-model="info.type">
                <option>remote</option>
                <option>local</option>
              </select>
            </div>
          </div>
          <div class="buttons-container">
            <button id="delete" @click="deleteInfo" class="secondary" type="button" tabindex="0" title="删除">删除</button>
            <span class="right">
              <button @click="changeInfo" class="cancel secondary" type="button" tabindex="0" title="取消">取消</button>
              <button type="submit" id="done" class="primary" tabindex="0" title="修改快捷方式" @click="updateInfo">完成</button>
            </span>
          </div>
        </form>
      </dialog>
      <dialog v-show="showConfigurationDialog" class="edit-link-dialog" open="">
        <div class="dialog-title">修改配置文件</div>
        <form action="">
          <textarea v-model="settingInfo" rows="3" cols="20">
          </textarea>
          <div class="buttons-container">
            <span class="right">
              <button @click="showConfigurationDialog=false" class="cancel secondary" type="button" tabindex="0" title="取消">取消</button>
              <button type="submit" id="done" class="primary" tabindex="0" title="修改快捷方式" @click="updateInfo">完成</button>
            </span>
          </div>
        </form>
      </dialog>
    </div>
  </div>
</template>

<script>
  import Store from 'electron-store';
  export default {
    name: 'system-information',
    props: {
      currentTabs: {
        type: Array
      },
      currentTabIndex: {
        type: Number
      }
    },
    data() {
      return {
        store: null,
        categories: [],
        curCategorie: {},
        curCategoriesIndex: 0,
        categoriesList: {},
        menuTemplate: [
          { label: '设置', accelerator: 'Command+,', selector: 'orderFrontStandardAboutPanel:' },
          { type: 'separator' },
          { label: '关于', selector: 'orderFrontStandardAboutPanel:' },
          { type: 'separator' },
          { label: '退出', accelerator: 'Command+Q', click: () => { remote.app.quit(); } }
        ],
        isTabInfo: false,
        pageUrl: '',
        showDialog: false,
        info: {
          name: '',
          url: '',
          type: ''
        },
        name: false,
        showConfigurationDialog: false,
        settingInfo: {}
      };
    },    
    created() {
      this.getInitialData();
    },
    watch: {
      currentTabIndex (val, oldVal) {
        if (this.currentTabs[val].name === 'blank') {
          this.isTabInfo = false;
        } else {
          this.pageUrl = this.currentTabs[val].url;
          this.isTabInfo = true;
        }
      }
    },
    mounted() {
      // this.getGroup();
    },
    methods: {
      changeInfo(item, name) {
        this.info.url = item.url;
        this.info.name = name;
        this.info.type = item.type;
        this.name = name;
        this.showDialog = !this.showDialog;
      },
      updateSettingInfo() {
        this.showConfigurationDialog = true;
        this.settingInfo = JSON.stringify(this.store.get('categories'));
      },
      deleteInfo() {
        delete this.categoriesList[this.categories[this.curCategoriesIndex]][this.info.name];
        this.store.set('categories', this.categoriesList);
        this.showDialog = !this.showDialog;
      },
      updateInfo() {
        if (this.name && (this.name !== this.info.name)) {
          delete this.categoriesList[this.categories[this.curCategoriesIndex]][this.name];
        }
        this.categoriesList[this.categories[this.curCategoriesIndex]][this.info.name] = {
          type: this.info.type,
          url: this.info.url
        }
        this.store.set('categories', this.categoriesList);
        this.showDialog = !this.showDialog;
      },
      addShortcut() {
        this.showDialog = !this.showDialog;
      },
      getInitialData() {
        this.store = new Store();
        const categoriesStore = this.store.get('categories');
        this.categoriesList = categoriesStore;
        console.log('dd', categoriesStore);
        for (let i in categoriesStore) {
          console.log('222e', categoriesStore[i])
          if (categoriesStore[i] !=='') {
            this.categories.push(i);
          }
        }
        this.curCategorie = this.categoriesList[this.categories[0]];
      },
      handleChangeCategorie(index) {
        this.curCategoriesIndex = index;
        this.curCategorie = this.categoriesList[this.categories[index]];
      },
      open(link) {
        this.$electron.shell.openExternal(link)
      },
      openTab(item, name) {
        this.pageUrl = item.url;
        this.isTabInfo = true;
        this.currentTabs[this.currentTabIndex] = {
          name: name,
          url: this.pageUrl,
          path: this.categories[this.currentTabIndex] + '.' + name
        };
        this.$emit('changeTabs', this.currentTabIndex, this.currentTabs);
      }
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');
  /* .container-box {
    width: 100%;
    display: flex;
  } */
  .nav-group {
    width: 16%;
    display: inline-block;
    background: #f5f5f4;
    height: 100%;
    border-radius: .3rem;
  }
  .cur-categories {
    background: #dcdfe1!important;
  }
  .container-main {
    width: 100%;
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
    height: auto;
    justify-content: center;
    line-height: normal;
    margin: 0;
    position: static;
  }
  .container-box {
    border-radius: 4px;
    box-sizing: border-box;
    height: 112px;
    margin-bottom: 16px;
    opacity: 1;
    position: relative;
    transition-property: background, background-color, border-color, box-shadow, opacity, text-shadow;
    width: 112px;
  }
  .container-box:hover {
    background-color: rgba(33, 32, 36, 0.06);
  }
  a {
    color: inherit;
    text-decoration: none;
    display: block;
  }
  .box-title {
    cursor: pointer;
    padding: 16px 4px;
  }
  .box-title-inner {
    align-items: center;
    display: flex;
    flex-flow: column nowrap;
    height: 100%;
    position: relative;
    width: 100%;
  }
  .box-icon {
    margin-bottom: 16px;
    width: 48px;
    height: 48px;
    background: rgba(220, 220, 220, 0.35);
    border: 50%;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .box-favicon {
    pointer-events: none;
    line-height: 48px;
    text-align: center;
    text-transform: Uppercase;
    font-size: 20px;
    font-weight: bold;
  }
  .box-title-container {
    direction: ltr;
    font-weight: 400;
    color: rgba(33, 32, 36, 0.86);
    font-family: 'Segoe UI', 'Roboto', arial, sans-serif;
    font-size: var(--md-title-font-size);
    font-weight: 500;
    height: var(--md-title-height);
    line-height: var(--md-title-height);
    text-align: center;
    width: 96px;
    word-break: break-word;
    word-wrap: break-word;
  }
  .box-menu {
    background-color: transparent;
    border: none;
    cursor: pointer;
    height: 17px;
    margin: 10px 7px 2px 7px;
    opacity: 0;
    position: absolute;
    right: 0;
    top: 0;
  }
  .container-box:hover .box-edit-menu {
    opacity: 1;
    transition-delay: 500ms;
  }
  .box-edit-menu {
    width: 11px;
    background: url(../../assets/image/icon-more.svg) no-repeat;
    background-size: 100%;
  }
  /*加号*/
  .plus-icon {
    display: inline-block;
    background: #000;
    line-height: 48px;
    text-align: center;
    height: 12px;
    position: relative;
    width: 2px;
  }
  .plus-icon:after {
    background: #000;
    content: "";
    height: 12px;
    left: 0;
    position: absolute;
    top: 0;
    width: 2px;
    transform: rotateZ(90deg)
  }
  /* .container-box {
    width: 13%;
    padding: 13%;
    margin: 1rem;
    position: relative;
    border: 1px solid #dedddd;
    box-shadow: 0.1rem 0 0.4rem #717171;
  } */
  /* .container-box .box {
    position: absolute;
    overflow: hidden;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    // position: absolute;
    width: 80%;
    height: 60%;
    text-align: center;
    background: #464242;
    color: #fff;
  } */
  /* .container-box .box div {
    position: relative;
  }
  .container-box .page-title {
    font-size: 1.6rem;
  }
  .container-box .page-url {
    word-wrap: break-word;
    margin-top: 28%;
    color: #dfdeff;
    font-size: 0.7rem;
  } */
  .container-right-webview {
    width: 100%;
    height: 100%;
  }
  .container-right {
    display: inline-block;
    width: 80%;
    float: right;
  }
  /* .container {
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    flex: 1;
  } */
  webview {
    width: 100%;
    height: 100%;
  }
  .webview-container {
    width: 100%;
    height: 100%;
  }
  /* 弹框 */
  dialog {
    display: block;
    position: absolute;
    left: 0px;
    right: 0px;
    width: -webkit-fit-content;
    height: -webkit-fit-content;
    color: black;
    margin: auto;
    border-width: initial;
    border-style: solid;
    border-color: initial;
    border-image: initial;
    padding: 1em;
    background: white;
  }
  .edit-link-dialog {
    background-color: #fff;
    border: none;
    border-radius: 8px;
    bottom: 0; 
    box-shadow: 0 1px 3px 0 rgba(60, 64, 67, 0.3), 0 4px 8px 3px rgba(60, 64, 67, 0.15);
    font-family: 'Roboto', arial, sans-serif;
    margin: auto;
    padding: 16px;
    top: 0;
    width: 320px;
    z-index: 10000;
  }
  .edit-link-dialog > div {
    width: 100%;
  }

  .dialog-title {
    color: rgb(32, 33, 36);
    font-family: 'Roboto', arial, sans-serif;
    font-size: 15px;
    line-height: 24px;
    margin-bottom: 16px;
  }
  form {
    display: block;
    margin-top: 0em;
  }
  .field-container {
    margin-bottom: 16px;
  }
  .field-title {
    color: rgb(95, 99, 104);
    font-size: 10px;
    font-weight: 500;
    margin-bottom: 4px;
  }
  .edit-link-dialog input {
    background-color: rgb(241, 243, 244);
    border: none;
    border-radius: 4px;
    caret-color: rgb(26, 115, 232);
    color: rgb(32, 33, 36);
    font-family: 'Roboto', arial, sans-serif;
    font-size: 13px;
    height: 32px;
    line-height: 24px;
    outline: none;
    padding-inline-end: 8px;
    padding-inline-start: 8px;
    width: calc(100% - 16px);
  }
  .buttons-container {
    display: flex;
    justify-content: space-between;
    margin-top: 24px;
  }
  .edit-link-dialog button {
    border: none;
    border-radius: 4px;
    font-family: 'Roboto', arial, sans-serif;
    font-size: 12px;
    font-weight: 500;
    height: 32px;
    padding: 0 16px;
    transition-duration: 200ms;
    transition-property: background-color, color, box-shadow, border;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  .edit-link-dialog button.secondary {
    background-color: white;
    border: 1px solid rgb(218, 220, 224);
    color: rgb(26, 115, 232);
  }
  .cancel {
    margin-right: 8px;
  }
  .edit-link-dialog button.primary {
    background-color: rgb(26, 115, 232);
    color: white;
  }
</style>
