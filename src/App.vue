<script>
export default {
  data() {
    return {
      items: [
        // {
        //   name: "Mais",
        //   icon: "fas fa-bars",
        //   path: "/more"
        // },
        {
          name: "Quizzes",
          icon: "fas fa-clipboard-question",
          path: "/quizzes"
        },
        {
          name: "Inicio",
          icon: "fas fa-house",
          path: "/",
          active: true,
        },
        // {
        //   name: "Sobre",
        //   icon: "fas fa-info-circle",
        //   path: "/more"
        // },
        {
          name: "Perfil",
          icon: "fas fa-user",
          path: "/profile"
        }
      ]
    }
  },
  methods: {
    setActive(selectedItem) {
      // Desativa todos os itens
      this.items.forEach(item => {
        item.active = false
      })
      // Ativa apenas o item selecionado
      selectedItem.active = true
    }
  }
}
</script>

<template>
  <header class="nav-menu">
      <nav class="d-flex gap-3">
        <RouterLink
          v-for="(item, index) in items"
          :key="index"
          class="item-menu"
          :class="item.active ? 'active' : ''"
          :to="item.path"
          @click="setActive(item)"
        >
          <i :class="item.icon"></i>
          <span>{{ item.name }}</span>
        </RouterLink>
      </nav>
  </header>
  <main class="main-content" >
    <RouterView />
  </main>
</template>

<style scoped>

.nav-menu {
  position: fixed;
  z-index: 1;
  width: 100%;
}

/*
DESKTOP
@media screen and (min-width: 1024px) {
  .nav-menu {
    position: fixed;
    z-index: 1;
    width: 100%;
  }
  .nav-menu {
    background-color: blue;
    top:0;
  }
} */

/* MOBILE */
@media screen and (max-width: 768px) {
  .main-content {
    padding-bottom: 4rem;
  }
  .nav-menu {
    display: flex;
    flex-direction: row;
    justify-content: center;
    bottom:0;
    padding: .8rem 0rem;
    border-radius: 1.8rem;
    border-end-start-radius: 0rem;
    border-end-end-radius: 0rem;
    background-color: var(--primary-color);
  }
  .nav-menu .item-menu {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0.8rem 1rem;
    gap: 0.5rem;

    color: var(--white-color);
    border-radius: 20rem;
  }
  .nav-menu .item-menu span {
    text-underline-position: under;
    font-size: 14px;
    display: none;
  }
  .nav-menu .item-menu.active {
    background-color: var(--white-color);
    color: var(--primary-color);
  }
  .nav-menu .item-menu.active span {
    display: block;
  }
  .nav-menu .item-menu i {
    font-size: 16pt;
  }
}
</style>
