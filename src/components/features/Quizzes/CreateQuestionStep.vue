<template>
  <div v-if="isLoading" class="skeleton">

  </div>
  <div v-else class="questao-container">
    <div class="mb-3 d-flex justify-content-between">
      <h3 class="mb-1">Questão {{ currentStep + 1 }}</h3>
      <div>
        <button
          v-if="currentStep < 3"
          class="btn btn-primary"
          :disabled="!isCurrentQuestionValid"
          @click="handleNextStep"
        >
          <i class="fas fa-plus"></i>
          <span class="ms-2">Adicionar</span>
        </button>
        <div
          v-else-if="currentStep == 3 && !isUserPremium"
          class="become-premium"
        >
          <badge-premium>
            <button
              class="btn btn-primary disabled aq"
              :disabled="isUserPremium"
            >
              <i class="fas fa-plus"></i>
              <span class="ms-2">Adicionar</span>
            </button>
          </badge-premium>
        </div>
      </div>
    </div>

    <div class="mb-3">
      <label class="form-label">Texto da pergunta:</label>
      <el-input
        v-model="questionsLocal[currentStep].text"
        type="textarea"
        placeholder="Digite sua pergunta aqui"
      />
    </div>

    <div class="alternativas-container">
      <div
        v-for="(option, index) in questionsLocal[currentStep].options"
        :key="index"
        class="mb-3 d-flex align-items-center"
      >
        <div class="option-number me-2">{{ ['A', 'B', 'C', 'D'][index] }}.</div>
        <el-input
          v-model="questionsLocal[currentStep].options[index]"
          placeholder="Digite uma alternativa"
          class="flex-grow-1 me-2"
        />
        <el-radio
          class="radio-color-success"
          v-model="questionsLocal[currentStep].correctAnswer"
          :value="index"
          :label="`Correta`"
        />
      </div>
    </div>

    <div class="d-flex justify-content-between mt-2">
      <div>
        <button
          v-if="currentStep > 0"
          class="btn btn-secondary me-2"
          @click="handlePrevStep"
        >
          <i class="fas fa-arrow-left"></i>
        </button>
        <button
          class="btn btn-success ms-2"
          :disabled="!isCurrentQuestionValid"
          @click="handleIrParaRevisao"
        >
          Concluir Quiz
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import BadgePremium from '@/components/BadgePremium.vue'
export default {
  components: { BadgePremium },
  data() {
    return {
      questionsLocal: null
    }
  },
  props: {
    currentStep: {
      type: Number,
      required: true
    },
    questions: {
      type: Array,
      required: true
    },
    isCurrentQuestionValid: {
      type: Boolean,
      required: true
    },
    isUserPremium: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isLoading() {
      return !this.questionsLocal?.length
    }
  },
  mounted() {
    this.questionsLocal = [...this.questions]
  },
  methods: {
    handlePrevStep() {
      this.$emit('prev-step');
    },
    handleNextStep() {
      this.$emit('next-step', this.questionsLocal);
    },
    handleIrParaRevisao() {
      this.$emit('ir-para-revisao', this.questionsLocal);
    },
  }
}
</script>
