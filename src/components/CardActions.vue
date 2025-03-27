<template>
  <div class="content-actions ps-3">
    <div class="d-flex scrolling-wrapper">

      <div
        v-for="(item, index) in actions"
        :key="index"
        class="card p-3 bg-primary-gradient"
      >
        <div class="position-relative d-flex flex-column">
          <div class="flag-new">Novo</div>
          <div class="pt-4">
            <div class="h2 text-bold">
              {{ item.title }}
            </div>
          </div>
          <div class="w-75 card-description">
            <small class="limit-text-line-2">{{ item.description }}</small>
          </div>

          <div class="position-absolute action-icon-up">
            <i :class="`${item.icon} shadow`"></i>
          </div>

          <a class="position-absolute action-icon-down text-white" :href="item.path">
            <i class="fas fa-circle-arrow-right"></i>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      actions: [
        {
          title: "Quizz",
          icon: "fas fa-clipboard-question",
          description: "Crie e responda quizzes divertidos para testar o seu conhecimento sobre o seu parceiro e se divertir juntos.",
          path: "/quizzes"
        },
        {
          title: "Bilhetes",
          icon: "fas fa-envelope-open-text",
          description: "Deixe mensagens para o seu parceiro, mesmo quando não estiverem juntos",
          path: ""
        },
        {
          title: "Pontos",
          icon: "fas fa-clipboard-question",
          description: "Veja todos os pontos e troque por cupons do seu parceiro.",
          path: ""
        },
      ]
    }
  }

}
</script>

<style>
.scrolling-wrapper {
  display: flex;
  overflow-x: auto;
  gap: 16px;
  padding: 0.5rem 0rem;

  scrollbar-width: none;
  -ms-overflow-style: none;
}
.scrolling-wrapper::-webkit-scrollbar {
  display: none;
}

.scrolling-wrapper .card {
  flex: 0 0 auto;
  width: 200px;
}

.card-description {
  line-height: normal;
}

.action-icon-up {
  font-size: 3.5rem;
  top: -1rem;
  right: 0;
}
.action-icon-down {
  font-size: 2rem;
  bottom: -.6rem;
  right: 0rem;
}

.flag-new {
  color: var(--primary-color);
  text-transform: uppercase;
}
</style>