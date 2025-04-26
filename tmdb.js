const TMDB = {
    apiKey: '93648c872be3879cbab3623bdf67763b',
    baseUrl: 'https://api.themoviedb.org/3',
    imageBase: 'https://image.tmdb.org/t/p/w500',

    // Cache per memorizzare le risposte già ottenute
    cache: new Map(),

    async fetchWithCache(url) {
        if (this.cache.has(url)) {
            return this.cache.get(url);
        }

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            this.cache.set(url, data);
            return data;
        } catch (error) {
            console.error('Fetch error:', error);
            return null;
        }
    },

    async getPopularMovies() {
        const url = `${this.baseUrl}/movie/popular?api_key=${this.apiKey}&language=it-IT`;
        const data = await this.fetchWithCache(url);

        if (!data || !data.results) return [];
        return this.processItems(data.results.slice(0, 12), 'movie');
    },

    async getPopularTVShows() {
        const url = `${this.baseUrl}/tv/popular?api_key=${this.apiKey}&language=it-IT`;
        const data = await this.fetchWithCache(url);

        if (!data || !data.results) return [];
        return this.processItems(data.results.slice(0, 12), 'tv');
    },

    async processItems(items, type) {
        return Promise.all(items.map(async item => {
            const trailer = await this.getTrailer(type, item.id);
            return {
                id: item.id,
                title: type === 'movie' ? item.title : item.name,
                poster: item.poster_path ?
                    `${this.imageBase}${item.poster_path}` :
                    'https://via.placeholder.com/500x750?text=No+Poster',
                trailer: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null,
                overview: item.overview,
                rating: item.vote_average,
                releaseDate: type === 'movie' ? item.release_date : item.first_air_date
            };
        }));
    },

    async getTrailer(type, id) {
        const url = `${this.baseUrl}/${type}/${id}/videos?api_key=${this.apiKey}`;
        const data = await this.fetchWithCache(url);

        if (!data || !data.results) return null;

        // Cerca prima un trailer ufficiale, altrimenti prendi il primo trailer YouTube
        return data.results.find(video =>
            video.type === 'Trailer' && video.site === 'YouTube' && video.official
        ) || data.results.find(video =>
            video.type === 'Trailer' && video.site === 'YouTube'
        );
    },

    // Metodo per cercare contenuti
    async search(query, type = 'multi') {
        const url = `${this.baseUrl}/search/${type}?api_key=${this.apiKey}&language=it-IT&query=${encodeURIComponent(query)}`;
        const data = await this.fetchWithCache(url);

        if (!data || !data.results) return [];
        return this.processItems(data.results.slice(0, 10), type === 'multi' ? 'mixed' : type);
    },

    async enhancedSearch(query, type = 'multi') {
        const url = `${this.baseUrl}/search/${type}?api_key=${this.apiKey}&language=it-IT&query=${encodeURIComponent(query)}`;
        const data = await this.fetchWithCache(url);

        if (!data || !data.results) return [];

        // Processa tutti i risultati e cerca i trailer per ciascuno
        return Promise.all(data.results.slice(0, 10).map(async item => {
            const mediaType = item.media_type || type;
            const trailer = await this.getTrailer(mediaType, item.id);

            return {
                id: item.id,
                title: item.title || item.name,
                overview: item.overview,
                poster_path: item.poster_path,
                release_date: item.release_date || item.first_air_date,
                media_type: mediaType,
                trailer: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null
            };
        }));
    }
};
