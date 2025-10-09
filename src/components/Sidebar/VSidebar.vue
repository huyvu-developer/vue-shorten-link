<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useSidebar } from '@/composables/useSidebar'
import { APP_NAME } from '@/constants/env'
import { Icon } from '@iconify/vue'

interface MenuItem {
  icon: string
  name: string
  path: string
  subItems?: SubMenuItem[]
}

interface SubMenuItem {
  name: string
  path: string
  pro?: boolean
  new?: boolean
}

interface MenuGroup {
  title: string
  items: MenuItem[]
}

const { isExpanded, isMobileOpen, isHovered, openSubmenu } = useSidebar()
const { t } = useI18n()
const route = useRoute()

const menuGroups = computed<MenuGroup[]>(() => [
  {
    title: t('sidebar.menu'),
    items: [
      {
        icon: 'material-symbols:dashboard',
        name: t('sidebar.dashboard'),
        path: '/dashboard',
      },
      // {
      //   icon: 'material-symbols:person',
      //   name: t('sidebar.profile'),
      //   path: '/profile',
      // },
      {
        name: t('sidebar.shortLinks'),
        icon: 'material-symbols:link',
        path: '/dashboard/short-links',
      },
      // {
      //   name: t('sidebar.analytics'),
      //   icon: 'material-symbols:analytics',
      //   path: '/analytics',
      // },
      // {
      //   name: t('sidebar.settings'),
      //   icon: 'material-symbols:settings',
      //   path: '/settings',
      // },
    ],
  },
])

// Determine if a given menu path matches the current location
const isActive = (path: string) => {
  try {
    const currentPath = route.path.split('?')[0]

    // Exact match
    if (currentPath === path) {
      return true
    }

    // For dashboard, only match exact path to avoid conflicts with sub-routes
    if (path === '/dashboard') {
      return currentPath === '/dashboard'
    }

    // Check if current path starts with target path (for detail routes)
    // Only match if target path is not just "/" and current path is longer
    if (path !== '/' && currentPath.startsWith(path + '/')) {
      return true
    }

    return false
  } catch (error) {
    console.error(error)
    return false
  }
}

const toggleSubmenu = (groupIndex: number, itemIndex: number) => {
  const key = `${groupIndex}-${itemIndex}`
  openSubmenu.value = openSubmenu.value === key ? null : key
}

const isAnySubmenuRouteActive = computed(() => {
  return menuGroups.value.some((group) =>
    group.items.some(
      (item) => item.subItems && item.subItems.some((subItem) => isActive(subItem.path)),
    ),
  )
})

const isSubmenuOpen = (groupIndex: number, itemIndex: number) => {
  const key = `${groupIndex}-${itemIndex}`
  return (
    openSubmenu.value === key ||
    (isAnySubmenuRouteActive.value &&
      menuGroups.value[groupIndex].items[itemIndex].subItems?.some((subItem) =>
        isActive(subItem.path),
      ))
  )
}

const startTransition = (el: Element) => {
  const element = el as HTMLElement
  element.style.height = 'auto'
  const height = element.scrollHeight
  element.style.height = '0px'
  void element.offsetHeight // force reflow
  element.style.height = height + 'px'
}

const endTransition = (el: Element) => {
  const element = el as HTMLElement
  element.style.height = ''
}
</script>

<template>
  <aside
    :class="[
      'fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-primary border-border-primary text-text-primary h-screen transition-all duration-300 ease-in-out z-50 border-r',
      {
        'lg:w-[290px]': isExpanded || isMobileOpen || isHovered,
        'lg:w-[90px]': !isExpanded && !isHovered,
        'translate-x-0 w-[290px]': isMobileOpen,
        '-translate-x-full': !isMobileOpen,
        'lg:translate-x-0': true,
      },
    ]"
    @mouseenter="!isExpanded && (isHovered = true)"
    @mouseleave="isHovered = false"
  >
    <div :class="['py-3 flex', !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start']">
      <router-link to="/" class="flex items-center">
        <h1
          v-if="isExpanded || isHovered || isMobileOpen"
          class="text-3xl py-5 font-bold transition-colors duration-300 bg-clip-text text-transparent bg-gradient-to-r from-text-primary to-brand-blue"
        >
          {{ APP_NAME }}
        </h1>
        <div
          v-else
          class="w-8 h-8 bg-gradient-to-r from-brand-blue to-brand-cyan rounded-lg flex items-center justify-center text-white font-bold text-lg"
        >
          {{ APP_NAME.charAt(0) }}
        </div>
      </router-link>
    </div>
    <div
      :class="[
        'flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar text-text-primary',
        !isExpanded && !isHovered ? 'lg:px-1' : 'px-2',
      ]"
    >
      <nav class="mb-6">
        <div class="flex flex-col gap-2">
          <div v-for="(menuGroup, groupIndex) in menuGroups" :key="groupIndex">
            <h2
              :class="[
                'mb-3 text-xs uppercase flex leading-[20px] text-text-secondary font-bold tracking-wider',
                !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start',
              ]"
            >
              <template v-if="isExpanded || isHovered || isMobileOpen">
                {{ menuGroup.title }}
              </template>
              <div v-else class="w-1 h-1 bg-text-secondary rounded-full"></div>
            </h2>
            <ul class="flex flex-col gap-2">
              <li v-for="(item, index) in menuGroup.items" :key="item.name">
                <button
                  v-if="item.subItems"
                  :class="[
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-md min-h-[48px] group w-full',
                    {
                      'bg-gradient-to-r from-brand-blue to-brand-cyan text-white shadow-xl transform scale-[1.02]':
                        isSubmenuOpen(groupIndex, index),
                      'text-text-secondary hover:bg-secondary hover:text-text-primary hover:shadow-sm':
                        !isSubmenuOpen(groupIndex, index),
                    },
                    !isExpanded && !isHovered ? 'lg:justify-center lg:px-2' : 'lg:justify-start',
                  ]"
                  @click="toggleSubmenu(groupIndex, index)"
                >
                  <span
                    :class="[
                      'w-5 h-5 flex-shrink-0 flex items-center justify-center min-w-[20px] min-h-[20px]',
                      isSubmenuOpen(groupIndex, index)
                        ? 'text-white drop-shadow-sm'
                        : 'text-text-secondary',
                    ]"
                  >
                    <Icon :icon="item.icon" class="w-5 h-5" />
                  </span>
                  <span
                    v-if="isExpanded || isHovered || isMobileOpen"
                    class="flex-1 text-left font-semibold text-base leading-tight whitespace-nowrap overflow-hidden transition-all duration-300"
                    >{{ item.name }}</span
                  >
                  <Icon
                    v-if="isExpanded || isHovered || isMobileOpen"
                    :class="[
                      'ml-auto w-5 h-5 transition-transform duration-200 flex-shrink-0',
                      {
                        'rotate-180 text-brand-500': isSubmenuOpen(groupIndex, index),
                      },
                    ]"
                    icon="material-symbols:keyboard-arrow-down"
                  />
                </button>
                <router-link
                  v-else-if="item.path"
                  :to="item.path"
                  :class="[
                    'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-md group',
                    {
                      'bg-[color-mix(in_oklab,#465fff_12%,transparent)] text-[#7592ff] transform scale-[1.02]':
                        isActive(item.path),
                      'text-text-secondary hover:bg-secondary hover:text-text-primary hover:shadow-sm':
                        !isActive(item.path),
                    },
                    !isExpanded && !isHovered ? 'lg:justify-center lg:px-2' : 'lg:justify-start',
                  ]"
                >
                  <span
                    :class="[
                      'w-4 h-4 flex-shrink-0 flex items-center justify-center',
                      isActive(item.path) ? 'text-white drop-shadow-sm' : 'text-text-secondary',
                    ]"
                  >
                    <Icon :icon="item.icon" class="w-5 h-5 text-[#7592ff]" />
                  </span>
                  <span
                    v-if="isExpanded || isHovered || isMobileOpen"
                    class="flex-1 text-left font-medium text-sm transition-all duration-300 block"
                    >{{ item.name }}</span
                  >
                </router-link>
                <transition
                  @enter="startTransition"
                  @after-enter="endTransition"
                  @before-leave="startTransition"
                  @after-leave="endTransition"
                >
                  <div
                    v-show="
                      isSubmenuOpen(groupIndex, index) && (isExpanded || isHovered || isMobileOpen)
                    "
                  >
                    <ul class="mt-2 space-y-1 ml-9">
                      <li v-for="subItem in item.subItems" :key="subItem.name">
                        <router-link
                          :to="subItem.path"
                          :class="[
                            'flex items-center justify-between px-4 py-3 text-sm rounded-lg transition-all duration-300 hover:scale-[1.01] hover:shadow-sm',
                            {
                              'bg-gradient-to-r from-brand-blue to-brand-cyan text-white shadow-md':
                                isActive(subItem.path),
                              'text-text-secondary hover:bg-secondary hover:text-text-primary':
                                !isActive(subItem.path),
                            },
                          ]"
                        >
                          {{ subItem.name }}
                          <span class="flex items-center gap-1 ml-auto">
                            <span
                              v-if="(subItem as any).new"
                              :class="[
                                'px-3 py-1 text-xs rounded-full font-semibold shadow-sm',
                                {
                                  'bg-white text-brand-blue': isActive(subItem.path),
                                  'bg-secondary text-text-secondary': !isActive(subItem.path),
                                },
                              ]"
                            >
                              {{ t('badge.new') }}
                            </span>
                            <span
                              v-if="(subItem as any).pro"
                              :class="[
                                'px-3 py-1 text-xs rounded-full font-semibold shadow-sm',
                                {
                                  'bg-white text-brand-blue': isActive(subItem.path),
                                  'bg-secondary text-text-secondary': !isActive(subItem.path),
                                },
                              ]"
                            >
                              {{ t('badge.pro') }}
                            </span>
                          </span>
                        </router-link>
                      </li>
                    </ul>
                  </div>
                </transition>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  </aside>
</template>

<style scoped>
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
