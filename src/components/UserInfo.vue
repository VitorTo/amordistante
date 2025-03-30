<template>
  <div>
    <div class="profile-info">
      <span class="heart">💖</span>
      <div v-for="(user, index) in users" :key="user.id"
        :class="['user-details', index == 0 ? 'text-left' : 'text-right']">
        <p class="px-2">{{ user.name }}</p>
      </div>
    </div>
    <p class="text-center mb-0 text-primary fw-bold">{{ formatDate(milestoneDate) }}</p>
    <p class="text-center fw-bold">{{ formatMonthDayYear(milestoneDate) }}</p>
  </div>
</template>

<script>
import { formatDate, formatMonthDayYear, getMonth, getYear } from '@/utils/index.js';
export default {
  props: {
    users: Array,
    milestoneDate: String
  },
  setup() {
    return {
      formatMonthDayYear,
      formatDate,
      getMonth,
      getYear
    }
  }
}
</script>

<style scoped>
.profile-info > .heart {
  position: absolute;
  font-size: 16pt;
  margin-left: -8px;
}

.profile-info {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: nowrap;
  justify-content: space-around;
  margin-top: 3rem;
  margin-bottom: 0.5rem;
  position: relative;
}

.profile-info .text-left {
  text-align: left;
}
.profile-info .text-right {
  text-align: right;
}

.profile-info .user-details,
.profile-info .user-details p {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.profile-info .user-details p {
  margin: 0;
  font-weight: bold;
}
</style>