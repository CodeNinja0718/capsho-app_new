<script setup>
  const footerCompany = [
    { name: 'Contact Us', link: '/contact' },
    { name: 'Pricing', link: '/pricing' }
  ]
  const footerSupport = [
    { name: 'Terms and conditions', link: '/terms-and-conditions' },
    { name: 'Privacy policy', link: '/privacy-policy' }
  ]
</script>

<template>
  <div>
    <footer class="footer relative pt-1 pb-8">
      <div class="container">
        <div class="flex flex-col justify-between">
          <div class="sm:flex sm:mt-8">
            <div class="mt-8 sm:mt-0 sm:w-full flex flex-col md:flex-row md:justify-start">
              <div class="flex flex-col align-start md:mr-5">
                <div class="flex justify-center md:justify-start">
                  <img
                    src="../assets/logo/logo-purple.png"
                    class="w-1/4"
                    alt="App brand purple logo"
                  >
                </div>
                <span class="py-8 pr-4 font-body text-center sm:text-left">Copyright © 2021 Capsho.</span>
                <div class="flex flex-row justify-center sm:justify-start items-start pb-4">
                  <a
                    href="https://www.instagram.com/capshohq/"
                    target="_blank"
                    class="mr-2"
                  >
                    <button class="bg-gray-200 py-3 px-3 rounded-full">
                      <img
                        src="../assets/socials/instagram-footer.svg"
                        alt="Instagram logo"
                      >
                    </button>
                  </a>
                  <a
                    href="https://www.facebook.com/capshohq"
                    target="_blank"
                    class="mx-2"
                  >
                    <button class="bg-gray-200 py-3 px-3 rounded-full">
                      <img
                        src="../assets/socials/facebook-footer.svg"
                        alt="Facebook logo"
                      >
                    </button>
                  </a>
                  <a
                    href="https://www.pinterest.com/capsho"
                    target="_blank"
                    class="ml-2"
                  >
                    <button class="bg-gray-200 py-3 px-3 rounded-full">
                      <img
                        src="../assets/socials/pinterest-footer.svg"
                        alt="Pinterest logo"
                      >
                    </button>
                  </a>
                </div>
              </div>
              <div class="font-body sm:flex sm:flex-row">
                <div class="flex flex-col sm:pr-3 py-4 md:py-0">
                  <span class="font-bold text-center sm:text-left mb-2">Company</span>
                  <button
                    v-for="(item, i) in footerCompany"
                    :key="i"
                    class="py-2 text-center sm:text-left"
                  >
                    <router-link :to="item.link">
                      {{ item.name }}
                    </router-link>
                  </button>
                </div>
                <div class="flex flex-col sm:px-6 py-4 md:py-0">
                  <span class="font-bold mb-2 text-center sm:text-left">Support</span>
                  <button
                    v-for="(item, i) in footerSupport"
                    :key="i"
                    class="py-2 text-center sm:text-left"
                  >
                    <router-link :to="item.link">
                      {{ item.name }}
                    </router-link>
                  </button>
                </div>
                <div class="flex flex-col sm:pl-3 py-4 md:py-0">
                  <span class="font-bold mb-2 text-center sm:text-left">Unlock Viralocity Marketing Secrets</span>
                  <div class="flex justify-center sm:justify-start">
                    <a
                      href="https://www.capshoplans.com/gimmedemtips"
                      target="_blank"
                    >
                      <button class="py-2 text-center sm:text-left">
                        Gimme dem tips!
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
