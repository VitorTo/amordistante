<template>
  <div
    v-if="timeline"
    class="profile-timeline"
  >
    <!-- Timeline -->
    <h3 class="mb-2">Linha do tempo</h3>
    <el-timeline>
      <!-- :timestamp="formatDate(event.date)" -->
      <el-timeline-item
        v-for="(event, index) in timelineOrder"
        :key="index"
        center
        :color="getColorPrimary()"
        placement="top"
      >
        <div class="event pt-3">
          <div class="card p-2">
            <div class="d-flex flex-wrap align-items-end">
              <h4 class="title-text col">
                {{ event.title }}
              </h4>
              <div class="row col-4 text-end">
                <small>
                  <small style="font-size: 9px;">{{ formatDate(event.date) }}</small>
                  {{ getMonth(event.date) }}
                </small>
                <span class="title-year">
                  {{ getYear(event.date) }}
                </span>
              </div>
            </div>
            <div>
              <img class="image" v-if="event.image" :src="event.image" alt="Timeline Event" />
            </div>
          </div>
          <div v-if="isExistNotes(event.notes)" class="notes mb-3">
            <div v-for="(item, index) in event.notes" :key="index" class="notes-content">
              {{ item.text }}
            </div>
            <small class="notes-info text-uppercase">anotações</small>
          </div>
        </div>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import { formatDate, getMonth, getYear, getColorPrimary } from '@/utils/index.js';
import { ElTimeline, ElTimelineItem } from 'element-plus';

export default {
  name: "TimelineComponent",
  components: { ElTimeline, ElTimelineItem },
  props: {
    timeline: {
      type: Array,
      default: () => []
    }
  },
  setup() {
    return {
      formatDate,
      getMonth,
      getYear,
      getColorPrimary
    }
  },
  computed: {
    timelineOrder() {
      // ordenar do mais antigo para o mais recente
      if (!this.timeline || !Array.isArray(this.timeline)) {
        return [];
      }
      return [...this.timeline].sort((a, b) => new Date(a.date) + new Date(b.date));
    }
  },
  methods: {
    isExistNotes(notes) {
      const existNotes = notes && notes.length > 0
      const textValid = notes?.some(item => item?.text?.trim().length > 0)
      return existNotes && textValid
    },
  }
}
</script>

<style>
.profile-timeline {
  margin: 20px;
}

.event .title-year {
  color: var(--primary-color);
  font-size: 24px;
  font-weight: 700;
  line-height: 20px;
}
.event .title-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.event .image {
  width: 100%;
  margin-top: .5rem;
  border-end-start-radius: var(--border-radius);
  border-end-end-radius: var(--border-radius);
  max-height: 300px;
  object-fit: cover;
}

.event .notes {
  position: relative;
  width: 90%;
  display: flex;
  justify-content: center;
  margin: 0 auto;
  padding: 0.5rem 1rem;
  background-color: var(--white-color);
  border-end-end-radius: var(--border-radius);
  border-end-start-radius: var(--border-radius);
  filter: drop-shadow(1px 3px 4px #e3e3e3);
}

.event .notes-info {
  position: absolute;
  width: 7.5rem;
  color:#a6a6a6;
  font-size: 12px;
  display: flex;
  justify-content: center;
  background-color: var(--white-color);
  border-end-end-radius: var(--border-radius);
  border-end-start-radius: var(--border-radius);
  padding: 0.1rem 1rem;
  bottom: -1.2rem;
}
</style>