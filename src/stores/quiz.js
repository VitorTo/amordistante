import $http from "@/http";
import { defineStore } from "pinia";

export const useQuizStore = defineStore("quizStore", {
  state: () => ({
    quizzes: []
  }),
  actions: {
    async getQuizzes() {
        try {

          const res = await $http.get(`/quiz`);

          setTimeout(() => {}, 5000)

          if(res.data) {
            this.quizzes = res.data
          }
        } catch (e) {
            console.error(e);
        }
    },
    async saveQuiz(quiz) {
        try {

            await $http.post(`/quiz`, quiz);
            setTimeout(() => {}, 5000)

        } catch (e) {
            console.error(e);
        }
    },
  },
  mutations: {},
});
