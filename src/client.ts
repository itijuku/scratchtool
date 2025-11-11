import {scratchtool} from "./scratchtool.js";

const st = new scratchtool("zaimusyo","1220123");
await st.login();
console.log(st.cookies);

(async()=>{
    const project = await st.connect_project("1237490908");
    await project.love();
})();