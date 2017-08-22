define(['service'], function(service) {
    describe('Service', function() {
        
        let fetchDefault, openDefault;
        
        beforeAll(function() {
            fetchDefault = fetch;
            fetch = jasmine.createSpy('window fetch').and.returnValue({ then: fun => fun({ json: () => ({}) }) });
            
            openDefault = open;
            open = jasmine.createSpy('window open');
        });
        
        afterAll(function() {
            fetch = fetchDefault;            
            open = openDefault;
        });
        
        it('can fire webservice', function() {
            service.fire('testUrl');            
            expect(fetch).toHaveBeenCalledWith('testUrl');
        });    
        
        it('can open youtube webPages', function() {
            service.open('testId');            
            expect(open).toHaveBeenCalledWith('https://www.youtube.com/watch?v=testId');
        });    
    });
});