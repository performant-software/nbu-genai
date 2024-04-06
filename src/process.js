const { JSDOM } = require('jsdom')
const { chatGPT } = require('./chatgpt')

async function processTEI(xml) {
    const doc = new JSDOM(xml, { contentType: "text/xml" }).window.document
    // const sourceDoc = doc.querySelector('sourceDoc')
    // const sourceDocXML = sourceDoc.outerHTML
    const text = doc.getElementsByTagName('div')[0]
    const textXML = text.outerHTML
    const prompt = getRelationPrompt(textXML)
    const response = await chatGPT(prompt)
    return response
}

function getUUIDPrompt() {
    return "Please generate a sequence of 50 UUIDs."
}

function getRelationPrompt(translation) {
    return `
    The following TEI XML encoded document is called documentA. 
    Please provide a list of all the relationships between the people in documentA in TEI XML format using <relation> elements. 
    For each <relation> element, populate the name attribute with the most appropriate relation type from the following list: grandparent, godparent, parent, baptized.
    ${translation}
    `
}

function getNERPrompt(translation) {
    return `
    The following TEI XML encoded document is called documentA. 
    Mark all of the person names in the translation with the <persName> element.
    Mark all of the place names with the <placeName> element. 
    ${translation}
    `
}

function getSourceDocPrompt(sourceDoc) {
    return `
    The following TEI XML encoded document is called documentA. 
    Please translate the contents of the sourceDoc element in documentA into English. 
    Place the translation of documentA in a 'TEI XML <body> element within a <text> element with the xml:id "translation". 
    Place the <text> element inside a <TEI> element.
    In the translation, remove the line elements and use <p> elements instead when appropriate. 
    Mark all of the person names in the translation with the <persName> TEI element.
    Mark all of the place names with the <placeName> TEI element. 
    Mark the page beginnings with a <pb/> TEI element.
    ${sourceDoc}
    `
}

module.exports.processTEI = processTEI;