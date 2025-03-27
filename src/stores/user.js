import $http from "@/http";
import { formatMonthDayYear } from "@/utils/index.js";
import { defineStore } from "pinia";

export const useUserStore = defineStore("userStore", {
  state: () => ({
    profileInfos: {},
    isLoadingProfileInfos: true,
    cover: "",
    avatar: "",
    users: [],
    milestoneDate: "",
    milestoneText: "",
    timeline: [],
  }),
  actions: {
    async getProfile(id) {
        try {
            this.isLoadingProfileInfos = true
            const res = await $http.get(`/profile/${id}`);
            setTimeout(() => {}, 5000)

            if(res.data) {
                const profile = res.data;
                this.profileInfos = profile
                this.profileInfos.milestoneText = formatMonthDayYear(profile.milestoneDate);
                this.getUsersProfileId(id);
                this.getTimelineProfileId(id);
            }
        } catch (e) {
            console.error(e);
        } finally {
          this.isLoadingProfileInfos = false
        }
    },
    async getUsersProfileId(profileId) {
        try {
            const res = await $http.get(`/users?profileId=${profileId}`);
            if(res.data) {
                this.profileInfos.users = res.data.map((user) => {
                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                    };
                });
            }
        } catch (e) {
            console.error(e);
        }
    },
    async getTimelineProfileId(profileId) {
        try {
            const res = await $http.get(`/timeline?profileId=${profileId}`);
            if(res.data) {
                this.profileInfos.timeline = res.data.map((item) => {
                    return {
                        title: item.title,
                        date: item.date,
                        image: item.image,
                        notes: item.notes
                    };
                });
            }
        } catch (e) {
            console.error(e);
        }
    },
    async getUserById(id) {
        try {
            const res = await $http.get(`/users/${id}`);
            console.log('getUserById', res);
            return res.data;
        } catch (e) {
            console.error(e);
        }
    },
  },
  mutations: {
    addNewUser(user) {
      this.users.push(user);
    },
    updateUser(id, user) {
      const auxUser = this.getUserById(id);
      auxUser.name = user.name;
      auxUser.email = user.email;
      this.users = this.users.map((u) => (u.id === id ? auxUser : u));
    },
  },
});
