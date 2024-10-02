<script setup>

</script>

<template>
  <router-view></router-view>
</template>

<style>
/*谷哥滚动条样式*/
::-webkit-scrollbar {
  width: 0px;
}

::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0.1)
}

::-webkit-scrollbar-track {
  background-color: rgba(0, 0, 0, 0.05)
}

.fade-enter-from {
  opacity: 0;
}

.fade-enter-to {
  opacity: 1;
}

.fade-leave-from {
  opacity: 1;
}

.fade-leave-to {
  opacity: 0;
}

.fade-enter-active {
  transition: all 0.1s;
}

.fade-enter-active {
  transition-delay: 0.1s;
}
</style>
