describe("jquery.activedescendant.js", function() {

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;

    var $body = $('body');
    var dom = '<ul id="widget">'
                + '<li></li>'
                + '<li></li>'
                + '<li></li>'
            + '</ul>';
    var $widget;
    var $descendants;

    beforeEach(function() {
        $body.empty().append($(dom));
        $widget = $('#widget');
        $descendants = $widget.find('li');
    });

    it("should trigger change.activeDescendant event on downarrow.commonKeyDown", function(done) {
        $widget.activeDescendant($descendants);
        $widget.on('change.activeDescendant', done);
        $widget.trigger('downarrow.commonKeyDown');
    });

    it("should trigger change.activeDescendant event on uparrow.commonKeyDown", function(done) {
        $widget.activeDescendant($descendants);
        $widget.on('change.activeDescendant', done);
        $widget.trigger('uparrow.commonKeyDown');
    });

    it("should have correct activedescendant data", function() {
        $widget.activeDescendant($descendants);
        expect($descendants.first().data().widget.activedescendant).toBe(0);
        expect($descendants.last().data().widget.activedescendant).toBe(2);
    });
});
