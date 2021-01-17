function parseURL(url) {
    const parser = document.createElement('a')
    let searchObject = {};
    parser.href = url;
    

    if(parser.host === 'www.youtube.com') {
        queries = parser.search.replace(/^\?/, '').split('&');

        for (const query of queries) {
            const split = query.split('=');
            searchObject[split[0]] = split[1];
        }
    } else if(parser.host === 'youtu.be') {
        searchObject['v'] = parser.pathname.replace(/^\//, '');
    }

    return {
        host: parser.host,
        searchObject: searchObject
    };
}