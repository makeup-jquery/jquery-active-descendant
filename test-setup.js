// event mocks that will be spied on
var eventHandlerMocks = {
    onActiveDescendantChange : function() {}
};

// cache useful elements
var $widget;
var $focusItem;
var $descendantItems;

function setupDom(html) {
    $('body').empty().html(html);
}

function setupGlobals() {
    $widget = $('.combobox').first();
    $focusItem = $widget.find('[role=combobox]');
    $descendantItems = $widget.find('[role=option]');
}

function setupSpy() {
    spyOn(eventHandlerMocks, 'onActiveDescendantChange');
    $widget.on('activeDescendantChange', eventHandlerMocks.onActiveDescendantChange);
}

function executePlugin() {
    $widget.activeDescendant($focusItem, $descendantItems);
}

function setupSuite(html) {
    setupDom(html);
    setupGlobals();
    executePlugin();
    setupSpy();
}
