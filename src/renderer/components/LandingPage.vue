<template>
  <div class="container-main">
    <nav class="nav-group">
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
    </nav>
    <div class="container-right">
      <div class="container">
        <div class="container-box" :key="name" v-for="(item, name) in curCategorie"
          @click.stop.prevent="handleJump(item, name)">
            <div class="box">
              <div class="center">
                <p class="page-title">{{ name }}</p>
              </div>
              <p class="page-url" @click.stop.prevent>{{ item.url }}</p>
            </div>
        </div>
      </div>
    </div>
  </div>
  <!-- <webview id="foo" src="https://www.github.com/" style="display:inline-block; width:1240px; height:480px"></webview> -->
</template>

<script>
  import Store from 'electron-store';
  export default {
    name: 'landing-page',
    data() {
      return {
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
      };
    },    
    created() {
      this.getInitialData();
    },
    mounted() {
      // this.getGroup();
    },
    methods: {
      getInitialData() {
        const store = new Store();
        const categoriesStore = store.get('categories');
        this.categoriesList = categoriesStore;
        for (let i in categoriesStore) {
          this.categories.push(i);
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
      handleJump(item, name) {
        if (this.$route.query.type) {
          this.$router.push({
            name: 'container-info',
            query: {
              url: item.url,
              index: this.$route.query.index - 1,
              updateIndex: this.$route.query.index - 1,
              categories: `${this.categories[this.curCategoriesIndex]}.${name}`
            }
          });          
        } else {
          this.$router.push({
            name: 'container-info',
            query: {
              url: item.url
            }
          });
        }
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
    margin-top: 2rem;
  }
  .cur-categories {
    background: #8c8c8c!important;
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
  }
  .container-box {
    width: 13%;
    padding: 13%;
    margin: 1rem;
    position: relative;
    border: 1px solid #dedddd;
    box-shadow: 0.1rem 0 0.4rem #717171;
  }
  .container-box .box {
    position: absolute;
    overflow: hidden;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    /* position: absolute; */
    width: 80%;
    height: 60%;
    text-align: center;
    background: #464242;
    color: #fff;
  }
  .container-box .box div {
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
  }
  .nav-group-item {
    background: #f5f5f5;
    border-bottom: 1px solid #c3c3c3;
    box-shadow: 1px 1px #d4cfcf;
    padding: 2px 10px 2px 25px;
    margin-bottom: 0.8rem;
  }
  .container-right {
    display: inline-block;
    width: 80%;
    float: right;
  }
</style>
