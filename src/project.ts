import {metaData} from "./scratchtool.js"

export class projectMetaData{ 
    projectId:string;
    metaDatasJson:{[name:string]:any} = {};
    constructor(projectId:string){
        this.projectId = String(projectId);
    }
    async init(){
        const res = await fetch(
            `https://api.scratch.mit.edu/projects/${this.projectId}`,
            {
                method:"GET",
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

    private constructor(projectId:string,metaDat:metaData,projectMetaData:projectMetaData){
        this.targetProjectId = projectId;
        this.metaData = metaDat;
        this.projectMetaData = projectMetaData;

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
        const md = await new projectMetaData(projectId);
        await md.init();
        return new project(projectId,metaData,md);
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

    async post_comment(content:string){
        const csrftoken = this.metaData.cookies["scratchcsrftoken"] || "";
        const x_token = this.metaData.otherMetaDatas["x-token"] || "";

        const body = {
            "commentee_id":"",
            "parent_id":"",
            "content":content,
        }

        const res = await fetch(
            `https://api.scratch.mit.edu/proxy/comments/project/${this.targetProjectId}`,
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
                body:JSON.stringify(body),
            }
        );

        if(Math.floor(res.status/100) !== 2){
            throw new Error(`エラー ステータスコード:${res.status}`);
        }
    }
}