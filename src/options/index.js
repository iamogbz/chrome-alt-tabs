const openLink = () => {
    chrome.tabs.update({
        url: this.attributes.href.value,
    });
};

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("change-btn").addEventListener("click", openLink);
    chrome.commands.getAll(commands => {
        document.getElementById("commands").innerHTML = commands
            .map(
                cmd =>
                    `<li class='cmd'><span class='sc-cmd'>${
                        cmd.shortcut
                    }</span><span class='sc-name'>${
                        cmd.name
                    }</span><span class='sc-desc'>${
                        cmd.description
                    }</span></li>`,
            )
            .join("");
    });
});
