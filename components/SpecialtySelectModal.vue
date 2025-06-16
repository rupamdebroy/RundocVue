<template>
  <Transition name="modal-fade">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        @click="closeModal"
      ></div>

      <div
        class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col transform transition-all duration-300 scale-95 opacity-0"
        :class="{ 'scale-100 opacity-100': show }"
        @click.stop
      >
        <div
          class="p-6 border-b border-gray-200 flex items-center justify-between"
        >
          <h3 class="text-xl font-semibold text-gray-800 flex items-center">
            <i class="fas fa-microscope mr-3 text-blue-600"></i> Select a
            Specialty
          </h3>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <div class="p-4 border-b border-gray-100">
          <div class="relative">
            <input
              type="text"
              v-model="searchText"
              placeholder="Search specialties..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <i class="fas fa-search text-gray-400"></i>
            </div>
          </div>
        </div>

        <div class="flex-grow overflow-y-auto custom-scrollbar p-6">
          <ul class="space-y-3">
            <li>
              <button
                @click="selectAndClose('')"
                :class="{
                  'bg-blue-500 text-white shadow-md hover:bg-blue-600':
                    !currentSelection,
                  'bg-gray-100 text-gray-800 hover:bg-gray-200':
                    currentSelection,
                }"
                class="w-full text-left px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-between"
              >
                <span>All Specialties</span>
                <i
                  v-if="!currentSelection"
                  class="fas fa-check-circle text-white"
                ></i>
              </button>
            </li>
            <li v-for="specialty in filteredSpecialties" :key="specialty">
              <button
                @click="selectAndClose(specialty)"
                :class="{
                  'bg-blue-500 text-white shadow-md hover:bg-blue-600':
                    currentSelection === specialty,
                  'bg-gray-100 text-gray-800 hover:bg-gray-200':
                    currentSelection !== specialty,
                }"
                class="w-full text-left px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-between"
              >
                <span>{{ specialty }}</span>
                <i
                  v-if="currentSelection === specialty"
                  class="fas fa-check-circle text-white"
                ></i>
              </button>
            </li>
            <li v-if="filteredSpecialties.length === 0 && searchText">
              <p class="text-center text-gray-500 py-4">
                No specialties found for "{{ searchText }}"
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  specialties: {
    type: Array,
    default: () => [],
  },
  currentSelection: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:show", "selectSpecialty"]);

const searchText = ref("");

const filteredSpecialties = computed(() => {
  if (!searchText.value) {
    return props.specialties;
  }
  const lowerSearch = searchText.value.toLowerCase();
  return props.specialties.filter((s) => s.toLowerCase().includes(lowerSearch));
});

const closeModal = () => {
  emit("update:show", false);
  searchText.value = ""; // Reset search on close
};

const selectAndClose = (specialty) => {
  emit("selectSpecialty", specialty);
  closeModal();
};

// Add a watch to prevent modal content from rendering while it's hidden (performance)
watch(
  () => props.show,
  (newValue) => {
    if (!newValue) {
      searchText.value = ""; // Ensure search is cleared when modal is hidden
    }
  }
);
</script>

<style scoped>
/* Custom scrollbar for the modal content */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1; /* gray-300 */
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #a0aec0; /* gray-400 */
}

/* Modal transition styles */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Specific styling for the modal content during transition */
.modal-fade-enter-active .relative,
.modal-fade-leave-active .relative {
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55); /* Bounce effect */
}

.modal-fade-enter-from .relative,
.modal-fade-leave-to .relative {
  transform: scale(0.95);
  opacity: 0;
}
</style>
