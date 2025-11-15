import type { projectMetaData } from "./project.js";
import type { userMetaData } from "./user.js";
import {metaData} from "./scratchtool.js"

export class commentMetaDataForProject{
    object:{[name:string]:any,};
    id:string;
    parent_id:string;
    commentee_id :string;
    content :string;
    datetime_created:string;
    author_name:string;
    author_id:string;
    reply_count:string;

    projectMetaData:projectMetaData;
    metaData:metaData;

    constructor(object:{[name:string]:any,},metaData:metaData,projectMetaData:projectMetaData){
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
        const cd = await commentForProject.buildForPost(content,this.metaData,this.id,this.projectMetaData);
        await cd.reply_comment(this.author_id);
    }

    async get_replies(number:number = 25):Promise<commentMetaDataForProject[]>{
        if(typeof this.projectMetaData === "string"){
            throw new Error("projectMetaData is not found");
        }

        const author = this.projectMetaData.metaDatasJson["author"]["username"];
        const x_token = this.metaData.otherMetaDatas["x-token"] || "";

        const res = await fetch(
            `https://api.scratch.mit.edu/users/${author}/projects/${this.projectMetaData.projectId}/comments/${this.id}/replies?offset=0&limit=${number}`,
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

        const returnData = await commentMetaDataForProject.commentObjectParser(resJson,this.metaData,this.projectMetaData);

        return returnData ?? [];
    }

    static commentObjectParser(objects:{[name:string]:any}[],metaData:metaData,projectMetaData:projectMetaData):commentMetaDataForProject[]{
        let obj:commentMetaDataForProject[] = [];
        for(const o of objects){
            obj.push(new commentMetaDataForProject(o,metaData,projectMetaData));
        }
        
        return obj;
    }
}

export class commentForProject{
    private content:string;
    private targetParentId:string;
    private metaData:metaData;
    private comment_id:string;
    private number:number;
    private projectMetaData:projectMetaData;
    private authorId:projectMetaData|string;

    private constructor(content:string,parentId:string,metaData:metaData,comment_id:string="",number:number=0,
        projectMetaData:projectMetaData,authorId:string=""
    ){
        this.content = content;
        this.targetParentId = parentId;
        this.metaData = metaData;
        this.comment_id = comment_id;
        this.number = number;
        this.projectMetaData = projectMetaData;
        this.authorId = authorId;
    }

    static async buildForPost(content:string,metaData:metaData,parentId:string="",projectMetaData:projectMetaData){
        if(typeof projectMetaData === "string"){
            throw new Error("projectMetaData is not found");
        }

        if(parentId){
            const author = projectMetaData.metaDatasJson["author"]["username"];
            const x_token = metaData.otherMetaDatas["x-token"] || "";

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

            return new commentForProject(content,parentId,metaData,"",0,projectMetaData,resJson["author"]["id"]);
        }else{
            return new commentForProject(content,parentId,metaData,"",0,projectMetaData,"");
        }

    }

    static async buildForDelete(comment_id:string,metaData:metaData,projectMetaData:projectMetaData){
        return new commentForProject("","",metaData,comment_id,0,projectMetaData);
    }

    static async buildForGet(number:number,metaData:metaData,projectMetaData:projectMetaData){
        return new commentForProject("","",metaData,"",number,projectMetaData);
    }

    async get_comment(){
        if(typeof this.projectMetaData === "string"){
            throw new Error("projectMetaData is not found");
        }

        const author = this.projectMetaData.metaDatasJson["author"]["username"];
        const x_token = this.metaData.otherMetaDatas["x-token"] || "";

        let comments:{[name:string]:any}[] = [];

        if(this.number <= 40){
            const res = await fetch(
                `https://api.scratch.mit.edu/users/${author}/projects/${this.projectMetaData.projectId}/comments?offset=0&limit=${this.number}`,
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

            comments = await res.json();
        }else{
            for(let i=0;i<Math.ceil(this.number / 40);i++){
                if(i === Math.ceil(this.number / 40) - 1){
                    const res = await fetch(
                        `https://api.scratch.mit.edu/users/${author}/projects/${this.projectMetaData.projectId}/comments?offset=${i*40}&limit=${this.number%40}`,
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
                        break;
                    }

                    comments = [...comments,...await res.json()];
                }else{
                    const res = await fetch(
                        `https://api.scratch.mit.edu/users/${author}/projects/${this.projectMetaData.projectId}/comments?offset=${i*40}&limit=${40}`,
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
                        break;
                    }

                    comments = [...comments,...await res.json()];
                }
            }
        }

        const returnData = await commentMetaDataForProject.commentObjectParser(comments,this.metaData,this.projectMetaData);

        return returnData;
    }

    async post_comment(){
        if(typeof this.projectMetaData === "string"){
            throw new Error("projectMetaData is not found");
        }

        const csrftoken = this.metaData.cookies["scratchcsrftoken"] || "";
        const x_token = this.metaData.otherMetaDatas["x-token"] || "";

        const body = {
            "commentee_id":"",
            "parent_id":"",
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

    async reply_comment(author_id:string=""){
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

    async delete_comment(){
        if(typeof this.projectMetaData === "string"){
            throw new Error("projectMetaData is not found");
        }

        const csrftoken = this.metaData.cookies["scratchcsrftoken"] || "";
        const x_token = this.metaData.otherMetaDatas["x-token"] || "";

        const res = await fetch(
            `https://api.scratch.mit.edu/proxy/comments/project/${this.projectMetaData.projectId}/comment/${this.comment_id}`,
            {
                method:"DELETE",
                headers:{
                    "x-csrftoken":csrftoken,
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
}

export class commentForUser{
    private content:string;
    private targetParentId:string;
    private metaData:metaData;
    private comment_id:string;
    private number:number;
    private userMetaData:userMetaData;

    private constructor(content:string,parentId:string,metaData:metaData,comment_id:string="",number:number=0,
        userMetaData:userMetaData
    ){
        this.content = content;
        this.targetParentId = parentId;
        this.metaData = metaData;
        this.comment_id = comment_id;
        this.number = number;
        this.userMetaData = userMetaData;
    }

    static async buildForPost(content:string,metaData:metaData,parentId:string="",userMetaData:userMetaData){
        if(typeof userMetaData === "string"){
            throw new Error("projectMetaData is not found");
        }

        return new commentForUser(content,parentId,metaData,"",0,userMetaData);
    }

    static async buildForDelete(comment_id:string,metaData:metaData,userMetaData:userMetaData){
        return new commentForUser("","",metaData,comment_id,0,userMetaData);
    }

    static async buildForGet(number:number,metaData:metaData,userMetaData:userMetaData){

    }

    async post_comment(){
        if(typeof this.userMetaData === "string"){
            throw new Error("userMetaData is not found");
        }

        const csrftoken = this.metaData.cookies["scratchcsrftoken"] || "";

        const body = {
            "commentee_id":"",
            "parent_id":"",
            "content":this.content,
        }

        const res = await fetch(
            `https://scratch.mit.edu/site-api/comments/user/${this.userMetaData.username}/add/`,
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

    async reply_comment(){
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


    async delete_comment(){
        if(typeof this.userMetaData === "string"){
            throw new Error("userMetaData is not found");
        }

        const csrftoken = this.metaData.cookies["scratchcsrftoken"] || "";

        const body = {
            "id":this.comment_id,
        }

        const res = await fetch(
            `https://scratch.mit.edu/site-api/comments/user/${this.userMetaData.username}/del/`,
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
}