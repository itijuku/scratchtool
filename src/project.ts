import fs from "fs";
import path from "path";

import {metaData} from "./scratchtool.js";
import {commentForProject} from "./comment.js";
import {userMetaData} from "./user.js";

export class projectMetaData{ 
    projectId:string;
    metaData:metaData;
    metaDatasJson:{[name:string]:any} = {};
    constructor(projectId:string,metaData:metaData){
        this.projectId = String(projectId);
        this.metaData = metaData;
    }
    async init(){
        const csrftoken = this.metaData.cookies["scratchcsrftoken"] || "";
        const x_token = this.metaData.otherMetaDatas["x-token"] || "";

        const res = await fetch(
            `https://api.scratch.mit.edu/projects/${this.projectId}`,
            {
                method:"GET",
                headers:{
                    "content-type":"application/json",
                    "referer":`https://scratch.mit.edu/`,
                    "user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
                    "origin":"https://scratch.mit.edu",
                    "x-token":x_token,
                }
            }
        )

        const resJson = await res.json();
        this.metaDatasJson = resJson;
    }
}

export class project{
    private targetProjectId:string;
    private metaData:metaData;
    private projectMetaData:projectMetaData;
    private userMetaData:userMetaData;

    id:string = "";
    url:string = "";
    title:string = "";
    author_name:string = "";
    comments_allowed:boolean;
    instructions:string = "";
    notes:string = "";
    created:string = "";
    last_modified:string = "";
    share_date:string = "";
    thumbnail_url:string = "";
    remix_parent:any = null;
    remix_root:any = null;
    loves:number = NaN;
    favorites:number = NaN;
    remix_count:number = NaN;
    views:number = NaN;
    project_token:string = "";

    private constructor(projectId:string,metaDat:metaData,projectMetaData:projectMetaData,userMetaData:userMetaData){
        this.targetProjectId = projectId;
        this.metaData = metaDat;
        this.projectMetaData = projectMetaData;
        this.userMetaData = userMetaData;

        this.id = projectMetaData.metaDatasJson["id"];
        this.url = `https://scratch.mit.edu/projects/${projectMetaData.metaDatasJson["id"]}`;
        this.title = projectMetaData.metaDatasJson["title"];
        this.author_name = projectMetaData.metaDatasJson["author"]["username"];
        this.comments_allowed = projectMetaData.metaDatasJson["comments_allowed"];
        this.instructions = projectMetaData.metaDatasJson["instructions"];
        this.notes = projectMetaData.metaDatasJson["description"];
        this.created = projectMetaData.metaDatasJson["history"]["created"];
        this.last_modified = projectMetaData.metaDatasJson["history"]["modified"];
        this.share_date = projectMetaData.metaDatasJson["history"]["shared"];
        this.thumbnail_url = projectMetaData.metaDatasJson["image"];
        this.remix_parent = projectMetaData.metaDatasJson["remix"]["parent"];
        this.remix_root = projectMetaData.metaDatasJson["remix"]["root"];
        this.loves = projectMetaData.metaDatasJson["stats"]["loves"];
        this.favorites = projectMetaData.metaDatasJson["stats"]["favorites"];
        this.remix_count = projectMetaData.metaDatasJson["stats"]["remixes"];
        this.views = projectMetaData.metaDatasJson["stats"]["views"];
        this.project_token = projectMetaData.metaDatasJson["project_token"];
    }

    static async build(projectId:string,metaData:metaData){
        const md = await new projectMetaData(projectId,metaData);
        await md.init();
        const _userMetaData = new userMetaData(metaData.username,metaData);
        return new project(projectId,metaData,md,_userMetaData);
    }

    static async create_project_build(title:string,metaData:metaData){
        const filepath = path.resolve("db/default.json");
        const jsonData = JSON.parse(fs.readFileSync(filepath,"utf-8"));

        const res = await fetch(
            `https://projects.scratch.mit.edu/`,
            {
                method:"POST",
                headers:{
                    "cookie":metaData.parsedCookies,
                    "content-type":"application/json",
                    "referer":`https://scratch.mit.edu/`,
                    "user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
                    "origin":"https://scratch.mit.edu",
                },
                body:JSON.stringify({
                    "extensions":[],
                    "meta":{
                        "semver":"3.0.0",
                        "vm":"12.0.2-hotfix",
                        "agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
                    },
                    "monitors":[],
                    "targets":jsonData,
                })
            }
        );
        
        if(Math.floor(res.status/100) !== 2){
            throw new Error(`エラー ステータスコード:${res.status}`);
        }

        const resJson = await res.json();
        const projectId = resJson["content-name"];
        const md = await new projectMetaData(projectId,metaData);
        await md.init();

        const _userMetaData = new userMetaData(metaData.username,metaData);

        const _project = await new project(projectId,metaData,md,_userMetaData);
        if(title !== "new title")_project.set_title(title);
        return _project;
        
    }

    async delete(){
        const csrftoken = this.metaData.cookies["scratchcsrftoken"] || "";
        const nowIso = new Date().toISOString();
        const body = {
            "commenters_count":0,
            "creator":{
                "admin":false,
                "pk":this.userMetaData.id,
                "thumbnail_url":this.userMetaData.thumbnail_url,
                "username":this.metaData.username
            },
            "datetime_created":nowIso,
            "datetime_modified":nowIso,
            "datetime_shared":null,
            "favorite_count":this.favorites,
            "id":this.targetProjectId,
            "isPublished":false,
            "love_count":this.loves,
            "remixers_count":this.remix_count,
            "thumbnail":`${this.targetProjectId}.png`,
            "thumbnail_url":`//uploads.scratch.mit.edu/projects/thumbnails/${this.targetProjectId}.png`,
            "title":this.title,
            "uncached_thumbnail_url":"\\\\" + this.thumbnail_url.split("//")[1],
            "view_count":this.views,
            "visibility":"trshbyusr",            
        }

        const res = await fetch(
            `https://scratch.mit.edu/site-api/projects/all/${this.targetProjectId}/`,
            {
                method:"PUT",
                headers:{
                    "x-csrftoken":csrftoken,
                    "x-requested-with":"XMLHttpRequest",
                    "cookie":this.metaData.parsedCookies,
                    "content-type":"application/json",
                    "referer":`https://scratch.mit.edu/`,
                    "user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
                    "origin":"https://scratch.mit.edu",
                },
                body:JSON.stringify(body),
            }
        );

        if(Math.floor(res.status/100) !== 2){
            throw new Error(`エラー ステータスコード:${res.status}`);
        }
    }

    async set_title(title:string){
        const x_token = this.metaData.otherMetaDatas["x-token"] || "";

        const body = {
            "title":title
        }

        const res = await fetch(
            `https://api.scratch.mit.edu/projects/1244748821`,
            {
                method:"PUT",
                headers:{
                    "cookie":this.metaData.parsedCookies,
                    "content-type":"application/json",
                    "referer":`https://scratch.mit.edu/`,
                    "user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
                    "origin":"https://scratch.mit.edu",
                    "x-token":x_token,
                },
                body:JSON.stringify(body),
            }
        );

        if(Math.floor(res.status/100) !== 2){
            throw new Error(`エラー ステータスコード:${res.status}`);
        }
    }

    async love(){
        const csrftoken = this.metaData.cookies["scratchcsrftoken"] || "";
        const x_token = this.metaData.otherMetaDatas["x-token"] || "";

        const res = await fetch(
            `https://api.scratch.mit.edu/proxy/projects/${this.targetProjectId}/loves/user/${this.metaData.username}`,
            {
                method:"POST",
                headers:{
                    "x-csrftoken":csrftoken,
                    "x-requested-with":"XMLHttpRequest",
                    "cookie":this.metaData.parsedCookies,
                    "content-type":"application/json",
                    "referer":`https://scratch.mit.edu/`,
                    "user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
                    "origin":"https://scratch.mit.edu",
                    "x-token":x_token,
                },
            }
        );

        if(Math.floor(res.status/100) !== 2){
            throw new Error(`エラー ステータスコード:${res.status}`);
        }
    }

    async unlove(){
        const csrftoken = this.metaData.cookies["scratchcsrftoken"] || "";
        const x_token = this.metaData.otherMetaDatas["x-token"] || "";

        const res = await fetch(
            `https://api.scratch.mit.edu/proxy/projects/${this.targetProjectId}/loves/user/${this.metaData.username}`,
            {
                method:"DELETE",
                headers:{
                    "x-csrftoken":csrftoken,
                    "x-requested-with":"XMLHttpRequest",
                    "cookie":this.metaData.parsedCookies,
                    "content-type":"application/json",
                    "referer":`https://scratch.mit.edu/`,
                    "user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
                    "origin":"https://scratch.mit.edu",
                    "x-token":x_token,
                },
            }
        );

        if(Math.floor(res.status/100) !== 2){
            throw new Error(`エラー ステータスコード:${res.status}`);
        }
    }

    async favorite(){
        const csrftoken = this.metaData.cookies["scratchcsrftoken"] || "";
        const x_token = this.metaData.otherMetaDatas["x-token"] || "";

        const res = await fetch(
            `https://api.scratch.mit.edu/proxy/projects/${this.targetProjectId}/favorites/user/${this.metaData.username}`,
            {
                method:"POST",
                headers:{
                    "x-csrftoken":csrftoken,
                    "x-requested-with":"XMLHttpRequest",
                    "cookie":this.metaData.parsedCookies,
                    "content-type":"application/json",
                    "referer":`https://scratch.mit.edu/`,
                    "user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
                    "origin":"https://scratch.mit.edu",
                    "x-token":x_token,
                },
            }
        );

        if(Math.floor(res.status/100) !== 2){
            throw new Error(`エラー ステータスコード:${res.status}`);
        }
    }

    async unfavorite(){
        const csrftoken = this.metaData.cookies["scratchcsrftoken"] || "";
        const x_token = this.metaData.otherMetaDatas["x-token"] || "";

        const res = await fetch(
            `https://api.scratch.mit.edu/proxy/projects/${this.targetProjectId}/favorites/user/${this.metaData.username}`,
            {
                method:"DELETE",
                headers:{
                    "x-csrftoken":csrftoken,
                    "x-requested-with":"XMLHttpRequest",
                    "cookie":this.metaData.parsedCookies,
                    "content-type":"application/json",
                    "referer":`https://scratch.mit.edu/`,
                    "user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
                    "origin":"https://scratch.mit.edu",
                    "x-token":x_token,
                },
            }
        );

        if(Math.floor(res.status/100) !== 2){
            throw new Error(`エラー ステータスコード:${res.status}`);
        }
    }

    async post_view(){
        const csrftoken = this.metaData.cookies["scratchcsrftoken"] || "";
        const x_token = this.metaData.otherMetaDatas["x-token"] || "";

        const res = await fetch(
            `https://api.scratch.mit.edu/users/${this.projectMetaData.metaDatasJson["author"]["username"]}/projects/${this.targetProjectId}/views`,
            {
                method:"POST",
                headers:{
                    "x-csrftoken":csrftoken,
                    "x-requested-with":"XMLHttpRequest",
                    "cookie":this.metaData.parsedCookies,
                    "content-type":"application/json",
                    "referer":`https://scratch.mit.edu/`,
                    "user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
                    "origin":"https://scratch.mit.edu",
                    "x-token":x_token,
                },
            }
        );

        if(Math.floor(res.status/100) !== 2){
            throw new Error(`エラー ステータスコード:${res.status}`);
        }
    }

    async get_comment(number:number){
        const cd = await commentForProject.buildForGet(number,this.metaData,this.projectMetaData);
        return await cd.get_comment();
    }

    async post_comment(content:string){
        const cd = await commentForProject.buildForPost(content,this.metaData,"",this.projectMetaData);
        cd.post_comment();
    }


    async reply_comment(content:string,parent_id:string){
        const cd = await commentForProject.buildForPost(content,this.metaData,parent_id,this.projectMetaData);
        cd.reply_comment();
    }

    async delete_comment(commentId:string){
        const cd = await commentForProject.buildForDelete(commentId,this.metaData,this.projectMetaData);
        cd.delete_comment();
    }
}