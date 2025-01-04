import requests
from bs4 import BeautifulSoup

class user:   
    def get_followers(name):
        # aaa = input("username:")

        # HTMLの取得(GET)
        req = requests.get(f"https://scratch.mit.edu/users/{name}/followers/")
        req.encoding = req.apparent_encoding # 日本語の文字化け防止

        # HTMLの解析
        data = BeautifulSoup(req.text,"html.parser")

        items = data.find(class_ = "box-head")
        item = items.find("h2")

        aaaaa = item.text

        j = aaaaa.find("Followers") + 11
        mozi = ""
        while aaaaa[j] != ")":
            mozi = mozi+aaaaa[j]
            j += 1
        # print(f"フォロワー:{mozi}")
        return mozi
    
    def get_following(name):
        # aaa = input("username:")

        # HTMLの取得(GET)
        req = requests.get(f"https://scratch.mit.edu/users/{name}/following/")
        req.encoding = req.apparent_encoding # 日本語の文字化け防止

        # HTMLの解析
        data = BeautifulSoup(req.text,"html.parser")

        items = data.find(class_ = "box-head")
        item = items.find("h2")

        aaaaa = item.text

        j = aaaaa.find("Following") + 11
        mozi = ""
        while aaaaa[j] != ")":
            mozi = mozi+aaaaa[j]
            j += 1
        # print(f"フォロワー:{mozi}")
        return mozi
    
    
    def get_messages(name):
        # aaa = input("username:")

        # HTMLの取得(GET)
        req = requests.get(f"https://api.scratch.mit.edu/users/{name}/messages/count")
        req.encoding = req.apparent_encoding # 日本語の文字化け防止

        # HTMLの解析
        data = BeautifulSoup(req.text,"html.parser")

        aaaaa = data.text
        j = 9
        mozi = ""
        while aaaaa[j] != "}":
            mozi = mozi+aaaaa[j]
            j += 1
        # print(f"フォロワー:{mozi}")
        return int(mozi)
    def get_id(name):
        # APIのURL
        url = f"https://api.scratch.mit.edu/users/{name}/"

        # GETリクエストを送信してデータを取得
        response = requests.get(url)
        data = response.json()
        return data.get("id")
    
    def get_joined(name):
        # APIのURL
        url = f"https://api.scratch.mit.edu/users/{name}/"

        # GETリクエストを送信してデータを取得
        response = requests.get(url)
        data = response.json()
        return data.get("history").get("joined")

    def get_status1(name):
        # APIのURL
        url = f"https://api.scratch.mit.edu/users/{name}/"

        # GETリクエストを送信してデータを取得
        response = requests.get(url)
        data = response.json()
        return data.get("profile").get("bio")
        
    def get_status2(name):
        # APIのURL
        url = f"https://api.scratch.mit.edu/users/{name}/"

        # GETリクエストを送信してデータを取得
        response = requests.get(url)
        data = response.json()
        return data.get("profile").get("status")

    def get_country(name):
        # APIのURL
        url = f"https://api.scratch.mit.edu/users/{name}/"

        # GETリクエストを送信してデータを取得
        response = requests.get(url)
        data = response.json()
        return data.get("profile").get("country")
    
    def get_st(name):
        # APIのURL
        url = f"https://api.scratch.mit.edu/users/{name}/"

        # GETリクエストを送信してデータを取得
        response = requests.get(url)
        data = response.json()
        return data.get("scratchteam")


class project:
    def get_title(id):
        # APIのURL
        url = f"https://api.scratch.mit.edu/projects/{id}/"

        # GETリクエストを送信してデータを取得
        response = requests.get(url)
        data = response.json()
        return data.get("title")
    
    def get_explanation1(id):
        # APIのURL
        url = f"https://api.scratch.mit.edu/projects/{id}/"

        # GETリクエストを送信してデータを取得
        response = requests.get(url)
        data = response.json()
        return data.get("instructions")
    
    def get_explanation2(id):
        # APIのURL
        url = f"https://api.scratch.mit.edu/projects/{id}/"

        # GETリクエストを送信してデータを取得
        response = requests.get(url)
        data = response.json()
        return data.get("description")
    
    def get_views(id):
        # APIのURL
        url = f"https://api.scratch.mit.edu/projects/{id}/"

        # GETリクエストを送信してデータを取得
        response = requests.get(url)
        data = response.json()
        return data.get("stats").get("views")

    def get_loves(id):
        # APIのURL
        url = f"https://api.scratch.mit.edu/projects/{id}/"

        # GETリクエストを送信してデータを取得
        response = requests.get(url)
        data = response.json()
        return data.get("stats").get("loves")
    
    def get_favorites(id):
        # APIのURL
        url = f"https://api.scratch.mit.edu/projects/{id}/"

        # GETリクエストを送信してデータを取得
        response = requests.get(url)
        data = response.json()
        return data.get("stats").get("favorites")

    def get_remixes(id):
        # APIのURL
        url = f"https://api.scratch.mit.edu/projects/{id}/"

        # GETリクエストを送信してデータを取得
        response = requests.get(url)
        data = response.json()
        return data.get("stats").get("remixes")

    def get_images(id):
        return f"https://uploads.scratch.mit.edu/get_image/project/{id}_480x360.png"
    
    def get_created(id):
        # APIのURL
        url = f"https://api.scratch.mit.edu/projects/{id}/"
        # GETリクエストを送信してデータを取得
        response = requests.get(url)
        data = response.json()
        return data.get("history").get("created")
    
    def get_modified(id):
        # APIのURL
        url = f"https://api.scratch.mit.edu/projects/{id}/"
        # GETリクエストを送信してデータを取得
        response = requests.get(url)
        data = response.json()
        return data.get("history").get("modified")
    
    def get_shared(id):
        # APIのURL
        url = f"https://api.scratch.mit.edu/projects/{id}/"
        # GETリクエストを送信してデータを取得
        response = requests.get(url)
        data = response.json()
        return data.get("history").get("shared")