// upload csv to database: $ node upload_tables.js
// upload INSSE Tempo data to PostgreSQL DB


// import libraries
const fs = require('fs');
const { once } = require('events');
const axios = require('axios');
// const logger = require('../../node_modules/morgan/index');
const cheerio = require('cheerio');
// library to format time
const dateFormat = require('dateformat');
const glob = require('glob');
const readline = require('readline');
// const redis = require('redis');


// paths
const inputPath = '../../../docker-data/control/insse';
// const jsonOutputPath = '../../../docker-data/control/insse/json';
const csvOutputPath = '../../../docker-data/control/insse/csv';
const csvTransformPath = '../../../docker-data/control/insse/extracts/csv-transform';
const extractsOutputPath = '../../../docker-data/control/insse/extracts';
// const tempoL1File = `${inputPath}/tempoL1.json`;
// const tempoL2File = `${inputPath}/tempoL2.json`;
const tempoL3File = `${inputPath}/tempoL3.json`;
// const requestPath = 'http://statistici.insse.ro:8077/tempo-ins/matrix/';
// const tempoL3 = { level3: [] };
// const stringifier = csv.stringify();
// INSSE Tempo query limit (no of cells)
// const queryLimit = 30000;

// create redis client
// const rStorage = redis.createClient();
// rStorage.on('error', (err) => {
//     console.log(`Error: ${err}`);
// });


// ////////////////////////////////////////////////////////////////////////////////////////////
// // METHODS

// ////////////////////////////////////////////////////////////////////////////////////////////
// load table headers from file [tempoL3.json]
function readFile(filePath) {
    // console.log(`@read file: ${filePath}`);
    if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    console.log('@readTemplate: File not found!');
    return {};
}

// ///////////////////////////////////////////////////////////////////////////////////////
// // extract counties from files that have localities level data

function extractCounties(exTable) {

    // start timer
    const dbStartTime = new Date();
    const dbStartDate = dateFormat(dbStartTime, 'isoDate');
    console.log('\x1b[33m%s\x1b[0m', '@extractCounties:: Timer started\n');
    console.log(`${dbStartTime}`);

    // read table ancestors from file
    // const tempoL1 = readFile(tempoL1File);
    // const ancestors = tempoL1.level1;
    const tempoL3 = readFile(tempoL3File);
    // filter the tables containing localities data ( 86 tables )
    const childrenArr = tempoL3.level3.filter(item => item.matrixName.includes('si localitati'));
    console.log(`\nTOTAL COUNT = ${childrenArr.length}\n`);

    // save list to file
    const indexListStream = fs.createWriteStream(`${extractsOutputPath}/index_list.csv`);
    indexListStream.write('"indicator";"nume"\n');

    // for each table, filter the given county
    childrenArr.forEach((child, index) => {
        const tableName = child.tableName;
        // save item to index file
        const writeLine = `"${tableName}";"${child.matrixName}"\n`;
        indexListStream.write(writeLine);
        indexListStream.on('error', (err) => { console.log(`ERROR:: Write Stream: ${err}`); });

        // console.log(child);
        // const tableIndex = ancestors.filter(item => item.context.code === tableCode)[0].context.name.split(' ')[0].replace('.', '');
        // const ancestorPrefix = ancestors.filter(item => item.context.code === parentCode)[0].context.name.split(' ')[0];
        // const tablePrefix = `${ancestorPrefix}.${tableIndex}`;
        const fileName = `????-??-??_*_${tableName}.csv`;
        // test if file exists
        if (glob.sync(fileName, { cwd: csvOutputPath }).length > 0) {
            console.log(`file ${index} found`);

            // get actual filename
            const currentFileName = glob.sync(fileName, { cwd: csvOutputPath })[0];
            const currentFilePath = `${csvOutputPath}/${currentFileName}`;
            console.log(`${index} :: ${currentFileName}: START`);

            // create new files to hold the filtered values
            const streams = [];
            exTable.forEach((sItem) => {
                streams.push(fs.createWriteStream(`${extractsOutputPath}/${sItem.code}/${currentFileName}`));
            });

            // parse file, line by line
            const rl = readline.createInterface({
                input: fs.createReadStream(currentFilePath),
                // output: process.stdout,
            });

            // set line counter
            let lineCounter = 0;

            // parse each line
            rl.on('line', (line) => {
                lineCounter += 1;
                // if header line
                if (lineCounter === 1) {
                    let newLine = line.replace(/;(Localitati)\s*;/gm, ';SIRUTA;$1;');
                    newLine = newLine.replace(/;(Municipii si orase)\s*;/gm, ';SIRUTA;$1;');
                    streams.forEach(stream => stream.write(`${newLine}\n`));
                    // print new header to console
                    console.log(`\n${index} :: ${currentFileName}: HEADER`);
                    console.log(newLine);
                // if data line
                } else {
                    streams.forEach((stream, itemIndex) => {
                        if (line.includes(exTable[itemIndex].name)) {
                            // console.log(`\n${line}`);
                            const newLine = line.replace(/;"(\d+)\s([^"]+)";/gm, ';"$1";"$2";');
                            if (line !== newLine) stream.write(`${newLine}\n`);
                        }
                    });
                }
            });
            rl.on('close', () => {
                // console.log(line);
                console.log(`${index} :: ${currentFileName}: done reading file.`);
                streams.forEach(stream => stream.close());
            });
        }

    // close index file
    // indexListStream.close();
    });

    // upload tables to database


    // end timer
    const dbDuration = new Date() - dbStartTime;
    console.info('\x1b[33m%s\x1b[0m', `\nProcess execution time: ${Math.floor(dbDuration / 1000)}s`);
}


// ///////////////////////////////////////////////////////////////////////////////////////
// get array of time instances from table files

async function getTimesArr(index, currentFileName, filePath) {
    // open file for first stage processing
    const inStream = readline.createInterface({
        input: fs.createReadStream(filePath),
        crlfDelay: Infinity,
        // output: process.stdout,
    });
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.

    // create items array
    const itemsArr = [];

    // create time array
    const timesArr = [];

    // set markers
    let lineCounter = 0;
    let luniIndex = -1;
    let perioadeIndex = -1;
    let trimestreIndex = -1;
    let aniIndex = -1;
    let umIndex = -1;
    let valoareIndex = -1;
    let oldHeader = [];

    // parse each line
    for await (const line of inStream) {
        lineCounter += 1;

        // break line into array
        const lineArrRaw = line.replace('\n', '').split(';');
        const lineArr = line.replace(/"/g, '').replace('\n', '').split(';');
        // console.log('\n>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
        // console.log(lineArr);

        // header item
        if (lineCounter === 1) {
            // console.log(lineArr);
            oldHeader = [];
            for (const item of lineArr) {
                oldHeader.push(`"${item.trim()}"`);
            }
            perioadeIndex = lineArr.indexOf('Perioade');
            trimestreIndex = lineArr.indexOf('Trimestre');
            luniIndex = lineArr.indexOf('Luni');
            aniIndex = lineArr.indexOf('Ani');
            umIndex = aniIndex + 1;
            valoareIndex = umIndex + 1;
        // lines
        } else {
            let itemInstance = '';
            let timeInstance = '';
            // if time is represented only in 'Ani'
            if (perioadeIndex === -1 && luniIndex === -1 && trimestreIndex === -1) {
                itemInstance = `${lineArrRaw.slice(0, aniIndex).join(';')}`;
                timeInstance = `"${lineArr[aniIndex]}"`;
                // console.log(`${lineArr.join()}`);

            // if time is represented in 'Perioade' and 'Ani'
            } else if (perioadeIndex !== -1) {
                itemInstance = `${lineArrRaw.slice(0, perioadeIndex).join(';')}`;
                if (lineArr[perioadeIndex] === 'anual') {
                    timeInstance = `"${lineArr[aniIndex]}"`;
                } else {
                    timeInstance = `"${lineArr[perioadeIndex]} ${lineArr[aniIndex]}"`;
                }

            // if time is represented in 'Trimestre' and 'Ani'
            } else if (trimestreIndex !== -1) {
                itemInstance = `${lineArrRaw.slice(0, trimestreIndex).join(';')}`;
                if (lineArr[trimestreIndex] === 'anual') {
                    timeInstance = `"${lineArr[aniIndex]}"`;
                } else {
                    timeInstance = `"${lineArr[trimestreIndex]} ${lineArr[aniIndex]}"`;
                }

            // if time is represented in 'Luni' and 'Ani'
            } else if (luniIndex !== -1) {
                itemInstance = `${lineArrRaw.slice(0, luniIndex).join(';')}`;
                if (lineArr[luniIndex] === 'anual') {
                    timeInstance = `"${lineArr[aniIndex]}"`;
                } else {
                    timeInstance = `"${lineArr[luniIndex]} ${lineArr[aniIndex]}"`;
                }
            }
            // if item is new add it
            if (!itemsArr.includes(itemInstance)) itemsArr.push(itemInstance);
            // if item is new add it into timesArr
            if (!timesArr.includes(timeInstance)) timesArr.push(timeInstance);
        }
    }
    inStream.on('error', (err) => {
        console.log(err);
    });

    console.log('\n>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    console.log(`${index} :: ${currentFileName}: times array finished!`);
    console.log(`perioadeIndex = ${perioadeIndex}; luniIndex = ${luniIndex}; trimestreIndex = ${trimestreIndex}; aniIndex = ${aniIndex}\n`);
    return {
        oldHeader,
        itemsArr,
        timesArr,
        lineCounter,
        perioadeIndex,
        luniIndex,
        trimestreIndex,
        aniIndex,
        umIndex,
        valoareIndex,
    };
}


// ///////////////////////////////////////////////////////////////////////////////////////
// transform table - read old table and save new version in separate folder

function transformTable(headerInfo, countyId) {
    // create variables
    const lineFlagArray = [];

    // open write file
    const outStream = fs.createWriteStream(`${csvTransformPath}/${countyId}/${headerInfo.fileName}`);
    // const outObj = [];

    // write new header to file
    outStream.write(`${headerInfo.newHeader.join(';')}\n`);

    // for each new item parse entire table
    headerInfo.itemsArr.forEach(async (headerItem, index) => {
    // for (let index = 0; index < headerInfo.itemsArr.length; index += 1) {
        // const headerItem = headerInfo.itemsArr[index];
        console.log(`${index} :: @transform ${headerItem}`);

        // create read stream
        const inStream = readline.createInterface({
            input: fs.createReadStream(`${extractsOutputPath}/${countyId}/${headerInfo.fileName}`),
            crlfDelay: Infinity,
            // output: process.stdout,
        });

        // create values array
        // rStorage.set(headerItem, '');
        const timeValues = [];
        for (let i = 0; i < headerInfo.timesArr.length; i += 1) {
            timeValues.push('');
        }

        // set markers
        let lineCounter = 0;
        let valuesCounter = 0;
        let currentUM = '';

        console.log(`${index} :: @transform ${headerItem} >>> start for loop\n`);
        // parse each line
        // for await (const line of inStream) {
        inStream.on('line', (line) => {
            lineCounter += 1;
            if (!lineFlagArray.includes(lineCounter)) {
                // console.log(`${headerInfo.index}: ${headerInfo.tableId} >>> item ${index}/${headerInfo.itemsArr.length} :: @transform loop line ${lineCounter}/${headerInfo.lineCounter}\n`);

                // break line into array
                const lineArr = line.replace('\n', '').split(';');

                // create items
                let currentItem = '';
                let currentTime = '';
                let currentTimeIndex = '';
                // console.log(`${headerInfo.perioadeIndex} :: ${headerInfo.luniIndex} :: ${headerInfo.trimestreIndex}`);

                // if header row
                if (lineCounter <= 1) return;
                // if normal row
                // if time is represented only in 'Ani'
                if (headerInfo.perioadeIndex === -1
                    && headerInfo.luniIndex === -1
                    && headerInfo.trimestreIndex === -1) {
                    currentItem = lineArr.slice(0, headerInfo.aniIndex).join(';');
                    currentTime = lineArr[headerInfo.aniIndex];
                    currentTimeIndex = headerInfo.timesArr.indexOf(currentTime);

                // if time is represented in 'Perioade' and 'Ani'
                } else if (headerInfo.perioadeIndex !== -1) {
                    currentItem = lineArr.slice(0, headerInfo.perioadeIndex).join(';');
                    currentTime = `"${lineArr[headerInfo.perioadeIndex].replace(/"/g, '')} ${lineArr[headerInfo.aniIndex].replace(/"/g, '')}"`;
                    currentTimeIndex = headerInfo.timesArr.indexOf(currentTime);

                // if time is represented in 'Trimestre' and 'Ani'
                } else if (headerInfo.trimestreIndex !== -1) {
                    currentItem = lineArr.slice(0, headerInfo.trimestreIndex).join(';');
                    currentTime = `"${lineArr[headerInfo.trimestreIndex].replace(/"/g, '')} ${lineArr[headerInfo.aniIndex].replace(/"/g, '')}"`;
                    currentTimeIndex = headerInfo.timesArr.indexOf(currentTime);

                // if time is represented in 'Luni' and 'Ani'
                } else if (headerInfo.luniIndex !== -1) {
                    currentItem = lineArr.slice(0, headerInfo.luniIndex).join(';');
                    currentTime = `"${lineArr[headerInfo.luniIndex].replace(/"/g, '')} ${lineArr[headerInfo.aniIndex].replace(/"/g, '')}"`;
                    currentTimeIndex = headerInfo.timesArr.indexOf(currentTime);
                }

                // console.log(`${headerInfo.index}: ${headerInfo.tableId} >>> item ${index}/${headerInfo.itemsArr.length} :: @transform loop line ${lineCounter}/${headerInfo.lineCounter}`);
                // console.log(`current item: ${currentItem}\n`);
                // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
                // console.log(`current time: ${currentTime}\n`);

                // if current line item is new
                if (headerItem === currentItem) {
                    console.log(`\n${headerInfo.tableId} >>> item ${index}/${headerInfo.itemsArr.length} :: @transform loop line ${lineCounter}/${headerInfo.lineCounter}`);
                    // increase values counter
                    valuesCounter += 1;
                    // console.log(`${headerInfo.index}: ${headerInfo.tableId} >>> item ${index}/${headerInfo.itemsArr.length} :: values ${valuesCounter}/${headerInfo.timesArr.length}`);
                    // add new line index to array
                    lineFlagArray.push(lineCounter);

                    // add new value to value array
                    timeValues[currentTimeIndex] = lineArr[headerInfo.valoareIndex];

                    // update current um
                    currentUM = lineArr[headerInfo.umIndex];
                }

                // if we found all values for one item, close stream
                if (valuesCounter === headerInfo.timesArr.length || lineCounter === headerInfo.lineCounter) {
                    console.log(`\n${headerItem} :: done!`);
                    console.log(`${timeValues.join()}\n`);
                    // outStream.write(`${headerItem};${timeValues.join(';')};${currentUM}\n`);
                    inStream.close();
                }
            }
        });

        inStream.on('error', (err) => {
            console.log(err);
        });

        inStream.on('close', () => {
            console.log(`${index} :: @transform ${headerItem} >>> inStream CLOSED!\n`);
            // write line to out stream
            outStream.write(`${headerItem};${timeValues.join(';')};${currentUM}\n`);
            // outObj.push([headerItem, timeValues, currentUM]);
            console.log('##############################################################');
            // console.log(outObj);
        });
    });
    // }

    // close write file
    // outStream.close();
}


// ///////////////////////////////////////////////////////////////////////////////////////
// // transform tables - get all time instances into columns

function transformTables(batchIndex, countyId, tablesList = []) {

    // start timer
    const dbStartTime = new Date();
    const dbStartDate = dateFormat(dbStartTime, 'isoDate');
    console.log('\x1b[33m%s\x1b[0m', '@transformTables:: Timer started\n');

    let selectedTArr = [];
    let batchArray = [];

    // if no tables list is provided
    if (tablesList.length === 0) {
        // read selected tables ids from file
        try {
            const selectedTables = fs.readFileSync(`${extractsOutputPath}/index_list.csv`, 'utf8').split('\n');
            // remove last item (empty item generated from split)
            selectedTables.pop();
            selectedTArr = selectedTables.map(line => line.split(';')[0].replace(/"/g, '')).slice(1);
            console.log(`@transformTables :: table IDs are ready for ${selectedTArr.length} tables\n`);
        } catch (e) {
            console.log('Error: ', e.stack);
        }
    } else {
        selectedTArr = tablesList;
    }

    // create batch array
    if (batchIndex === 0) {
        batchArray = batchArray.concat(selectedTArr);
    } else {
        batchArray = selectedTArr.slice((batchIndex - 1) * 11, batchIndex * 11);
    }

    // for each table id get header data
    Promise.all(batchArray.map(async (tableId, index) => {

        const returnObj = {};
        returnObj.tableId = tableId;
        returnObj.index = index;

        const fileName = `????-??-??_*_${tableId}.csv`;
        const sourcePath = `${extractsOutputPath}/${countyId}`;
        // test if file exists
        if (glob.sync(fileName, { cwd: sourcePath }).length > 0) {
            console.log(`file ${index} found`);

            // get actual filename
            const currentFileName = glob.sync(fileName, { cwd: csvOutputPath })[0];
            const currentFilePath = `${sourcePath}/${currentFileName}`;
            console.log(`${tableId} :: ${currentFileName}`);
            console.log(`${tableId} :: ${currentFilePath}`);

            // first stage processing
            // create array of time instances
            const headerInfo = await getTimesArr(index, currentFileName, currentFilePath);
            console.log(`${index} :: outside header`);

            // pass data into return object
            returnObj.fileName = currentFileName;
            returnObj.filePath = currentFilePath;
            returnObj.oldHeader = headerInfo.oldHeader;
            returnObj.itemsArr = headerInfo.itemsArr;
            returnObj.timesArr = headerInfo.timesArr;
            returnObj.lineCounter = headerInfo.lineCounter;
            returnObj.luniIndex = headerInfo.luniIndex;
            returnObj.trimestreIndex = headerInfo.trimestreIndex;
            returnObj.perioadeIndex = headerInfo.perioadeIndex;
            returnObj.aniIndex = headerInfo.aniIndex;
            returnObj.umIndex = headerInfo.umIndex;
            returnObj.valoareIndex = headerInfo.valoareIndex;

            console.log(`${index} :: ${currentFileName} : headerInfo aquired`);
            console.log(`${index} :: timesArr >>> ${returnObj.timesArr}`);

            // create new header
            // insert cells before time instance
            // if time is represented only in 'Ani'
            if (returnObj.perioadeIndex === -1
                && returnObj.trimestreIndex === -1
                && returnObj.luniIndex === -1) {
                returnObj.newHeader = returnObj.oldHeader.slice(0, returnObj.aniIndex);
            // if time is represented in 'Perioade' || 'Trimestre' || 'Luni' and 'Ani'
            } else {
                returnObj.newHeader = returnObj.oldHeader.slice(0, returnObj.aniIndex - 1);
            }
            // insert time array
            returnObj.newHeader = returnObj.newHeader.concat(returnObj.timesArr);

            // insert um column
            returnObj.newHeader.push(returnObj.oldHeader[returnObj.umIndex]);

            console.log(`\n${index} :: ${currentFileName} : old header`);
            console.log(`${index} :: ${returnObj.oldHeader}\n`);
            console.log(`${index} :: aniIndex = ${returnObj.aniIndex}\n`);

            console.log(`\n${index} :: ${currentFileName} : new header created`);
            console.log(`${index} :: ${returnObj.newHeader}\n`);

            // console.log(`\n${index} :: ${currentFileName} : new items array created`);
            // console.log(`${index} :: ${returnObj.itemsArr}\n`);
        } else {
            console.log(`\n${fileName} NOT FOUND!\n`);
        }

        // return new value for current item
        return returnObj;
    })).then((result) => {
        // calculate transpose tables
        console.log('\n# Start transpose process !!! >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> \n');
        console.log(result.length);

        // for each item in array
        result.forEach((headerInfo) => {
            transformTable(headerInfo, countyId);
        });
    }).catch((error) => {
        console.log(error.message);
    });

    // // calculate transpose tables
    // console.log('\n Start transpose process !!! \n');
    // transformTable(batchArray);
}


// ////////////////////////////////////////////////////////////////////////////
// // MAIN FUNCTION

function main() {
    console.log(process.argv);

    // help text
    const helpText = '\n Available commands:\n\n\
 1. -h or --help : display help text\n\
 2. -e or --extract : extract desired counties (SJ, SV, TL) in separate folders and files (folders must be created manually)\n\
 3. -t or --transform : refactor tables to display data in one line, each time instance becomes a header column\n\
    (destination folder must be created manually)\n\
    + can also accept additional argument [0:8] or table id, defaults to 0\n\
          0    process all files\n\
          1-8  process Nth batch of 10-12 tables\n\
          GOS102A\n\
    + can also accept additional argument county id, defaults to all\n\
          SV\n\
    ';

    // set extracts
    const exTable = [
        { name: 'Suceava', code: 'SV' },
        { name: 'Salaj', code: 'SJ' },
        { name: 'Tulcea', code: 'TL' },
    ];
    const ctyIds = [
        'SV',
        'SJ',
        'TL',
    ];

    // get third command line argument
    const argument = process.argv[2] || '--help';
    let batchArg = 0;
    const tableIds = [];
    let countiesIds = [];

    if (process.argv[3] && process.argv[3].length === 1) {
        batchArg = process.argv[3];
    } else if (process.argv[3] && process.argv[3].length > 5) {
        tableIds.push(process.argv[3]);
        if (process.argv[4] || ctyIds.includes(process.argv[4])) {
            countiesIds.push(process.argv[4]);
        } else {
            countiesIds = ctyIds;
        }
    }

    console.log('\x1b[34m%s\x1b[0m', `\n@uploadTables >>>>>>> ${argument} + ${batchArg}`);

    // run requested command
    // 1. if argument is 'h' or 'help' print available commands
    if (argument === '-h' || argument === '--help') {
        console.log(helpText);

    // 2. else if argument is 'e' or 'extract', check which tables have 'luni' for time column
    } else if (argument === '-e' || argument === '--extract') {
        // extract counties from the localities level tables
        extractCounties(exTable);

    // 3. refactor tables: create columns from time instances
    } else if (argument === '-t' || argument === '--transform') {
        // if (process.argv[3].length === 2) {
        //     batchArg = process.argv[3];
        // } else if (process.argv[3].length > 5) {
        //     tableIds.push(process.argv[3]);
        // }
        // transform tables from counties extracted files
        countiesIds.forEach((item) => {
            console.log(`batchArg = ${batchArg}; countyId = ${item}; tableIds = ${tableIds}`);
            transformTables(batchArg, item, tableIds);
        });
        // transformTables(batchArg, 'SV', tableIds);
        // transformTables(batchArg, 'SJ', tableIds);
        // transformTables(batchArg, 'TL', tableIds);

    // else print help
    } else {
        console.log(helpText);
    }

}


// ////////////////////////////////////////////////////////////////////////////
// // RUN MAIN

main();
