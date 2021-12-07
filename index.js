const fs = require('fs')
const readline = require('readline');
var readlineSync = require('readline-sync');

var impactQuestions = fs.readFileSync('./impact.questions', 'utf-8').split('\n')
var feasabilityQuestions = fs.readFileSync('./feasability.questions', 'utf-8').split('\n')
var auditabilityQuestions = fs.readFileSync('./auditability.questions', 'utf-8').split('\n')

const start = async (questionsArr) => {
    var report = []
    questionsArr.forEach((arrayOfQuestions, index) => {
        const key = Object.keys(arrayOfQuestions)[0]
        report.push(`\n${key}`)
        var longAnswer = ""
        for (const line of arrayOfQuestions[key]) {
            const arr = line.split('-')
            var query = `${arr[0]}\n`
            if (arr.length > 0) {
                arr.forEach((item, index) => {
                    if (index > 0) query = query.concat(`\t* ${item}\n`)
                })
            }

            var answer = readlineSync.question(query).trim()
            var skip = answer === '' ? true : false
            answer = answer.charAt(0).toUpperCase() + answer.slice(1)
            const lastSymbolFromAnswer = answer.substring(answer.length - 1)
            if (query.trim() !== 'SCORE:') {
                if (skip || lastSymbolFromAnswer === '.' || lastSymbolFromAnswer === '!' || lastSymbolFromAnswer === '?') {
                    longAnswer = longAnswer.concat(`${answer} `)
                } else {
                    longAnswer = longAnswer.concat(`${answer}. `)
                }
            } else {
                let scoreAnswer = 0
                while (true) {
                    try {
                        let currentAnswer = readlineSync.question(query).trim()
                        console.log(currentAnswer)
                        scoreAnswer = Number.parseInt(currentAnswer)
                        if (scoreAnswer >= 1 && scoreAnswer <= 5) {
                            break
                        } else {
                            console.log('\033[2J')
                            console.log("Score should be between 1 to 5")
                        }
                    } catch (e) {
                        console.log('\033[2J');
                        console.log("Score is between 1 to 5")
                    }
                }
                longAnswer = longAnswer.concat(`\nSCORE: ${answer}`)
            }

        }
        report.push(longAnswer.trim())
    })
    fs.writeFileSync('./report.txt', report.join('\n'))
}
start([{ "IMPACT:": impactQuestions }, { "FEASABILITY:": feasabilityQuestions }, { "AUDITABILITY:": auditabilityQuestions }])
