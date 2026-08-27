<template>
    <div>

        <!-- 语言选择面板 -->
        <div v-if="showDrawer" class="fixed top-0 right-0 z-50 h-screen p-4 overflow-y-auto bg-white w-80 shadow-lg" tabindex="-1">
            <div class="flex justify-between items-center mb-4">
                <h5 class="inline-flex items-center text-base font-semibold text-gray-500 dark:text-gray-400">
                    <img src="/public/storage/idioma_1.png" alt="Language Icon" class="w-4 h-4 mr-2.5">
                    {{ $t('Select language') }}
                </h5>
                <button @click="toggleModal" type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex items-center justify-center">
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span class="sr-only">Close menu</span>
                </button>
            </div>

            <div class="relative h-[calc(100%_-_64px)] w-full px-10">
                <div class="grid grid-cols-2 py-6">
                    <div class="relative my-4 flex items-center justify-center">
                        <div class="relative">
                            <input type="radio" v-model="language" value="en" name="language_selection" class="peer absolute start-0 top-0 z-20 h-full w-full cursor-pointer opacity-0" />
                            <div class="border-gray-200 peer-checked:border-primary-500 flex h-14 w-14 items-center justify-center rounded-full border-2 shadow-lg transition-all duration-300">
                                <img class="h-10 w-10 rounded-full" :src="`/static/image/transfer/united-states-of-america.svg`" alt="flag icon" />
                            </div>
                            <div class="bg-primary-500 absolute -end-1 -top-1 hidden h-7 w-7 items-center justify-center rounded-full border-4 border-white text-white peer-checked:flex">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="icon h-3 w-3" width="1em" height="1em" viewBox="0 0 24 24">
                                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 6L9 17l-5-5"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div class="relative my-4 flex items-center justify-center">
                        <div class="relative">
                            <input type="radio" v-model="language" value="pt" name="language_selection" class="peer absolute start-0 top-0 z-20 h-full w-full cursor-pointer opacity-0" />
                            <div class="border-gray-200 peer-checked:border-primary-500 flex h-14 w-14 items-center justify-center rounded-full border-2 shadow-lg transition-all duration-300">
                                <img class="h-10 w-10 rounded-full" :src="`/static/image/transfer/brasil.svg`" alt="flag icon" />
                            </div>
                            <div class="bg-primary-500 absolute -end-1 -top-1 hidden h-7 w-7 items-center justify-center rounded-full border-4 border-white text-white peer-checked:flex">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="icon h-3 w-3" width="1em" height="1em" viewBox="0 0 24 24">
                                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 6L9 17l-5-5"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div class="relative my-4 flex items-center justify-center">
                        <div class="relative">
                            <input type="radio" v-model="language" value="th" name="language_selection" class="peer absolute start-0 top-0 z-20 h-full w-full cursor-pointer opacity-0" />
                            <div class="border-gray-200 peer-checked:border-primary-500 flex h-14 w-14 items-center justify-center rounded-full border-2 shadow-lg transition-all duration-300">
                                <img class="h-10 w-10 rounded-full" :src="`/static/image/transfer/thailand.svg`" alt="flag icon" />
                            </div>
                            <div class="bg-primary-500 absolute -end-1 -top-1 hidden h-7 w-7 items-center justify-center rounded-full border-4 border-white text-white peer-checked:flex">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="icon h-3 w-3" width="1em" height="1em" viewBox="0 0 24 24">
                                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 6L9 17l-5-5"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div class="relative my-4 flex items-center justify-center">
                        <div class="relative">
                            <input type="radio" v-model="language" value="vi" name="language_selection" class="peer absolute start-0 top-0 z-20 h-full w-full cursor-pointer opacity-0" />
                            <div class="border-gray-200 peer-checked:border-primary-500 flex h-14 w-14 items-center justify-center rounded-full border-2 shadow-lg transition-all duration-300">
                                <img class="h-10 w-10 rounded-full" :src="`/static/image/transfer/vietnam.svg`" alt="flag icon" />
                            </div>
                            <div class="bg-primary-500 absolute -end-1 -top-1 hidden h-7 w-7 items-center justify-center rounded-full border-4 border-white text-white peer-checked:flex">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="icon h-3 w-3" width="1em" height="1em" viewBox="0 0 24 24">
                                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 6L9 17l-5-5"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 背景遮罩 -->
        <div v-if="showDrawer" @click="toggleModal" class="fixed inset-0 z-40 bg-black bg-opacity-50"></div>
    </div>
</template>

<script>
    import HttpApi from "@/services/httpapi.js";

    export default {
        props: [],
        data() {
            return {
                isLoading: false,
                showDrawer: false,
                language: 'en',
                routeParams: {
                    lang: null
                }
            }
        },
        computed: {

        },
        mounted() {
            const params = new URLSearchParams(window.location.search);
            if (params.has('lang')) {
                this.routeParams.lang = params.get('lang');
                this.updateLangWithParam(this.routeParams.lang);
            }
            this.getLanguage();
        },
        methods: {
            updateLangWithParam: async function(language) {
                if(language === 'pt-br') {
                    language = 'pt';
                }
                this.$i18n.locale = language;
                this.language = language;

                await HttpApi.put('/profile/updateLanguage', { language: language })
                    .then(response => {

                    })
                    .catch(error => { });
            },
            toggleModal() {
                this.showDrawer = !this.showDrawer;
            },
            getLanguage: async function() {
                const _this = this;
                _this.isLoading = true;

                await HttpApi.post('/profile/getLanguage', {  })
                    .then(response => {
                        _this.$i18n.locale = response.data.language;
                        _this.language = response.data.language;
                        _this.isLoading = false;
                    })
                    .catch(error => {
                        _this.isLoading = false;
                    });
            },
            updateLanguage: async function() {
                const _this = this;

                if(!this.routeParams.lang) {
                    _this.isLoading = true;
                    _this.$i18n.locale = _this.language;

                    await HttpApi.put('/profile/updateLanguage', { language: _this.language })
                        .then(response => {
                            _this.isLoading = false;
                        })
                        .catch(error => {
                            _this.isLoading = false;
                        });
                }
            }
        },
        watch: {
            language(newValue, oldValue) {
                this.updateLanguage();
            }
        },
    };
</script>

<style scoped>

</style>

