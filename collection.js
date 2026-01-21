(function() {
    'use strict';

    class RussianContentPlugin {
        constructor() {
            this.init();
        }

        init() {
            // Убираем вызов Lampa.Platform.tv() для совместимости

            if (window.appready) {
                this.setupPlugin();
            } else {
                Lampa.Listener && Lampa.Listener.follow('app', (event) => {
                    if (event.type === 'ready') {
                        this.setupPlugin();
                    }
                });
            }
        }

        setupPlugin() {
            // Проверяем доступность TMDB
            if (!Lampa.Api || !Lampa.Api.sources || !Lampa.Api.sources.tmdb) {
                console.error('Lampa: TMDB source not available');
                return;
            }

            this.today = new Date().toISOString().substr(0, 10);

            this.setupCollections();
            this.setupMenu();
            this.setupMainPageContent();
            this.setupSettings();
        }

        setupCollections() {
            this.collections = [
                {
                    title: 'Русские фильмы',
                    img: 'https://bylampa.github.io/img/rus_movie.jpg',
                    request: `discover/movie?sort_by=primary_release_date.desc&with_original_language=ru&vote_average.gte=5&vote_average.lte=9.5&primary_release_date.lte=${this.today}`
                },
                {
                    title: 'Русские сериалы',
                    img: 'https://bylampa.github.io/img/rus_tv.jpg',
                    request: `discover/tv?sort_by=first_air_date.desc&with_original_language=ru&air_date.lte=${this.today}`
                },
                {
                    title: 'Русские мультфильмы',
                    img: 'https://bylampa.github.io/img/rus_mult.jpg',
                    request: `discover/movie?sort_by=primary_release_date.desc&vote_average.gte=5&vote_average.lte=9.5&with_genres=16&with_original_language=ru&primary_release_date.lte=${this.today}`
                },
                {
                    title: 'Start',
                    img: 'https://bylampa.github.io/img/start.jpg',
                    request: `discover/tv?with_networks=2493&sort_by=first_air_date.desc&air_date.lte=${this.today}`
                },
                {
                    title: 'Premier',
                    img: 'https://bylampa.github.io/img/premier.jpg',
                    request: `discover/tv?with_networks=2859&sort_by=first_air_date.desc&air_date.lte=${this.today}`
                },
                {
                    title: 'KION',
                    img: 'https://bylampa.github.io/img/kion.jpg',
                    request: `discover/tv?with_networks=4085&sort_by=first_air_date.desc&air_date.lte=${this.today}`
                },
                {
                    title: 'ИВИ',
                    img: 'https://bylampa.github.io/img/ivi.jpg',
                    request: `discover/tv?with_networks=3923&sort_by=first_air_date.desc&air_date.lte=${this.today}`
                },
                {
                    title: 'Okko',
                    img: 'https://bylampa.github.io/img/okko.jpg',
                    request: `discover/tv?with_networks=3871&sort_by=first_air_date.desc&air_date.lte=${this.today}`
                },
                {
                    title: 'КиноПоиск',
                    img: 'https://bylampa.github.io/img/kinopoisk.jpg',
                    request: `discover/tv?with_networks=3827&sort_by=first_air_date.desc&air_date.lte=${this.today}`
                },
                {
                    title: 'Wink',
                    img: 'https://bylampa.github.io/img/wink.jpg',
                    request: `discover/tv?with_networks=5806&sort_by=first_air_date.desc&air_date.lte=${this.today}`
                },
                {
                    title: 'СТС',
                    img: 'https://bylampa.github.io/img/sts.jpg',
                    request: `discover/tv?with_networks=806&sort_by=first_air_date.desc&air_date.lte=${this.today}`
                },
                {
                    title: 'ТНТ',
                    img: 'https://bylampa.github.io/img/tnt.jpg',
                    request: `discover/tv?with_networks=1191&sort_by=first_air_date.desc&air_date.lte=${this.today}`
                }
            ];
        }

        createCollectionsComponent() {
            return (settings) => {
                const component = Lampa.Component.make('Category', settings);

                return component.use({
                    onCreate() {
                        this.body.addClass('mapping--grid');
                        this.body.addClass('cols--5');

                        setTimeout(() => {
                            const data = {
                                results: this.collections.map(item => ({
                                    title: item.title,
                                    img: item.img,
                                    params: {
                                        style: { name: 'collection' },
                                        module: Lampa.Maker.module('Card').only('Card', 'Callback', 'Style')
                                    },
                                    data: {
                                        url: item.request,
                                        title: item.title,
                                        component: 'category_full',
                                        source: 'tmdb',
                                        page: 1
                                    }
                                }))
                            };

                            this.build(data);
                            $('.card', this.body).css('text-align', 'center');
                        }, 100);
                    },

                    onInstance(instance, itemData) {
                        instance.use({
                            onlyEnter() {
                                if (itemData && itemData.data) {
                                    Lampa.Activity.push(itemData.data);
                                }
                            }
                        });
                    }
                });
            };
        }

        setupMenu() {
            const menuIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 48 48">
                <g fill="none" stroke="currentColor" stroke-width="4">
                    <path stroke-linejoin="round" d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z"/>
                    <path stroke-linejoin="round" d="M24 18a3 3 0 1 0 0-6a3 3 0 0 0 0 6Zm0 18a3 3 0 1 0 0-6a3 3 0 0 0 0 6Zm-9-9a3 3 0 1 0 0-6a3 3 0 0 0 0 6Zm18 0a3 3 0 1 0 0-6a3 3 0 0 0 0 6Z"/>
                    <path stroke-linecap="round" d="M24 44h20"/>
                </g>
            </svg>`;

            const pluginInfo = {
                type: 'video',
                version: '1.0.0',
                name: 'Русское',
                description: 'Русские новинки',
                component: 'rus_movie'
            };

            // Регистрируем плагин
            if (!Lampa.Manifest.plugins) {
                Lampa.Manifest.plugins = {};
            }

            Lampa.Manifest.plugins.rus_movie = pluginInfo;
            Lampa.Component.add('rus_movie', this.createCollectionsComponent());

            // Добавляем пункт меню
            const menuItem = $(`
                <li class="menu__item selector">
                    <div class="menu__ico">${menuIcon}</div>
                    <div class="menu__text">${pluginInfo.name}</div>
                </li>
            `);

            menuItem.on('hover:enter', () => {
                Lampa.Activity.push({
                    url: '',
                    title: pluginInfo.name,
                    component: 'rus_movie',
                    page: 1
                });
            });

            // Ищем меню и добавляем пункт
            const menuList = $('.menu .menu__list').eq(0);
            if (menuList.length) {
                menuList.append(menuItem);
            } else {
                // Если меню не найдено, добавляем позже
                setTimeout(() => {
                    $('.menu .menu__list').eq(0).append(menuItem);
                }, 1000);
            }
        }

        setupMainPageContent() {
            // Добавляем контент на главную страницу
            if (Lampa.Storage && Lampa.Storage.get('rus_movie_main') !== false) {
                this.injectMainPageSections();
            }
        }

        injectMainPageSections() {
            // Этот метод будет добавлять разделы на главную страницу
            // Реализация зависит от структуры главной страницы Lampa

            setTimeout(() => {
                // Добавляем разделы через ContentRows если доступно
                if (Lampa.ContentRows) {
                    this.addContentRows();
                }
            }, 2000);
        }

        addContentRows() {
            // Добавляем русский контент в ряды на главной
            // Примерная реализация - нужно адаптировать под конкретную версию Lampa
            const sections = [
                {
                    title: 'Русские новинки',
                    request: `discover/movie?sort_by=primary_release_date.desc&with_original_language=ru&vote_average.gte=5&vote_average.lte=9.5&primary_release_date.lte=${this.today}`,
                    type: 'movie'
                },
                {
                    title: 'Русские сериалы',
                    request: `discover/tv?sort_by=first_air_date.desc&with_original_language=ru&air_date.lte=${this.today}`,
                    type: 'tv'
                }
            ];

            // Добавляем каждый раздел
            sections.forEach(section => {
                if (Lampa.ContentRows.addSection) {
                    Lampa.ContentRows.addSection({
                        title: section.title,
                        url: section.request,
                        component: 'category_full'
                    });
                }
            });
        }

        setupSettings() {
            // Добавляем настройку в интерфейс
            if (Lampa.SettingsApi && Lampa.SettingsApi.addParam) {
                Lampa.SettingsApi.addParam({
                    component: 'interface',
                    param: {
                        name: 'rus_movie_main',
                        type: 'trigger',
                        default: true
                    },
                    field: {
                        name: 'Русские новинки на главной',
                        description: 'Показывать подборки русских новинок на главной странице. После изменения параметра приложение нужно перезапустить (работает только с TMDB)'
                    },
                    onRender: (field) => {
                        setTimeout(() => {
                            const target = $('div[data-name="interface_size"]');
                            if (target.length) {
                                $(field).insertAfter(target);
                            }
                        }, 0);
                    }
                });
            }
        }
    }

    // Инициализируем плагин с задержкой для совместимости
    setTimeout(() => {
        try {
            new RussianContentPlugin();
            console.log('Lampa: Russian Content Plugin loaded successfully');
        } catch (error) {
            console.error('Lampa: Failed to load Russian Content Plugin', error);
        }
    }, 1000);

})();