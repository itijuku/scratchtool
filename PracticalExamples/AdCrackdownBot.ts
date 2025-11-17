import {scratchtool} from "scratchtool";

function sleep(ms:number):Promise<void>{
    return new Promise(resolve=>setTimeout(resolve,ms));
}

(async()=>{
    const st = await scratchtool.login("username","password",);


    const projectIds = ["1190624252","1187349297","1241860236","1190887332"];
    let projects:[string,any,boolean][] = [];
    for(const id of projectIds){
        const p = await st.connect_project(id);
        const nowcommentArray = await p.get_comment(1);
        if(nowcommentArray.length){
            const lastcomment = nowcommentArray[0];
            if(lastcomment){
                projects.push([id,lastcomment,true]);
            }
        }else{
            projects.push([id,"",false]);
        }
    }

    let i = 0;

    while(1){
        try{
            const p = projects[i % projects.length];
            if(!p || !projects.length){
                throw new Error("projects.length === 0");
            }

            const project = await st.connect_project(p[0]);
            const nowcommentArray = await project.get_comment(1);
            if(p[2]){
                const nowcomment = nowcommentArray[0];
                if(!nowcommentArray.length){
                    projects[i % projects.length] = [p[0],"",false];
                    continue;
                }

                if(nowcomment && typeof p[1] !== "string" && p[1].content !== nowcomment.content){
                    console.log(nowcomment.content);
                    const now = new Date();
                    const nowTime = now.toLocaleString();

                    if(nowcomment.content.includes("mit.edu/projec")){
                        await nowcomment.reply(`ここでの宣伝行為は許可されていません。このような場での宣伝は利用規約に違反する可能性が高いので以後お気を付けください。 / No Ads allowed here.
                            (※此れはSOI組織によりscratchtool with nodejsで作成されたβ版botです。現在時刻:${nowTime})`);
                    }
                    projects[i % projects.length] = [p[0],nowcomment,true];
                }

            }else{
                if(nowcommentArray.length){
                    const nowcomment = nowcommentArray[0];
                    if(nowcomment){
                        console.log(nowcomment.content);
                        const now = new Date();
                        const nowTime = now.toLocaleString();

                        if(nowcomment.content.includes("mit.edu/projec")){
                            await nowcomment.reply(`ここでの宣伝行為は許可されていません。このような場での宣伝は利用規約に違反する可能性が高いので以後お気を付けください。 / No Ads allowed here.
                                (※此れはSOI組織によりscratchtool with nodejsで作成されたβ版botです。現在時刻:${nowTime})`);
                        }
                        projects[i % projects.length] = [p[0],nowcomment,true];
                    }
                }
            }
            i++;
            await sleep(1000);
        }catch(e){
            console.log("error:",e,(new Date()).toLocaleString());
        }

    }
})();
