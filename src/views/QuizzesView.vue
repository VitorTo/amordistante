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
    initQuiz() {
      if (!this.quizTitle.trim()) return;
      this.startedCreateQuiz = true;
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
