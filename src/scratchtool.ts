import * as cheerio from "cheerio";

import {user} from "./user.js";
import {project} from "./project.js";

function sleep(ms:number):Promise<void>{
    return new Promise(resolve=>setTimeout(resolve,ms));
}

export class metaData{
    username:string;
    password:string;
    otherMetaDatas:{[name:string]:string} = {};
    cookies:{[name:string]:string};
    parsedCookies:string;

    constructor(username:string,password:string,cookies:{[name:string]:string},otherMetaDatas:{[name:string]:string}){
        this.username = username;
        this.password = password;
        this.cookies = cookies;
        this.otherMetaDatas = otherMetaDatas;

        let cookie = "";
        for(const key in cookies){
            cookie += `${key}=${cookies[key]}; `
        }
        cookie = cookie.slice(0,cookie.length - 2);
        this.parsedCookies = cookie;
    }

    static getParsedCookies(cookies:{[name:string]:string}){
        let cookie = "";
        for(const key in cookies){
            cookie += `${key}=${cookies[key]}; `
        }
        cookie = cookie.slice(0,cookie.length - 2);

        return cookie;
    }
}

export class userMetaData{
    username:string;
    id:string = "";
    thumbnail_url:string = "";
    
    constructor(username:string){
        this.username = username;
    }
    async init(){
        const res = await fetch(
            `https://scratch.mit.edu/site-api/comments/user/${this.username}/?page=1`,
            {
                method:"GET",
            }
        )

        const html = await res.text();

        const $ = cheerio.load(html);
        const png = $("img").eq(2);
        const src = png.attr("src");
        if(src){
            const img = src.split("/")[src.split("/").length - 1];
            this.id = img ? String(img.split("_")[0]) : "";

            this.thumbnail_url = `//uploads.scratch.mit.edu/users/avatars/${this.id}.png`;
        }
    }
}

export class scratchtool{
    _username:string;
    _password:string;
    otherMetaDatas:{[name:string]:string} = {};
    cookies:{[name:string]:string} = {
        "permissions":"{}"
    };

    constructor(username:string,password:string){
        this._username = username;
        this._password = password;
    }

    async login(){
        let res = await fetch("https://scratch.mit.edu/csrf_token/");
        let setcookies = res.headers.get("set-cookie");
        if(Math.floor(res.status/100) !== 2){
            throw new Error(`エラー:ステータスコード=${res.status} 場所=ログイン段階1`);
        }else if(!setcookies){
            throw new Error("エラー:cookieを読み込めませんでした");
        }
        const _cookies = setcookies.split(" ");
        let token = "";
        for(const c of _cookies){
            if(c.includes("scratchcsrftoken")){
                const d = c.replace(";","").split("=");
                token = d[1] || "";
                break;
            }
        }
        this.cookies["scratchcsrftoken"] = token;

        res = await fetch("https://scratch.mit.edu/accounts/login/",{
            method:"POST",
            headers:{
                "x-csrftoken":this.cookies["scratchcsrftoken"],
                "x-requested-with":"XMLHttpRequest",
                "cookie":metaData.getParsedCookies(this.cookies),
                "content-type":"application/json",
                "referer":"https://scratch.mit.edu/",
                "user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
                "origin":"https://scratch.mit.edu",

            },
            body:JSON.stringify({
                "username":this._username,
                "password":this._password,
                "useMessages":true,
            })
        });
        if(Math.floor(res.status/100) !== 2){
            throw new Error(`エラー:ステータスコード=${res.status} 場所=ログイン段階2`);
        }
        setcookies = res.headers.get("set-cookie");
        if(setcookies){
            const _cookies = setcookies.split(" ");
            let session = "";
            for(const c of _cookies){
                if(c.includes("scratchsessionsid")){
                    const d = c.replace(";","").split("=");
                    session = d[1] || "";
                    break;
                }
            }

            this.cookies["scratchsessionsid"] = session.replace(`"`,'');
        }
        const resJson = await res.json();
        this.otherMetaDatas["x-token"] = resJson[0]["token"];
        this.otherMetaDatas["id"] = resJson[0]["id"];

    }

        // await sleep(50)

        // driver.findElement(By.className("login-item")).click();
        // await sleep(50)
        // const loginWrapper = await driver.findElement(By.className("login"));
        // const inputs = await loginWrapper.findElements(By.tagName("input"));
        // inputs[0]?.sendKeys(this._username);
        // inputs[1]?.sendKeys(this._password);
        // const sendButton = loginWrapper.findElement(By.tagName("button"));
        // sendButton.click();

        // await sleep(6000);

    connect_user(username:string){
        return user.build(username,new metaData(this._username,this._password,this.cookies,this.otherMetaDatas));
    }

    connect_project(projectId:string){
        return project.build(projectId,new metaData(this._username,this._password,this.cookies,this.otherMetaDatas));
    }
}