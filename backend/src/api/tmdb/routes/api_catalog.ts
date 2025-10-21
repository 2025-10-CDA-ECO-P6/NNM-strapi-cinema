export default {
    routes : [
        {
            method: 'GET',
            path : '/tmdb/api_catalog',
            handler : 'api-catalog.apiCatalog',
            config : {
                auth : false,
            },
        },
    ],
}