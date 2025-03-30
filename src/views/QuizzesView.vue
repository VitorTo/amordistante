<template>
  <div class="content-page-quizzes">
    <div class="h1 mb-4">
      QUIZZES
    </div>

    <!-- Título do Quiz (fora do step-by-step) -->
    <div class="mb-4" v-if="!iniciadoCriacao">
      <el-input
        v-model="quizTitle"
        placeholder="Digite o título do seu quiz"
        class="mb-3"
      />
      <button
        class="btn btn-primary"
        @click="iniciarCriacaoQuiz"
        :disabled="!quizTitle.trim()"
      >
        Começar a criar questões
      </button>
    </div>

    <!-- Sistema de etapas para questões -->
    <div v-if="iniciadoCriacao">
      <el-steps :active="currentStep" finish-status="success" >
        <el-step
          v-for="n in totalSteps"
          :key="n"
          :description="n < totalSteps ? `Questão ${n}` : 'Finalizar'"
        />
      </el-steps>

      <div class="step-content mt-4">
        <!-- Etapas de perguntas (1-4) -->
        <create-question-step
          v-if="currentStep < questionsCount"
          :current-step="currentStep"
          :isCurrentQuestionValid="isCurrentQuestionValid"
          :isUserPremium="isUserPremium"
          :questions="questions"
          @prev-step="prevStep"
          @next-step="nextStep"
          @ir-para-revisao="irParaRevisao"
        />

        <!-- Etapa de revisão/finalização -->
        <div v-else class="revisao-container">
          <h3 class="mb-3">Revisão do Quiz</h3>
          <p class="mb-3"><strong>Título:</strong> {{ quizTitle }}</p>
          <p class="mb-3"><strong>Total de questões:</strong> {{ questionsCount }}</p>

          <div class="accordion" id="quizAccordion">
            <div
              class="accordion-item"
              v-for="(question, qIndex) in questions.slice(0, questionsCount)"
              :key="qIndex"
            >
              <h2 class="accordion-header">
                <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  :data-bs-target="'#collapse' + qIndex"
                  aria-expanded="false"
                  :aria-controls="'collapse' + qIndex"
                >
                  Questão {{ qIndex + 1 }}: {{ question.text.substring(0, 50) }}{{ question.text.length > 50 ? '...' : '' }}
                </button>
              </h2>
              <div
                :id="'collapse' + qIndex"
                class="accordion-collapse collapse"
                data-bs-parent="#quizAccordion"
              >
                <div class="accordion-body">
                  <p><strong>Pergunta:</strong> {{ question.text }}</p>
                  <ul class="list-group">
                    <li
                      v-for="(option, oIndex) in question.options"
                      :key="oIndex"
                      class="list-group-item"
                      :class="{'list-group-item-success': oIndex === question.correctAnswer}"
                    >
                      {{ ['A', 'B', 'C', 'D'][oIndex] }}. {{ option }}
                      <span v-if="oIndex === question.correctAnswer" class="badge bg-success ms-2">Correta</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div class="d-flex justify-content-between mt-4">
            <button class="btn btn-secondary" @click="voltarParaUltimaQuestao">
              <i class="fas fa-arrow-left"></i>
              Voltar
            </button>
            <button class="btn btn-success" @click="salvarQuiz">
              Salvar Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CreateQuestionStep from '@/components/features/Quizzes/CreateQuestionStep.vue';
export default {
  components: { CreateQuestionStep },
  data() {
    return {
      iniciadoCriacao: false,
      quizTitle: "",
      currentStep: 0,
      questionsCount: 1,
      questions: [
        {
          text: "",
          options: ["", "", "", ""],
          correctAnswer: null
        },
        {
          text: "",
          options: ["", "", "", ""],
          correctAnswer: null
        },
        {
          text: "",
          options: ["", "", "", ""],
          correctAnswer: null
        },
        {
          text: "",
          options: ["", "", "", ""],
          correctAnswer: null
        }
      ]
    };
  },
  computed: {
    isCurrentQuestionValid() {
      const question = this.questions[this.currentStep];
      return (
        question.text.trim() !== "" &&
        question.options.every(option => option.trim() !== "") &&
        question.correctAnswer !== null
      );
    },
    totalSteps() {
      // Número de questões + etapa de revisão
      return this.questionsCount + 1;
    },
    isUserPremium() {
      return false
    }
  },
  methods: {
    iniciarCriacaoQuiz() {
      if (!this.quizTitle.trim()) return;
      this.iniciadoCriacao = true;
      this.currentStep = 0;
    },
    loadQuestions(questions) {
      this.questions = questions
    },
    prevStep() {
      if (this.currentStep > 0) {
        this.currentStep--;
      }
    },
    nextStep(questions) {
      if (!this.isCurrentQuestionValid) return;
      this.loadQuestions(questions)

      if (this.currentStep < 3) {
        if (this.currentStep === this.questionsCount - 1) {
          this.questionsCount++;
        }
        this.currentStep++;
      }
    },
    irParaRevisao(questions) {
      if (!this.isCurrentQuestionValid) return;
      this.loadQuestions(questions)
      // Certifique-se de que a questão atual é contada
      if (this.currentStep === this.questionsCount - 1) {
        // Já estamos na última questão, então não precisa incrementar
      } else {
        // Estamos adicionando uma nova questão válida
        this.questionsCount = this.currentStep + 1;
      }

      // Vá para a etapa de revisão
      this.currentStep = this.questionsCount;
    },
    voltarParaUltimaQuestao() {
      this.currentStep = this.questionsCount - 1;
    },
    salvarQuiz() {
      const quiz = {
        title: this.quizTitle,
        questions: this.questions.slice(0, this.questionsCount)
      };

      console.log("Quiz salvo:", quiz);
      // Aqui você pode implementar a lógica de salvar no banco de dados
      // ou disparar uma ação para salvar no Vuex/Pinia

      // Exemplo: this.$store.dispatch('saveQuiz', quiz);

      // Reiniciar o formulário após salvar
      this.resetForm();
    },
    resetForm() {
      this.iniciadoCriacao = false;
      this.quizTitle = "";
      this.currentStep = 0;
      this.questionsCount = 1;
      this.questions = this.questions.map(() => ({
        text: "",
        options: ["", "", "", ""],
        correctAnswer: null
      }));
    }
  }
};
</script>

<style>
.step-content {
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 5px;
  margin-top: 20px;
}

.questao-container, .revisao-container {
  max-width: 800px;
  margin: 0 auto;
}

.alternativas-container {
  margin-top: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 5px;
}

.option-number {
  font-weight: bold;
  width: 30px;
}

.accordion-button:not(.collapsed) {
  background-color: #e7f1ff;
  color: #0c63e4;
}
</style>
