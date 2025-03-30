<template>
  <div v-if="isLoading" class="skeleton">

  </div>
  <div v-else class="questao-container">
    <div v-if="!isCurrentQuestionValid && !showInfo" class="question-content">
      <div class="mb-3">
        <h3 class="mb-1">Questão {{ currentStep + 1 }}</h3>
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

      <button
        v-if="canComeBack"
        class="btn btn-secondary me-2"
        @click="handlePrevStep"
      >
        <i class="fas fa-arrow-left"></i>
      </button>
    </div>
    <div v-else class="info-content">

      <!-- MOSTRAR UM RESUMO DO QUE ELA PREENCHEU -->
      <div>
        <!-- aqui o resumo -->
      </div>

      <div class="actions-info row gap-2">
        <div class="col-md-3">
          <button
            class="w-100 btn btn-primary"
            :disabled="!isCurrentQuestionValid"
            @click="showInfo = false"
          >
            <i class="fas fa-edit"></i>
            <span class="ms-2">Alterar questão</span>
          </button>
        </div>
        <div class="col-md-3">
          <btn-add-question
          class="w-100"
          :show-add-button="allowAddQuestion"
          :show-premium-button="currentStep == 3 && !isUserPremium"
          :disabled="!isCurrentQuestionValid"
          @click="handleNextStep"
          />
        </div>
        <div class="col-md-3">
          <button
            class="w-100 btn btn-success"
            :disabled="!isCurrentQuestionValid"
            @click="handleIrParaRevisao"
          >
            Concluir Quiz
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { LIMIT_FREE_QUESTION } from '@/utils/consts.js'
import BtnAddQuestion from './BtnAddQuestion.vue'

export default {
  components: {
    BtnAddQuestion
  },
  data() {
    return {
      questionsLocal: null,
      showInfo: false
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
    },
    canComeBack() {
      return this.currentStep > 0
    },
    allowAddQuestion() {
      return this.currentStep < LIMIT_FREE_QUESTION
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
      if(this.allowAddQuestion) {
        this.$emit('next-step', this.questionsLocal);
      }
    },
    handleIrParaRevisao() {
      this.$emit('ir-para-revisao', this.questionsLocal);
    },
  },
  watch: {
    // AJUSTE ESSA LOGICA
    isCurrentQuestionValid: function(newVal, oldVal) {
      this.showInfo = newVal
    }
  }
}
</script>
