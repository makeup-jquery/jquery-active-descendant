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

    it("should trigger change.activeDescendant event on downArrowKeyDown", function(done) {
        $widget.activeDescendant($descendants);
        $widget.on('activeDescendantChange', done);
        $widget.trigger('downArrowKeyDown');
    });

    it("should trigger change.activeDescendant event on upArrowKeyDown", function(done) {
        $widget.activeDescendant($descendants);
        $widget.on('activeDescendantChange', done);
        $widget.trigger('upArrowKeyDown');
    });

    it("should have correct activedescendant data", function() {
        $widget.activeDescendant($descendants);
        expect($descendants.first().data().widget.activedescendant).toBe(0);
        expect($descendants.last().data().widget.activedescendant).toBe(2);
    });
});
