const cookie = '_ga=GA1.1.1132175985.1758114345; scratchpolicyseen=true; scratchcsrftoken=qKQcKlXd5PYgIPx5leS67a9qTxUEl1Os; permissions=%7B%22admin%22%3Afalse%2C%22scratcher%22%3Atrue%2C%22new_scratcher%22%3Afalse%2C%22invited_scratcher%22%3Afalse%2C%22social%22%3Atrue%2C%22educator%22%3Afalse%2C%22educator_invitee%22%3Afalse%2C%22student%22%3Afalse%2C%22mute_status%22%3A%7B%7D%7D; _ga_3FZMRJWZR6=GS2.1.s1762849559$o47$g1$t1762851118$j59$l0$h0';

const _cookies = cookie.split(";");
let cookies = {};
for(const c of _cookies){
    const d = c.replace(" ","").split("=");
    cookies[d[0]] = d[1];
}

console.log(cookies);