import fs from "fs";
import path from "path";

import {metaData} from "./scratchtool.js"
import {userMetaDataForV3} from "./user.js"

export class studio{
    private targetStudioId:string;
    private metaData:metaData;

    private constructor(studioId:string,metaDat:metaData,){
        this.metaData = metaDat;
        this.targetStudioId = studioId;
    }

    static async build(projectId:string,metaData:metaData){
        return new studio(projectId,metaData);
    }

    async get_curators(number:number=40,offset:number=0){
        let ress:{[name:string]:string}[] = [];
        if(offset){
            if(number <= 40){
                const res = await fetch(
                    `https://api.scratch.mit.edu/studios/${this.targetStudioId}/curators/?limit=${number}&offset=${offset}`,
                    {
                        method:"GET",
                        headers:{
                            "content-type":"application/json",
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

                ress = resJson;
            }else{
                for(let i=0;i<Math.ceil(number/40);i++){
                    if(i === Math.ceil(number/40) - 1){
                        const res = await fetch(
                            `https://api.scratch.mit.edu/studios/${this.targetStudioId}/curators/?limit=${number%40}&offset=${i*40+offset}`,
                            {
                                method:"GET",
                                headers:{
                                    "content-type":"application/json",
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

                        ress = [...ress,...resJson];
                    }else{
                        const res = await fetch(
                            `https://api.scratch.mit.edu/studios/${this.targetStudioId}/curators/?limit=${40}&offset=${i*40+offset}`,
                            {
                                method:"GET",
                                headers:{
                                    "content-type":"application/json",
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

                        ress = [...ress,...resJson];
                    }
                }
            }
        }else{
            if(number <= 40){
                const res = await fetch(
                    `https://api.scratch.mit.edu/studios/${this.targetStudioId}/curators/?limit=${number}&offset=0`,
                    {
                        method:"GET",
                        headers:{
                            "content-type":"application/json",
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

                ress = resJson;
            }else{
                for(let i=0;i<Math.ceil(number/40);i++){
                    if(i === Math.ceil(number/40) - 1){
                        const res = await fetch(
                            `https://api.scratch.mit.edu/studios/${this.targetStudioId}/curators/?limit=${number%40}&offset=${i*40}`,
                            {
                                method:"GET",
                                headers:{
                                    "content-type":"application/json",
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

                        ress = [...ress,...resJson];
                    }else{
                        const res = await fetch(
                            `https://api.scratch.mit.edu/studios/${this.targetStudioId}/curators/?limit=${40}&offset=${i*40}`,
                            {
                                method:"GET",
                                headers:{
                                    "content-type":"application/json",
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

                        ress = [...ress,...resJson];
                    }
                }
            }
        }


        const datas = userMetaDataForV3.userObjectParser(ress);
        
        return datas;
    }

    async invite_curator(username:string){
        const csrftoken = this.metaData.cookies["scratchcsrftoken"] || "";

        const res = await fetch(
            `https://scratch.mit.edu/site-api/users/curators-in/${this.targetStudioId}/invite_curator/?usernames=${username}`,
            {
                method:"PUT",
                headers:{
                    "x-csrftoken":csrftoken,
                    "x-requested-with":"XMLHttpRequest",
                    "cookie":this.metaData.parsedCookies,
                    "content-type":"application/json",
                    "referer":`https://scratch.mit.edu/`,
                    "user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
                    "origin":"https://scratch.mit.edu",
                },
            }
        );

        if(Math.floor(res.status/100) !== 2){
            throw new Error(`エラー ステータスコード:${res.status}`);
        }
    }
}

