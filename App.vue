<script setup lang="ts">
import { useSiteConfig } from 'valaxy'
import { nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ImageGalleryViewer from './components/ImageGalleryViewer.vue'
import { applyCodeBlockFold, initCodeBlockFold } from './utils/collapseCode'
import { initImageGallery } from './utils/imageGallery'
import { isHomePaginationPath, scheduleScrollToPostList } from './utils/homePagination'
import { useSakuraAppStore } from './node_modules/valaxy-theme-sakura/stores/app.ts'

const route = useRoute()
const router = useRouter()
const siteConfig = useSiteConfig()
const sakura = useSakuraAppStore()

function setupCodeBlockFold() {
  const limit = siteConfig.value.codeHeightLimit
  if (typeof limit === 'number' && limit > 0)
    initCodeBlockFold(limit)
}

router.afterEach((to, from) => {
  if (to.hash)
    return

  if (
    isHomePaginationPath(to.path)
    && from.path
    && isHomePaginationPath(from.path)
    && to.path !== from.path
  ) {
    nextTick(() => {
      scheduleScrollToPostList((top) => {
        sakura.setScrollPosition(to.path, top)
      })
    })
  }
})

initImageGallery()
setupCodeBlockFold()

watch(() => route.path, () => {
  nextTick(() => applyCodeBlockFold())
})
</script>

<template>
  <ImageGalleryViewer />
</template>
