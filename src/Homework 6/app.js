requirejs.config({
    baseUrl: 'lib',
    paths: {
        text: '../external/text/text',
        
        element: 'element/element',
        pagination: 'helper/pagination',
        service: 'service/service',
        util: 'helper/util'
    }
});

requirejs(['main']);