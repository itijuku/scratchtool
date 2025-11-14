import {scratchtool} from "scratchtool";
import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI("yourToken");

function sleep(ms:number):Promise<void>{
    return new Promise(resolve=>setTimeout(resolve,ms));
}

(async()=>{
    const st = new scratchtool("username","password");
    await st.login();

    const projectIds = [""];
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

                    const res:string|boolean = await checkContent(nowcomment.content);
                    if(typeof res === "string"){
                        await nowcomment.reply(
                            `【AIによる回答】${res}`
                        )
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

                        const res:string|boolean = await checkContent(nowcomment.content);
                        if(typeof res === "string"){
                            await nowcomment.reply(
                            `【AIによる回答】${res}`
                            )
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

async function checkContent(content:string) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite",
        systemInstruction:`
役割: コメントが「質問／問題／クイズ」か判定する。命令形の「予想して」「予想」や「〜かな？」等も質問扱いにする。
相手の意図通りの回答か***熟考して熟考して熟考して***本当にこれが大事だから。
但し本当にそれが「質問／問題／クイズ」かはとても真剣に長時間考えて。「質問／問題／クイズ」に感想は含めない。
出力:
- 質問系なら → 200字以内の回答。
- 非質問系なら → 1（数字1のみ、1行）。
判定トリガー(例): 何、誰、いつ、どこ、なぜ、どう、どの、いくつ、〜か、〜かな、教えて、答えて、解いて、クイズ、問題、予想、予想して、推測して
注意: 出力は200文字以内、余計なラベル・説明・句読点は入れない。上から目線・意図の要求は禁止。ここでいうSTとはscratch team、要するに運営者を指す
scratch利用規約で禁止されている主な内容: 憎悪・差別・暴力・性的・下品・個人情報・違法・スパム・（宣伝は原則禁止だが例外あり）
`
     });
    const result = await model.generateContent(content);
    const res = result.response.text();
    console.log(res)
    if(isNaN(Number(res.trim()))){
        return res;
    }return false;
}