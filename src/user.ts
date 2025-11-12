import * as cheerio from "cheerio";

import {metaData} from "./scratchtool.js"
import {comment} from "./comment.js"

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
        const cd = await comment.buildForPost(content,this.metaData);
        cd.post_comment_inUser();
    }

    async reply_comment(content:string,parent_id:string){
        const cd = await comment.buildForPost(content,this.metaData,parent_id);
        cd.reply_comment_inUser();
    }

    async delete_comment(comment_id:string,){
        const cd = await comment.buildForDelete(comment_id,this.metaData);
        cd.delete_comment_inUser();
    }
}