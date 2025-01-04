# scratchtool
scratchtoolではscratchサイトでの統計(フォロワー、プロジェクトの参照者数等)を取得できます
With scratchtool you can get statistics (followers, number of project visitors, etc.) on the scratch site

## document
https://github.com/itijuku/scratchtool/wiki

## install
```
pip install -U scratchtool
```

## for example
```python
import scratchtool as tool

user = tool.user("purupann")
print(user.get_followers())
```
