# scratchtool
With scratchtool you can get statistics (followers, number of project visitors, etc.) on the scratch site

## document
[en] https://github.com/itijuku/scratchtool/wiki/%5Ben%5Dscratchtool's-document

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
