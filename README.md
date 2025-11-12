# [document](https://github.com/itijuku/scratchtool/wiki/document)
#### More quickly,more functions.

# Sample program
```typescript
import {scratchtool} from "scratchtool";

(async()=>{
    const st = new scratchtool("username","password");

    const project = await st.connect_project("projectId");
    console.log(project.views);

})();
```

# Installation
```shell
npm install scratchtool
```

# Logging in
```typescript
const st = new scratchtool("username","password");
```

# Users
Connect a user by name
```typescript
const user = st.connect_user("name")
```

## st.UserClass
#### Attributers:
```typescript

```

#### Methods:
```typescript
user.follow();
user.unfollow();

user.following_count();
user.follower_count();

user.post_comment();
user.reply_comment();
user.delete_comment();
```

# Projects
Connect a project by Id
```typescript
const project = st.connect_project("projectId")
```

## st.ProjectClass
#### Attributers:
```typescript
project.id
project.url
project.title
project.author_name
project.comments_allowed
project.instructions
project.notes
project.created
project.last_modified
project.share_date
project.thumbnail_url
project.remix_parent
project.remix_root
project.loves
project.favorites
project.remix_count
project.views
project.project_token
```

#### Methods:
```typescript
project.post_view();
project.love();
project.favorite();
project.unlove();
project.unfavorite();

project.post_comment();
project.reply_comment();
```
