var openLink = function () {
    chrome.tabs.update({
        url: this.attributes.href.value
    });
};

document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM loaded");
    // attach listener
    document.getElementById('change-btn').addEventListener("click", openLink);
    // populate commands
    chrome.commands.getAll(function (commands) {
        commands.map(function (cmd) {
            document.getElementById('commands').innerHTML += "<li class='cmd'><span class='sc-cmd'>" + cmd.shortcut + "</span><span class='sc-name'>" + cmd.name + "</span><span class='sc-desc'>" + cmd.description + "</span></li>";
        });
    });
});
