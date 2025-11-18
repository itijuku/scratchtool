# [document](https://github.com/itijuku/scratchtool/wiki/document)
#### More quickly,more functions.

# Sample program
```typescript
import {scratchtool} from "scratchtool";

(async()=>{
    const st = await scratchtool.login("username","password");

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
const st = await scratchtool.login("username","password");
```

# Clouds
Connect a user by name
```typescript
const cloud = st.connect_tw_cloud("projectId");
```

## st.CloudClass
#### Attributers:
```typescript

```

#### Methods:
```typescript
cloud.set_var("variable","value");
cloud.get_var("variable");
```

# Users
Connect a user by name
```typescript
const user = st.connect_user("name");
```

## st.UserClass
#### Attributers:
```typescript
user.username
user.id
user.icon_url
user.about_me
user.wiwo
user.country
```

#### Methods:
```typescript
user.follow();
user.unfollow();

user.following_count();
user.follower_count();

user.post_comment("content");
user.reply_comment("content","parentId");
user.delete_comment("commentId");
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

project.post_comment("content");
project.reply_comment("content","parentId");
project.get_comment(number=40);
```

# studios
Connect a studio by Id
```typescript
const studio = st.connect_studio("studioId")
```

## st.StudioClass
#### Attributers:
```typescript

```
#### Methods:
```typescript
studio.invite_curator("username");
studio.get_curator(number=24,offset=0);
studio.activity(number=40);
```

# Comment
Connect a comment by Id
```typescript

```

## st.CommentClass
#### Attributers:
```typescript
comment.id
comment.parent_id
comment.commentee_id
comment.content
comment.datetime_created
comment.author_name
comment.author_id
comment.reply_count
```

#### Methods:
```typescript
comment.reply("text");
comment.get_replies(number=40);
```
