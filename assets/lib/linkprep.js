var clipboard = new ClipboardJS('.copyButton');
var address = document.getElementById("myCropAddress");

new ClipboardJS('.copyButton');
$('.copyButton').on('click', function() {
    alertify.success('Copied Link', 2)
});

$("#copyAddressButton").attr("data-clipboard-text", address);

window.addEventListener("load",function() {
    clipboard.on('success', function(e) {
        $(e.trigger).text("Copied!");
        e.clearSelection();
        setTimeout(function() {
            $(e.trigger).text("Copy");
        }, 2500);
    });

    clipboard.on('error', function(e) {
        $(e.trigger).text("Can't in Safari");
        setTimeout(function() {
            $(e.trigger).text("Copy");
        }, 2500);
    });
});