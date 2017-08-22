requirejs.config({
    baseUrl: 'src',
    paths: {
        text: '../lib/text/text',
        
        element: 'element/element',
        pagination: 'helper/pagination',
        service: 'service/service',
        util: 'helper/util'
    }
});

requirejs(['main']);