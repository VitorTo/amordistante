<template>
  <!-- SKELETON -->
  <div v-if="isLoadingProfileInfos" class="profile">
  </div>
  <div v-else class="profile">
    <!-- Header -->
    <div class="profile-header" :style="{ backgroundImage: `url(${cover})` }">
      <div class="profile-avatar">
        <img :src="avatar" alt="Avatar" />
      </div>
    </div>

    <div class="page-content">
      <!-- User Info -->
      <UserInfo
        :users="users"
        :milestoneDate="milestoneDate"
      />

      <!-- ACTIONS -->
      <CardActions />

      <!-- TIMELINE -->
      <Timeline :timeline="timeline" />
    </div>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/user';
import Timeline from '@/components/Timeline.vue';
import UserInfo from '@/components/UserInfo.vue';
import CardActions from '@/components/CardActions.vue';

export default {
  name: "ProfileView",
  components: { Timeline, UserInfo, CardActions },
  setup() {
    const userStore = useUserStore();
    return {
      userStore
    };
  },
  async mounted() {
    await this.userStore.getProfile(1);
    this.loadInfos();
  },
  data() {
    return {
      cover: "",
      avatar: "",
      milestoneDate: "",
      milestoneText: "",
    };
  },
  computed: {
    isLoadingProfileInfos() {
      return this.userStore.isLoadingProfileInfos
    },
    users() {
      const { users } = this.userStore.profileInfos
      return users || {}
    },
    timeline() {
      const { timeline } = this.userStore.profileInfos
      return Array.isArray(timeline) ? timeline : []
    },
  },
  methods:{
    loadInfos() {
      const { cover, avatar, milestoneDate, milestoneText } = this.userStore.profileInfos;
      this.cover = cover
      this.avatar = avatar
      this.milestoneDate = milestoneDate
      this.milestoneText = milestoneText
    }
  }
};
</script>

<style scoped>
.profile {
  font-family: Arial, sans-serif;
}

.profile-header {
  height: var(--avatar-profile-size);
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  position: relative;
}

.profile-avatar {
  position: absolute;
  bottom: -40px;
  width: var(--avatar-profile-size);
  height: var(--avatar-profile-size);
}

.profile-avatar img {
  width: 100%;
  height: var(--avatar-profile-size);
  object-fit: cover;
  border-radius: 50%;
  border: .25rem solid var(--white-color);
}
</style>
