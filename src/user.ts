import * as cheerio from "cheerio";

import {metaData} from "./scratchtool.js"
import {commentForUser} from "./comment.js"

export class userMetaDataForV3{
    username:string;
    id:string = "";
    thumbnail_url:string = "";
    
    constructor(object:{[name:string]:any}){
        this.username = object["username"];
        this.id = object["id"];
    }

    static userObjectParser(objects:{[name:string]:any}[]){
        let obj = [];
        for(const d of objects){
            obj.push(new userMetaDataForV3(d));
        }

        return obj;
    }
}

export class userMetaData{
    metaData:metaData;
    thumbnail_url:string = "";

    username:string;
    id:string = "";
    icon_url:string = "";
    about_me:string = "";
    wiwo:string = "";
    country:string = "";
    
    constructor(username:string,metaData:metaData){
        this.username = username;
        this.metaData = metaData;
    }
    async initForV2(){
        const res = await fetch(
            `https://scratch.mit.edu/users/${this.username}/`,
            {
                method:"GET",
                headers:{
                    "Cookie": this.metaData.parsedCookies, 
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                    "Accept-Language": "ja,en-US;q=0.9,en;q=0.8",
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                    "Referer": "https://scratch.mit.edu/"
                }
            }
        )

        const html = await res.text();

        const $ = cheerio.load(html);
        const script = $("script").eq(6).text();
        const match = script.match(/Scratch\.INIT_DATA\.PROFILE\s*=\s*(\{[\s\S]*?\})\s*(?=Scratch\.INIT_DATA\.)/);

        if(!match || !match.length || !match[1]){
            throw new Error("not found data");
        }
        const scriptJson = eval(`(${match[1]})`);
        const id = scriptJson["model"]["userId"] || "";
        const thumbnail_url = scriptJson["model"]["thumbnail_url"] || "";

        const location = $(".location").eq(0).text();
        this.country = location;

        const textarea = $("textarea");

        const bio = textarea.eq(0).text();
        this.about_me = bio;
        const wiwo = textarea.eq(1).text();
        this.wiwo = wiwo;

        this.id = id;
        this.thumbnail_url = thumbnail_url;
        this.icon_url = thumbnail_url;
    }
}

export class user{
    private targetUserName:string;
    private metaData:metaData;
    private userMetaData:userMetaData;

    username:string;
    id:string = "";
    icon_url:string = "";
    about_me:string = "";
    wiwo:string = "";
    country:string = "";

    private constructor(username:string,metaData:metaData,userMetaData:userMetaData){
        this.targetUserName = username;
        this.metaData = metaData;
        this.userMetaData = userMetaData;
        
        this.username = userMetaData.username;
        this.id = userMetaData.id;
        this.icon_url = userMetaData.thumbnail_url
        this.about_me = userMetaData.about_me
        this.wiwo = userMetaData.wiwo
        this.country = userMetaData.country
    }

    static async build(username:string,metaData:metaData){
        const md = await new userMetaData(username,metaData);
        await md.initForV2();
        return new user(username,metaData,md);
    }

    async follower_count():Promise<number>{
        const res = await fetch(`https://scratch.mit.edu/users/${this.targetUserName}/followers/`);
        
        const html = await res.text();
        const $ = cheerio.load(html);
        const data = $("h2").text();
        const followerCount = data.split("(")[1]?.split(")")[0];
        
        return Number(followerCount);
    }

    async following_count():Promise<number>{
        const res = await fetch(`https://scratch.mit.edu/users/${this.targetUserName}/following/`);
        
        const html = await res.text();
        const $ = cheerio.load(html);
        const data = $("h2").text();
        const followingCount = data.split("(")[1]?.split(")")[0];
        
        return Number(followingCount);
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
        const
         res = await fetch(
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

    async post_comment(content:string){
        const cd = await commentForUser.buildForPost(content,this.metaData,"",this.userMetaData);
        cd.post_comment();
    }

    async reply_comment(content:string,parent_id:string){
        const cd = await commentForUser.buildForPost(content,this.metaData,parent_id,this.userMetaData);
        cd.reply_comment();
    }

    async delete_comment(comment_id:string,){
        const cd = await commentForUser.buildForDelete(comment_id,this.metaData,this.userMetaData);
        cd.delete_comment();
    }
}