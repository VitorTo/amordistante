<template>
  <div class="content-page-quizzes">
    <div class="h1 mb-4">
      QUIZZES
    </div>

    <!-- Título do Quiz (fora do step-by-step) -->
    <div class="mb-4" v-if="!startedCreateQuiz">
      <el-input
        v-model="quizTitle"
        placeholder="Digite o título do seu quiz"
        class="mb-3"
      />
      <button
        class="btn btn-primary"
        @click="initQuiz"
        :disabled="!quizTitle.trim()"
      >
        Começar a criar questões
      </button>
    </div>

    <!-- Sistema de etapas para questões -->
    <div v-if="startedCreateQuiz">
      <el-steps
        :class="`${transformStepGrid ? 'step-add-grid' : '' }`"
      :active="currentStep" finish-status="success" >
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
          @ir-para-revisao="goToReview"
        />

        <!-- Etapa de revisão/finalização -->
        <review-quizzes
          v-if="currentStep >= questionsCount"
          :quiz-title="quizTitle"
          :questions-count="questionsCount"
          :questions="questions"
          @back-last-question="backLastQuestion"
          @save-quiz="saveQuiz"
        />
      </div>
    </div>
  </div>
</template>

<script>
import CreateQuestionStep from '@/components/features/Quizzes/CreateQuestionStep.vue';
import ReviewQuizzes from '@/components/features/Quizzes/ReviewQuizzes.vue';
import { LIMIT_FREE_QUESTION, DEFAULT_QUESTION_POINTS } from '@/utils/consts.js';

export default {
  components: {
    CreateQuestionStep,
    ReviewQuizzes
  },
  data() {
    return {
      startedCreateQuiz: false,
      quizTitle: "",
      currentStep: 0,
      questionsCount: 1,
      questions: [
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
      // Substitua por sua lógica real para verificar usuário premium
      return false
    },
    maxQuestions() {
      return this.isUserPremium ? Infinity : LIMIT_FREE_QUESTION
    },
    transformStepGrid() {
      return this.questions.length > 5
    }
  },
  methods: {
    initQuiz() {
      if (!this.quizTitle.trim()) return;
      this.startedCreateQuiz = true;
      this.currentStep = 0;

      // Inicializar o array de questões com base no limite
      this.questions = [];
      const initialQuestionsCount = this.isUserPremium ? 1 : LIMIT_FREE_QUESTION;

      for (let i = 0; i < initialQuestionsCount; i++) {
        this.questions.push({
          text: "",
          options: ["", "", "", ""],
          correctAnswer: null,
          points: DEFAULT_QUESTION_POINTS // Inicializa com a pontuação padrão
        });
      }
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
      this.loadQuestions(questions);

      // Verificar se podemos adicionar mais questões
      if (this.currentStep < this.maxQuestions - 1) {
        // Se estamos na última questão disponível, pode ser necessário adicionar uma nova
        if (this.currentStep === this.questionsCount - 1) {
          this.questionsCount++;

          // Se o array de questões atual não tem espaço suficiente, adicionar mais uma
          if (this.questionsCount > this.questions.length) {
            this.questions.push({
              text: "",
              options: ["", "", "", ""],
              correctAnswer: null,
              points: DEFAULT_QUESTION_POINTS // Inicializa com a pontuação padrão
            });
          }
        }

        this.currentStep++;
      }
    },
    goToReview(questions) {
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
    backLastQuestion() {
      this.currentStep = this.questionsCount - 1;
    },
    saveQuiz() {
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
      this.startedCreateQuiz = false;
      this.quizTitle = "";
      this.currentStep = 0;
      this.questionsCount = 1;
      this.questions = [{
        text: "",
        options: ["", "", "", ""],
        correctAnswer: null,
        points: DEFAULT_QUESTION_POINTS // Inicializa com a pontuação padrão
      }];
    }
  }
};
</script>