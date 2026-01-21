(function() {
    'use strict';

    Lampa.Platform.tv();

    class RussianContentPlugin {
        constructor() {
            this.init();
        }

        init() {
            console.log("LAMPA MANIFEST")
            console.log(Lampa.Manifest.origin)
            if (Lampa.Manifest.origin !== 'bylampa') {
                Lampa.Noty.show('Ошибка доступа');
                return;
            }

            this.today = new Date().toISOString().substr(0, 10);
            this.setupCollections();
            this.setupMenu();
            this.setupCardRenderer();
            this.setupDataSource();
            this.setupSettings();

            if (window.appready) {
                this.onAppReady();
            } else {
                Lampa.Listener.follow('app', (event) => {
                    if (event.type === 'ready') {
                        this.onAppReady();
                    }
                });
            }
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
            const createCategoryComponent = (settings) => {
                const categoryComponent = Lampa.Maker.make('Category', settings);

                return categoryComponent.use({
                    onCreate() {
                        this.body.addClass('mapping--grid');
                        this.body.addClass('cols--5');

                        setTimeout(() => {
                            const data = {
                                results: this.collections.map(collection => ({
                                    title: collection.title,
                                    img: collection.img,
                                    params: {
                                        style: { name: 'collection' },
                                        module: Lampa.Maker.module('Card').only('Card', 'Callback', 'Style')
                                    },
                                    data: {
                                        url: collection.request,
                                        title: collection.title,
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

            return createCategoryComponent;
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

            if (!Lampa.Manifest.plugins) {
                Lampa.Manifest.plugins = {};
            }

            Lampa.Manifest.plugins.rus_movie = pluginInfo;
            Lampa.Component.add('rus_movie', this.createCollectionsComponent());

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

            $('.menu .menu__list').eq(0).append(menuItem);
        }

        setupCardRenderer() {
            class CardEpisodeRenderer {
                constructor(data) {
                    this.cardData = data.card || data;
                    this.episodeData = data.next_episode_to_air || data.episode || {};

                    if (!this.cardData.source) {
                        this.cardData.source = 'tmdb';
                    }

                    Lampa.Arrays.extend(this.cardData, {
                        title: this.cardData.name,
                        original_title: this.cardData.original_name,
                        release_date: this.cardData.first_air_date
                    });

                    this.cardData.release_year = ((this.cardData.release_date || '0000') + '').slice(0, 4);
                }

                build() {
                    this.card = Lampa.Template.js('card_episode');
                    this.imgPoster = this.card.querySelector('.card__img') || {};
                    this.imgEpisode = this.card.querySelector('.full-episode__img img') || {};

                    this.card.querySelector('.card__title').innerText = this.cardData.title;
                    this.card.querySelector('.full-episode__num').innerText = this.cardData.unwatched || '';

                    if (this.episodeData && this.episodeData.air_date) {
                        this.card.querySelector('.full-episode__name').innerText =
                            this.episodeData.name || Lampa.Lang.translate('noname');
                        this.card.querySelector('.full-episode__num').innerText =
                            this.episodeData.episode_number || '';
                        this.card.querySelector('.full-episode__date').innerText =
                            this.episodeData.air_date ? Lampa.Utils.parseTime(this.episodeData.air_date).full : '----';
                    }

                    if (this.cardData.release_year === '0000') {
                        this.removeElement(this.card.querySelector('.card__age'));
                    } else {
                        this.card.querySelector('.card__age').innerText = this.cardData.release_year;
                    }

                    this.card.addEventListener('visible', this.visible.bind(this));
                }

                setupImageHandlers() {
                    this.imgPoster.onload = () => {};
                    this.imgPoster.onerror = () => {
                        this.imgPoster.src = './img/img_broken.svg';
                    };

                    this.imgEpisode.onload = () => {
                        this.card.querySelector('.full-episode__img').classList.add('full-episode__img--loaded');
                    };

                    this.imgEpisode.onerror = () => {
                        this.imgEpisode.src = './img/img_broken.svg';
                    };
                }

                create() {
                    this.build();

                    this.card.addEventListener('hover:focus', () => {
                        if (this.onFocus) {
                            this.onFocus(this.card, this.cardData);
                        }
                    });

                    this.card.addEventListener('hover:hover', () => {
                        if (this.onHover) {
                            this.onHover(this.card, this.cardData);
                        }
                    });

                    this.card.addEventListener('hover:enter', () => {
                        if (this.onEnter) {
                            this.onEnter(this.card, this.cardData);
                        }
                    });

                    this.setupImageHandlers();
                }

                visible() {
                    // Set poster image
                    if (this.cardData.poster_path) {
                        this.imgPoster.src = Lampa.Api.img(this.cardData.poster_path);
                    } else if (this.cardData.profile_path) {
                        this.imgPoster.src = Lampa.Api.img(this.cardData.profile_path);
                    } else if (this.cardData.poster) {
                        this.imgPoster.src = this.cardData.poster;
                    } else if (this.cardData.img) {
                        this.imgPoster.src = this.cardData.img;
                    } else {
                        this.imgPoster.src = './img/img_broken.svg';
                    }

                    // Set episode image
                    if (this.cardData.still_path) {
                        this.imgEpisode.src = Lampa.Api.img(this.episodeData.still_path, 'w300');
                    } else if (this.cardData.backdrop_path) {
                        this.imgEpisode.src = Lampa.Api.img(this.cardData.backdrop_path, 'w300');
                    } else if (this.episodeData.img) {
                        this.imgEpisode.src = this.episodeData.img;
                    } else if (this.cardData.img) {
                        this.imgEpisode.src = this.cardData.img;
                    } else {
                        this.imgEpisode.src = './img/img_broken.svg';
                    }

                    if (this.onVisible) {
                        this.onVisible(this.card, this.cardData);
                    }
                }

                destroy() {
                    this.imgPoster.onerror = () => {};
                    this.imgPoster.onload = () => {};
                    this.imgEpisode.onerror = () => {};
                    this.imgEpisode.onload = () => {};

                    this.imgPoster.src = '';
                    this.imgEpisode.src = '';

                    this.removeElement(this.card);

                    this.card = null;
                    this.imgPoster = null;
                    this.imgEpisode = null;
                }

                render(asElement = false) {
                    return asElement ? this.card : $(this.card);
                }

                removeElement(element) {
                    if (element) {
                        element.remove();
                    }
                }
            }

            this.CardEpisodeRenderer = CardEpisodeRenderer;
        }

        setupDataSource() {
            class RussianContentSource {
                constructor() {
                    this.network = new Lampa.Reguest();
                }

                getMainContent(params = {}, callback, errorCallback) {
                    const dateRanges = [
                        { start: 2023, end: 2025 },
                        { start: 2020, end: 2022 },
                        { start: 2017, end: 2019 },
                        { start: 2014, end: 2016 },
                        { start: 2011, end: 2013 }
                    ];

                    const randomRange = dateRanges[Math.floor(Math.random() * dateRanges.length)];
                    const tvStartDate = randomRange.start + '-01-01';
                    const tvEndDate = randomRange.end + '-12-31';

                    const randomRange2 = dateRanges[Math.floor(Math.random() * dateRanges.length)];
                    const movieStartDate = randomRange2.start + '-01-01';
                    const movieEndDate = randomRange2.end + '-12-31';

                    const sortOptions = ['vote_count.desc', 'vote_average.desc', 'popularity.desc', 'revenue.desc'];
                    const randomSort = sortOptions[Math.floor(Math.random() * sortOptions.length)];

                    const sortOptions2 = ['vote_count.desc', 'popularity.desc', 'revenue.desc'];
                    const randomSort2 = sortOptions2[Math.floor(Math.random() * sortOptions2.length)];

                    const today = new Date().toISOString().substr(0, 10);

                    // Add icons to template
                    this.addTemplateIcons();

                    const contentRequests = [
                        // Now Playing Movies
                        (next) => {
                            this.network.get('movie/now_playing', params, (data) => {
                                data.title = Lampa.Lang.translate('title_now_watch');
                                data.icon_svg = Lampa.Template.string('now_icon');
                                data.icon_bgcolor = '#0f7679';
                                data.icon_color = '#fff';
                                data.results.forEach(item => {
                                    item.params = { style: { name: 'collection' } };
                                    data.params = {
                                        items: { view: 4 },
                                        module: Lampa.Maker.module('Line').toggle(
                                            Lampa.Maker.module('Line').MASK.base,
                                            'Icon'
                                        )
                                    };
                                });
                                next(data);
                            }, next);
                        },

                        // Trending Today
                        (next) => {
                            this.network.get('trending/all/day', params, (data) => {
                                data.title = Lampa.Lang.translate('title_trend_day');
                                data.icon_svg = Lampa.Template.string('icon_star');
                                data.icon_bgcolor = '#fff';
                                data.icon_color = '#212121';
                                data.params = {
                                    module: Lampa.Maker.module('Line').toggle(
                                        Lampa.Maker.module('Line').MASK.base,
                                        'Icon'
                                    )
                                };
                                next(data);
                            }, next);
                        },

                        // Trending Week
                        (next) => {
                            this.network.get('trending/all/week', params, (data) => {
                                data.title = Lampa.Lang.translate('title_trend_week');
                                data.icon_svg = Lampa.Template.string('icon_star');
                                data.icon_bgcolor = '#fff';
                                data.icon_color = '#212121';
                                data.params = {
                                    module: Lampa.Maker.module('Line').toggle(
                                        Lampa.Maker.module('Line').MASK.base,
                                        'Icon'
                                    )
                                };
                                next(data);
                            }, next);
                        },

                        // Russian Movies
                        (next) => {
                            this.network.get(`discover/movie?vote_average.gte=5&vote_average.lte=9.5&with_original_language=ru&sort_by=primary_release_date.desc&primary_release_date.lte=${today}`, params, (data) => {
                                data.title = Lampa.Lang.translate('Русские фильмы');
                                data.icon_svg = Lampa.Template.string('rus_icon');
                                data.icon_bgcolor = 'rgba(255,255,255,0.15)';
                                data.results.forEach(item => {
                                    item.params = { style: { name: 'wide' } };
                                    data.params = {
                                        items: { view: 3 },
                                        module: Lampa.Maker.module('Line').toggle(
                                            Lampa.Maker.module('Line').MASK.base,
                                            'Icon'
                                        )
                                    };
                                });
                                next(data);
                            }, next);
                        },

                        // Russian TV Series
                        (next) => {
                            this.network.get(`discover/tv?with_original_language=ru&sort_by=first_air_date.desc&air_date.lte=${today}`, params, (data) => {
                                data.title = Lampa.Lang.translate('Русские сериалы');
                                data.icon_svg = Lampa.Template.string('rus_icon');
                                data.icon_bgcolor = 'rgba(255,255,255,0.15)';
                                data.params = {
                                    module: Lampa.Maker.module('Line').toggle(
                                        Lampa.Maker.module('Line').MASK.base,
                                        'Icon'
                                    )
                                };
                                next(data);
                            }, next);
                        },

                        // Upcoming Movies
                        (next) => {
                            this.network.get('movie/upcoming', params, (data) => {
                                data.title = Lampa.Lang.translate('title_upcoming');
                                data.icon_svg = Lampa.Template.string('upcoming_icon');
                                data.icon_bgcolor = '#25b7d3';
                                data.params = {
                                    module: Lampa.Maker.module('Line').toggle(
                                        Lampa.Maker.module('Line').MASK.base,
                                        'Icon'
                                    )
                                };
                                next(data);
                            }, next);
                        },

                        // Russian Cartoons
                        (next) => {
                            this.network.get(`discover/movie?vote_average.gte=5&vote_average.lte=9.5&with_genres=16&with_original_language=ru&sort_by=primary_release_date.desc&primary_release_date.lte=${today}`, params, (data) => {
                                data.title = Lampa.Lang.translate('Русские мультфильмы');
                                data.icon_svg = Lampa.Template.string('rus_icon');
                                data.icon_bgcolor = 'rgba(255,255,255,0.15)';
                                data.results.forEach(item => {
                                    item.params = { style: { name: 'collection' } };
                                    data.params = {
                                        items: { view: 4 },
                                        module: Lampa.Maker.module('Line').toggle(
                                            Lampa.Maker.module('Line').MASK.base,
                                            'Icon'
                                        )
                                    };
                                });
                                next(data);
                            }, next);
                        },

                        // Popular Movies
                        (next) => {
                            this.network.get('movie/popular', params, (data) => {
                                data.title = Lampa.Lang.translate('title_popular_movie');
                                data.icon_svg = Lampa.Template.string('icon_fire');
                                data.icon_bgcolor = '#fff';
                                data.icon_color = '#fd4518';
                                data.params = {
                                    module: Lampa.Maker.module('Line').toggle(
                                        Lampa.Maker.module('Line').MASK.base,
                                        'Icon'
                                    )
                                };
                                next(data);
                            }, next);
                        },

                        // Popular TV Shows
                        (next) => {
                            this.network.get('trending/tv/week', params, (data) => {
                                data.title = Lampa.Lang.translate('title_popular_tv');
                                data.icon_svg = Lampa.Template.string('icon_fire');
                                data.icon_bgcolor = '#fff';
                                data.icon_color = '#fd4518';
                                data.params = {
                                    module: Lampa.Maker.module('Line').toggle(
                                        Lampa.Maker.module('Line').MASK.base,
                                        'Icon'
                                    )
                                };
                                next(data);
                            }, next);
                        },

                        // Random Russian Movies Collection
                        (next) => {
                            this.network.get(`discover/movie?primary_release_date.gte=${movieStartDate}&primary_release_date.lte=${movieEndDate}&vote_average.gte=5&vote_average.lte=9.5&with_original_language=ru&sort_by=${randomSort2}`, params, (data) => {
                                data.title = Lampa.Lang.translate('Подборки русских фильмов');
                                data.icon_svg = Lampa.Template.string('icon_collection');
                                data.icon_color = '#fff';
                                data.icon_bgcolor = 'rgba(255,255,255,0.15)';
                                data.params = {
                                    module: Lampa.Maker.module('Line').toggle(
                                        Lampa.Maker.module('Line').MASK.base,
                                        'Icon'
                                    )
                                };
                                next(data);
                            }, next);
                        },

                        // Random Russian TV Series Collection
                        (next) => {
                            this.network.get(`discover/tv?first_air_date.gte=${tvStartDate}&first_air_date.lte=${tvEndDate}&with_networks=2493|2859|4085|3923|3871|3827|5806|806|1191&sort_by=${randomSort}`, params, (data) => {
                                data.title = Lampa.Lang.translate('Подборки русских сериалов');
                                data.icon_svg = Lampa.Template.string('icon_collection');
                                data.icon_color = '#fff';
                                data.icon_bgcolor = 'rgba(255,255,255,0.15)';
                                data.params = {
                                    module: Lampa.Maker.module('Line').toggle(
                                        Lampa.Maker.module('Line').MASK.base,
                                        'Icon'
                                    )
                                };
                                next(data);
                            }, next);
                        },

                        // Start Channel
                        (next) => {
                            this.network.get(`discover/tv?with_networks=2493&sort_by=first_air_date.desc&air_date.lte=${today}`, params, (data) => {
                                data.title = Lampa.Lang.translate('Start');
                                data.icon_svg = Lampa.Template.string('start_icon');
                                data.icon_bgcolor = '#ff0019';
                                data.icon_color = '#fff';
                                data.results.forEach(item => {
                                    item.params = { style: { name: 'wide' } };
                                    data.params = {
                                        items: { view: 3 },
                                        module: Lampa.Maker.module('Line').toggle(
                                            Lampa.Maker.module('Line').MASK.base,
                                            'Icon'
                                        )
                                    };
                                });
                                next(data);
                            }, next);
                        },

                        // Premier Channel
                        (next) => {
                            this.network.get(`discover/tv?with_networks=2859&sort_by=first_air_date.desc&air_date.lte=${today}`, params, (data) => {
                                data.title = Lampa.Lang.translate('Premier');
                                data.icon_svg = Lampa.Template.string('premier_icon');
                                data.icon_bgcolor = 'rgba(255,255,255,0.15)';
                                data.icon_color = '#fddd2d';
                                data.params = {
                                    module: Lampa.Maker.module('Line').toggle(
                                        Lampa.Maker.module('Line').MASK.base,
                                        'Icon'
                                    )
                                };
                                next(data);
                            }, next);
                        },

                        // KION Channel
                        (next) => {
                            this.network.get(`discover/tv?with_networks=4085&sort_by=first_air_date.desc&air_date.lte=${today}`, params, (data) => {
                                data.title = Lampa.Lang.translate('KION');
                                data.icon_svg = Lampa.Template.string('kion_icon');
                                data.icon_bgcolor = '#792788';
                                data.icon_color = '#fff';
                                data.params = {
                                    module: Lampa.Maker.module('Line').toggle(
                                        Lampa.Maker.module('Line').MASK.base,
                                        'Icon'
                                    )
                                };
                                next(data);
                            }, next);
                        },

                        // IVI Channel
                        (next) => {
                            this.network.get(`discover/tv?with_networks=3923&sort_by=first_air_date.desc&air_date.lte=${today}`, params, (data) => {
                                data.title = Lampa.Lang.translate('IVI');
                                data.icon_svg = Lampa.Template.string('ivi_icon');
                                data.icon_bgcolor = '#f2144f';
                                data.icon_color = '#fff';
                                data.results.forEach(item => {
                                    item.params = { style: { name: 'collection' } };
                                    data.params = {
                                        items: { view: 4 },
                                        module: Lampa.Maker.module('Line').toggle(
                                            Lampa.Maker.module('Line').MASK.base,
                                            'Icon'
                                        )
                                    };
                                });
                                next(data);
                            }, next);
                        },

                        // Okko Channel
                        (next) => {
                            this.network.get(`discover/tv?with_networks=3871&sort_by=first_air_date.desc&air_date.lte=${today}`, params, (data) => {
                                data.title = Lampa.Lang.translate('OKKO');
                                data.icon_svg = Lampa.Template.string('okko_icon');
                                data.icon_bgcolor = '#380c81';
                                data.icon_color = '#fff';
                                data.params = {
                                    module: Lampa.Maker.module('Line').toggle(
                                        Lampa.Maker.module('Line').MASK.base,
                                        'Icon'
                                    )
                                };
                                next(data);
                            }, next);
                        },

                        // Kinopoisk Channel
                        (next) => {
                            this.network.get(`discover/tv?with_networks=3827&sort_by=first_air_date.desc&air_date.lte=${today}`, params, (data) => {
                                data.title = Lampa.Lang.translate('КиноПоиск');
                                data.icon_svg = Lampa.Template.string('kinopoisk_icon');
                                data.icon_bgcolor = 'rgba(255,255,255,0.15)';
                                data.icon_color = '#fe5d0f';
                                data.params = {
                                    module: Lampa.Maker.module('Line').toggle(
                                        Lampa.Maker.module('Line').MASK.base,
                                        'Icon'
                                    )
                                };
                                next(data);
                            }, next);
                        },

                        // Wink Channel
                        (next) => {
                            this.network.get(`discover/tv?with_networks=5806&sort_by=first_air_date.desc&air_date.lte=${today}`, params, (data) => {
                                data.title = Lampa.Lang.translate('Wink');
                                data.icon_svg = Lampa.Template.string('wink_icon');
                                data.icon_bgcolor = '#fff';
                                data.icon_color = '#ff5b22';
                                data.results.forEach(item => {
                                    item.params = { style: { name: 'wide' } };
                                    data.params = {
                                        items: { view: 3 },
                                        module: Lampa.Maker.module('Line').toggle(
                                            Lampa.Maker.module('Line').MASK.base,
                                            'Icon'
                                        )
                                    };
                                });
                                next(data);
                            }, next);
                        },

                        // CTC Channel
                        (next) => {
                            this.network.get(`discover/tv?with_networks=806&sort_by=first_air_date.desc&air_date.lte=${today}`, params, (data) => {
                                data.title = Lampa.Lang.translate('СТС');
                                data.icon_svg = Lampa.Template.string('sts_icon');
                                data.icon_bgcolor = '#fff';
                                data.params = {
                                    module: Lampa.Maker.module('Line').toggle(
                                        Lampa.Maker.module('Line').MASK.base,
                                        'Icon'
                                    )
                                };
                                next(data);
                            }, next);
                        },

                        // TNT Channel
                        (next) => {
                            this.network.get(`discover/tv?with_networks=1191&sort_by=first_air_date.desc&air_date.lte=${today}`, params, (data) => {
                                data.title = Lampa.Lang.translate('ТНТ');
                                data.icon_svg = Lampa.Template.string('tnt_icon');
                                data.icon_bgcolor = '#fff';
                                data.params = {
                                    module: Lampa.Maker.module('Line').toggle(
                                        Lampa.Maker.module('Line').MASK.base,
                                        'Icon'
                                    )
                                };
                                next(data);
                            }, next);
                        },

                        // Top Rated Movies
                        (next) => {
                            this.network.get('movie/top_rated', params, (data) => {
                                data.title = Lampa.Lang.translate('title_top_movie');
                                data.icon_svg = Lampa.Template.string('icon_top');
                                data.icon_bgcolor = '#e02129';
                                data.params = {
                                    module: Lampa.Maker.module('Line').toggle(
                                        Lampa.Maker.module('Line').MASK.base,
                                        'Icon'
                                    )
                                };
                                next(data);
                            }, next);
                        },

                        // Top Rated TV Shows
                        (next) => {
                            this.network.get('tv/top_rated', params, (data) => {
                                data.title = Lampa.Lang.translate('title_top_tv');
                                data.icon_svg = Lampa.Template.string('icon_top');
                                data.icon_bgcolor = '#e02129';
                                data.params = {
                                    module: Lampa.Maker.module('Line').toggle(
                                        Lampa.Maker.module('Line').MASK.base,
                                        'Icon'
                                    )
                                };
                                next(data);
                            }, next);
                        }
                    ];

                    // Add genre-based collections
                    Lampa.Api.sources.tmdb.genres.movie.forEach(genre => {
                        contentRequests.push((next) => {
                            this.network.get(`discover/movie?with_genres=${genre.id}`, params, (data) => {
                                data.title = Lampa.Lang.translate(genre.title.replace(/[^a-z_]/g, ''));
                                next(data);
                            }, next);
                        });
                    });

                    Lampa.ContentRows.call('main', params, contentRequests);

                    // Add person recommendations
                    const totalItems = contentRequests.length + 1;
                    Lampa.Arrays.insert(contentRequests, 0,
                        Lampa.Api.partPersons(contentRequests, 6, 'movie', totalItems));

                    return (page, callback) => {
                        Lampa.Api.partNext(contentRequests, 6, page, callback);
                    };
                }

                addTemplateIcons() {
                    // Add all SVG icons to Lampa.Template
                    const icons = {
                        'now_icon': '...', // SVG content shortened for brevity
                        'upcoming_icon': '...',
                        'rus_icon': '...',
                        'start_icon': '...',
                        'premier_icon': '...',
                        'kion_icon': '...',
                        'ivi_icon': '...',
                        'okko_icon': '...',
                        'kinopoisk_icon': '...',
                        'wink_icon': '...',
                        'sts_icon': '...',
                        'tnt_icon': '...'
                    };

                    Object.entries(icons).forEach(([name, svg]) => {
                        Lampa.Template.add(name, svg);
                    });
                }
            }

            // Replace TMDB source with our enhanced source
            if (Lampa.Storage.get('rus_movie_main') !== false) {
                Object.assign(Lampa.Api.sources.tmdb, new RussianContentSource(Lampa.Api.sources.tmdb));
                this.setupAutoRedirect();
            }
        }

        setupAutoRedirect() {
            // Anti-debugging protection removed for clarity

            if (Lampa.Storage.get('source') === 'tmdb') {
                const currentSource = Lampa.Storage.get('source');
                const redirectInterval = setInterval(() => {
                    const activeActivity = Lampa.Activity.active();
                    const settingsElements = $('#app > div.settings > div.settings__content.layer--height > div.settings__body > div');

                    if (activeActivity &&
                        activeActivity.component === 'main' &&
                        !settingsElements.length > 0) {

                        clearInterval(redirectInterval);
                        Lampa.Activity.replace({
                            source: currentSource,
                            title: `${Lampa.Lang.translate('title_main')} - ${Lampa.Storage.field('source').toUpperCase()}`
                        });
                    }
                }, 200);
            }
        }

        setupSettings() {
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
                        $('div[data-name="rus_movie_main"]').insertAfter('div[data-name="interface_size"]');
                    }, 0);
                }
            });
        }

        onAppReady() {
            // Main initialization when app is ready
            console.log('Russian Content Plugin initialized');
        }
    }

    // Initialize the plugin
    new RussianContentPlugin();

})();