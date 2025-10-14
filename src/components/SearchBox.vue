<template>
  <div class="search-box">
    <el-input
      v-model="keyword"
      :placeholder="placeholder"
      :size="size"
      @input="handleInput"
      @keyup.enter="handleSearch"
    >
      <template #prepend>
        <el-button :icon="Search" @click="handleSearch" />
      </template>
      <template #append v-if="keyword">
        <el-button :icon="Close" @click="clearSearch" />
      </template>
    </el-input>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Search, Close } from '@element-plus/icons-vue'
import { debounce } from '@/utils/debounce'

interface Props {
  modelValue?: string
  placeholder?: string
  size?: 'large' | 'default' | 'small'
  debounceTime?: number
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '搜索...',
  size: 'default',
  debounceTime: 300
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  search: [value: string]
  clear: []
}>()

const keyword = ref(props.modelValue || '')

const handleInput = debounce(() => {
  emit('update:modelValue', keyword.value)
}, props.debounceTime)

const handleSearch = () => {
  if (keyword.value.trim()) {
    emit('search', keyword.value.trim())
  }
}

const clearSearch = () => {
  keyword.value = ''
  emit('update:modelValue', '')
  emit('clear')
}

watch(() => props.modelValue, (newValue) => {
  if (newValue !== keyword.value) {
    keyword.value = newValue || ''
  }
})
</script>

<style scoped>
.search-box {
  display: inline-block;
}
</style>