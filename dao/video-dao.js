"use strict";
const fs = require("fs");
const path = require("path");

const rf = fs.promises.readFile;
const wf = fs.promises.writeFile;

// path to default storage
const DEFAULT_STORAGE_PATH = path.join(__dirname, "..", "storage", "videos.json");


class VideoDao {
  constructor(storagePath=DEFAULT_STORAGE_PATH) {
    this._videoStoragePath = storagePath;
  }


  async createVideo(video) {
    let videos = await this._loadAllVideos();
    if (videos.find(b =>  b.id === video.id)) {
      throw new Error(`This video with ${video.id} already existaś!`);
    }
    videos.push(video)
    await wf(this._getStorageLocation(), JSON.stringify(videos, null, 2));
    return video;
  }


  async getVideo(id) {
    let videos = await this._loadAllVideos();
    const video = videos.find(b => {return b.id === id;});
    return video;
  }


  async listVideos(map) {
    let videos = await this._loadAllVideos();
    let returnVideos = [];
    if (Object.keys(map).length === 0) {
      return videos;
    }
    if (map.tag) {
      for (let video of videos) {
        if(video.tags.includes(map.tag)) {
          returnVideos.push(video);
        }
      }
      if (returnVideos.length === 0) {
        return [];
      }
    }
    if (map.chapter) {
      returnVideos = returnVideos.length === 0 ? videos : returnVideos;
      let index = returnVideos.length;
      while (index--) {
        if(!(map.chapter === returnVideos[index].chapterSchema.chapterOrderNumber && map.subchapter === returnVideos[index].chapterSchema.subchapterOrderNumber)) {
          returnVideos.splice(index, 1);
        }
      }
    }
    
    return returnVideos;
  }


  async updateVideo(video) {
    let videos = await this._loadAllVideos();
    const videoIndex = videos.findIndex(b => b.id === video.id)
    if (videoIndex < 0) {
      throw new Error(`Video with given id ${video.id} does not exists.`);
    } else {
      videos[videoIndex] = {
        ...videos[videoIndex],
        ...video
      }
    }
    await wf(this._getStorageLocation(), JSON.stringify(videos, null, 2))
    return videos[videoIndex];
  }
  
  async rateVideo(id, rating) {
    let videos = await this._loadAllVideos();
    const videoIndex = videos.findIndex(b => b.id === id);
    let ratingSum = (videos[videoIndex].numberOfRatings * videos[videoIndex].rating) + rating;
    videos[videoIndex].rating = ratingSum / ++videos[videoIndex].numberOfRatings;
    await wf(this._getStorageLocation(), JSON.stringify(videos, null, 2))
    return videos[videoIndex];
  }


  async deleteVideo(id) {
    let videos = await this._loadAllVideos();
    const videoIndex = videos.findIndex(b => b.id === id)
    if (videoIndex >= 0) {
      videos.splice(videoIndex, 1)
    }
    await wf(this._getStorageLocation(), JSON.stringify(videos, null, 2))
    return {};
  }


  // Returns storage path
  _getStorageLocation() {
    return this._videoStoragePath;
  }

  
  // Loading all videos from the DB and returns them as an array of objects
  async _loadAllVideos() {
    let videos;
    try {
      videos = JSON.parse(await rf(this._getStorageLocation()));
    } catch (e) {
      if (e.code === 'ENOENT') {
        console.info("No storage found, initializing new one.");
        videos = [];
      } else {
        throw new Error("Unable to read from storage. Wrong data format in storage: " +
          this._getStorageLocation());
      }
    }
    return videos;
  }

  
  _isDuplicate(videos, id) {
    const result = videos.find(b => {
      return b.id === id;
    });
    return result ? true : false;
  }

}

module.exports = VideoDao; 