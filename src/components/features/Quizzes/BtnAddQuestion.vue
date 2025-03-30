<template>
  <button
    v-if="showAddButton"
    class="btn btn-primary"
    :disabled="disabled"
    @click="handleNextStep"
  >
    <i class="fas fa-plus"></i>
    <span class="ms-2">Adicionar questão</span>
  </button>
  <badge-premium v-else>
    <button
      class="btn btn-primary disabled"
    >
      <i class="fas fa-plus"></i>
      <span class="ms-2">Adicionar questão</span>
    </button>
  </badge-premium>
</template>

<script>
import BadgePremium from '@/components/BadgePremium.vue'
export default {
  components: { BadgePremium },
  props: {
    disabled: {
      type: Boolean
    },
    showAddButton: {
      type: Boolean
    },
    showPremiumButton: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style>

</style>