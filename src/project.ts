import {metaData} from "./scratchtool.js"

export class project{
    targetProjectId:string;
    _metaData:metaData;

    private constructor(projectId:string,_metaData:metaData){
        this.targetProjectId = projectId;
        this._metaData = _metaData;
    }

    static async build(projectId:string,_metaData:metaData){
        return new project(projectId,_metaData);
    }

    async love(){
        const body = {
            "projectId": this.targetProjectId,
            "statusChanged": true,
            "userLove": true,
        }

        const csrftoken = this._metaData.cookies["scratchcsrftoken"] ?? "";
        console.log("send")
        const res = await fetch(
            `https://api.scratch.mit.edu/proxy/projects/${this.targetProjectId}/loves/user/${this._metaData.username}`,
            {
                method:"POST",
                headers:{
                    "Cookie":this._metaData.parsedCookies,
                    "X-Csrftoken":csrftoken,
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
                    "Origin": "https://scratch.mit.edu",
                    "Referer": `https://scratch.mit.edu/`,
                    "Content-Type": "application/json",
                    "x-requested-with":"XMLHttpRequest",
                    "content-length":"0",
                },
                body:JSON.stringify(body)
            }
        );

        if(Math.floor(res.status/100) !== 2){
            throw new Error(`エラー ステータスコード:${res.status}`);
        }else{
            console.log("成功",res.status);
        }
    }
}