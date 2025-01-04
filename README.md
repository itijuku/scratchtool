# scratchtool
scratchtoolではscratchサイトでの統計(フォロワー、プロジェクトの参照者数等)を取得できます

## document
https://github.com/itijuku/scratchtool/wiki

## install
```
pip install -U scratchtool
```

```python
import scratchtool as tool

user = tool.user("purupann")
print(user.get_followers())
```
