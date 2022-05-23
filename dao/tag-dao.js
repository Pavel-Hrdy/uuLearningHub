"use strict";
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");


const rf = fs.promises.readFile;
const wf = fs.promises.writeFile;



// path to default storage
const DEFAULT_STORAGE_PATH = path.join(__dirname, "..", "storage", "tags.json");


class TagDao {
  constructor(storagePath=DEFAULT_STORAGE_PATH) {
    this._tagStoragePath = storagePath;
  }


  async createTag(tag) {
    tag.name = tag.name.toLowerCase().trim();
    let tags = await this._loadAllTags();
    if (tags.find(b => b.name === tag.name)) {
      throw new Error(`The tag "${tag.name}" already exists!`);
    }
    tag.id = crypto.randomBytes(16).toString("hex");
    tags.push(tag)
    await wf(this._getStorageLocation(), JSON.stringify(tags, null, 2));
    return tag;
  }


  async getTag(id) {
    let tags = await this._loadAllTags();
    const tag = tags.find(b => {return b.id === id;});
    return tag;
  }

  async getTagByName(name) {
    let tags = await this._loadAllTags();
    console.log(tags)
    const tag = tags.find(b => {return b.name === name;});
    return tag;
  }

  async listTags(substring) {
    let tags = await this._loadAllTags();
    if (!substring) {
      return tags;
    }
    substring = substring.toLowerCase().trim();
    tags = tags.filter(tag => tag.name.includes(substring))
    return tags;
  }

  async updateTag(tag) {
    let tags = await this._loadAllTags();
    const tagIndex = tags.findIndex(b => b.id === tag.id)
    if (tagIndex < 0) {
      throw new Error(`Tag with given id '${tag.id}' does not exists.`);
    } else {
      tags[tagIndex] = {
        ...tags[tagIndex],
        ...tag
      }
    }
    await wf(this._getStorageLocation(), JSON.stringify(tags, null, 2))
    return tags[tagIndex];
  }


  // Returns storage path
  _getStorageLocation() {
    return this._tagStoragePath;
  }

  
  // Loading all tags from the DB and returns them as an array of objects
  async _loadAllTags() {
    let tags;
    try {
      tags = JSON.parse(await rf(this._getStorageLocation()));
    } catch (e) {
      if (e.code === 'ENOENT') {
        console.info("No storage found, initializing new one.");
        tags = [];
      } else {
        throw new Error("Unable to read from storage. Wrong data format in storage: " +
          this._getStorageLocation());
      }
    }
    return tags;
  }
}

module.exports = TagDao; 