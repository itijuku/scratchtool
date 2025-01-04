# scratchtool
With scratchtool you can get statistics (followers, number of project visitors, etc.) on the scratch site

## document
[en] 
https://github.com/itijuku/scratchtool/wiki/%5Ben%5Dscratchtool's-document

[ja] https://github.com/itijuku/scratchtool/wiki/%5Bja%5Dscratchtool%E3%81%AE%E3%83%89%E3%82%AD%E3%83%A5%E3%83%A1%E3%83%B3%E3%83%88

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
