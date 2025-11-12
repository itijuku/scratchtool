import {metaData} from "./scratchtool.js"

export class comment{
    private content:string;
    private targetParentId:string;
    private metaData:metaData;
    private comment_id:string;

    private constructor(content:string,parentId:string,metaData:metaData,comment_id:string=""){
        this.content = content;
        this.targetParentId = parentId;
        this.metaData = metaData;
        this.comment_id = comment_id;
    }

    static async buildForPost(content:string,metaData:metaData,parentId:string=""){
        return new comment(content,parentId,metaData,);
    }

    static async buildForDelete(comment_id:string,metaData:metaData,){
        return new comment("","",metaData,comment_id);
    }

    async delete_comment_inUser(){
        const csrftoken = this.metaData.cookies["scratchcsrftoken"] || "";
        const x_token = this.metaData.otherMetaDatas["x-token"] || "";

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
        const x_token = this.metaData.otherMetaDatas["x-token"] || "";

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
}