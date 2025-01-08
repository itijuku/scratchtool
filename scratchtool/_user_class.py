import requests
from bs4 import BeautifulSoup


class user:   
    def __init__(self,username:str):
        self.username = str(username)
        
    def _get_data(self,get_data1:str,get_data2:str=""):
        # APIのURL
        url = f"https://api.scratch.mit.edu/users/{self.username}/"

        # GETリクエストを送信してデータを取得
        response = requests.get(url)
        data = response.json()
        try:
            if get_data2:
                return data.get(get_data1).get(get_data2)
            else:
                return data.get(get_data1)
        except:
            return None
    
    def get_followers(self):
        # HTMLの取得(GET)
        req = requests.get(f"https://scratch.mit.edu/users/{self.username}/followers/")
        req.encoding = req.apparent_encoding # 日本語の文字化け防止

        # HTMLの解析
        data = BeautifulSoup(req.text,"html.parser")

        items = data.find(class_ = "box-head")
        item = items.find("h2")
        try:
            textdata = item.text

            j = textdata.find("Followers") + 11
            mozi = ""
            while textdata[j] != ")":
                mozi = mozi+textdata[j]
                j += 1
            # print(f"フォロワー:{mozi}")
            return mozi
        except:
            print("Could not load data.\n[Possibility]\n1.User does not exist.\n2. scratchserver may have crashed.")
    
    def get_following(self):
        # aaa = input("username:")

        # HTMLの取得(GET)
        req = requests.get(f"https://scratch.mit.edu/users/{self.username}/following/")
        req.encoding = req.apparent_encoding # 日本語の文字化け防止

        # HTMLの解析
        data = BeautifulSoup(req.text,"html.parser")

        items = data.find(class_ = "box-head")
        item = items.find("h2")
        try:
            textdata = item.text

            j = textdata.find("Following") + 11
            mozi = ""
            while textdata[j] != ")":
                mozi = mozi+textdata[j]
                j += 1
            # print(f"フォロワー:{mozi}")
            return mozi
        except:
            print("Could not load data.\n[Possibility]\n1.User does not exist.\n2. scratchserver may have crashed.")
    
    
    def get_messages(self):
        # aaa = input("username:")

        # HTMLの取得(GET)
        req = requests.get(f"https://api.scratch.mit.edu/users/{self.username}/messages/count")
        req.encoding = req.apparent_encoding # 日本語の文字化け防止

        # HTMLの解析
        data = BeautifulSoup(req.text,"html.parser")

        textdata = data.text
        j = 9
        mozi = ""
        while textdata[j] != "}":
            mozi = mozi+textdata[j]
            j += 1
        # print(f"フォロワー:{mozi}")
        return int(mozi)
    
    
    
    def get_id(self):
        return self._get_data("id")

    
    def get_joined(self):
        return self._get_data("history","joined")


    def get_status1(self):
        return self._get_data("profile","bio")

        
    def get_status2(self):
        return self._get_data("profile","status")


    def get_country(self):
        return self._get_data("profile","country")

    
    def get_st(self):
        return self._get_data("scratchteam")