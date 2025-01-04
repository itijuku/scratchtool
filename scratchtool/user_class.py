import requests
from bs4 import BeautifulSoup


class user:   
    def __init__(self,username:str):
        self.username = str(username)
    def get_followers(self):
        # aaa = input("username:")

        # HTMLの取得(GET)
        req = requests.get(f"https://scratch.mit.edu/users/{self.username}/followers/")
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
    
    def get_following(self):
        # aaa = input("username:")

        # HTMLの取得(GET)
        req = requests.get(f"https://scratch.mit.edu/users/{self.username}/following/")
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
    
    
    def get_messages(self):
        # aaa = input("username:")

        # HTMLの取得(GET)
        req = requests.get(f"https://api.scratch.mit.edu/users/{self.username}/messages/count")
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
    def get_id(self):
        # APIのURL
        url = f"https://api.scratch.mit.edu/users/{self.username}/"

        # GETリクエストを送信してデータを取得
        response = requests.get(url)
        data = response.json()
        return data.get("id")
    
    def get_joined(self):
        # APIのURL
        url = f"https://api.scratch.mit.edu/users/{self.username}/"

        # GETリクエストを送信してデータを取得
        response = requests.get(url)
        data = response.json()
        return data.get("history").get("joined")

    def get_status1(self):
        # APIのURL
        url = f"https://api.scratch.mit.edu/users/{self.username}/"

        # GETリクエストを送信してデータを取得
        response = requests.get(url)
        data = response.json()
        return data.get("profile").get("bio")
        
    def get_status2(self):
        # APIのURL
        url = f"https://api.scratch.mit.edu/users/{self.username}/"

        # GETリクエストを送信してデータを取得
        response = requests.get(url)
        data = response.json()
        return data.get("profile").get("status")

    def get_country(self):
        # APIのURL
        url = f"https://api.scratch.mit.edu/users/{self.username}/"

        # GETリクエストを送信してデータを取得
        response = requests.get(url)
        data = response.json()
        return data.get("profile").get("country")
    
    def get_st(self):
        # APIのURL
        url = f"https://api.scratch.mit.edu/users/{self.username}/"

        # GETリクエストを送信してデータを取得
        response = requests.get(url)
        data = response.json()
        return data.get("scratchteam")