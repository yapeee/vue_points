<template>
  <div>
    <div class="main-content">
      <div name="scroll" class="scroll-block">
        <scroll ref="scroll" :freeScroll="true" :bounce="true">
          <slot></slot>
        </scroll>
      </div>
    </div>
  </div>
</template>
<script>
import Scroll from './scroll/scroll'
export default {
  name: 'content-wrapper',
  components: {Scroll},
    data () {
      return {
      }
    },
  props: {
    replaceScroll: {
      default: false
    },
      contentHeight: {
        default:'content-noheader'
      },
    hasPadding: {
      default: false
    },
    noTop: {
      default: false
    },
    hasTab: {
      default: false
    }
  }
}
</script>
<style scoped>
  *{
    background-color: #fff5e1;
  }
  .main-content .scroll-block {
    height: 270px;
  }

</style>
