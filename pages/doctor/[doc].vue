<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <Header />
    <WebHeaderNav />
    <section class="flex-grow py-4 px-4 sm:px-6 lg:px-8">
      <div
        v-if="loading"
        class="flex justify-center items-center min-h-[60vh] flex-col"
      >
        <i
          class="fas fa-spinner fa-spin text-blue-600 text-5xl mb-6 animate-pulse"
        ></i>
        <p class="text-xl text-gray-700 font-medium animate-pulse">
          Fetching doctor's detailed profile...
        </p>
      </div>

      <div
        v-else-if="error"
        class="text-center text-red-600 py-16 px-4 rounded-xl bg-red-50 border border-red-200 max-w-2xl mx-auto shadow-lg"
      >
        <p class="text-2xl font-bold mb-4 flex items-center justify-center">
          <i class="fas fa-exclamation-triangle mr-3 text-red-500"></i> Oh no!
          Something went wrong.
        </p>
        <p class="text-lg text-gray-800 mb-6">{{ error }}</p>
        <button
          @click="router.back()"
          class="px-8 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300 font-semibold flex items-center justify-center mx-auto"
        >
          <i class="fas fa-arrow-left mr-2"></i> Go Back
        </button>
      </div>

      <div v-else-if="doctor" class="max-w-7xl mx-auto space-y-8 py-2">
        <!-- Doctor Profile Section (Unchanged) -->
        <div
          class="bg-white p-4 sm:p-8 rounded-3xl shadow-2xl border border-blue-100 animate-fade-in-up delay-100"
        >
          <div class="flex flex-row items-center gap-4">
            <div class="relative w-20 h-20 sm:w-56 sm:h-56 flex-shrink-0">
              <img
                src="https://placehold.co/224x224/E0F2FE/1E40AF?text=Dr.+Avatar"
                alt="Doctor Avatar"
                class="w-full h-full object-cover rounded-full border-4 border-blue-200 shadow-lg"
                onerror="this.onerror=null;this.src='https://placehold.co/224x224/E0F2FE/1E40AF?text=Dr.+Avatar';"
              />
              <div
                class="absolute bottom-0 right-0 bg-green-500 text-white rounded-full p-1 text-xs font-bold shadow-md"
              >
                <i class="fas fa-check-circle"></i> Verified
              </div>
            </div>

            <div class="flex-grow space-y-1">
              <h1
                class="text-lg sm:text-4xl font-extrabold text-gray-900 leading-tight"
              >
                Dr. {{ doctor.name }}
              </h1>
              <p
                class="text-xs sm:text-xl text-gray-700 font-semibold flex items-center"
              >
                <i
                  class="fas fa-user-graduate mr-2 text-purple-600 text-sm sm:text-xl"
                ></i
                >{{ doctor.degree }}
              </p>
              <p
                class="text-xs sm:text-xl text-blue-700 font-bold tracking-wide flex items-center"
              >
                <i
                  class="fas fa-stethoscope mr-2 text-red-500 text-sm sm:text-xl"
                ></i
                >{{ doctor.specilities }}
              </p>
              <div
                class="flex items-center text-xs sm:text-lg text-gray-600 space-x-3 mt-2"
              >
                <span class="flex items-center"
                  ><i class="fas fa-heart text-pink-500 mr-1 text-sm"></i>98%
                  Rating</span
                >
                <span class="flex items-center"
                  ><i class="fas fa-comments text-yellow-600 mr-1 text-sm"></i
                  >{{ formatNumber(5300) }} Reviews</span
                >
              </div>
            </div>
          </div>

          <div
            class="pt-4 flex flex-col items-center justify-center gap-3 animate-fade-in-up delay-200"
          >
            <div
              class="flex flex-row items-center justify-center gap-2 space-x-2"
            >
              <p class="text-sm sm:text-lg font-medium text-gray-700">
                Recommend this Doctor ?
              </p>
              <div class="flex items-center gap-3">
                <button
                  v-if="authStore.isAuthenticated"
                  @click="recommendDoctor(true)"
                  :class="[
                    'w-7 h-7 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-base sm:text-2xl shadow-md transition-all duration-300 transform',
                    userRecommendation && userRecommendation.value === true
                      ? 'bg-green-100 text-green-600 scale-110 border-2 border-green-500 animate-recommend-bounce'
                      : 'bg-gray-100 text-gray-500 hover:bg-green-50 hover:text-green-500 hover:scale-105',
                  ]"
                  aria-label="Recommend doctor with thumbs up"
                >
                  <i class="fas fa-thumbs-up"></i>
                </button>
                <button
                  v-if="authStore.isAuthenticated"
                  @click="recommendDoctor(false)"
                  :class="[
                    'w-7 h-7 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-base sm:text-2xl shadow-md transition-all duration-300 transform',
                    userRecommendation && userRecommendation.value === false
                      ? 'bg-red-100 text-red-600 scale-110 border-2 border-red-500 animate-recommend-bounce'
                      : 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500 hover:scale-105',
                  ]"
                  aria-label="Do not recommend doctor with thumbs down"
                >
                  <i class="fas fa-thumbs-down"></i>
                </button>
              </div>
            </div>

            <p
              v-if="!authStore.isAuthenticated"
              class="text-xs text-gray-600 text-center"
            >
              Please
              <NuxtLink
                to="/auth"
                class="text-blue-700 underline hover:text-blue-500"
                >log in</NuxtLink
              >
              to recommend.
            </p>
            <div
              v-if="recommendationPercentage > 0"
              class="text-xs sm:text-base text-gray-600 font-medium flex items-center justify-center mt-0"
            >
              <i class="fas fa-chart-line mr-2 text-blue-500"></i>
              {{ formatNumber(5300) }} of users recommend Dr.
              {{ doctor.name }}
            </div>
          </div>

          <div
            class="grid grid-cols-3 gap-2 sm:gap-6 pt-4 mt-4 border-t border-gray-200 animate-fade-in-up delay-300"
          >
            <div
              class="flex flex-col items-center text-center p-2 sm:p-4 bg-blue-50 rounded-xl shadow-sm border border-blue-200"
            >
              <i
                class="fas fa-users text-2xl sm:text-4xl text-blue-600 mb-2"
              ></i>
              <p class="text-lg sm:text-2xl font-bold text-gray-900">
                {{ formatNumber(2050) }}+
              </p>
              <p class="text-xs text-gray-600">Patients Treated</p>
            </div>
            <div
              v-if="doctor.experience !== ''"
              class="flex flex-col items-center text-center p-2 sm:p-4 bg-green-50 rounded-xl shadow-sm border border-green-200"
            >
              <i
                class="fas fa-briefcase-medical text-2xl sm:text-4xl text-green-600 mb-2"
              ></i>
              <p class="text-lg sm:text-2xl font-bold text-gray-900">
                {{ doctor.experience }}
              </p>
              <p class="text-xs text-gray-600">Years Experience</p>
            </div>
            <div
              class="flex flex-col items-center text-center p-2 sm:p-4 bg-yellow-50 rounded-xl shadow-sm border border-yellow-200"
            >
              <i
                class="fas fa-star text-2xl sm:text-4xl text-yellow-600 mb-2"
              ></i>
              <p class="text-lg sm:text-2xl font-bold text-gray-900">
                {{ formatNumber(5300) }}+
              </p>
              <p class="text-xs text-gray-600">Recommended by</p>
            </div>
          </div>

          <div
            class="pt-6 mt-6 border-t border-gray-200 animate-fade-in-up delay-400"
          >
            <h2
              class="text-lg sm:text-2xl font-bold text-gray-900 mb-3 flex items-center"
            >
              <i
                class="fas fa-info-circle mr-2 text-blue-600 text-xl sm:text-2xl"
              ></i>
              About Dr. {{ doctor.name }}
            </h2>
            <p class="text-sm text-gray-700 leading-relaxed">
              Dr. {{ doctor.name }} is a highly experienced
              <span class="font-semibold text-blue-800">{{
                doctor.specilities.toLowerCase()
              }}</span>
              specialist with over
              <span class="font-semibold text-blue-800">{{
                doctor.experience || "several"
              }}</span>
              years of dedicated practice. Known for a patient-centric approach,
              Dr. {{ doctor.name }} excels in providing precise diagnoses and
              developing effective, personalized treatment plans. Committed to
              continuous learning and staying updated with the latest medical
              advancements, Dr. {{ doctor.name }} ensures every patient receives
              the highest standard of care.
            </p>
          </div>
        </div>

        <!-- Related Doctors Section (Unchanged) -->
        <div
          class="max-w-7xl mx-auto py-6 bg-white rounded-2xl shadow-lg border border-gray-200 animate-fade-in-up delay-500"
        >
          <h2
            class="text-sm sm:text-3xl font-bold text-gray-900 mb-5 flex flex-row items-center justify-center text-center px-4 whitespace-nowrap overflow-hidden text-ellipsis"
          >
            <!-- <i
              class="px-2 fas fa-user-md mr-0 sm:mr-3 mb-0 sm:mb-0 text-blue-600"
            ></i> -->
            Other
            <span class="text-blue-600 flex sm:ml-2 sm:mr-1 px-1">
              {{ doctor.specilities }}</span
            >
            Doctors in
            <span class="text-blue-600 sm:ml-1 px-1">{{
              doctorsStore.selectedLocation
            }}</span>
          </h2>

          <div class="relative px-4 sm:px-10">
            <button
              @click="scrollLeft"
              class="absolute left-0 sm:left-4 top-1/2 -translate-y-1/2 z-10 bg-blue-700 text-white p-2 sm:p-3 rounded-full shadow-lg hover:bg-blue-600 transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Scroll left"
            >
              <ChevronLeftIcon class="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <div
              ref="doctorsList"
              class="flex gap-3 sm:gap-6 overflow-x-auto snap-x snap-mandatory py-3 px-2 hide-scrollbar scroll-smooth"
            >
              <div
                v-for="relatedDoctor in relatedDoctors"
                :key="relatedDoctor.id"
                @click="navigateToDoctor(relatedDoctor.doc)"
                class="flex-shrink-0 w-28 sm:w-48 text-center snap-center cursor-pointer bg-blue-50 rounded-xl p-3 sm:p-4 shadow-md hover:shadow-lg hover:bg-blue-100 transition-all duration-300 transform hover:-translate-y-1 border border-blue-200"
              >
                <img
                  src="https://placehold.co/100x100/E0F2FE/1E40AF?text=Dr.+Avatar"
                  alt="Related Doctor Avatar"
                  class="w-16 h-16 sm:w-24 sm:h-24 mx-auto object-cover rounded-full border-2 border-blue-300 shadow-sm mb-2"
                  onerror="this.onerror=null;this.src='https://placehold.co/100x100/E0F2FE/1E40AF?text=Dr.+Avatar';"
                />
                <p
                  class="text-sm sm:text-lg font-bold text-gray-800 truncate mb-1"
                >
                  Dr. {{ relatedDoctor.name }}
                </p>
                <p class="text-xs text-blue-700 font-medium">
                  {{ relatedDoctor.specilities }}
                </p>
                <p class="text-xs text-gray-500 mt-1">
                  Exp: {{ relatedDoctor.experience }} yrs
                </p>
              </div>
              <div
                v-if="relatedDoctors.length === 0"
                class="text-center text-gray-600 py-4 w-full"
              >
                No other doctors found for this specialty.
              </div>
            </div>
            <button
              @click="scrollRight"
              class="absolute right-0 sm:right-4 top-1/2 -translate-y-1/2 z-10 bg-blue-700 text-white p-2 sm:p-3 rounded-full shadow-lg hover:bg-blue-600 transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Scroll right"
            >
              <ChevronRightIcon class="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        <!-- Available Slots Section -->
        <div
          class="bg-gradient-to-br from-blue-50 to-indigo-50 py-8 sm:py-10 rounded-3xl shadow-xl border border-blue-200 animate-fade-in-up delay-600"
        >
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              class="text-xl sm:text-3xl font-bold text-gray-900 mb-8 flex flex-row items-center justify-center text-center whitespace-nowrap overflow-hidden text-ellipsis"
            >
              <i
                class="fas fa-calendar-alt mr-0 sm:mr-3 text-blue-600 px-2"
              ></i>
              <span class="flex-shrink-0">Available Slots</span>
              <span v-if="clinic" class="flex-shrink-0 ml-1"
                >at <span class="text-blue-700">{{ clinic.name }}</span></span
              >
            </h2>

            <div
              v-if="scheduleLoading"
              class="flex justify-center items-center py-8 flex-col"
            >
              <i
                class="fas fa-sync-alt fa-spin text-blue-500 text-3xl mb-4"
              ></i>
              <p class="text-lg text-gray-600 animate-pulse">
                Loading doctor's schedule...
              </p>
            </div>
            <div
              v-else-if="scheduleError"
              class="text-center text-red-500 py-8 text-lg"
            >
              <i class="fas fa-exclamation-circle mr-2"></i> {{ scheduleError }}
            </div>
            <div
              v-else-if="availableDates.length === 0"
              class="text-center bg-yellow-100 text-yellow-800 px-6 py-5 rounded-xl font-medium shadow-md"
            >
              <p class="text-base sm:text-lg mb-2">
                <i class="fas fa-calendar-times mr-2"></i> Sorry, no available
                appointment slots for Dr. {{ doctor.name }}
              </p>
              <p class="text-sm">
                <span v-if="clinic">at {{ clinic.name }}</span
                >. Please check back later or choose another doctor.
              </p>
            </div>

            <div v-else class="space-y-8">
              <div class="relative px-8 sm:px-12">
                <button
                  @click="scrollLeftDates"
                  class="absolute left-0 sm:left-4 top-1/2 -translate-y-1/2 z-10 bg-blue-700 text-white p-2 sm:p-3 rounded-full shadow-lg hover:bg-blue-600 transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Scroll dates left"
                >
                  <ChevronLeftIcon class="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <div
                  ref="datesList"
                  class="flex gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory py-4 px-2 hide-scrollbar scroll-smooth"
                >
                  <div
                    v-for="date in availableDates"
                    :key="date.fullDate"
                    @click="selectDate(date)"
                    :class="[
                      'flex-shrink-0 w-28 sm:w-32 p-3 sm:p-4 rounded-xl border-2 text-center cursor-pointer transition-all duration-200 shadow-md',
                      selectedDate && selectedDate.fullDate === date.fullDate
                        ? 'bg-blue-600 text-white border-blue-600 shadow-lg scale-105'
                        : 'bg-white text-gray-800 border-gray-300 hover:bg-blue-50 hover:border-blue-400',
                    ]"
                  >
                    <p class="text-base sm:text-lg font-bold">
                      {{ date.dayName }}
                    </p>
                    <p class="text-sm font-medium">{{ date.monthDate }}</p>
                  </div>
                </div>
                <button
                  @click="scrollRightDates"
                  class="absolute right-0 sm:right-4 top-1/2 -translate-y-1/2 z-10 bg-blue-700 text-white p-2 sm:p-3 rounded-full shadow-lg hover:bg-blue-600 transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Scroll dates right"
                >
                  <ChevronRightIcon class="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              <div
                v-if="selectedDate && availableSlots.length > 0"
                class="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 mt-8 animate-fade-in-up delay-700"
              >
                <h4
                  class="text-xl font-bold text-gray-800 mb-6 flex items-center justify-center text-center"
                >
                  <i class="fas fa-clock mr-3 text-blue-600 hidden sm:flex"></i>
                  Select a Time Slot for {{ selectedDate.fullDateFormatted }}
                </h4>
                <div
                  class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4"
                >
                  <button
                    v-for="slot in availableSlots"
                    :key="slot.scheduletime"
                    @click="selectSlot(slot)"
                    :class="[
                      'px-4 py-2 sm:px-5 sm:py-3 rounded-xl border-2 text-center font-semibold transition-all duration-200 transform hover:scale-105 shadow-sm text-sm sm:text-base',
                      selectedSlot &&
                      selectedSlot.scheduletime === slot.scheduletime
                        ? 'bg-green-600 text-white border-green-600 shadow-lg'
                        : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-green-50 hover:border-green-400',
                    ]"
                  >
                    {{ slot.scheduletime }}
                  </button>
                </div>
              </div>
              <div
                v-else-if="selectedDate && availableSlots.length === 0"
                class="text-center bg-yellow-100 text-yellow-800 px-6 py-5 rounded-xl font-medium shadow-md mt-8"
              >
                <p class="text-base sm:text-lg mb-2">
                  <i class="fas fa-exclamation-circle mr-2"></i> No available
                  slots for {{ selectedDate.fullDateFormatted }}.
                </p>
                <p class="text-sm">
                  Please select another date or check back later.
                </p>
              </div>

              <!-- Confirm Appointment Section -->
              <div
                v-if="selectedSlot"
                class="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl border border-green-200 max-w-4xl mx-auto mt-8 animate-fade-in-up delay-800"
              >
                <h2
                  class="text-xl sm:text-3xl font-bold text-center text-gray-900 mb-8 flex flex-row items-center justify-center whitespace-nowrap overflow-hidden text-ellipsis"
                >
                  <!-- <i
                    class="fas fa-check-circle mr-0 sm:mr-3 text-green-600"
                  ></i> -->
                  <span class="flex-shrink-0">Confirm Your</span>
                  <span class="text-blue-600 flex-shrink-0 ml-1"
                    >Appointment</span
                  >
                </h2>

                <div
                  class="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-10 text-gray-700 text-base sm:text-lg"
                >
                  <div class="flex items-center">
                    <i
                      class="fas fa-calendar-day mr-4 text-blue-500 text-xl sm:text-2xl flex-shrink-0"
                    ></i>
                    <div>
                      <p class="font-medium">Appointment Date:</p>
                      <p>
                        {{ selectedSlot.scheduledate }} ({{
                          selectedSlot.Dayname
                        }})
                      </p>
                    </div>
                  </div>

                  <div
                    class="flex items-center flex-row whitespace-nowrap overflow-hidden text-ellipsis"
                  >
                    <i
                      class="fas fa-clock mr-4 text-blue-500 text-xl sm:text-2xl flex-shrink-0"
                    ></i>
                    <div class="flex-grow overflow-hidden">
                      <p class="font-medium inline">Reporting Time:</p>
                      <p class="inline ml-1">{{ selectedSlot.scheduletime }}</p>
                    </div>
                  </div>

                  <div class="flex items-center">
                    <img
                      src="https://placehold.co/32x32/E0F2FE/1E40AF?text=Clinic"
                      alt="Clinic Image"
                      class="w-8 h-8 rounded-full mr-4 flex-shrink-0"
                      onerror="this.onerror=null;this.src='https://placehold.co/32x32/E0F2FE/1E40AF?text=Clinic';"
                    />
                    <div>
                      <p class="font-medium">Clinic:</p>
                      <NuxtLink
                        :to="`/find-clinic?location=${
                          locationStore.currentLocation
                        }&clinic=${slugify(selectedSlot.clinicname)}`"
                        class="text-blue-600 underline hover:text-blue-500 transition"
                      >
                        {{ selectedSlot.clinicname }}
                      </NuxtLink>
                    </div>
                  </div>

                  <div class="flex items-start">
                    <i
                      class="fas fa-map-marker-alt mr-4 text-blue-500 text-xl sm:text-2xl mt-1 flex-shrink-0"
                    ></i>
                    <div>
                      <p class="font-medium">Address:</p>
                      <p>{{ selectedSlot.ClinicA }}</p>
                    </div>
                  </div>

                  <div
                    class="flex items-center flex-row whitespace-nowrap overflow-hidden text-ellipsis"
                  >
                    <i
                      class="fas fa-hand-holding-usd mr-4 text-blue-500 text-xl sm:text-2xl flex-shrink-0"
                    ></i>
                    <div class="flex-grow overflow-hidden">
                      <p class="font-medium inline">Doctor Fee:</p>
                      <p class="inline ml-1">₹{{ selectedSlot.docfee }}</p>
                    </div>
                  </div>

                  <div
                    class="flex items-center flex-row whitespace-nowrap overflow-hidden text-ellipsis"
                  >
                    <i
                      class="fas fa-money-bill-wave mr-4 text-blue-500 text-xl sm:text-2xl flex-shrink-0"
                    ></i>
                    <div class="flex-grow overflow-hidden">
                      <p class="font-medium inline">Platform Fee:</p>
                      <p class="inline ml-1">₹{{ selectedSlot.pfee }}</p>
                    </div>
                  </div>
                </div>

                <button
                  @click="showPaymentModal = true"
                  class="mt-8 sm:mt-10 w-full bg-blue-600 text-white px-6 py-4 rounded-xl hover:bg-blue-700 transition-all shadow-md text-base sm:text-xl font-bold flex items-center justify-center animate-pulse-once"
                >
                  <i class="fas fa-wallet mr-3"></i> Proceed to Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <Footer />
    <BottomNav />

    <!-- Booking Confirmation Modal -->
    <Teleport to="body">
      <Transition name="confirm-modal-fade">
        <div
          v-if="showBookingConfirmationModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            class="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
            @click="closeBookingConfirmationModal"
          ></div>
          <div
            class="relative bg-white rounded-2xl shadow-3xl w-full max-w-sm p-8 text-center transform transition-all duration-300 scale-95 opacity-0"
            :class="{ 'scale-100 opacity-100': showBookingConfirmationModal }"
            @click.stop
          >
            <i
              :class="
                bookingSuccess
                  ? 'fas fa-check-circle text-green-500'
                  : 'fas fa-times-circle text-red-500'
              "
              class="text-6xl mb-6"
            ></i>
            <h3 class="text-2xl font-bold text-gray-800 mb-4">
              {{ bookingSuccess ? "Booking Confirmed!" : "Booking Failed" }}
            </h3>
            <p class="text-gray-700 mb-6">{{ bookingMessage }}</p>
            <button
              @click="closeBookingConfirmationModal"
              :class="
                bookingSuccess
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              "
              class="px-6 py-3 text-white rounded-lg font-semibold transition-colors shadow-md"
            >
              {{ bookingSuccess ? "Done" : "Close" }}
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Payment Modal (Book Appointment Form) -->
    <Teleport to="body">
      <Transition name="payment-modal-fade">
        <div
          v-if="showPaymentModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto"
        >
          <div
            class="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
            @click="showPaymentModal = false"
          ></div>
          <div
            class="relative bg-white rounded-2xl shadow-3xl w-full max-w-sm sm:max-w-md lg:max-w-2xl xl:max-w-3xl p-4 sm:p-6 text-left transform transition-all duration-300 scale-95 opacity-0 my-8"
            :class="{ 'scale-100 opacity-100': showPaymentModal }"
            @click.stop
          >
            <h3
              class="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center"
            >
              <i class="fas fa-wallet mr-2 text-blue-600"></i> Book Appointment
            </h3>

            <div
              class="space-y-4 sm:space-y-5 max-h-[70vh] overflow-y-auto pr-2"
            >
              <div class="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <h4 class="text-sm font-medium text-gray-700 mb-2">
                  Add Family Member
                </h4>
                <p v-if="familyMemberError" class="text-xs text-red-600 mb-2">
                  {{ familyMemberError }}
                </p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label
                      for="familyName"
                      class="block text-xs font-medium text-gray-700 mb-1"
                    >
                      Name
                    </label>
                    <input
                      id="familyName"
                      v-model="newFamilyMember.name"
                      type="text"
                      class="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Enter name"
                    />
                  </div>
                  <div>
                    <label
                      for="familyRelation"
                      class="block text-xs font-medium text-gray-700 mb-1"
                    >
                      Relation
                    </label>
                    <select
                      id="familyRelation"
                      v-model="newFamilyMember.relation"
                      @change="setGenderFromRelation"
                      class="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option value="" disabled>Select relation</option>
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Brother">Brother</option>
                      <option value="Sister">Sister</option>
                      <option value="Wife">Wife</option>
                      <option value="Son">Son</option>
                      <option value="Daughter">Daughter</option>
                    </select>
                  </div>
                  <div>
                    <label
                      for="familyAge"
                      class="block text-xs font-medium text-gray-700 mb-1"
                    >
                      Age
                    </label>
                    <input
                      id="familyAge"
                      v-model.number="newFamilyMember.age"
                      type="number"
                      min="1"
                      class="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Enter age"
                    />
                  </div>
                  <div>
                    <label
                      for="familyGender"
                      class="block text-xs font-medium text-gray-700 mb-1"
                    >
                      Gender
                    </label>
                    <input
                      id="familyGender"
                      v-model="newFamilyMember.gender"
                      type="text"
                      class="w-full px-2 py-1.5 border border-gray-300 rounded-lg bg-gray-100 text-sm"
                      readonly
                    />
                  </div>
                </div>
                <button
                  @click="addFamilyMember"
                  class="mt-3 w-full px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-semibold"
                  :disabled="
                    !newFamilyMember.name ||
                    !newFamilyMember.relation ||
                    !newFamilyMember.age
                  "
                >
                  <i class="fas fa-user-plus mr-2"></i> Add Family Member
                </button>
              </div>

              <div>
                <label
                  for="patientType"
                  class="block text-sm font-medium text-gray-700 mb-1"
                >
                  Book Appointment For
                </label>
                <select
                  id="patientType"
                  v-model="patientType"
                  @change="updatePatientDetails"
                  class="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="self">Self</option>
                  <option
                    v-for="member in familyMembers"
                    :key="member.id"
                    :value="member.id"
                  >
                    {{ member.name }} ({{ member.relation }})
                  </option>
                </select>
              </div>

              <div class="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label
                    for="patientAge"
                    class="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Age
                  </label>
                  <input
                    id="patientAge"
                    v-model="patientDetails.age"
                    type="number"
                    class="w-full px-2 py-1.5 border border-gray-300 rounded-lg bg-gray-100 text-sm"
                    readonly
                  />
                </div>
                <div>
                  <label
                    for="patientGender"
                    class="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Gender
                  </label>
                  <input
                    id="patientGender"
                    v-model="patientDetails.gender"
                    type="text"
                    class="w-full px-2 py-1.5 border border-gray-300 rounded-lg bg-gray-100 text-sm"
                    readonly
                  />
                </div>
              </div>

              <div class="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p class="text-sm font-medium text-gray-700 mb-2">
                  Payment Details
                </p>
                <div class="flex justify-between text-sm text-gray-600">
                  <span>Platform Fee</span>
                  <span>₹{{ selectedSlot.pfee }}</span>
                </div>
                <div
                  v-if="docfeeCollect"
                  class="flex justify-between text-sm text-gray-600 mt-1"
                >
                  <span>Clinic Fee</span>
                  <span>₹{{ selectedSlot.docfee }}</span>
                </div>
                <div v-else class="text-xs text-red-600 mt-2 italic">
                  Note: Doctor fee (₹{{ selectedSlot.docfee }}) to be paid at
                  the clinic.
                </div>
                <div
                  class="flex justify-between text-sm font-bold text-gray-800 mt-2"
                >
                  <span>Total Payable Now</span>
                  <span>₹{{ totalPayable }}</span>
                </div>
              </div>

              <div class="text-xs text-gray-600">
                <label class="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    v-model="useWallet"
                    class="mt-1 mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span>Use ₹100 from Rundoc Wallet</span>
                </label>
              </div>

              <div class="text-xs text-gray-600">
                <label class="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    v-model="platformFeeDue"
                    class="mt-1 mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked
                  />
                  <span>
                    I understand that we charge a small platform fee of ₹50 to
                    help keep things running smoothly. This fee is usually
                    non-refundable, but if the doctor doesn't show up, your ₹50
                    will be credited back to your Rundoc Wallet for use in
                    future transactions. For more info, visit our
                    <NuxtLink
                      to="/refund-cancellation"
                      class="text-blue-600 underline hover:text-blue-500"
                    >
                      Refund and Cancellation Policy
                    </NuxtLink>
                    .
                  </span>
                </label>
              </div>

              <div class="text-xs text-gray-600">
                <label class="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    v-model="termsAccepted"
                    class="mt-1 mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked
                  />
                  <span>
                    I agree to Rundoc’s
                    <NuxtLink
                      to="/terms-conditions"
                      class="text-blue-600 underline hover:text-blue-500"
                    >
                      Terms & Conditions
                    </NuxtLink>
                    .
                  </span>
                </label>
              </div>

              <button
                @click="initiatePayment"
                :disabled="!platformFeeDue || !termsAccepted"
                :class="[
                  'w-full px-4 py-2 rounded-lg font-semibold transition-colors shadow-md text-sm sm:text-base',
                  platformFeeDue && termsAccepted
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed',
                ]"
              >
                <i class="fas fa-credit-card mr-2"></i> Pay ₹{{ totalPayable }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import BottomNav from "~/components/BottomNav.vue";
import { onMounted, ref, computed, watch } from "vue";
import { useDoctorsStore } from "@/stores/doctors";
import { useClinicsStore } from "@/stores/clinics";
import { useLocationStore } from "@/stores/location";
import { useAuthStore } from "@/stores/auth";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/24/solid";
import { navigateTo, useRoute, useRouter } from "#app";
import axios from "axios";

// Route, Router, and Stores
const route = useRoute();
const router = useRouter();
const doctorsStore = useDoctorsStore();
const clinicsStore = useClinicsStore();
const locationStore = useLocationStore();
const authStore = useAuthStore();
const doctorSlug = ref(route.params.doc);
const clinicSlug = ref(route.query.clinic || "");

// Doctor State
const loading = ref(true);
const error = ref("");
const doctor = ref(null);
const clinic = ref(null);

// Schedule State
const scheduleLoading = ref(true);
const scheduleError = ref("");
const schedule = ref([]);
const selectedDate = ref(null);
const selectedSlot = ref(null);

// Recommendation State
const userRecommendation = ref(null);
const recommendationPercentage = ref(0);

// Booking Confirmation Modal State
const showBookingConfirmationModal = ref(false);
const bookingSuccess = ref(false);
const bookingMessage = ref("");

// Payment Modal State
const showPaymentModal = ref(false);
const patientType = ref("self");
const patientDetails = ref({
  age: "",
  gender: "",
});
const platformFeeDue = ref(true);
const termsAccepted = ref(true);
const docfeeCollect = ref(true);
const useWallet = ref(false);

// Family Members State
const familyMembers = ref([]);
const newFamilyMember = ref({
  name: "",
  relation: "",
  age: null,
  gender: "",
});
const familyMemberError = ref("");

// Mock User Profile
const userProfile = ref({
  name: "Current User",
  age: 30,
  gender: "M",
  phone: "9876543210",
  pid: 209,
});

// References for smooth scrolling
const doctorsList = ref(null);
const datesList = ref(null);

// Computed properties
const relatedDoctors = computed(() => {
  if (!doctor.value || !doctorsStore.doctors.length) return [];
  return doctorsStore.doctors.filter(
    (doc) =>
      doc.doc !== doctorSlug.value &&
      doc.specilities === doctor.value.specilities
  );
});

const availableDates = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dates = schedule.value
    .map((s) => {
      const dateKey = s.scheduledate || s.date;
      const dateObj = new Date(dateKey);
      if (isNaN(dateObj.getTime())) {
        console.warn(`Invalid date found in schedule: ${dateKey}`);
        return null;
      }

      dateObj.setHours(0, 0, 0, 0);

      return {
        fullDate: dateKey,
        dayName: formatDayOfWeek(dateObj),
        monthDate: formatMonthDate(dateObj),
        fullDateFormatted: formatFullDate(dateObj),
      };
    })
    .filter(
      (date) =>
        date && new Date(date.fullDate).setHours(0, 0, 0, 0) >= today.getTime()
    )
    .sort(
      (a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime()
    );

  const uniqueDates = [];
  const seenDates = new Set();
  for (const date of dates) {
    if (!seenDates.has(date.fullDate)) {
      uniqueDates.push(date);
      seenDates.add(date.fullDate);
    }
  }
  return uniqueDates;
});

const availableSlots = computed(() => {
  if (!selectedDate.value) return [];

  const slotsForSelectedDate = schedule.value
    .filter((s) => (s.scheduledate || s.date) === selectedDate.value.fullDate)
    .flatMap((s) => s.slots);

  return slotsForSelectedDate.filter((slot) => slot && slot.scheduletime);
});

const totalPayable = computed(() => {
  if (!selectedSlot.value) return 0;
  const platformFee = parseInt(selectedSlot.value.pfee) || 0;
  const doctorFee = docfeeCollect.value
    ? parseInt(selectedSlot.value.docfee) || 0
    : 0;
  let total = platformFee + doctorFee;
  if (useWallet.value) {
    total = Math.max(total - 100, 0);
  }
  return total;
});

// Functions
const slugify = (text) => {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
};

const fetchDoctorData = async () => {
  loading.value = true;
  scheduleLoading.value = true;
  error.value = "";
  scheduleError.value = "";
  selectedSlot.value = null;
  selectedDate.value = null;

  try {
    await locationStore.restoreLocation();
    let currentLocation = locationStore.currentLocation;

    if (!currentLocation || currentLocation === "Select Location") {
      error.value = "Please select a location first.";
      navigateTo("/");
      return;
    }

    if (
      !doctorsStore.doctors.length ||
      doctorsStore.selectedLocation !== currentLocation
    ) {
      await doctorsStore.fetchDoctors(currentLocation);
    }

    if (!doctorsStore.selectedLocation || doctorsStore.doctors.length === 0) {
      error.value = "No doctors found in the selected location.";
      return;
    }

    doctor.value = doctorsStore.doctors.find(
      (doc) => doc.doc === doctorSlug.value
    );
    if (!doctor.value) {
      error.value = "Doctor not found in the selected location.";
      return;
    }

    if (clinicSlug.value) {
      if (
        !clinicsStore.clinics.length ||
        clinicsStore.selectedLocation !== currentLocation
      ) {
        await clinicsStore.fetchClinics(currentLocation);
      }

      const foundClinic = clinicsStore.clinics.find(
        (c) => slugify(c.name) === clinicSlug.value
      );

      if (foundClinic) {
        clinic.value = foundClinic;
        const doctorInClinic = foundClinic.doctors.find(
          (d) => d.docSlug === doctorSlug.value
        );

        if (
          doctorInClinic &&
          doctorInClinic.schedules &&
          doctorInClinic.schedules.length > 0
        ) {
          schedule.value = doctorInClinic.schedules.map((s) => ({
            date: s.date,
            scheduledate: s.date,
            slots: s.slots.map((slot) => ({
              ...slot,
              scheduledate: s.date,
              clinicname: foundClinic.name,
              ClinicA: foundClinic.address,
              docfee: slot.docfee || "0",
              pfee: slot.pfee || "50",
              Dayname: new Date(s.date).toLocaleString("en-US", {
                weekday: "long",
              }),
            })),
          }));
          autoSelectDate();
        } else {
          scheduleError.value =
            "This doctor does not have an available schedule at this clinic.";
          schedule.value = [];
        }
      } else {
        scheduleError.value =
          "The specified clinic was not found for this location.";
        schedule.value = [];
      }
    } else {
      // This is the general schedule fetch
      try {
        const response = await axios.post(
          "https://api.rundoc.in/api/app3/doctor.php",
          JSON.stringify({ doc: doctorSlug.value }),
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer Rupam@98639999",
            },
          }
        );

        if (Object.keys(response.data).length === 0) {
          scheduleError.value = "No general schedule found for this doctor.";
          schedule.value = [];
        } else {
          schedule.value = Object.entries(response.data).map(
            ([date, slotsArray]) => ({
              date: date,
              scheduledate: date,
              slots: slotsArray.map((slot) => ({
                ...slot,
                scheduledate: slot.scheduledate || date,
                Dayname:
                  slot.Dayname ||
                  new Date(date).toLocaleString("en-US", { weekday: "long" }),
                clinicname: slot.clinicname || "Virtual Clinic",
                ClinicA: slot.ClinicA || "Online Consultation",
                docfee: slot.docfee || "0",
                pfee: slot.pfee || "50",
              })),
            })
          );
          autoSelectDate();
        }
      } catch (err) {
        console.error("Error fetching general schedule:", err);
        scheduleError.value =
          "Error fetching general schedule. Please try again.";
        schedule.value = [];
      }
    }

    // Logic for user recommendation and patient details (moved inside the main try block)
    if (authStore.isAuthenticated) {
      userRecommendation.value = { value: Math.random() > 0.5 };
      recommendationPercentage.value = 85;
      patientDetails.value = {
        age: userProfile.value.age || "30",
        gender: userProfile.value.gender || "M",
      };
    } else {
      userRecommendation.value = null;
      recommendationPercentage.value = 0;
      patientDetails.value = {
        age: "30",
        gender: "M",
      };
    }
  } catch (err) {
    error.value =
      "Failed to load doctor details or data. Please check location.";
    console.error(err);
  } finally {
    loading.value = false;
    scheduleLoading.value = false;
  }
};

const recommendDoctor = async (isRecommended) => {
  if (!authStore.isAuthenticated) {
    sessionStorage.setItem(
      "redirectAfterLogin",
      router.currentRoute.value.fullPath
    );
    router.push("/auth");
    return;
  }

  userRecommendation.value = { value: isRecommended };
  console.log(
    `Submitting recommendation ${isRecommended} for doctor ${doctorSlug.value}`
  );

  try {
    recommendationPercentage.value = isRecommended
      ? Math.min(
          recommendationPercentage.value +
            (recommendationPercentage.value < 95 ? 5 : 0),
          100
        )
      : Math.max(
          recommendationPercentage.value -
            (recommendationPercentage.value > 5 ? 5 : 0),
          0
        );
  } catch (err) {
    console.error("Error submitting recommendation:", err);
    userRecommendation.value = null;
  }
};

const autoSelectDate = () => {
  if (availableDates.value.length > 0) {
    selectDate(availableDates.value[0]);
  } else {
    selectedDate.value = null;
    selectedSlot.value = null;
  }
};

const selectDate = (dateObj) => {
  selectedDate.value = dateObj;
  selectedSlot.value = null;
};

const selectSlot = (slot) => {
  selectedSlot.value = { ...slot, doctorName: doctor.value.name };
  console.log("Selected Slot:", selectedSlot.value);
};

const navigateToDoctor = (docSlug) => {
  const query = clinicSlug.value ? { clinic: clinicSlug.value } : {};
  router.push({ path: `/doctor/${docSlug}`, query });
};

const scrollLeft = () => {
  if (doctorsList.value)
    doctorsList.value.scrollBy({ left: -250, behavior: "smooth" });
};

const scrollRight = () => {
  if (doctorsList.value)
    doctorsList.value.scrollBy({ left: 250, behavior: "smooth" });
};

const scrollLeftDates = () => {
  if (datesList.value)
    datesList.value.scrollBy({ left: -150, behavior: "smooth" });
};

const scrollRightDates = () => {
  if (datesList.value)
    datesList.value.scrollBy({ left: 150, behavior: "smooth" });
};

const formatNumber = (num) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
};

const formatMonthDate = (dateObj) => {
  return dateObj.toLocaleString("en-US", { month: "short", day: "numeric" });
};

const formatDayOfWeek = (dateObj) => {
  return dateObj.toLocaleString("en-US", { weekday: "short" });
};

const formatFullDate = (dateObj) => {
  return dateObj.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const setGenderFromRelation = () => {
  const genderMap = {
    Father: "M",
    Mother: "F",
    Brother: "M",
    Sister: "F",
    Wife: "F",
    Son: "M",
    Daughter: "F",
  };
  newFamilyMember.value.gender =
    genderMap[newFamilyMember.value.relation] || "";
};

const addFamilyMember = () => {
  familyMemberError.value = "";

  if (
    !newFamilyMember.value.name ||
    !newFamilyMember.value.relation ||
    !newFamilyMember.value.age
  ) {
    familyMemberError.value = "Please fill all fields.";
    return;
  }

  const restrictions = {
    Father: 1,
    Mother: 1,
    Brother: 1,
    Sister: 1,
    Wife: 1,
    Son: 2,
    Daughter: 2,
  };

  const relationCount = familyMembers.value.filter(
    (m) => m.relation === newFamilyMember.value.relation
  ).length;

  if (relationCount >= restrictions[newFamilyMember.value.relation]) {
    familyMemberError.value = `Cannot add more than ${
      restrictions[newFamilyMember.value.relation]
    } ${newFamilyMember.value.relation}(s).`;
    return;
  }

  const newMember = {
    id: familyMembers.value.length + 1,
    name: newFamilyMember.value.name,
    relation: newFamilyMember.value.relation,
    age: newFamilyMember.value.age,
    gender: newFamilyMember.value.gender,
  };

  familyMembers.value.push(newMember);
  console.log("Mock POST: Added family member", newMember);
  console.log("Mock GET: Updated family members", familyMembers.value);

  newFamilyMember.value = { name: "", relation: "", age: null, gender: "" };
};

const updatePatientDetails = () => {
  if (patientType.value === "self") {
    patientDetails.value = {
      age: userProfile.value.age || "30",
      gender: userProfile.value.gender || "M",
    };
  } else {
    const member = familyMembers.value.find((m) => m.id === patientType.value);
    if (member) {
      patientDetails.value = {
        age: member.age,
        gender: member.gender,
      };
    }
  }
};

const openBookingConfirmationModal = () => {
  showBookingConfirmationModal.value = true;
};

const closeBookingConfirmationModal = () => {
  showBookingConfirmationModal.value = false;
  if (bookingSuccess.value) {
    // router.push('/my-bookings');
  }
};

const openPaymentModal = async () => {
  if (!authStore.isAuthenticated) {
    sessionStorage.setItem(
      "redirectAfterLogin",
      router.currentRoute.value.fullPath
    );
    router.push("/auth");
    return;
  }

  if (!selectedSlot.value) {
    bookingSuccess.value = false;
    bookingMessage.value = "Please select a date and time slot.";
    openBookingConfirmationModal();
    return;
  }

  // Mock bookingStart API response for testing
  try {
    const payload = {
      dt: selectedSlot.value.scheduledate,
      id: selectedSlot.value.scheduleid,
      st: selectedSlot.value.scheduletime,
      pid: authStore.userInfo?.pid || userProfile.value.pid,
    };

    console.log("Booking Start Payload:", payload); // Debug log

    const mockResponse = {
      data: {
        docfee: selectedSlot.value.docfee || 500,
        docfee_c: Math.random() > 0.5 ? 1 : 0,
        pfee: selectedSlot.value.pfee || 50,
        scheduleid: selectedSlot.value.scheduleid || 227,
        docname: doctor.value.name,
        scheduledate: selectedSlot.value.scheduledate,
        scheduletime: selectedSlot.value.scheduletime,
        reporting_time: selectedSlot.value.scheduletime,
        booking_start_datetime: "2025-06-22 10:00:00", // Past date for testing payment flow
        time_and_date: "2025-06-23 12:51:00", // Matches current time (12:51 PM IST, June 23, 2025)
        status: 1,
        nop: 20,
        booking_open: true,
        disclaimer: {
          title: "Disclaimer",
          content: [
            "Age Requirement: Dr. Prasun Bhattacharjee's services are available to patients aged 16 years and above.",
            "Medical Specialization: Dr. Prasun Bhattacharjee is a specialist in addressing various medical issues.",
            "Refund Policy: No refunds will be provided under any circumstances once the booking is confirmed.",
          ],
        },
      },
    };

    const response = mockResponse; // Replace with real API call when available
    /*
    const response = await axios.post(
      'https://api.rundoc.in/api/app3/bookingStart.php',
      JSON.stringify(payload),
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authStore.userInfo?.token || 'Rupam@98639999'}`,
        },
      }
    );
    */

    // Check if booking is not open
    const bookingStart = new Date(response.data.booking_start_datetime);
    const currentTime = new Date(response.data.time_and_date);
    if (bookingStart > currentTime) {
      bookingSuccess.value = false;
      bookingMessage.value = `Booking hasn't started yet. It will start from ${bookingStart.toLocaleString(
        "en-US",
        {
          dateStyle: "medium",
          timeStyle: "short",
        }
      )}`;
      openBookingConfirmationModal();
      return;
    }

    if (response.data.message === "Ticket full") {
      bookingSuccess.value = false;
      bookingMessage.value = "This slot is no longer available.";
      openBookingConfirmationModal();
      return;
    }

    if (response.data.message === "You already booked this ticket") {
      bookingSuccess.value = false;
      bookingMessage.value = "You have already booked this slot.";
      openBookingConfirmationModal();
      return;
    }

    if (!response.data.booking_open) {
      bookingSuccess.value = false;
      bookingMessage.value = "Booking is not open for this slot.";
      openBookingConfirmationModal();
      return;
    }

    docfeeCollect.value = response.data.docfee_c === 1;
    showPaymentModal.value = true;
  } catch (err) {
    console.error("Booking start error:", err);
    bookingSuccess.value = false;
    bookingMessage.value = "Failed to verify slot availability.";
    openBookingConfirmationModal();
  }
};

const initiatePayment = async () => {
  if (!platformFeeDue.value || !termsAccepted.value) return;

  try {
    const payload = {
      dt: selectedSlot.value?.scheduledate,
      id: selectedSlot.value?.scheduleid,
      st: formatTimeForAPI(selectedSlot.value?.scheduletime), // Format time to HH:MM:SS
      pid: userProfile.value.pid || "209",
      name:
        patientType.value === "self"
          ? userProfile.value.name
          : familyMembers.value.find((m) => m.id === patientType.value)?.name ||
            "",
      age: patientDetails.value.age.toString() || "30",
      Gender: patientDetails.value.gender || "M",
      Phone: userProfile.value.phone || "9876543210",
      total: totalPayable.value || 0,
    };

    console.log("Booking Order Payload:", payload); // Debug log

    const response = await axios.post(
      "https://api.rundoc.in/api/app3/bookingOrderIDvue.php", // Correct endpoint
      JSON.stringify(payload),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            authStore.userInfo?.token || "Rupam@98639999"
          }`,
        },
      }
    );

    console.log("Booking Order Response:", response.data); // Debug log

    // Destructure response per API docs
    const { data, marchent_OI, serverid } = response.data;

    // Validate response
    if (!data || !data.key || !data.order_id) {
      throw new Error("Invalid payment data received from server");
    }

    // Load Razorpay SDK dynamically
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      if (!window.Razorpay) {
        console.error("Razorpay SDK failed to load");
        bookingSuccess.value = false;
        bookingMessage.value = "Failed to load payment gateway.";
        openBookingConfirmationModal();
        return;
      }

      const options = {
        key: data.key,
        amount: data.amount,
        currency: "INR",
        name: data.name,
        description: data.description,
        image: data.image,
        order_id: data.order_id,
        prefill: data.prefill,
        notes: data.notes,
        theme: data.theme,
        handler: async (response) => {
          try {
            console.log("Payment Success:", response);
            // Simulate server verification
            // await axios.post('/api/verify-payment', { razorpay_payment_id: response.razorpay_payment_id, marchent_OI, serverid });
            bookingSuccess.value = true;
            bookingMessage.value =
              "Your appointment has been successfully booked! A confirmation email has been sent.";
            showPaymentModal.value = false;
            openBookingConfirmationModal();
            selectedSlot.value = null;
            selectedDate.value = null;
          } catch (err) {
            console.error("Payment verification error:", err);
            bookingSuccess.value = false;
            bookingMessage.value = "Payment verification failed.";
            openBookingConfirmationModal();
          }
        },
        modal: {
          ondismiss: () => {
            bookingSuccess.value = false;
            bookingMessage.value = "Payment cancelled.";
            openBookingConfirmationModal();
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    };
    script.onerror = () => {
      console.error("Failed to load Razorpay SDK");
      bookingSuccess.value = false;
      bookingMessage.value = "Failed to load payment gateway.";
      openBookingConfirmationModal();
    };
    document.body.appendChild(script);
  } catch (err) {
    console.error("Payment initiation error:", err);
    bookingSuccess.value = false;
    bookingMessage.value = "Failed to initiate payment. Please try again.";
    openBookingConfirmationModal();
  }
};

// Helper function to format time to HH:MM:SS
const formatTimeForAPI = (time) => {
  if (!time) return "00:00:00";
  const [hours, minutes, period] = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
  let hour = parseInt(hours, 10);
  if (period.toUpperCase() === "PM" && hour !== 12) hour += 12;
  if (period.toUpperCase() === "AM" && hour === 12) hour = 0;
  return `${hour.toString().padStart(2, "0")}:${minutes.padStart(2, "0")}:00`;
};

onMounted(async () => {
  await fetchDoctorData();
});

watch(
  () => [route.params.doc, route.query.clinic],
  async ([newDocSlug, newClinicSlug]) => {
    doctorSlug.value = newDocSlug;
    clinicSlug.value = newClinicSlug || "";
    await fetchDoctorData();
  }
);
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.animate-fade-in {
  animation: fade-in 0.6s ease-out forwards;
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out forwards;
}
.animate-fade-in-up.delay-100 {
  animation-delay: 0.1s;
}
.animate-fade-in-up.de100-200 {
  animation-delay: 0.2s;
}
.animate-fade-in-up.de100-delay200-300 {
  animation-delay: 0.3sdelay;
}
.animate-fade-in-up.de-delay-400 {
  animation-delay: 0.4s;
}
.animate-fade-in-up.delay-500 {
  animation-delay: 0.5s;
}
.animate-delay-in-up.delay-600 {
  animation-delay: 0.6s;
}
.animate-delay-in-up.delay-700 {
  animation-delay: 0.7s;
}
.animate-delay-in-up.delay-800 {
  animation-delay: 0.8s;
}

@keyframes recommend-bounce {
  0%,
  100% {
    transform: scale(1.1);
  }
  20% {
    transform: scale(1.08);
  }
  40% {
    transform: scale(1.12);
  }
  60% {
    transform: scale(1.08);
  }
  80% {
    transform: scale(1.11);
  }
}
.animate-recommend-bounce {
  animation: recommend-bounce 0.8s ease-out forwards;
}

@keyframes pulse-once {
  0% {
    transform: scale(1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  50% {
    transform: scale(1.02);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}
.animate-pulse-once {
  animation: pulse-once 1.2s ease-in-out;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.confirm-modal-fade-enter-active,
.payment-modal-fade-enter-active,
.confirm-modal-modal-leave-active,
.payment-modal-modal-leave-active {
  transition: opacity 0.3s ease;
}
.confirm-modal-fade-enter-from,
.payment-modal-fade-enter-from,
.confirm-modal-modal-leave-to,
.payment-modal-modal-leave-to {
  opacity: 0;
}

.confirm-modal-fade-enter-active .relative,
.payment-modal-fade-enter-active .relative,
.confirm-modal-modal-leave-active .relative,
.payment-modal-modal-leave-active .relative {
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

.confirm-modal-modal-enter-from .relative,
.payment-modal-modal-enter-from .relative,
.confirm-modal-modal-leave-to .relative,
.payment-modal-modal-leave-to .relative {
  transform: scale(0.9);
  opacity: 0;
}
</style>
