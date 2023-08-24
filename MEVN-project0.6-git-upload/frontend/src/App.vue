<template>

  <div class="flex flex-col h-screen min-w-min">
    <div class="sticky top-0 w-full">
      <Navigation/>
    </div>
    <router-view/>
  </div>

  <!-- <div class="flex flex-col h-screen bg-white"> -->
    <!-- Navigation -->
    <!-- <div>
      <Navigation/>
    </div> -->
    <!-- Body -->
    <!-- <div class="flex flex-grow overflow-y-auto">
      <div class="w-full m-10">
        <router-view/>
      </div>
    </div>
  </div> -->
  
  
</template>

<script>
import Navigation from './components/Navigation';
export default {
    components: { Navigation },
    setup() {
    }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #484848;
}

</style>
