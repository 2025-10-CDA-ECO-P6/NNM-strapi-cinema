import {
    chunkArray,
    deduplicateMovies,
    exctractUniqueActorIds,
    enrichMovieWithDetails,
    determineActorsToFetch,
    prepareActorData,
    prepareMovieData
} from '../../../src/api/tmdb/utils/pure-logic-function';

import { MovieDto, ActorDto, RawCreditResponse, RawImagesResponse } from '../../../src/api/tmdb/types/types';


describe('Pure Logic Functions - PRIORITE 1', ()=> {

    describe('chunkArray', () => {
        it('Diviser un tableau en chunk de taille spécifiée', () => {
            const arr = [1, 2, 3, 4, 5, 6, 7];
            const result = chunkArray(arr, 3);
            expect(result).toEqual([[1, 2, 3], [4, 5, 6], [7]]);
        });

        it('Devrait gérer un tableau vide', () => {
            expect(chunkArray([], 3)).toEqual([]);
        });

        it('Devrait géré une taille de chunk plus grande que le tableau', () => {
            expect(chunkArray([1, 2], 5)).toEqual([[1, 2]]);
        });

    });

        describe('deduplicateMovies', () => {
            it('devrait supprimer les films en double par id', () => {
                const movies: MovieDto[] = [
                    {
                        id: 1,
                        title: 'Movie A',
                        description: '',
                        release_date: null,
                        realisator: null,
                        background_image: null,
                        poster_image: null,
                        actors: []
                    },
                    {
                        id: 2,
                        title: 'Movie B',
                        description: '',
                        release_date: null,
                        realisator: null,
                        background_image: null,
                        poster_image: null,
                        actors: []
                    },
                    {
                        id: 1,
                        title: 'Movie A Duplicate',
                        description: '',
                        release_date: null,
                        realisator: null,
                        background_image: null,
                        poster_image: null,
                        actors: []
                    }
                ];
                const results = deduplicateMovies(movies);
                expect(results).toHaveLength(2);
                expect(results.map(m => m.id)).toEqual([1, 2]);
            });

            it('devrait conserver la première occurrence en cas de doublons', () => {
                const movies: MovieDto[] = [
                    {
                        id: 1,
                        title: 'First',
                        description: '',
                        release_date: null,
                        realisator: null,
                        background_image: null,
                        poster_image: null,
                        actors: []
                    },
                    {
                        id: 1,
                        title: 'Second',
                        description: '',
                        release_date: null,
                        realisator: null,
                        background_image: null,
                        poster_image: null,
                        actors: []
                    }
                ];
                const result = deduplicateMovies(movies);
                expect(result[0].title).toBe('First');
            });
        })


        describe('exctractUniqueActorIds', () => {
            it('devrait extraire les IDs uniques des acteurs depuis les films', () => {
                const movies: MovieDto[] = [
                    {
                        id: 1, title: 'Movie', description: '', release_date: null, realisator: null,
                        background_image: null, poster_image: null,
                        actors: [
                            {tmdb_actor_id: 101, name: 'Actor1', last_name: 'One', profile_path: null},
                            {tmdb_actor_id: 102, name: 'Actor2', last_name: 'Two', profile_path: null}
                        ]
                    },
                    {
                        id: 2, title: 'Movie 2', description: '', release_date: null, realisator: null,
                        background_image: null, poster_image: null,
                        actors: [
                            {tmdb_actor_id: 102, name: 'Actor2', last_name: 'Two', profile_path: null},
                            {tmdb_actor_id: 103, name: 'Actor3', last_name: 'Three', profile_path: null}
                        ]
                    }
                ];
                const result = exctractUniqueActorIds(movies);
                expect(result).toEqual([101, 102, 103]);
            });

        });

        describe('enrichMovieWithDetails', () => {
            it('devrait enrichir le film avec les crédits et images', () => {
                const movie: MovieDto = {
                    id: 1, title: 'Test Movie', description: '', release_date: null,
                    realisator: null, background_image: null, poster_image: null, actors: []
                };

                const credits: RawCreditResponse = {
                    id: 1,
                    cast: [
                        { id: 101, name: 'John Doe', character: 'Hero', order: 0, popularity: 90, profile_path: '/path1.jpg' },
                        { id: 102, name: 'Jane Smith', character: 'Villain', order: 1, popularity: 85, profile_path: '/path2.jpg' }
                    ],
                    crew: [
                        { id: 201, name: 'Director Name', job: 'Director', department: 'Directing', profile_path: null }
                    ]
                };

                const images: RawImagesResponse = {
                    id: 1,
                    backdrops: [{ aspect_ratio: 1.78, height: 1080, iso_3166_1: 'US', iso_639_1: 'en', file_path: '/backdrop.jpg', vote_average: 8, vote_count: 100, width: 1920 }],
                    posters: [{ aspect_ratio: 0.67, height: 1500, iso_3166_1: 'US', iso_639_1: 'en', file_path: '/poster.jpg', vote_average: 7.5, vote_count: 50, width: 1000 }],
                    logos: []
                };

                enrichMovieWithDetails(movie, credits, images);

                expect(movie.realisator).toBe('Director Name');
                expect(movie.background_image).toBe('/backdrop.jpg');
                expect(movie.poster_image).toBe('/poster.jpg');
                expect(movie.actors).toHaveLength(2);
                expect(movie.actors[0].name).toBe('John');
                expect(movie.actors[0].last_name).toBe('Doe');
            });

            it('devrait gérer labsence de réalisateur', () => {
                const movie: MovieDto = {
                    id: 1, title: 'Test', description: '', release_date: null,
                    realisator: null, background_image: null, poster_image: null, actors: []
                };
                const credits: RawCreditResponse = { id: 1, cast: [], crew: [] };
                const images: RawImagesResponse = { id: 1, backdrops: [], posters: [], logos: [] };

                enrichMovieWithDetails(movie, credits, images);

                expect(movie.realisator).toBeNull();
            });

            it('devrait trier les acteurs par popularité et prendre le top 5', () => {
                const movie: MovieDto = {
                    id: 1, title: 'Test', description: '', release_date: null,
                    realisator: null, background_image: null, poster_image: null, actors: []
                };
                const credits: RawCreditResponse = {
                    id: 1,
                    cast: Array.from({ length: 10 }, (_, i) => ({
                        id: i,
                        name: `Actor ${i}`,
                        character: `Role ${i}`,
                        order: i,
                        popularity: 100 - i * 10,
                        profile_path: null
                    })),
                    crew: []
                };
                const images: RawImagesResponse = { id: 1, backdrops: [], posters: [], logos: [] };

                enrichMovieWithDetails(movie, credits, images);

                expect(movie.actors).toHaveLength(5);
                expect(movie.actors[0].name).toBe('Actor');
                expect(movie.actors[0].tmdb_actor_id).toBe(1);
            });
        });


        describe('determineActorsToFetch', () => {
            it('devrait identifier les acteurs à récupérer vs ceux en cache', () => {
                const actorIds = [101, 102, 103];
                const existingMap = new Map<number, ActorDto>([
                    [101, { tmdb_actor_id: 101, name: 'Actor1', birth_date: '1990-01-01', associated_movies: [] }],
                    [102, { tmdb_actor_id: 102, name: 'Actor2', birth_date: 'N/C', associated_movies: [] }]
                ]);

                const result = determineActorsToFetch(actorIds, existingMap);

                expect(result.actorIdsToFetch).toEqual([102, 103]);
                expect(result.actorDetailMap.get(101)).toBe('1990-01-01');
                expect(result.actorDetailMap.has(102)).toBe(false);
            });

            it('devrait récupérer tous les acteurs quand aucun n\'existe', () => {
                const actorIds = [101, 102];
                const existingMap = new Map<number, ActorDto>();

                const result = determineActorsToFetch(actorIds, existingMap);

                expect(result.actorIdsToFetch).toEqual([101, 102]);
                expect(result.actorDetailMap.size).toBe(0);
            });
        });

        describe('prepareActorData', () => {
            it('devrait préparer les données acteur avec date de naissance depuis la map', () => {
                const actor = {
                    name: 'John',
                    last_name: 'Doe',
                    tmdb_actor_id: 101,
                    profile_path: '/path.jpg'
                };
                const detailMap = new Map([[101, '1990-05-15']]);

                const result = prepareActorData(actor, detailMap);

                expect(result).toEqual({
                    full_name: 'John Doe',
                    tmdb_actor_id: 101,
                    name: 'John',
                    last_name: 'Doe',
                    birth_date: '1990-05-15',
                    profile_path: '/path.jpg'
                });
            });
        });

        describe('prepareMovieData', () => {
            it('devrait préparer les données film avec les IDs des acteurs', () => {
                const movie: MovieDto = {
                    id: 500,
                    title: 'Test Movie',
                    realisator: 'Director',
                    description: 'A great movie',
                    background_image: '/bg.jpg',
                    poster_image: '/poster.jpg',
                    release_date: new Date('2024-01-01'),
                    actors: []
                };
                const actorIds = [1, 2, 3];

                const result = prepareMovieData(movie, actorIds);

                expect(result).toEqual({
                    tmdb_id: 500,
                    title: 'Test Movie',
                    realisator: 'Director',
                    description: 'A great movie',
                    background_image: '/bg.jpg',
                    poster_image: '/poster.jpg',
                    release_date: new Date('2024-01-01'),
                    actors: [1, 2, 3]
                });
            });
        })




    });