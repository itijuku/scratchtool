import {WebSocket} from "ws";

import {metaData} from "./scratchtool.js"

function sleep(ms:number):Promise<void>{
    return new Promise(resolve=>setTimeout(resolve,ms));
}

export class ws{
    private wss:WebSocket;
    projectId:string;
    metaData:metaData;

    private variableDatas:{[name:string]:any} = {};

    constructor(wss:WebSocket,projectId:string,metaData:metaData){
        this.wss = wss;
        this.projectId = projectId;
        this.metaData = metaData;
        this.getMessage();
    }

    static async buildForTw(projectId:string,metaData:metaData):Promise<ws>{
        const wss = new WebSocket("wss://clouddata.turbowarp.org/",{
            headers:{
                "Origin": "https://turbowarp.org",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36",     
            }
        })
        return new Promise((resolve,reject)=>{
            wss.on("open",async()=>{
                await wss.send(JSON.stringify({
                    "method": "handshake",
                    "user": metaData.username,
                    "project_id": projectId
                }));

                const _wss = new ws(wss,projectId,metaData);

                await sleep(250);
                
                resolve(_wss); 
            });

            wss.on("error",(e:any)=>{
                reject(e);
            });
        })
    }

    static async buildForSh(projectId:string,metaData:metaData):Promise<ws>{
        const wss = new WebSocket("wss://clouddata.scratch.mit.edu/",{
            headers:{
                "Origin": "https://scratch.mit.edu",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36",
            }
        })
        return new Promise((resolve,reject)=>{
            wss.on("open",async()=>{
                await wss.send(JSON.stringify({
                    "method": "handshake",
                    "user": metaData.username,
                    "project_id": projectId
                }));

                const _wss = new ws(wss,projectId,metaData);

                await sleep(250);
                
                resolve(_wss); 
            });

            wss.on("error",(e)=>{
                reject(e);
            });
        })
    }

    private async getMessage(){
        this.wss.on("message",(msg:string)=>{
            const json = JSON.parse(msg);
            console.log(json)
            this.variableDatas[json["name"]] = json["value"];
        });
    }

    async set_var(variable:string,value:string){
        await this.wss.send(JSON.stringify({
            "method":"set",
            "name":`☁ ${variable}`,
            "project_id":this.projectId,
            "user":this.metaData.username,
            "value":Number(value)
        }));
    }

    async get_var(variable:string){
        const varName = `☁ ${variable}`;
        if(varName in this.variableDatas){
            return this.variableDatas[varName];
        }else{
            new Error(`WsClassError: not found ${varName}`)
        }
    }

    async disconnect(){
        await this.wss.close();
    }
}