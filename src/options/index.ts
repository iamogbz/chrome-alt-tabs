import { changeTabUrl, getAllCommands } from "../utils/chrome";

document.addEventListener("DOMContentLoaded", async () => {
    const changeShortcutsButton = document.getElementById("change-btn");
    changeShortcutsButton.addEventListener("click", () => {
        const targetAttrs = changeShortcutsButton.attributes;
        changeTabUrl(targetAttrs.getNamedItem("href").value);
    });
    const commands = await getAllCommands();
    document.getElementById("commands").innerHTML = commands
        .map(
            cmd =>
                `<li class='cmd'>
                <span class='sc-cmd'>${cmd.shortcut}</span>
                <span class='sc-name'>${cmd.name}</span>
                <span class='sc-desc'>${cmd.description}</span>
                </li>`,
        )
        .join("");
});
