<template>
  <el-badge value="Premium" class="item btn-plus-premium">
    <slot></slot>
  </el-badge>
</template>

<script>
import { ElBadge } from 'element-plus';
export default {
  components: { ElBadge }
}
</script>