"use strict";
const fs = require("fs");
const path = require("path");

const rf = fs.promises.readFile;
const wf = fs.promises.writeFile;



// path to default storage
const DEFAULT_STORAGE_PATH = path.join(__dirname, "..", "storage", "links.json");


class LinkDao {
  constructor(storagePath=DEFAULT_STORAGE_PATH) {
    this._linkStoragePath = storagePath;
  }


  async createLink(link) {
    let links = await this._loadAllLinks();
    if (links.find(b => b.name === link.name)) {
      throw new Error(`The link "${link.name}" already exists!`);
    }
    links.push(link);
    await wf(this._getStorageLocation(), JSON.stringify(links, null, 2));
    return link;
  }


  async getLink(name) {
    let links = await this._loadAllLinks();
    const link = links.find(b => {return b.name === name});
    return link;
  }


  async listLinks() {
    let links = await this._loadAllLinks();
    return links;
  }

  async updateLink(link) {
    let links = await this._loadAllLinks();
    const linkIndex = links.findIndex(b => b.name === link.name)
    if (linkIndex < 0) {
      throw new Error(`Link with given id '${link.name}' does not exists.`);
    } else {
      links[linkIndex] = {
        ...links[linkIndex],
        ...link
      }
    }
    await wf(this._getStorageLocation(), JSON.stringify(links, null, 2))
    return links[linkIndex];
  }


  // Returns storage path
  _getStorageLocation() {
    return this._linkStoragePath;
  }

  
  // Loading all links from the DB and returns them as an array of objects
  async _loadAllLinks() {
    let links;
    try {
      links = JSON.parse(await rf(this._getStorageLocation()));
    } catch (e) {
      if (e.code === 'ENOENT') {
        console.info("No storage found, initializing new one.");
        links = [];
      } else {
        throw new Error("Unable to read from storage. Wrong data format in storage: " +
          this._getStorageLocation());
      }
    }
    return links;
  }
}

module.exports = LinkDao; 