define(['pagination', 'element', 'util', 'service'], function(Pagination, Element, util, service) {
    describe('Pagination', function() {
        
        let isMobileDefault, container, listeners;
        let eventTriggerer = (obj, event, params) => { listeners.get(obj)[event].forEach(item => item(params)); };
        let eventRegisterer = function(obj, event, listener) {
            let register = listeners.get(obj);
            if (!register) {
                register = {};
                listeners.set(obj, register);
            }
            register[event] = register[event] && register[event].concat(listener) || [listener];
        };
        
        beforeAll(function() {
            isMobileDefault = util.isMobile;
            util.isMobile = () => false;
        });
            
        afterAll(function() {
            util.isMobile = isMobileDefault;
        });
        
        beforeEach(function() {
            listeners = new Map();
                
            container = {
                controls: {
                    classList: { length: 0, add: item => Array.prototype.push.call(this, item) },
                    addEventListener: () => {}, removeEventListener: () => {}
                },
                viewPort: {
                    classList: { length: 0, add: item => Array.prototype.push.call(this, item) },
                    addEventListener: () => {}, removeEventListener: () => {}
                },
                querySelector: expression => expression.indexOf('controls') < 0 && container.viewPort || container.controls
            };
        });
        
        describe('init', function() {
            
            let addEventListenerDefault;
            
            beforeAll(function() {
                addEventListenerDefault = window.addEventListener;                
                window.addEventListener = eventRegisterer.bind(null, window);
            });
            
            afterAll(function() {
                window.addEventListener = addEventListenerDefault;
            });
            
            beforeEach(function() {
                container.controls.addEventListener = eventRegisterer.bind(null, container.controls);
                container.viewPort.addEventListener = eventRegisterer.bind(null, container.viewPort);
                
                Pagination.init(container);
            });
            
            it('handles window resize', function() {
                expect(listeners.get(window).resize).toBeDefined();
                expect(listeners.get(window).resize.length).toEqual(1);
            });
            
            it('handles page clicks', function() {
                expect(listeners.get(container.controls).click).toBeDefined();
                expect(listeners.get(container.controls).click.length).toEqual(1);
            });
            
            describe('for mobile', function() {
                
                beforeAll(function() {
                    util.isMobile = () => true;
                });
                
                afterAll(function() {
                    util.isMobile = () => false;
                });
                
                it('has swipe functionality', function() {
                    let viewPortRegister = listeners.get(container.viewPort);
                    
                    expect(viewPortRegister.touchstart).toBeDefined();
                    expect(viewPortRegister.touchstart.length).toEqual(1);
                    
                    expect(viewPortRegister.touchmove).toBeDefined();
                    expect(viewPortRegister.touchmove.length).toEqual(1);
                    
                    expect(viewPortRegister.touchcancel).toBeDefined();
                    expect(viewPortRegister.touchcancel.length).toEqual(1);
                    
                    expect(viewPortRegister.touchend).toBeDefined();
                    expect(viewPortRegister.touchend.length).toEqual(1);
                });
            });
        });
        
        describe('start', function() {
            
            let createDefault, detailsDefault, widthDefault, stringToElementDefault, addEventListenerDefault;
            let data = { nextPageToken: 'next', items: new Array(10).fill({}) };
            let creationCount, updatedObjs, renderedObjs, hiddenObjs;
            
            beforeAll(function() {
                addEventListenerDefault = window.addEventListener;
                window.addEventListener = eventRegisterer.bind(null, window);
                    
                stringToElementDefault = util.stringToElement;
                util.stringToElement = str => str;
                
                widthDefault = util.width;
                util.width = () => 120;
                
                createDefault = Element.create;
                Element.create = function() {
                    let obj = {};
                    obj.id = ++creationCount;
                    obj.update = () => { updatedObjs.add(obj); };
                    obj.render = () => { renderedObjs.add(obj); };
                    obj.width = () => 50;
                    obj.hide = () => { hiddenObjs.add(obj); };
                    obj.show = () => { hiddenObjs.delete(obj); };
                    return obj;
                };
                detailsDefault = service.details;
                service.details = jasmine.createSpy('service details').and.returnValue({ then: fun => fun(data) });
            });
            
            afterAll(function() {
                service.details = detailsDefault;
                Element.create = createDefault;
                util.width = widthDefault;
                util.stringToElement = stringToElementDefault;
                window.addEventListener = addEventListenerDefault;
            });
            
            beforeEach(function() {
                creationCount = 0, updatedObjs = new Set();
                renderedObjs = new Set(), hiddenObjs = new Set();
                
                container.controls.appendChild = () => {};
                container.controls.appendChild = () => {};
                
                container.controls.addEventListener = eventRegisterer.bind(null, container.controls);
                container.viewPort.addEventListener = eventRegisterer.bind(null, container.viewPort);
            });
            
            afterEach(function() {
                Pagination.stop();
                Pagination.destroy();
            });
            
            it('works with elements', function() {                
                Pagination.init(container);
                Pagination.start(data, 'test');
            
                expect(creationCount).toEqual(10);
                expect(service.details).toHaveBeenCalledWith('1,2,3,4,5,6,7,8,9,10');
                expect(updatedObjs.size).toEqual(10);
                expect(renderedObjs.size).toEqual(10);
                expect(hiddenObjs.size).toEqual(9);
            });
            
            describe('allows pagination', function() {
                
                beforeEach(function() {
                    container.controls.trigger = eventTriggerer.bind(null, container.controls);
                    container.viewPort.trigger = eventTriggerer.bind(null, container.viewPort);
                    
                    pages = [];
                    container.controls.appendChild = item => { pages.push(item) };
                
                    Pagination.init(container);        
                    Pagination.start(data, 'test');
                });
                
                it('with first page', function() {                    
                    expect(pages.length).toEqual(7);
                    expect(pages[0]).toEqual('<li>Prev</li>');
                    expect(pages[1]).toEqual('<li class=\'num active\'>1</li>');
                    expect(pages[2]).toEqual('<li class=\'num\'>2</li>');
                    expect(pages[3]).toEqual('<li class=\'num\'>3</li>');
                    expect(pages[4]).toEqual('<li class=\'num\'>4</li>');
                    expect(pages[5]).toEqual('<li class=\'num\'>5</li>');
                    expect(pages[6]).toEqual('<li>Next</li>');
                    
                    expect(hiddenObjs.size).toEqual(9);
                    expect(Array.from(hiddenObjs).map(a => a.id).includes(1)).toEqual(false);
                });
                
                it('to paginate fixed pages', function() {
                    pages = [];
                    container.controls.trigger('click', { target: { textContent: '5' } });
                    
                    expect(pages.length).toEqual(7);
                    expect(pages[0]).toEqual('<li>Prev</li>');
                    expect(pages[1]).toEqual('<li class=\'num\'>3</li>');
                    expect(pages[2]).toEqual('<li class=\'num\'>4</li>');
                    expect(pages[3]).toEqual('<li class=\'num active\'>5</li>');
                    expect(pages[4]).toEqual('<li class=\'num\'>6</li>');
                    expect(pages[5]).toEqual('<li class=\'num\'>7</li>');
                    expect(pages[6]).toEqual('<li>Next</li>');
                    
                    expect(hiddenObjs.size).toEqual(9);
                    expect(Array.from(hiddenObjs).map(a => a.id).includes(5)).toEqual(false);
                });
                
                it('to paginate Next/Prev pages', function() {
                    container.controls.trigger('click', { target: { textContent: 'Next' } });
                    container.controls.trigger('click', { target: { textContent: 'Next' } });
                    
                    pages = [];
                    container.controls.trigger('click', { target: { textContent: 'Next' } });
                    
                    expect(pages.length).toEqual(7);
                    expect(pages[0]).toEqual('<li>Prev</li>');
                    expect(pages[1]).toEqual('<li class=\'num\'>2</li>');
                    expect(pages[2]).toEqual('<li class=\'num\'>3</li>');
                    expect(pages[3]).toEqual('<li class=\'num active\'>4</li>');
                    expect(pages[4]).toEqual('<li class=\'num\'>5</li>');
                    expect(pages[5]).toEqual('<li class=\'num\'>6</li>');
                    expect(pages[6]).toEqual('<li>Next</li>');
                    
                    expect(hiddenObjs.size).toEqual(9);
                    expect(Array.from(hiddenObjs).map(a => a.id).includes(4)).toEqual(false);
                    
                    pages = [];
                    container.controls.trigger('click', { target: { textContent: 'Prev' } });
                    
                    expect(pages.length).toEqual(7);
                    expect(pages[0]).toEqual('<li>Prev</li>');
                    expect(pages[1]).toEqual('<li class=\'num\'>1</li>');
                    expect(pages[2]).toEqual('<li class=\'num\'>2</li>');
                    expect(pages[3]).toEqual('<li class=\'num active\'>3</li>');
                    expect(pages[4]).toEqual('<li class=\'num\'>4</li>');
                    expect(pages[5]).toEqual('<li class=\'num\'>5</li>');
                    expect(pages[6]).toEqual('<li>Next</li>');
                    
                    expect(hiddenObjs.size).toEqual(9);
                    expect(Array.from(hiddenObjs).map(a => a.id).includes(3)).toEqual(false);
                });
                
                it('to re-render elements with resize', function() {
                    pages = [];
                    container.controls.trigger('click', { target: { textContent: '5' } });
                    
                    expect(pages.length).toEqual(7);
                    expect(pages[0]).toEqual('<li>Prev</li>');
                    expect(pages[1]).toEqual('<li class=\'num\'>3</li>');
                    expect(pages[2]).toEqual('<li class=\'num\'>4</li>');
                    expect(pages[3]).toEqual('<li class=\'num active\'>5</li>');
                    expect(pages[4]).toEqual('<li class=\'num\'>6</li>');
                    expect(pages[5]).toEqual('<li class=\'num\'>7</li>');
                    expect(pages[6]).toEqual('<li>Next</li>');
                    
                    expect(hiddenObjs.size).toEqual(9);
                    
                    util.width = () => 240;
                    pages = [];
                    eventTriggerer.bind(null, window)('resize');
                    
                    expect(pages.length).toEqual(7);
                    expect(pages[0]).toEqual('<li>Prev</li>');
                    expect(pages[1]).toEqual('<li class=\'num\'>1</li>');
                    expect(pages[2]).toEqual('<li class=\'num\'>2</li>');
                    expect(pages[3]).toEqual('<li class=\'num active\'>3</li>');
                    expect(pages[4]).toEqual('<li class=\'num\'>4</li>');
                    expect(pages[5]).toEqual('<li class=\'num\'>5</li>');
                    expect(pages[6]).toEqual('<li>Next</li>');
                    expect(hiddenObjs.size).toEqual(8);
                    
                    util.width = () => 120;
                });
            
                describe('lazy loads elements', function() {
                    
                    let searchDefault;
                    
                    beforeAll(function() {
                        searchDefault = service.search;
                        service.search = jasmine.createSpy('service search').and.returnValue({ then: fun => fun(data) });
                    });
                    
                    afterAll(function() {
                        service.search = searchDefault;
                    });
                    
                    it('when pages are almost over', function() {
                        expect(creationCount).toEqual(10);
                        
                        pages = [];
                        container.controls.trigger('click', { target: { textContent: '8' } });
                        
                        expect(service.search).toHaveBeenCalledWith('test', 'next');
                        
                        expect(pages.length).toEqual(7);
                        expect(pages[0]).toEqual('<li>Prev</li>');
                        expect(pages[1]).toEqual('<li class=\'num\'>6</li>');
                        expect(pages[2]).toEqual('<li class=\'num\'>7</li>');
                        expect(pages[3]).toEqual('<li class=\'num active\'>8</li>');
                        expect(pages[4]).toEqual('<li class=\'num\'>9</li>');
                        expect(pages[5]).toEqual('<li class=\'num\'>10</li>');
                        expect(pages[6]).toEqual('<li>Next</li>');
                        
                        expect(creationCount).toEqual(20);
                        for (var i = 11; i <= 20; i++) {
                            expect(Array.from(hiddenObjs).map(a => a.id).includes(i)).toEqual(true);
                        }
                    });
                });
            });
        });
        
        describe('stop', function() {
            
            beforeEach(function() {
                container.controls.textContent = {};
                container.viewPort.textContent = {};
            });
            
            it('clears the page', function() {
                Pagination.init(container);
                Pagination.start({ items: [] }, 'test');                
                Pagination.stop();
                
                expect(container.controls.textContent).toEqual('');
                expect(container.viewPort.textContent).toEqual('');
            });
        });
        
        describe('destroy', function() {
            
            let removeEventListenerDefault;
            
            beforeAll(function() {
                removeEventListenerDefault = window.removeEventListener;
                window.removeEventListener = eventRegisterer.bind(null, window);
            });
            
            afterAll(function() {
                window.removeEventListener = removeEventListenerDefault;
            });
            
            beforeEach(function() {
                Pagination.init(container);
            
                container.controls.removeEventListener = eventRegisterer.bind(null, container.controls);
                container.viewPort.removeEventListener = eventRegisterer.bind(null, container.viewPort);
                Pagination.destroy();
            });
            
            it('remove event listeners', function() {
                expect(listeners.get(window).resize).toBeDefined();
                expect(listeners.get(window).resize.length).toEqual(1);
                
                expect(listeners.get(window).click).toBeDefined();
                expect(listeners.get(window).click.length).toEqual(1);
            });
            
            describe('for mobile', function() {
                
                beforeAll(function() {
                    util.isMobile = () => true;
                });
                
                afterAll(function() {
                    util.isMobile = () => false;
                });
                
                it('remove swipe functionality', function() {
                    let viewPortRegister = listeners.get(container.viewPort);
                    
                    expect(viewPortRegister.touchstart).toBeDefined();
                    expect(viewPortRegister.touchstart.length).toEqual(1);
                    
                    expect(viewPortRegister.touchmove).toBeDefined();
                    expect(viewPortRegister.touchmove.length).toEqual(1);
                    
                    expect(viewPortRegister.touchcancel).toBeDefined();
                    expect(viewPortRegister.touchcancel.length).toEqual(1);
                    
                    expect(viewPortRegister.touchend).toBeDefined();
                    expect(viewPortRegister.touchend.length).toEqual(1);
                });
            });
        });
    });
});