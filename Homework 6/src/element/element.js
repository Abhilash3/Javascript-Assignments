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
        obj['Published Date'] = item.snippet && processDate(item.snippet.publishedAt) || '';
        obj.Views = item.statistics && item.statistics.viewCount || 0;
        obj.Likes = item.statistics && item.statistics.likeCount || 0;
        obj.Author = item.snippet && item.snippet.channelTitle || '';
        return obj;
    };
    
    class Element {
        
        constructor(item) {
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
        }
        
        render(container) {
            container.appendChild(this.node);
        }
        
        width() {
            return this.node.clientWidth;
        }
        
        hide() {
            this.node.classList.add('hide');
        }
        
        show() {
            this.node.classList.remove('hide');
        }
        
        update(item) {
            let content = '<table><body>';
            item = convert(item);
            for (let prop in item) {
                content += '<tr><td>' + prop + ': </td><td>' + item[prop] + '</td></tr>';
            }
            content += '</body></table>';
            let element = this.node.querySelector('div.content');
            element.textContent = '';
            element.appendChild(util.stringToElement(content));
        }
    }
    
    return { create: item => new Element(item) };
});