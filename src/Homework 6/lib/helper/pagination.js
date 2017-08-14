define(['service', 'element', 'util'], function(service, Element, util) {
    
    const NEXT = 'Next', PREV = 'Prev';
    
    let elements = [], elementSize;
    let query, nextPageToken;
    let pages, perPage, currentPage;
    let controls, viewPort;
    
    let resize = () => {
        perPage = Math.floor(util.width() / elementSize);
        pages = Math.ceil(elements.length / perPage);
    };
    
    let chooseElements = pageNumber => {
        elements.forEach((element, index) => {
            if (index >= pageNumber * perPage || index < (pageNumber - 1) * perPage) {
                element.addClass('hide');
            } else {
                element.removeClass('hide');
            }
        });
        currentPage = pageNumber;
    };
    
    let changePage = value => {
        if (value < 1 || value > pages) {
            return;
        }
        
        if (pages - value < 3) {
            service.search(query, nextPageToken).then(data => {
                nextPageToken = data.nextPageToken;
                
                newElements = data.items.map(a => {
                    return new Element().update(a);
                });
                retrieveDetails(newElements);
                Array.prototype.push.apply(elements, newElements);
                
                newElements.forEach(element => {
                    element.render(viewPort);
                    element.addClass('hide');
                });
                
                resize();
            });
        }
        chooseElements(value);
        
        controls.textContent = '';
        controls.appendChild(util.stringToElement('<li>' + PREV + '</li>'));
        
        let start = value > 2 ? value - 2 : 1, count = 0;
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
                Element.updateElement(items[index], item);
            });
        });
    };
    
    let addSwipeFunctionality = view => {
        let info = {}, min = 50, abs = n => n < 0 && -n || n;
        view.addEventListener('touchstart', event => {
            event.preventDefault();
            info.start = event.touches[0].screenX;
        });
        view.addEventListener('touchmove', event => {
            event.preventDefault();
            info.end = event.touches[0].screenX;
        });
        view.addEventListener('touchcancel', event => {
            event.preventDefault();
            info = {};
        });
        view.addEventListener('touchend', event => {
            event.preventDefault();
            let diff = info.end - info.start;
            if (abs(diff) >= min) {
                changePage(currentPage + (diff > 0 && 1 || -1));
            }
            info = {};
        });
    };
    
    return {
        init: container => {
            window.addEventListener('resize', () => {
                if (elements.length) {
                    let index = (currentPage - 1) * perPage;
                    resize();
                    changePage(+(index / perPage).toFixed(0) + 1);
                }
            });
            
            controls = container.querySelector('#controls ul');
            controls.addEventListener('click', event => {
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
            });
            viewPort = container.querySelector('#viewPort');
            
            if (util.isMobile()) {
                controls.classList.add('small');
                addSwipeFunctionality(viewPort);
            }
        },
        start: (data, searchInput) => {
            nextPageToken = data.nextPageToken;
            query = searchInput;
            
            elements = data.items.map(item => {
                return new Element().update(item);
            });
            retrieveDetails(elements);
            
            viewPort.textContent = '';
            elements.forEach(element => {
                element.render(viewPort);
            });
            
            elementSize = elements[0].width() + 50;
            resize();
            changePage(1);
        },
        stop: () => {
            elements.length = 0;
            elementSize = 0;
            controls.textContent = '';
            viewPort.textContent = '';
        }
    };
});