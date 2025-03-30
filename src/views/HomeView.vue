<template>
  <div class="home">
    <h1>HOME AQUI</h1>
    <button class="btn btn-primary">
      OI
    </button>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/user';

export default {
  name: "HomeView",
  setup() {
    const userStore = useUserStore();
    return {
      userStore
    };
  },
  async mounted() {
    this.loadInfos();
  },
  data() {
    return {};
  },
  methods:{
    loadInfos() {}
  }
};
</script>

<style scoped>

</style>
