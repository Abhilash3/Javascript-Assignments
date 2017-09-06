define(['service', 'element', 'util'], function(service, Element, util) {
    
    let elements = [], elementSize, completed;
    let query, nextPageToken;
    let pages, perPage, currentPage;
    let controls, viewPort;
    
    const NEXT = 'Next', PREV = 'Prev';
    const RESIZE_HANDLER = () => {
        if (elements.length) {
            let index = (currentPage - 1) * perPage;
            resize();
            changePage(+(index / perPage).toFixed(0) + 1);
        }
    };
    const PAGE_CLICK_HANDLER = event => {
        let value = event.target.textContent;
        
        if (value == undefined) {
            return;
        }
        
        let page = +value;
        if (value === NEXT) {
            page = currentPage + 1;
        } else if (value === PREV) {
            page = currentPage - 1;
        }
        changePage(page);
    };
    const SWIPE_FUNCTIONALITY = (() => {
        let info = {}, min = 50, abs = n => n < 0 && -n || n;
        return {
            TOUCH_START: event => {
                event.preventDefault();
                info.start = event.touches[0].screenX;
            },
            TOUCH_MOVE: event => {
                event.preventDefault();
                info.end = event.touches[0].screenX;
            },
            TOUCH_CANCEL: event => {
                event.preventDefault();
                info = {};
            },
            TOUCH_END: event => {
                event.preventDefault();
                let diff = info.end - info.start;
                if (abs(diff) >= min) {
                    changePage(currentPage + (diff < 0 && 1 || -1));
                }
                info = {};
            }
        };
    })();
    
    function resize() {
        perPage = Math.floor(util.width() / elementSize) || 1;
        pages = Math.ceil(elements.length / perPage);
    };
    
    let chooseElements = pageNumber => {
        elements.forEach((element, index) => {
            if (index >= pageNumber * perPage || index < (pageNumber - 1) * perPage) {
                element.hide();
            } else {
                element.show();
            }
        });
        currentPage = pageNumber;
    };
    
    function changePage(value) {
        if (value < 1 || value > pages) {
            return;
        }
        
        if (!completed && pages - value < 3) {
            service.search(query, nextPageToken).then(data => {
                nextPageToken = data.nextPageToken;
                
                let newElements = data.items.map(a => Element.create(a));
                retrieveDetails(newElements);
                Array.prototype.push.apply(elements, newElements);
                
                newElements.forEach(element => {
                    element.render(viewPort);
                    element.hide();
                });
                
				completed = newElements.length === 0;
                resize();
				changePage(value);
            });
        }
        chooseElements(value);
        
        controls.textContent = '';
        controls.appendChild(util.stringToElement('<li>' + PREV + '</li>'));
        
        let start = ((a, b) => a > b ? b : a)(((a, b) => a > b ? a : b)(value - 2, 1), pages - 4), count = 0;
        while(count++ < 5 && start <= elements.length) {            
            let content = '<li class=\'num';
            if (start === value) {
                content += ' active';
            }
            content += '\'>' + start++ + '</li>';
            controls.appendChild(util.stringToElement(content));
        }
        controls.appendChild(util.stringToElement('<li>' + NEXT + '</li>'));
    };
    
    let retrieveDetails = items => {
        service.details(items.map(a => a.id).join(',')).then(data => {
            data.items.forEach((item, index) => {
                items[index].update(item);
            });
        });
    };
    
    return {
        init: container => {
            window.addEventListener('resize', RESIZE_HANDLER);
            
            controls = container.querySelector('#controls ul');
            controls.addEventListener('click', PAGE_CLICK_HANDLER);
            viewPort = container.querySelector('#viewPort');
            
            if (util.isMobile()) {
                controls.classList.add('small');
                
                viewPort.addEventListener('touchstart', SWIPE_FUNCTIONALITY.TOUCH_START);
                viewPort.addEventListener('touchmove', SWIPE_FUNCTIONALITY.TOUCH_MOVE);
                viewPort.addEventListener('touchcancel', SWIPE_FUNCTIONALITY.TOUCH_CANCEL);
                viewPort.addEventListener('touchend', SWIPE_FUNCTIONALITY.TOUCH_END);
            }
        },
        start: (data, searchInput) => {
            nextPageToken = data.nextPageToken;
            query = searchInput;
            
            elements = data.items.map(item => Element.create(item));
            retrieveDetails(elements);
            
            viewPort.textContent = '';
            elements.forEach(element => {
                element.render(viewPort);
            });
            
            elementSize = (elements[0] && elements[0].width() || 0) + 50;
            resize();
			
			completed = false;
            changePage(1);
        },
        stop: () => {
            elements.length = 0;
            elementSize = 0;
            controls.textContent = '';
            viewPort.textContent = '';
        },
        destroy: () => {            
            window.removeEventListener('resize', RESIZE_HANDLER);
            window.removeEventListener('click', PAGE_CLICK_HANDLER);
            
            if (util.isMobile()) {
                viewPort.removeEventListener('touchstart', SWIPE_FUNCTIONALITY.TOUCH_START);
                viewPort.removeEventListener('touchmove', SWIPE_FUNCTIONALITY.TOUCH_MOVE);
                viewPort.removeEventListener('touchcancel', SWIPE_FUNCTIONALITY.TOUCH_CANCEL);
                viewPort.removeEventListener('touchend', SWIPE_FUNCTIONALITY.TOUCH_END);
            }
            
            controls = undefined;
            viewPort = undefined;
        }
    };
});