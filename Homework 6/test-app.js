requirejs.config({
    baseUrl: '/base/src',
    paths: {
        text: '../lib/text/text',
        
        element: 'element/element',
        pagination: 'helper/pagination',
        service: 'service/service',
        util: 'helper/util'
    },
    deps: Object.keys(window.__karma__.files).filter(file => /spec\.js$/.test(file)),
    callback: window.__karma__.start
});