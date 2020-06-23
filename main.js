"use strict";

// this script uses the write-good library to check
// HTML paragraphs for good writing style
// see https://github.com/btford/write-good for more details

const schreibGut = require('schreib-gut');
const writeGood = require('write-good');

function applyWriteGood() {
    let paragraphs = document.getElementsByTagName("p");
    let stats = {'oice': 0, 'iage': 0, 'eded': 0, 'ning': 0, 'iche': 0, 'ated': 0, 'word': 0};
    const names = {
        'oice': 'passive voice',
        'iage': 'unnecessary verbiage',
        'eded': 'wordy or unneeded',
        'ning': 'no meaning',
        'iche': 'cliché',
        'ated': 'repeated word',
        'word': 'weasel word'
    };
    [].forEach.call(paragraphs, function (paragraph) {
        let text = paragraph.textContent;
        let suggestions = writeGood(text);
        let numSuggestions = document.createElement("span");
        numSuggestions.innerHTML = suggestions.length;
        paragraph.appendChild(numSuggestions);
        let highlighted = "";
        let lastIndex = 0;
        [].forEach.call(suggestions, function (suggestion) {
            console.log(suggestion)
            highlighted += text.substr(lastIndex, suggestion.index - lastIndex);
            let reason = suggestion.reason;
            let type = reason.substr(reason.length - 4);
            highlighted += "<span class='mark wg-" + type + "'>";
            highlighted += text.substr(suggestion.index, suggestion.offset);
            highlighted += "<span class='reason'>" + reason + "</span></span>";
            lastIndex = suggestion.index + suggestion.offset;
            stats[type] += 1;
        });
        highlighted += text.substr(lastIndex, text.length - lastIndex);
        paragraph.innerHTML = highlighted
    });
    let output = "";
    for (let key in stats) {
        console.log(stats[key]);
        output += "<tr><td>" + stats[key] + " x</td><td><span class='wg-" + key + "'>" + names[key] + "</span></td></tr>";
    }
    ;
    let wgtable = document.getElementById('writegoodtd');
    wgtable.innerHTML = output;
}


document.addEventListener("DOMContentLoaded", function() {
//    applyWriteGood();

    var oldProcessLinks = __IntelliJTools && __IntelliJTools.processLinks;
    // if this is in the preview window in the IDE, run the checks
    if (oldProcessLinks) {
        __IntelliJTools.processLinks = function() {
            oldProcessLinks();
            applyWriteGood();
        }
    }
});
