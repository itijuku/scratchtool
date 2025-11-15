import {WebSocket} from "ws";

import {metaData} from "./scratchtool.js"

export class ws{
    wss:WebSocket;
    projectId:string;
    metaData:metaData;
    constructor(wss:WebSocket,projectId:string,metaData:metaData){
        this.wss = wss;
        this.projectId = projectId;
        this.metaData = metaData;
    }

    static async buildForTw(projectId:string,metaData:metaData):Promise<ws>{
        const wss = new WebSocket("wss://clouddata.turbowarp.org/");
        return await new Promise((resolve,reje)=>{
            wss.on("open",async()=>{
                await wss.send(JSON.stringify({
                    "method": "handshake",
                    "user": metaData.username,
                    "project_id": projectId
                }));
                
                resolve(new ws(wss,projectId,metaData)); 
            })
        })
    }

    async set_var(variable:string,value:string){
        this.wss.send(JSON.stringify({
            "method":"set",
            "name":`☁ ${variable}`,
            "project_id":this.projectId,
            "user":this.metaData.username,
            "value":Number(value)
        }));
    }
}