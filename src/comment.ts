import type { projectMetaData } from "./project.js";
import {metaData} from "./scratchtool.js"

export class commentMetaData{
    object:{[name:string]:any,};
    id:string;
    parent_id:string;
    commentee_id :string;
    content :string;
    datetime_created:string;
    author_name:string;
    author_id:string;
    reply_count:string;

    projectMetaData:projectMetaData|string;
    metaData:metaData;

    constructor(object:{[name:string]:any,},metaData:metaData,projectMetaData:projectMetaData|string=""){
        this.object = object;

        this.metaData = metaData;
        this.projectMetaData = projectMetaData;

        this.id = String(object["id"]);
        this.parent_id = String(object["parent_id"]) || "";
        this.commentee_id = String(object["commentee_id"]);
        this.content = object["content"];
        this.datetime_created = object["datetime_created"];
        this.author_name = object["author"]["username"];
        this.author_id = String(object["author"]["id"]);
        this.reply_count = String(object["reply_count"]);
    }

    async reply(content:string){
        const cd = await comment.buildForPost(content,this.metaData,this.id,this.projectMetaData);
        await cd.reply_comment_inProject(this.author_id);
    }

    static commentObjectParser(objects:[{[name:string]:any}],metaData:metaData,projectMetaData:projectMetaData|string=""):commentMetaData[]{
        let obj:commentMetaData[] = [];
        for(const o of objects){
            obj.push(new commentMetaData(o,metaData,projectMetaData));
        }
        
        return obj;
    }
}

export class comment{
    private content:string;
    private targetParentId:string;
    private metaData:metaData;
    private comment_id:string;
    private number:number;
    private projectMetaData:projectMetaData|string;
    private authorId:projectMetaData|string;

    private constructor(content:string,parentId:string,metaData:metaData,comment_id:string="",number:number=0,
        projectMetaData:projectMetaData|string="",authorId:string=""
    ){
        this.content = content;
        this.targetParentId = parentId;
        this.metaData = metaData;
        this.comment_id = comment_id;
        this.number = number;
        this.projectMetaData = projectMetaData;
        this.authorId = authorId;
    }

    static async buildForPost(content:string,metaData:metaData,parentId:string="",projectMetaData:projectMetaData|string=""){
        if(typeof projectMetaData === "string"){
            throw new Error("projectMetaData is not found");
        }

        const author = projectMetaData.metaDatasJson["author"]["username"];
        const x_token = metaData.otherMetaDatas["x-token"] || "";
        console.log(`https://api.scratch.mit.edu/users/${author}/projects/${projectMetaData.projectId}/comments/${parentId}`)
        const res = await fetch(
            `https://api.scratch.mit.edu/users/${author}/projects/${projectMetaData.projectId}/comments/${parentId}`,
            {
                method:"GET",
                headers:{
                    "cookie":metaData.parsedCookies,
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

        const resJson = await res.json();
        console.log(resJson)

        return new comment(content,parentId,metaData,"",0,projectMetaData,resJson["author"]["id"]);
    }

    static async buildForDelete(comment_id:string,metaData:metaData,){
        return new comment("","",metaData,comment_id);
    }

    static async buildForGet(number:number,metaData:metaData,projectMetaData:projectMetaData|string=""){
        return new comment("","",metaData,"",number,projectMetaData);
    }

    async get_comment_inProject(){
        if(typeof this.projectMetaData === "string"){
            throw new Error("projectMetaData is not found");
        }

        const author = this.projectMetaData.metaDatasJson["author"]["username"];
        const x_token = this.metaData.otherMetaDatas["x-token"] || "";

        const res = await fetch(
            `https://api.scratch.mit.edu/users/${author}/projects/${this.projectMetaData.metaDatasJson["id"]}/comments?offset=0&limit=${this.number}`,
            {
                method:"GET",
                headers:{
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

        const resJson = await res.json();
        return await commentMetaData.commentObjectParser(resJson,this.metaData,this.projectMetaData);
    }

    async delete_comment_inUser(){
        const csrftoken = this.metaData.cookies["scratchcsrftoken"] || "";

        const body = {
            "id":this.comment_id,
        }

        const res = await fetch(
            `https://scratch.mit.edu/site-api/comments/user/${this.metaData.username}/del/`,
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
                },
                body:JSON.stringify(body),
            }
        );

        if(Math.floor(res.status/100) !== 2){
            throw new Error(`エラー ステータスコード:${res.status}`);
        }
    }

    async post_comment_inProject(projectId:string){
        const csrftoken = this.metaData.cookies["scratchcsrftoken"] || "";
        const x_token = this.metaData.otherMetaDatas["x-token"] || "";

        const body = {
            "commentee_id":"",
            "parent_id":"",
            "content":this.content,
        }

        const res = await fetch(
            `https://api.scratch.mit.edu/proxy/comments/project/${projectId}`,
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

    async post_comment_inUser(){
        const csrftoken = this.metaData.cookies["scratchcsrftoken"] || "";

        const body = {
            "commentee_id":"",
            "parent_id":"",
            "content":this.content,
        }

        const res = await fetch(
            `https://scratch.mit.edu/site-api/comments/user/${this.metaData.username}/add/`,
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
                },
                body:JSON.stringify(body),
            }
        );

        if(Math.floor(res.status/100) !== 2){
            throw new Error(`エラー ステータスコード:${res.status}`);
        }
    }

    async reply_comment_inUser(){
        const csrftoken = this.metaData.cookies["scratchcsrftoken"] || "";

        const body = {
            "commentee_id":this.metaData.otherMetaDatas["id"],
            "parent_id":this.targetParentId,
            "content":this.content,
        }

        const res = await fetch(
            `https://scratch.mit.edu/site-api/comments/user/${this.metaData.username}/add/`,
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
                },
                body:JSON.stringify(body),
            }
        );

        if(Math.floor(res.status/100) !== 2){
            throw new Error(`エラー ステータスコード:${res.status}`);
        } 
    }

    async reply_comment_inProject(author_id:string=""){
        let authorId = author_id || this.authorId;
        if(typeof this.projectMetaData === "string"){
            throw new Error("projectMetaData is not found");
        }

        const csrftoken = this.metaData.cookies["scratchcsrftoken"] || "";
        const x_token = this.metaData.otherMetaDatas["x-token"] || "";
        const body = {
            "commentee_id":authorId,
            "parent_id":this.targetParentId,
            "content":this.content,
        }

        const res = await fetch(
            `https://api.scratch.mit.edu/proxy/comments/project/${this.projectMetaData.projectId}`,
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