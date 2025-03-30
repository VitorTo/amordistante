<template>
  <div class="revisao-container">
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
      <button class="btn btn-secondary" @click="backLastQuestion">
        <i class="fas fa-arrow-left"></i>
        Voltar
      </button>
      <button class="btn btn-success" @click="saveQuiz">
        Salvar Quiz
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    quizTitle: {
      type: String,
      required: true
    },
    questionsCount: {
      type: Number,
      required: true
    },
    questions: {
      type: Array,
      required: true
    }
  },
  methods: {
    backLastQuestion() {
      this.$emit('back-last-question');
    },
    saveQuiz() {
      this.$emit('save-quiz');
    }
  }
}
</script>