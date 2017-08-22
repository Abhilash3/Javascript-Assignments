define(['element', 'util'], function(Element, util) {
    describe('Element', function() {
        let element, item = { id: { videoId: 'id' }, snippet: { title: 'title',
            thumbnails: { medium: { url: 'medium', }, default: { url: 'default' } } } };
            
        let isMobileDefault;
        
        beforeAll(function() {
            isMobileDefault = util.isMobile;
            util.isMobile = () => false;
        });
            
        afterAll(function() {
            util.isMobile = isMobileDefault;
        });
        
        beforeEach(function() {
            element = Element.create(item);
        });
        
        describe('internal element has properties', function() {
                
            it('from item object', function() {                    
                expect(element.node.getAttribute('id')).toEqual(item.id.videoId);
                expect(element.node.querySelector('img.image').getAttribute('src')).toEqual(item.snippet.thumbnails.medium.url);
                expect(element.node.querySelector('div.title').textContent).toEqual(item.snippet.title);
            });
            
            describe('but different', function() {
                
                beforeAll(function() {
                    util.isMobile = () => true;
                });
                
                it('in case of mobile', function() {                        
                    expect(element.node.classList.contains('small')).toEqual(true);
                    expect(element.node.querySelector('img.image').getAttribute('src')).toEqual(item.snippet.thumbnails.default.url);
                    expect(element.node.querySelector('img.image').classList.contains('small')).toEqual(true);
                    expect(element.node.querySelector('div.title').textContent).toEqual(item.snippet.title);
                });
                
                afterAll(function() {
                    util.isMobile = () => false;
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
        
            it('can update elements if internal element exists', function() {
                let content = element.node.querySelector('div.content');
                spyOn(content, 'appendChild');
                
                element.update({});
                expect(content.appendChild).toHaveBeenCalled();
                
            });
        });
    });
});