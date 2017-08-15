define(['text!../template/element.html', 'util'], function(template, util) {
    
    const ELEMENT_TEMPLATE = util.stringToElement(template);
    
    let processDate = date => {
        let d = new Date(date),
        month = d.getMonth() + 1,
        day = d.getDate(),
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
    
    class Element {
        
        render(container) {
            container.appendChild(this.node);
        }
        
        width() {
            return this.node.clientWidth;
        }
        
        addClass(Class) {
            this.node.classList.add(Class);
        }
        
        removeClass(Class) {
            this.node.classList.remove(Class);
        }
        
        update(item) {
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
        }
        
        static updateElement(element, item) {
            let content = '<table><body>';
            item = convert(item);
            for (let prop in item) {
                content += '<tr><td>' + prop + ': </td><td>' + item[prop] + '</td></tr>';
            }
            content += '</body></table>';
            element.node.querySelector('div.content').appendChild(util.stringToElement(content));
        }
    }
    
    return Element;
});