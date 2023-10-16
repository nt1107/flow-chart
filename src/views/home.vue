<template>
  <div class="home">
    <el-row>
      <el-col :span="6">
        <el-button type="primary" @click="router.push('/lineGraph')">
          lineGraph
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
// import { ref } from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<style scoped></style>
