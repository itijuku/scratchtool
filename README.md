# scratchtool
With scratchtool you can get statistics (followers, number of project visitors, etc.) on the scratch site

## document
https://github.com/itijuku/scratchtool/wiki/scratchtool's-document%E2%80%90en

## install
```
pip install -U scratchtool
```

## for example
```python
import scratchtool as tool

user = tool.user("itijuku")
print(user.get_followers())
```
