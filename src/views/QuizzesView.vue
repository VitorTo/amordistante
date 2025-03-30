<template>
  <div class="content-page-quizzes">
    <div class="h1 mb-4">
      QUIZZES
    </div>

    <!-- Título do Quiz (fora do step-by-step) -->
    <div class="row mb-3" v-if="!startedCreateQuiz">
      <div class="col-md-3">
        <el-input
          v-model="quizTitle"
          placeholder="DIGITE TÍTULO DO SEU QUIZ"
          class="mb-3"
        />
      </div>
      <div class="col-md-3">
        <button
          class="w-100 btn btn-primary"
          @click="initQuiz"
          :disabled="!quizTitle.trim()"
        >
          <i class="fas fa-plus"></i>
          Criar um novo quiz
        </button>
      </div>
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

    <!-- Seção de Quizzes -->
    <div v-if="!startedCreateQuiz" class="quizzes-section mt-5">
      <!-- Meu último quiz -->
      <div v-if="lastQuiz" class="last-quiz mb-5">
        <h3 class="mb-3">Meu último quiz criado</h3>
        <div class="card quiz-card">
          <div class="card-body">
            <h4 class="card-title">{{ lastQuiz.title }}</h4>
            <p class="card-text">
              <i class="fas fa-list-ol me-2"></i>
              {{ lastQuiz.questions.length }} questões
              <span class="badge bg-info ms-2">{{ lastQuiz.points || sumQuizPoints(lastQuiz) }} pontos</span>
            </p>
            <!-- <div class="d-flex justify-content-between">
              <button class="btn btn-primary" @click="viewQuiz(lastQuiz)">
                <i class="fas fa-eye me-1"></i> Visualizar
              </button>
              <button class="btn btn-warning" @click="editQuiz(lastQuiz)">
                <i class="fas fa-edit me-1"></i> Editar
              </button>
            </div> -->
          </div>
        </div>
      </div>

      <!-- Meus Quizzes -->
      <div v-if="myQuizzes.length > 1" class="my-quizzes mb-5">
        <h3 class="mb-3">Meus Outros Quizzes</h3>
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          <div
            v-for="(quiz, index) in myOtherQuizzes"
            :key="`my-${index}`"
            class="col"
          >
            <div class="card h-100 quiz-card">
              <div class="card-body">
                <h5 class="card-title">{{ quiz.title }}</h5>
                <p class="card-text">
                  <i class="fas fa-list-ol me-2"></i>
                  {{ quiz.questions.length }} questões
                  <span class="badge bg-info ms-2">{{ quiz.points || sumQuizPoints(quiz) }} pontos</span>
                </p>
                <div class="d-flex justify-content-between">
                  <button class="btn btn-sm btn-primary" @click="viewQuiz(quiz)">
                    <i class="fas fa-eye me-1"></i> Visualizar
                  </button>
                  <button class="btn btn-sm btn-warning" @click="editQuiz(quiz)">
                    <i class="fas fa-edit me-1"></i> Editar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quizzes de Outros Usuários -->
      <div v-if="otherUsersQuizzes.length" class="other-quizzes">
        <h3 class="mb-3">Quizzes criado pelo seu par</h3>
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          <div
            v-for="(quiz, index) in otherUsersQuizzes"
            :key="`other-${index}`"
            class="col"
          >
            <div class="card h-100 quiz-card">
              <div class="card-body">
                <h5 class="card-title">{{ quiz.title }}</h5>
                <p class="card-text">
                  <i class="fas fa-list-ol me-2"></i>
                  {{ quiz.questions.length }} questões
                  <span class="badge bg-info ms-2">{{ quiz.points || sumQuizPoints(quiz) }} pontos</span>
                </p>
                <div class="d-flex justify-content-between">
                  <button class="btn btn-sm btn-primary" @click="viewQuiz(quiz)">
                    <i class="fas fa-eye me-1"></i> Ver
                  </button>
                  <button class="btn btn-sm btn-success" @click="playQuiz(quiz)">
                    <i class="fas fa-play me-1"></i> Jogar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mensagem se não houver quizzes -->
      <div v-if="!allQuizzes.length" class="no-quizzes text-center py-5">
        <i class="fas fa-question-circle fa-3x mb-3 text-muted"></i>
        <h4>Nenhum quiz encontrado</h4>
        <p class="text-muted">Crie seu primeiro quiz para começar!</p>
      </div>
    </div>
  </div>
</template>

<script>
import { useQuizStore } from '@/stores/quiz';
import { LIMIT_FREE_QUESTION, DEFAULT_QUESTION_POINTS } from '@/utils/consts.js';
import CreateQuestionStep from '@/components/features/Quizzes/CreateQuestionStep.vue';
import ReviewQuizzes from '@/components/features/Quizzes/ReviewQuizzes.vue';

export default {
  setup() {
    const quizStore = useQuizStore()
    return {
      quizStore
    }
  },
  components: {
    CreateQuestionStep,
    ReviewQuizzes
  },
  data() {
    return {
      currentUser: 1,
      startedCreateQuiz: false,
      quizTitle: "",
      currentStep: 0,
      questionsCount: 1,
      questions: [
        {
          text: "",
          options: ["", "", "", ""],
          correctAnswer: null,
          points: DEFAULT_QUESTION_POINTS
        }
      ],
      selectedQuiz: null
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
    },
    allQuizzes() {
      return this.quizStore?.quizzes || []
    },
    myQuizzes() {
      return this.allQuizzes.filter(item => item.userCreate === this.currentUser)
    },
    lastQuiz() {
      // Retorna o último quiz do usuário, baseado no ID ou data de criação
      return this.myQuizzes.length ? this.myQuizzes[this.myQuizzes.length - 1] : null
    },
    myOtherQuizzes() {
      // Retorna todos os quizzes do usuário exceto o último
      return this.myQuizzes.length > 1
        ? this.myQuizzes.slice(0, this.myQuizzes.length - 1)
        : []
    },
    otherUsersQuizzes() {
      // Retorna quizzes de outros usuários
      return this.allQuizzes.filter(item => item.userCreate !== this.currentUser)
    }
  },
  async mounted() {
    this.loadQuizzes()
  },
  methods: {
    async loadQuizzes() {
      await this.quizStore.getQuizzes()
    },
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
        questions: this.questions.slice(0, this.questionsCount),
        userCreate: this.currentUser
      };

      this.quizStore.saveQuiz(quiz)

      // Reiniciar o formulário após salvar
      this.resetForm();
      this.loadQuizzes()
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
    },
    sumQuizPoints(quiz) {
      // Calcula a soma dos pontos de todas as questões do quiz
      return quiz.questions.reduce((sum, question) => sum + (question.points || DEFAULT_QUESTION_POINTS), 0)
    },
    viewQuiz(quiz) {
      this.selectedQuiz = quiz
      // Aqui você pode implementar a navegação para a tela de detalhes do quiz
      console.log("Visualizando quiz:", quiz)
    },
    playQuiz(quiz) {
      // Aqui você pode implementar a navegação para a tela de jogar o quiz
      console.log("Jogando quiz:", quiz)
    },
    editQuiz(quiz) {
      // Implementar a lógica para editar
    }
  }
};
</script>

<style scoped>
.quiz-card {
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid #eaeaea;
}

.quiz-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.last-quiz .quiz-card {
  border-left: 4px solid #4CAF50;
}

.quizzes-section h3 {
  border-bottom: 2px solid #f1f1f1;
  padding-bottom: 10px;
  margin-bottom: 20px;
}
</style>