import {metaData} from "./scratchtool.js"

export class project{
    private targetProjectId:string;
    private metaData:metaData;

    private constructor(projectId:string,metaDat:metaData){
        this.targetProjectId = projectId;
        this.metaData = metaDat;
    }

    static async build(projectId:string,metaDat:metaData){
        return new project(projectId,metaDat);
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
}