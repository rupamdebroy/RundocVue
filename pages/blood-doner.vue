<template>
  <div>
    <Header />
    <WebHeaderNav />
    <section class="min-h-screen bg-gray-100 py-8">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div
          class="relative overflow-hidden rounded-xl shadow-lg mb-12 bg-gradient-to-r from-red-700 to-red-500 min-h-[450px] md:min-h-[350px] lg:min-h-[300px]"
        >
          <img
            :src="heroBackgroundImage"
            alt="Blood Donation"
            class="absolute inset-0 w-full h-full object-cover opacity-50"
          />
          <div
            class="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center p-6 rounded-xl text-white"
          >
            <h1
              class="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 leading-tight text-center animate-fade-in-down"
            >
              <span class="text-red-200">Saving Lives</span> Starts with a Click
            </h1>
            <p
              class="text-lg sm:text-xl text-red-100 mb-4 max-w-3xl text-center opacity-90 animate-fade-in-up"
            >
              Connect with trusted blood doners and make a difference.
            </p>
            <p
              class="text-base text-white opacity-80 mb-6 max-w-2xl text-center animate-fade-in-up"
            >
              Whether it’s an emergency or a planned need, Rundoc bridges doners
              and recipients across India, quickly and ethically.
            </p>
            <div
              class="flex flex-col sm:flex-row justify-center gap-4 mt-4 animate-fade-in-up"
            >
              <NuxtLink
                to="/register-as-a-blood-doner"
                class="inline-flex items-center justify-center bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition-all duration-200 font-semibold text-base shadow-md hover:scale-105"
              >
                <i class="fas fa-hand-holding-heart mr-2"></i> Register as Blood
                Doner
              </NuxtLink>
              <NuxtLink
                to="/find-blood-doners"
                class="inline-flex items-center justify-center bg-red-700 text-white px-6 py-3 rounded-full hover:bg-red-800 transition-all duration-200 font-semibold text-base shadow-md hover:scale-105"
              >
                <i class="fas fa-search mr-2"></i> Find Blood Doner
              </NuxtLink>
            </div>
          </div>
        </div>

        <div class="bg-white p-8 rounded-xl shadow-md mb-12">
          <h2
            class="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-6"
          >
            Why Choose Rundoc for Blood Donation?
          </h2>
          <div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              class="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-100 transition-transform duration-200"
            >
              <div
                class="w-12 h-12 flex items-center justify-center bg-red-100 text-red-600 rounded-full mb-3 text-2xl"
              >
                <i class="fas fa-shield-alt"></i>
              </div>
              <h3 class="font-bold text-lg text-gray-900 mb-1">
                Verified Doners
              </h3>
              <p class="text-gray-700 text-sm hidden sm:block">
                Access a database of verified and updated blood doners.
              </p>
            </div>
            <div
              class="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-100 transition-transform duration-200"
            >
              <div
                class="w-12 h-12 flex items-center justify-center bg-red-100 text-red-600 rounded-full mb-3 text-2xl"
              >
                <i class="fas fa-map-marked-alt"></i>
              </div>
              <h3 class="font-bold text-lg text-gray-900 mb-1">
                Location-Based Search
              </h3>
              <p class="text-gray-700 text-sm hidden sm:block">
                Filter doners by Blood Group, State, District, and City.
              </p>
            </div>
            <div
              class="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-100 transition-transform duration-200"
            >
              <div
                class="w-12 h-12 flex items-center justify-center bg-red-100 text-red-600 rounded-full mb-3 text-2xl"
              >
                <i class="fas fa-rupee-sign"></i>
              </div>
              <h3 class="font-bold text-lg text-gray-900 mb-1">
                100% Free Service
              </h3>
              <p class="text-gray-700 text-sm hidden sm:block">
                No hidden charges or service fees – completely free.
              </p>
            </div>
            <div
              class="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-100 transition-transform duration-200"
            >
              <div
                class="w-12 h-12 flex items-center justify-center bg-red-100 text-red-600 rounded-full mb-3 text-2xl"
              >
                <i class="fas fa-lock"></i>
              </div>
              <h3 class="font-bold text-lg text-gray-900 mb-1">
                Privacy-Focused
              </h3>
              <p class="text-gray-700 text-sm hidden sm:block">
                Your data is secure and handled with confidentiality.
              </p>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 p-8 rounded-xl shadow-md mb-12">
          <h2
            class="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-6"
          >
            How Rundoc Blood Donation Works
          </h2>
          <div
            class="relative grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center"
          >
            <div
              class="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-red-200 z-0 mx-20"
            ></div>

            <div
              class="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-sm border border-gray-200 relative z-10 w-full"
            >
              <div
                class="w-12 h-12 flex items-center justify-center bg-red-600 text-white rounded-full mb-3 text-2xl font-bold border-2 border-red-800"
              >
                <i class="fas fa-search"></i>
              </div>
              <h3 class="font-bold text-lg text-gray-900 mb-1">
                1. Browse Doners
              </h3>
              <p class="text-gray-700 text-sm hidden sm:block">
                Use search filters to find doners by blood group and location.
              </p>
            </div>

            <div
              class="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-sm border border-gray-200 relative z-10 w-full"
            >
              <div
                class="w-12 h-12 flex items-center justify-center bg-red-600 text-white rounded-full mb-3 text-2xl font-bold border-2 border-red-800"
              >
                <i class="fas fa-phone-alt"></i>
              </div>
              <h3 class="font-bold text-lg text-gray-900 mb-1">2. Connect</h3>
              <p class="text-gray-700 text-sm hidden sm:block">
                Access doner contact details securely for urgent or scheduled
                donations.
              </p>
            </div>

            <div
              class="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-sm border border-gray-200 relative z-10 w-full"
            >
              <div
                class="w-12 h-12 flex items-center justify-center bg-red-600 text-white rounded-full mb-3 text-2xl font-bold border-2 border-red-800"
              >
                <i class="fas fa-handshake"></i>
              </div>
              <h3 class="font-bold text-lg text-gray-900 mb-1">
                3. Donate/Receive
              </h3>
              <p class="text-gray-700 text-sm hidden sm:block">
                Coordinate with the doner at an approved healthcare facility.
              </p>
            </div>
          </div>
          <p
            class="text-center text-gray-700 mt-6 italic max-w-2xl mx-auto text-sm"
          >
            <i class="fas fa-info-circle mr-2 text-red-600"></i>Rundoc is
            committed to saving lives through secure and ethical doner
            connections. We do not sell or misuse your data.
          </p>
        </div>

        <div
          class="bg-red-600 p-8 rounded-xl shadow-lg text-white text-center mb-12"
        >
          <h2 class="text-2xl sm:text-3xl font-bold mb-3">
            Be a Lifesaver Today!
          </h2>
          <p class="text-base mb-6 max-w-2xl mx-auto opacity-90">
            Your act of kindness can save a life. Join our community of heroes.
          </p>
          <NuxtLink
            to="/register-as-a-blood-doner"
            class="inline-flex items-center justify-center bg-white text-red-700 px-6 py-3 rounded-full hover:bg-gray-200 transition-all duration-200 font-semibold text-base shadow-md hover:scale-105"
          >
            <i class="fas fa-tint mr-2"></i> Register Now
          </NuxtLink>
        </div>
      </div>
    </section>
    <Footer />
    <BottomNav />
  </div>
</template>

<script setup>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import BottomNav from "~/components/BottomNav.vue";
import { ref } from "vue";

const heroBackgroundImage = ref(
  "https://mgmhealthcare.in/wp-content/uploads/2022/06/Amazing-things-that-happen-to-your-body-when-you-donate-blood-big-1.jpg"
);
</script>

<style scoped>
.container {
  max-width: 1152px;
}

/* Animations */
@keyframes fade-in-down {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-down {
  animation: fade-in-down 0.6s ease-out forwards;
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
}

/* General styling */
.transition-all {
  transition: all 0.2s ease-in-out;
}

/* Specific styles for How It Works connecting line */
@media (min-width: 768px) {
  .how-it-works-grid::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(
      to right,
      transparent,
      #fecaca,
      #fecaca,
      transparent
    );
    z-index: 0;
  }
}
</style>
