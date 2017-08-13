define(['text!../template/element.html',
           'util', 'service'], function(elementTemplate, util, service) {
    
    const ELEMENT_TEMPLATE = util.stringToElement(elementTemplate);
    
    let processDate = date => {
        let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

        month = month.length < 2 && '0' + month || month;
        day = day.length < 2 && '0' + day || day;

        return [month, day, year].join('/');
    };
    
    let convert = item => {
        let obj = Object.create(null);
        //obj.Description = item.snippet.description || '';
        obj['Published Date'] = processDate(item.snippet.publishedAt);
        obj.Views = item.statistics.viewCount || 0;
        obj.Likes = item.statistics.likeCount || 0;
        obj.Author = item.snippet.channelTitle;
        return obj;
    };
    
    function Element() {};
    Element.prototype.render = function(container) {
        container.appendChild(this.node);
    };
    Element.prototype.width = function() {
        return this.node.clientWidth;
    };
    Element.prototype.addClass = function(Class) {
        this.node.classList.add(Class);
    };
    Element.prototype.removeClass = function(Class) {
        this.node.classList.remove(Class);
    };
    Element.prototype.update = function(item) {
        this.id = item.id.videoId;
        
        let element = ELEMENT_TEMPLATE.cloneNode(true);
        element.setAttribute('id', item.id.videoId);
        this.node = element;
        
        let title = element.querySelector('div.title');
        title.textContent = item.snippet.title;
        
        let obj = item.snippet.thumbnails.medium;
        let image = element.querySelector('img.image');
        if (util.isMobile()) {
            element.classList.add('small');
            image.classList.add('small');
            obj = item.snippet.thumbnails.default;
        }
        image.setAttribute('src', obj.url);
        
        return this;
    };
    
    Element.updateElement = (element, item) => {
        let content = '<table><body>';
        item = convert(item);
        for (let prop in item) {
            content += '<tr><td>' + prop + ': </td><td>' + item[prop] + '</td></tr>';
        }
        content += '</body></table>';
        element.node.querySelector('div.content').appendChild(util.stringToElement(content));
    };
    
    return Element;
});