define(function() {
    let width = () => window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    
    return {
        stringToElement: str => {
            let template = document.createElement('template');
            template.innerHTML = str;
            return template.content.firstChild;
        },
        width,
        isMobile: () => width() < 480
    };
});