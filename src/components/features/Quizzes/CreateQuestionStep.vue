<template>
  <div v-if="isLoading" class="skeleton">

  </div>
  <div v-else class="questao-container">
    <div v-if="!showInfo" class="question-content">
      <div class="mb-3">
        <h3 class="mb-1">Questão {{ currentStep + 1 }}</h3>
      </div>
      <div class="mb-3">
        <label class="form-label">Texto da pergunta:</label>
        <el-input
          v-model="questionsLocal[currentStep].text"
          type="textarea"
          placeholder="Digite sua pergunta aqui"
          @keydown.enter="focusNextInput($event, 'option-0')"
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
            :id="`option-${index}`"
            @keydown.enter="focusNextInput($event, index < 3 ? `option-${index+1}` : null)"
          />
          <el-radio
            class="radio-color-success"
            v-model="questionsLocal[currentStep].correctAnswer"
            :value="index"
            :label="`Correta`"
          />
        </div>
      </div>

      <div :class="`d-flex ${canComeBack ? 'justify-content-between' : 'justify-content-end'}` ">
        <button
          v-if="canComeBack"
          class="btn btn-secondary me-2"
          @click="handlePrevStep"
        >
          <i class="fas fa-arrow-left"></i>
          Voltar
        </button>
        <button
          class="btn btn-success"
          :disabled="!isCurrentQuestionValid"
          @click="showInfo = true"
        >
          <i class="fas fa-check"></i>
          Concluir Questão
        </button>
      </div>
    </div>
    <div v-else class="info-content">
      <div class="questao-resumo mb-4">
        <h4 class="mb-3">Resumo da Questão {{ currentStep + 1 }}</h4>
        <div class="pergunta-texto mb-3">
          <strong>Pergunta:</strong> {{ questionsLocal[currentStep].text }}
        </div>
        <div class="opcoes-resumo">
          <strong>Alternativas:</strong>
          <div v-for="(option, index) in questionsLocal[currentStep].options" :key="index"
               class="opcao-item d-flex align-items-center mt-2 p-2"
               :class="{ 'bg-light-success rounded': index === questionsLocal[currentStep].correctAnswer }">
            <span class="opcao-letra me-2">{{ ['A', 'B', 'C', 'D'][index] }}.</span>
            <span>{{ option }}</span>
            <span v-if="index === questionsLocal[currentStep].correctAnswer" class="badge bg-success ms-auto">Resposta correta</span>
          </div>
        </div>
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
          :show-premium-button="!allowAddQuestion"
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
      return this.isUserPremium || this.currentStep < LIMIT_FREE_QUESTION - 1
    }
  },
  mounted() {
    this.questionsLocal = [...this.questions]
  },
  methods: {
    focusNextInput(event, nextInputId) {
      event.preventDefault();

      if (nextInputId) {
        setTimeout(() => {
          const nextInput = document.getElementById(nextInputId);
          if (nextInput) nextInput.focus();
        }, 10);
      } else {

        event.target.blur();
      }
    },
    handlePrevStep() {
      this.showInfo = true
      this.$emit('prev-step');
    },
    handleNextStep() {
      if(this.allowAddQuestion) {
        this.showInfo = false
        this.$emit('next-step', this.questionsLocal);
      }
    },
    handleIrParaRevisao() {
      this.$emit('ir-para-revisao', this.questionsLocal);
    },
  }
}
</script>
