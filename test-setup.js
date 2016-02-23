// called by every test suite
function setupSuite(html) {
    // setup dom
    $('body').empty().html(html);

    // setup globals
    $widget = $('.combobox').first();
    $focusItem = $widget.find('[role=combobox]');
    $descendantItems = $widget.find('[role=option]');
    onActiveDescendantChange = jasmine.createSpy('onActiveDescendantChange');

    // execute plugin on widget
    $widget.activeDescendant($focusItem, $descendantItems);

    // setup event handlers on widget
    $widget.on('activeDescendantChange', onActiveDescendantChange);
}
