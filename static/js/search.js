/* global instantsearch */

var search = instantsearch({
    appId: 'E7IITFLWHD',
    apiKey: '5489341493f1e72ff3cd056ee1505187',
    indexName:
        window.location.hostname.indexOf('engbert.me') === -1
            ? 'dev_posts'
            : 'prod_posts',
    routing: true,
});

search.addWidget(
    instantsearch.widgets.searchBox({
        container: '#search-box',
        placeholder: 'Search',
    })
);

search.addWidget(
    instantsearch.widgets.stats({
        container: '#stats',
    })
);

search.addWidget(
    instantsearch.widgets.hits({
        container: '#hits',
        templates: {
            empty: '<p>No results</p>',
            item: '<p><a href="{{relativePermalink}}">{{title}}</a><br>{{{_snippetResult.content.value}}}</p>',
        },
    })
);

search.addWidget(
    instantsearch.widgets.pagination({
        container: '#pagination',
    })
);

search.addWidget(
    instantsearch.widgets.configure({
        attributesToHighlight: [],
        attributesToSnippet: ['content:40'],
        highlightPreTag: '<span class="search-highlight">',
        highlightPostTag: '</span>',
        hitsPerPage: 5,
        snippetEllipsisText: '...',
    })
);

search.start();
