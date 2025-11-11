import {metaData,userMetaData} from "./scratchtool.js"

export class user{
    targetUserName:string;
    _metaData:metaData;
    _userMetaData:userMetaData;

    private constructor(username:string,_metaData:metaData,_userMetaData:userMetaData){
        this.targetUserName = username;
        this._metaData = _metaData;
        this._userMetaData = _userMetaData;
    }

    static async build(username:string,_metaData:metaData){
        const md = await new userMetaData(username);
        await md.init();
        return new user(username,_metaData,md);
    }

    async follow(){
        const body = {
            "id": this.targetUserName,
            "userId": this._userMetaData.id,
            "username": this.targetUserName,
            "thumbnail_url": this._userMetaData.thumbnail_url,
            "comments_allowed": true
        }
        const csrftoken = this._metaData.cookies["scratchcsrftoken"] ?? "";

        const res = await fetch(
            `https://scratch.mit.edu/site-api/users/followers/${this.targetUserName}/add/?usernames=${this._metaData.username}`,
            {
                method:"PUT",
                headers:{
                    "Cookie":this._metaData.parsedCookies,
                    "X-Csrftoken":csrftoken,
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
                    "Origin": "https://scratch.mit.edu",
                    "Referer": `https://scratch.mit.edu/users/${this.targetUserName}/`,
                    "Content-Type": "application/json",
                    "x-requested-with":"XMLHttpRequest",
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
            "userId": this._userMetaData.id,
            "username": this.targetUserName,
            "thumbnail_url": this._userMetaData.thumbnail_url,
            "comments_allowed": true
        }
        const csrftoken = this._metaData.cookies["scratchcsrftoken"] ?? "";

        const res = await fetch(
            `https://scratch.mit.edu/site-api/users/followers/${this.targetUserName}/remove/?usernames=${this._metaData.username}`,
            {
                method:"PUT",
                headers:{
                    "Cookie":this._metaData.parsedCookies,
                    "X-Csrftoken":csrftoken,
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
                    "Origin": "https://scratch.mit.edu",
                    "Referer": `https://scratch.mit.edu/`,
                    "Content-Type": "application/json",
                    "x-requested-with":"XMLHttpRequest",
                    "priority":"u=1, i",
                    "content-length":"0",
                },
                body:JSON.stringify(body)
            }
        );

        if(Math.floor(res.status/100) !== 2){
            throw new Error(`エラー ステータスコード:${res.status}`);
        }
    }
}