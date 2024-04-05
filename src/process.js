const { JSDOM } = require('jsdom')
const { chatGPT } = require('./chatgpt')

async function processTEI(xml) {
    const dom = new JSDOM(xml)
    const document = dom.window.document
    const sourceDoc = document.querySelector('sourceDoc')
    // const text = document.querySelector('text')    
    const sourceDocXML = sourceDoc.outerHTML
    const prompt = getPrompt(sourceDocXML)
    const response = await chatGPT(prompt)
    console.log(response.message.content)
    return response.message.content
}

function getPrompt(sourceDoc) {
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