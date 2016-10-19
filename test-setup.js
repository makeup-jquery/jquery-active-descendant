// called by every test suite
function setupSuite(html) {
    // setup dom
    $('body').empty().html(html);

    // setup globals
    $widget = $('.combobox').first();
    $focusItem = $widget.find('[role=combobox]');
    $descendantItems = $widget.find('[role=option]');
    $descendantItemsContainer = $descendantItems.first().parents().has($descendantItems.last()).first();
    onActiveDescendantChange = jasmine.createSpy('onActiveDescendantChange');

    // execute plugin on widget
    $widget.activeDescendant('[role=combobox]', '[role=listbox]', '[role=option]');

    // setup event handlers on widget
    $widget.on('activeDescendantChange', '[role=option]', onActiveDescendantChange);
}
