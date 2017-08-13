define(function() {
    const KEY = 'AIzaSyBLflp1vMciZ7qJsfyqYS0oyhVBWmqPo8w';
    const SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search?key=' + KEY + '&type=video&part=snippet&maxResults=15&q=';
    const DETAILS_URL = 'https://www.googleapis.com/youtube/v3/videos?key=' + KEY + '&part=snippet,statistics&id=';
    const WATCH_URL = 'https://www.youtube.com/watch?v=';
    
    let fire = url => fetch(url).then(response => response.json());
    let search = (query, pageToken) => fire(SEARCH_URL + query + (pageToken && '&pageToken='+pageToken || ''));
    let details = query => fire(DETAILS_URL + query);
    let open = id => { window.open(WATCH_URL + id); };
    
    return { search, details, fire, open };
});