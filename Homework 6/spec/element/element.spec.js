define(['element', 'util'], function(Element, util) {
    describe('Element', function() {
        let element, item = { id: { videoId: 'id' }, snippet: { title: 'title',
            thumbnails: { medium: { url: 'medium', }, default: { url: 'default' } } } };
            
        let isMobileDefault, stringToElementDefault;
        
        beforeAll(function() {
            isMobileDefault = util.isMobile;
            util.isMobile = () => false;
            
            stringToElementDefault = util.stringToElement;
            util.stringToElement = str => str;
        });
            
        afterAll(function() {
            util.stringToElement = stringToElementDefault;
            
            util.isMobile = isMobileDefault;
        });
        
        beforeEach(function() {
            element = Element.create(item);
        });
        
        describe('internal element has properties', function() {
                
            it('from item object', function() {                    
                expect(element.node.getAttribute('id')).toEqual(item.id.videoId);
                expect(element.node.querySelector('img.image').getAttribute('src')).toEqual(item.snippet.thumbnails.medium.url);
                expect(element.node.querySelector('img.image').classList.contains('small')).toEqual(false);
                expect(element.node.querySelector('div.title').textContent).toEqual(item.snippet.title);
            });
            
            describe('but different', function() {
                
                beforeAll(function() {
                    util.isMobile = () => true;
                });
                
                afterAll(function() {
                    util.isMobile = () => false;
                });
                
                it('in case of mobile', function() {                        
                    expect(element.node.classList.contains('small')).toEqual(true);
                    expect(element.node.querySelector('img.image').getAttribute('src')).toEqual(item.snippet.thumbnails.default.url);
                    expect(element.node.querySelector('img.image').classList.contains('small')).toEqual(true);
                    expect(element.node.querySelector('div.title').textContent).toEqual(item.snippet.title);
                });
            });
        });
        
        describe('can', function() {
            
            it('retrieve internal element width', function() {
                expect(element.width()).toEqual(element.node.clientWidth);
            });
            
            it('show/hide internal Element', function() {
                expect(element.node.classList.contains('hide')).toEqual(false);
                element.hide();
                
                expect(element.node.classList.contains('hide')).toEqual(true);
                
                element.show();
                expect(element.node.classList.contains('hide')).toEqual(false);
            });
            
            it('render the internal element to container', function() {
                let container = { appendChild: jasmine.createSpy('container appendChild') };
                
                element.render(container);
                expect(container.appendChild).toHaveBeenCalledWith(element.node);
            });
        
            it('update the internal element with new details', function() {
                let content = element.node.querySelector('div.content');
                content.appendChild = jasmine.createSpy('element appendChild').and.callThrough();
                
                let d = new Date(), month = d.getMonth() + 1, day = d.getDate(), year = d.getFullYear();
                month = month < 10 && '0' + month || month;
                day = day < 10 && '0' + day || day;
                
                element.update({
                    snippet: { publishedAt: d, channelTitle: 'channelTitle' },
                    statistics: { viewCount: 'viewCount', likeCount: 'likeCount' }
                });
                expect(content.appendChild).toHaveBeenCalledWith('<table><body>' +
                    '<tr><td>Published Date: </td><td>' + [month, day, year].join('/') + '</td></tr>' + 
                    '<tr><td>Views: </td><td>viewCount</td></tr>' + 
                    '<tr><td>Likes: </td><td>likeCount</td></tr>' + 
                    '<tr><td>Author: </td><td>channelTitle</td></tr>' + 
                '</body></table>');
            });
        });
    });
});