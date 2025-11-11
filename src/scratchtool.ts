import { Builder, By, Key } from "selenium-webdriver";
import {WebSocket} from "ws";
import chrome from "selenium-webdriver/chrome.js";
import * as cheerio from "cheerio";

import {user} from "./user.js";

function sleep(ms:number):Promise<void>{
    return new Promise(resolve=>setTimeout(resolve,ms));
}

export class metaData{
    username:string;
    password:string;
    cookies:{[name:string]:string};
    parsedCookies:string;

    constructor(username:string,password:string,cookies:{[name:string]:string}){
        this.username = username;
        this.password = password;
        this.cookies = cookies;

        let cookie = "";
        for(const key in cookies){
            cookie += `${key}=${cookies[key]}; `
        }
        cookie = cookie.slice(0,cookie.length - 2);
        console.log("cookie",cookie)
        this.parsedCookies = cookie;
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
    cookies:{[name:string]:string} = {};

    constructor(username:string,password:string){
        this._username = username;
        this._password = password;
    }

    async login(){
        const options = new chrome.Options();
        options.addArguments("--headless=new");

        const driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .build();

        try {
            await driver.get("https://scratch.mit.edu/");
            await sleep(50)

            driver.findElement(By.className("login-item")).click();
            await sleep(50)
            const loginWrapper = await driver.findElement(By.className("login"));
            const inputs = await loginWrapper.findElements(By.tagName("input"));
            inputs[0]?.sendKeys(this._username);
            inputs[1]?.sendKeys(this._password);
            const sendButton = loginWrapper.findElement(By.tagName("button"));
            sendButton.click();

            await sleep(7000);
            for(const c of await driver.manage().getCookies()){
                this.cookies[c["name"]] = decodeURIComponent(c["value"]);
            }
        } finally {
            await driver.quit();
        }
    }

    connect_user(targetUserName:string){
        return user.build(targetUserName,new metaData(this._username,this._password,this.cookies));
    }
}