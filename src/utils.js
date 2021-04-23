import * as test_ from "./test"

let element = document.getElementById("mesgs-scrollable");
export function updateScroll(){
    element.scrollTop = element.scrollHeight;
}

export function htmlToElement(html) {
    let template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

export function openForm() {
    document.getElementById("myForm").style.display = "block";
}

export function closeForm() {
    document.getElementById("myForm").style.display = "none";
}