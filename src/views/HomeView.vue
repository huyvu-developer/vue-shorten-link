<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import LDefault from '@/layouts/LDefault.vue'

const auth = useAuthStore()

const urlInput = ref('')
const autoPaste = ref(true)

// Sample data for the table
const urlHistory = ref([
  {
    id: 1,
    shortLink: 'https://linkly.com/Bn41aCOlnxj',
    originalLink: 'https://www.twitter.com/tweets/8erelCoihu/',
    qrCode: 'QR',
    clicks: 1313,
    status: 'Active',
    date: 'Oct - 10 -2023',
  },
  {
    id: 2,
    shortLink: 'https://linkly.com/Bn41aCOlnxj',
    originalLink: 'https://www.youtube.com/watch?v=8J7ZmH0lXuk',
    qrCode: 'QR',
    clicks: 4313,
    status: 'Inactive',
    date: 'Oct - 08 -2023',
  },
  {
    id: 3,
    shortLink: 'https://linkly.com/Bn41aCOlnxj',
    originalLink: 'https://www.adventuresinwanderlust.com/',
    qrCode: 'QR',
    clicks: 1013,
    status: 'Active',
    date: 'Oct - 01 -2023',
  },
  {
    id: 4,
    shortLink: 'https://linkly.com/Bn41aCOlnxj',
    originalLink: 'https://vimeo.com/625257654',
    qrCode: 'QR',
    clicks: 1313,
    status: 'Active',
    date: 'Sep - 20 -2023',
  },
  {
    id: 5,
    shortLink: 'https://linkly.com/Bn41aCOlnxj',
    originalLink: 'https://unsplash.com/photos/2KjNwOzFfVQ',
    qrCode: 'QR',
    clicks: 1423,
    status: 'Active',
    date: 'Sep - 18 -2023',
  },
  {
    id: 6,
    shortLink: 'https://linkly.com/Bn41aCOlnxj',
    originalLink: 'https://www.travelwithth...',
    qrCode: 'QR',
    clicks: 3213,
    status: 'Inactive',
    date: 'Sep - 01 -2023',
  },
])

onMounted(() => {
  auth.initAuth()
})

const shortenUrl = () => {
  // TODO: Implement URL shortening logic
  console.log('Shortening URL:', urlInput.value)
}
</script>

<template>
  <LDefault>
    <main class="min-h-screen relative overflow-hidden pt-20 bg-primary">
      <!-- Hero Section -->
      <section class="relative z-10 py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div class="max-w-4xl mx-auto text-center">
          <h1
            class="text-5xl sm:text-6xl md:text-7xl font-bold mb-4 leading-tight text-text-primary"
          >
            Shorten Your Loooong
          </h1>
          <h2
            class="text-5xl sm:text-6xl md:text-7xl font-bold bg-clip-text text-transparent mb-8 leading-tight bg-gradient-to-r from-brand-blue to-brand-cyan"
          >
            Links :)
          </h2>
          <p class="text-xl mb-12 max-w-2xl mx-auto leading-relaxed text-text-secondary">
            Linkly is an efficient and easy-to-use URL shortening service that streamlines your
            online experience.
          </p>

          <!-- URL Shortener -->
          <div class="rounded-2xl p-8 mb-8 shadow-2xl bg-secondary border-border-primary">
            <div class="flex flex-col sm:flex-row gap-4">
              <div class="flex-1 relative">
                <div class="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <Input
                  v-model="urlInput"
                  :placeholder="$t('shortener.inputPlaceholder')"
                  class="w-full pl-12 pr-4 py-5 bg-transparent border-none outline-none text-lg rounded-lg focus:ring-2 focus:ring-brand-blue focus:ring-opacity-50 text-text-primary placeholder-text-secondary"
                />
              </div>
              <Button
                @click="shortenUrl"
                class="bg-gradient-to-r from-brand-blue to-brand-cyan hover:from-brand-blue/90 hover:to-brand-cyan/90 px-10 py-5 text-lg font-semibold w-full sm:w-auto rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-text-primary"
              >
                Shorten Now!
              </Button>
            </div>

            <!-- Auto Paste Option -->
            <div
              class="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-6 pt-6 border-t gap-4 border-border-primary"
            >
              <div class="flex items-center gap-3">
                <Switch v-model="autoPaste" />
                <span class="text-base font-medium text-text-secondary">
                  Auto Paste from Clipboard
                </span>
              </div>

              <div class="flex items-center gap-4">
                <p class="text-sm text-text-secondary">
                  You can create
                  <span class="font-semibold text-brand-blue">05</span> more links.
                  <span
                    class="underline cursor-pointer hover:text-brand-cyan transition-colors text-brand-blue"
                  >
                    Register Now
                  </span>
                  to enjoy Unlimited usage
                </p>
                <div
                  class="w-6 h-6 cursor-pointer flex-shrink-0 transition-colors text-text-secondary hover:text-brand-blue"
                >
                  <svg class="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- URL History Table -->
      <section class="relative z-10 py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
        <div class="w-full max-w-7xl">
          <div
            class="rounded-2xl overflow-hidden shadow-2xl bg-secondary border border-border-primary"
          >
            <!-- Table Header -->
            <div class="px-6 py-4 border-b border-border-primary bg-secondary">
              <h3 class="text-xl font-semibold text-text-primary">Your Recent Links</h3>
            </div>

            <!-- Table -->
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-accent">
                  <tr>
                    <th
                      class="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider text-text-secondary"
                    >
                      Short Link
                    </th>
                    <th
                      class="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider text-text-secondary"
                    >
                      Original Link
                    </th>
                    <th
                      class="px-6 py-4 text-center text-sm font-medium uppercase tracking-wider text-text-secondary"
                    >
                      QR Code
                    </th>
                    <th
                      class="px-6 py-4 text-center text-sm font-medium uppercase tracking-wider text-text-secondary"
                    >
                      Clicks
                    </th>
                    <th
                      class="px-6 py-4 text-center text-sm font-medium uppercase tracking-wider text-text-secondary"
                    >
                      Status
                    </th>
                    <th
                      class="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider text-text-secondary"
                    >
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y bg-secondary border-border-primary">
                  <tr
                    v-for="item in urlHistory"
                    :key="item.id"
                    class="transition-colors hover:bg-accent"
                  >
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center justify-between">
                        <span class="text-sm truncate max-w-[200px] text-text-primary">
                          {{ item.shortLink }}
                        </span>
                        <button
                          class="transition-colors flex-shrink-0 ml-2 text-brand-blue hover:text-text-primary"
                        >
                          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                            <path
                              d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM14 7a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <span class="text-sm truncate max-w-[300px] block text-text-secondary">
                        {{ item.originalLink }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-center">
                      <div class="text-sm text-text-secondary">QR</div>
                    </td>
                    <td class="px-6 py-4 text-center">
                      <span class="text-sm text-text-primary">
                        {{ item.clicks.toLocaleString() }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-center">
                      <div class="flex items-center justify-center gap-2">
                        <span
                          class="text-sm"
                          :class="item.status === 'Active' ? 'text-success' : 'text-error'"
                        >
                          {{ item.status }}
                        </span>
                        <svg
                          :class="item.status === 'Active' ? 'text-success' : 'text-error'"
                          class="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            v-if="item.status === 'Active'"
                            fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clip-rule="evenodd"
                          />
                          <path
                            v-else
                            fill-rule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <span class="text-sm text-text-secondary">{{ item.date }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Table Footer -->
            <div class="px-6 py-4 border-t border-border-primary bg-secondary">
              <p class="text-sm text-center text-text-secondary">
                Register NOW to enjoy Unlimited History
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  </LDefault>
</template>
