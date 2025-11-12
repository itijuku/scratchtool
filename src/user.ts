import {metaData,userMetaData} from "./scratchtool.js"

export class user{
    private targetUserName:string;
    private metaData:metaData;
    private userMetaData:userMetaData;

    private constructor(username:string,metaData:metaData,userMetaData:userMetaData){
        this.targetUserName = username;
        this.metaData = metaData;
        this.userMetaData = userMetaData;
    }

    static async build(username:string,metaData:metaData){
        const md = await new userMetaData(username);
        await md.init();
        return new user(username,metaData,md);
    }

    async follow(){
        const body = {
            "id": this.targetUserName,
            "userId": this.userMetaData.id,
            "username": this.targetUserName,
            "thumbnail_url": this.userMetaData.thumbnail_url,
            "comments_allowed": true
        }
        const csrftoken = this.metaData.cookies["scratchcsrftoken"] ?? "";
        const res = await fetch(
            `https://scratch.mit.edu/site-api/users/followers/${this.targetUserName}/add/?usernames=${this.metaData.username}`,
            {
                method:"PUT",
                headers:{
                    "x-csrftoken":csrftoken,
                    "x-requested-with":"XMLHttpRequest",
                    "cookie":this.metaData.parsedCookies,
                    "content-type":"application/json",
                    "referer":`https://scratch.mit.edu/users/${this.targetUserName}/`,
                    "user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
                    "origin":"https://scratch.mit.edu",
                },
                body:JSON.stringify(body)
            }
        );

        if(Math.floor(res.status/100) !== 2){
            throw new Error(`エラー ステータスコード:${res.status}`);
        }
    }

    async unfollow(){
        const body = {
            "id": this.targetUserName,
            "userId": this.userMetaData.id,
            "username": this.targetUserName,
            "thumbnail_url": this.userMetaData.thumbnail_url,
            "comments_allowed": true
        }
        const csrftoken = this.metaData.cookies["scratchcsrftoken"] || "";
        const res = await fetch(
            `https://scratch.mit.edu/site-api/users/followers/${this.targetUserName}/remove/?usernames=${this.metaData.username}`,
            {
                method:"PUT",
                headers:{
                    "x-csrftoken":csrftoken,
                    "x-requested-with":"XMLHttpRequest",
                    "cookie":this.metaData.parsedCookies,
                    "content-type":"application/json",
                    "referer":`https://scratch.mit.edu/users/${this.targetUserName}/`,
                    "user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
                    "origin":"https://scratch.mit.edu",
                },
                body:JSON.stringify(body)
            }
        );

        if(Math.floor(res.status/100) !== 2){
            throw new Error(`エラー ステータスコード:${res.status}`);
        }
    }
}