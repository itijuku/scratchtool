import {scratchtool} from "./scratchtool.js";

const st = new scratchtool("zaimusyo","1220123");
await st.login();
console.log(st.cookies);

(async()=>{
    const user = await st.connect_user("triton888");
    user.follow();
})();