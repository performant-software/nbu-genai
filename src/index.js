const path = require('path')
const fs = require('fs')
require('dotenv').config()

const { processTEI } = require('./process')

// For paths provided by the user
function processUserPath(input_path) {
    return path.resolve(process.cwd(), input_path)
}

function run(options) {
    // load the TEI file and process it
    const { targetPath, outputPath } = options
    const xml = fs.readFileSync(targetPath, "utf8")
    processTEI(xml).then((outputXML) => {
        fs.writeFileSync(outputPath, outputXML, "utf8")
    }).catch((err) => {
        console.log(err)
    })
}

function getResourceIDFromPath(targetPath) {
    if( targetPath.toLowerCase().endsWith('.xml') ) {
        return path.basename(targetPath,'.xml').trim()
    } else {
        return null
    }
}

function processArguments() {
    const args = process.argv
    const optForHelp = { mode: 'help' }

    if( args.length < 2 ) return optForHelp

    // default settings
    let config = {
        outputPath: '.'
    }

    // parse command line params
    if( args[2] ) {
        config.targetPath = processUserPath(args[2])
    } else {
        return optForHelp
    }
    if( args[3] ) { 
        config.outputPath = processUserPath(args[3])
        const resourceID = getResourceIDFromPath(config.targetPath)
        if( resourceID ) {
            config.outputPath = `${config.outputPath}/${resourceID}.xml`
        }
    }
    return config
}

function displayHelp() {
    console.log(`Usage: nbu-genai <tei_path> <output_path>` );
    console.log("\thelp: Displays this help. ");
}

function nbuGenAI() {
    const options = processArguments()
    if( options.mode === 'help' ) {
        displayHelp()
    } else {
        run(options)
    }
}

module.exports.nbuGenAI = nbuGenAI;
