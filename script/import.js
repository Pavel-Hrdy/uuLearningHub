const axios = require("axios").default;
const neatCsv = require("neat-csv");
const fs = require('fs');

const rf = fs.promises.readFile;
const wf = fs.promises.writeFile;



class Import {
    constructor() {
        this.videoToImportList = [];
        this.videoImportedList = [];
        this.videoImportFailedList = [];
        this.videoBeingImported = {};
    }

    async getVideoList() {
        const inputFile = await rf(__dirname + "/db.csv")
        this.videoToImportList = await neatCsv(inputFile.toString(), {separator: ";"})
    }


    getVideoToImport(i) {
        this.videoBeingImported = this.videoToImportList[i];
    }

    async importVideo() {
        this.videoBeingImported.chapterSchema = {chapterOrderNumber: null, subchapterOrderNumber: null};
        this.videoBeingImported.chapterSchema.chapterOrderNumber =  this.videoBeingImported.chapterOrderNumber;
        this.videoBeingImported.chapterSchema.subchapterOrderNumber  =  this.videoBeingImported.subchapterOrderNumber;
        this.videoBeingImported.state = "active";
        delete this.videoBeingImported.chapterOrderNumber;
        delete this.videoBeingImported.subchapterOrderNumber;
        try {
            await this._importVideo();
            this.videoImportedList.push(JSON.stringify(this.videoBeingImported))
        } catch(e) {
            this.videoBeingImported.error = e.message;
            this.videoImportFailedList.push(JSON.stringify(this.videoBeingImported))
        }
    }

    async _importVideo() {
        let data = JSON.stringify(this.videoBeingImported);
        const newResponse = await axios.post('http://localhost:3000/video/create', data);
    }
}



async function main() {
    const myImport = new Import();
    await myImport.getVideoList();   
    for (let i = 0; i < myImport.videoToImportList.length; i++) {
        myImport.getVideoToImport(i);
        await myImport.importVideo();
    }
    console.log(myImport.videoImportFailedList)
}

main()


