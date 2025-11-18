import {metaData} from "./scratchtool.js";

export class activityMetaData{
    datetime_created:string;
    id:string;
    actor_id:string;
    username:string;
    type:string;
    actor_username:string;
    constructor(object:{[name:string]:any},metaData:metaData){
        this.datetime_created = object["datetime_created"];
        this.id = object["id"];
        this.actor_id = object["actor_id"];
        this.username = object["username"];
        this.type = object["type"];
        this.actor_username = object["actor_username"];
    }

    static activityObjectParser(objects:{[name:string]:any}[],metaData:metaData){
        let obj:activityMetaData[] = [];
        for(const o of objects){
            obj.push(new activityMetaData(o,metaData));
        }

        return obj;
    }
}

export class activity{
    studioId:string;
    metaData:metaData;
    private constructor(studioId:string,metaData:metaData){
        this.studioId = studioId;
        this.metaData = metaData;
    }

    static async build(studioId:string,metaData:metaData){
        return new activity(studioId,metaData);
    }

    async activity(number:number=40,offset:number=0){
        const res = await fetch(
            `https://api.scratch.mit.edu/studios/${this.studioId}/activity/?limit=${number}`,
            {
                method:"GET",
                headers:{
                    "referer":`https://scratch.mit.edu/`,
                    "user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
                    "origin":"https://scratch.mit.edu",
                },
            }
        );

        if(Math.floor(res.status/100) !== 2){
            throw new Error(`エラー ステータスコード:${res.status}`);
        }

        const resJson = await res.json();
        return activityMetaData.activityObjectParser(resJson,this.metaData);
    }
}