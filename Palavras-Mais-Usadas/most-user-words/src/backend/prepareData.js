module.exports = rows => {
    return new Promise((resolver, reject) => {
        try {
            
            const words = rows
                .filter(filterValidRow)    // filtrando linhas validas
                .map(removePunctuation)    // removendo pontuação
                .map(removeTags)           // removendo tags html
                .reduce(mergeRows)         // juntar as linhas em uma
                .split(' ')                // transformando em array (para ter todas as palavras separadas)
                .map(turningIntoLowercase) // transformando as palavras em letras minusculas
                .map(removeDoubleQuotes)   // removendo aspas duplas

            resolver(words)

        } catch (e) {
            reject(e)
        }
    })
}
//#region Functions

function filterValidRow(row) {
    const notNumber = !parseInt(row.trim())
    const notEmpty = !!row.trim()
    const notInterval = !row.includes('-->')

    return notNumber && notEmpty && notInterval
}

const removePunctuation = row => row.replace(/[,?!.-]/g, '')
const removeTags = row => row.replace(/(<[^>]+)/ig, '').trim()
const mergeRows = (fullText, row) => `${fullText} ${row}`
const turningIntoLowercase = word => word.toLowerCase()
const removeDoubleQuotes = word => word.replace('"', '')
//#endregion