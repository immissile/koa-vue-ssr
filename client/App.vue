<template>
  <div id="app">
    <div class="menu-horizontal">
      <router-link class="menu__heading menu__link" to="/home">Home</router-link>
      <ul class="menu__list">
        <li class="menu__item">
          <router-link class="menu__link" to="/menu" active-class="menu__item--active">Menu</router-link>
        </li>
        <li class="menu__item">
          <router-link class="menu__link" to="/button"
            active-class="menu__item--active">Button</router-link>
        </li>
      </ul>
    </div>
    <transition name="fade" mode="out-in">
      <router-view class="view"></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted () {
    if (process.env.NODE_ENV === 'development') {
      window.that = this
    }
  }
}
</script>

<style lang="scss">
$--font-path: '../node_modules/element-ui/lib/theme-chalk/fonts';
@import "../node_modules/element-ui/packages/theme-chalk/src/index";
@import './assets/css/normalize.css';
@import './components/Menu/base.scss';
@import './components/Menu/horizontal.scss';
@import './components/Button/base.scss';
</style>
