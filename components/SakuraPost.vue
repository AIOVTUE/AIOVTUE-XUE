<script lang="ts" setup>
import type { Article } from '@unhead/schema-org'
import { defineArticle, useSchemaOrg } from '@unhead/schema-org/vue'
import { formatDate, useFrontmatter, useFullUrl, useSiteConfig } from 'valaxy'
import { computed } from 'vue'

const siteConfig = useSiteConfig()
const frontmatter = useFrontmatter()
const url = useFullUrl()

const showSponsor = computed(() => {
  if (typeof frontmatter.value.sponsor === 'boolean')
    return frontmatter.value.sponsor

  return siteConfig.value.sponsor.enable
})

const article: Article = {
  '@type': 'BlogPosting',
  'headline': frontmatter.value.title,
  'description': frontmatter.value.description,
  'author': [
    {
      name: siteConfig.value.author.name,
      url: siteConfig.value.author.link,
    },
  ],
  'datePublished': formatDate(frontmatter.value.date || 0),
  'dateModified': formatDate(frontmatter.value.updated || 0),
  'image': frontmatter.value.image || frontmatter.value.cover,
}

useSchemaOrg(
  defineArticle(article),
)
</script>

<template>
  <SakuraPage class="sakura-post">
    <template #header>
      <SakuraPostHeader :fm="frontmatter" />
    </template>

    <template v-if="$slots.left" #left>
      <slot name="left" />
    </template>
    <template #content>
      <slot name="content">
        <RouterView v-slot="{ Component }">
          <component :is="Component">
            <template #main-content-after>
              <SakuraSponsor v-if="showSponsor" />
              <ValaxyCopyright v-if="frontmatter.copyright || siteConfig.license.enabled" :url="url" />
            </template>

            <template #main-nav-after>
              <div class="sakura-post-nav-before-comment">
                <SakuraPostNav />
              </div>
            </template>

            <template #footer>
              <SakuraPostFooter />
            </template>
          </component>
        </RouterView>
      </slot>
    </template>
    <template #right>
      <slot name="right">
        <SakuraAside>
          <SakuraToc />
        </SakuraAside>
      </slot>
    </template>
  </SakuraPage>
</template>

<style lang="scss">
.sakura-post {
  .sakura-page-content {
    box-sizing: border-box;
    width: 100%;
    max-width: 800px;
    margin-inline: auto;
    padding-block: 24px;
  }

  /* 流体布局：随窗口平滑变化，避免 md/lg 断点处左右宽度突变 */
  .sakura-triple-columns {
    --post-content-max: 800px;
    --post-toc-width: clamp(140px, 16vw, 220px);

    box-sizing: border-box;
    width: 100%;
    margin-inline: auto;
    justify-content: center;
    grid-template-columns:
      minmax(0, min(var(--post-content-max), calc(100vw - var(--post-toc-width) - 64px)))
      minmax(0, var(--post-toc-width)) !important;
    gap: 0 clamp(8px, 1.2vw, 20px);

    > aside:first-child {
      display: none;
    }

    > div {
      grid-column: 1;
      min-width: 0;
    }

    > aside:last-child {
      grid-column: 2;
      min-width: 0;
    }

    @media (max-width: 767px) {
      --post-toc-width: 0px;

      grid-template-columns: minmax(0, 1fr) !important;
      gap: 0;

      > aside:last-child {
        display: none;
      }
    }
  }

  .sakura-post-nav-before-comment {
    width: 100%;
    margin-bottom: 24px;
  }

  .sakura-post-nav-before-comment .sakura-post-nav .card-prev {
    margin-top: 0;
  }

  .sakura-post .sakura-comment {
    margin-top: 0 !important;
  }

  /* 文章头图遮罩：仅文章页，提升标题与元信息可读性 */
  .sakura-post-header.sakura-page-header.has-cover {
    overflow: hidden;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      background: linear-gradient(
        180deg,
        rgb(0 0 0 / 25%) 0%,
        rgb(0 0 0 / 12%) 38%,
        rgb(0 0 0 / 50%) 72%,
        rgb(0 0 0 / 80%) 100%
      );
    }

    .sakura-header-container {
      position: relative;
      z-index: 1;
    }

    .sakura-post-header-meta {
      justify-content: center;
      text-align: center;
    }

    .sakura-post-header-meta .sakura-post-tags,
    .sakura-post-header-meta__tags {
      justify-content: center;
    }

    .sakura-header-title,
    .sakura-post-header-meta {
      text-shadow: 0 1px 10px rgb(0 0 0 / 60%);
    }

    .sakura-post-header-meta__tags a {
      text-shadow: none;
    }
  }
}
</style>
