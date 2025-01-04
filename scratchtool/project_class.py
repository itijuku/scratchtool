import requests
from bs4 import BeautifulSoup


class project:
    def __init__(self,projectID:any):
        self.projectID = str(projectID)
    
    def get_title(self):
        # APIのURL
        url = f"https://api.scratch.mit.edu/projects/{self.projectID}/"

        # GETリクエストを送信してデータを取得
        response = requests.get(url)
        data = response.json()
        return data.get("title")
    
    def get_explanation1(self):
        # APIのURL
        url = f"https://api.scratch.mit.edu/projects/{self.projectID}/"

        # GETリクエストを送信してデータを取得
        response = requests.get(url)
        data = response.json()
        return data.get("instructions")
    
    def get_explanation2(self):
        # APIのURL
        url = f"https://api.scratch.mit.edu/projects/{self.projectID}/"

        # GETリクエストを送信してデータを取得
        response = requests.get(url)
        data = response.json()
        return data.get("description")
    
    def get_views(self):
        # APIのURL
        url = f"https://api.scratch.mit.edu/projects/{self.projectID}/"

        # GETリクエストを送信してデータを取得
        response = requests.get(url)
        data = response.json()
        return data.get("stats").get("views")

    def get_loves(self):
        # APIのURL
        url = f"https://api.scratch.mit.edu/projects/{self.projectID}/"

        # GETリクエストを送信してデータを取得
        response = requests.get(url)
        data = response.json()
        return data.get("stats").get("loves")
    
    def get_favorites(self):
        # APIのURL
        url = f"https://api.scratch.mit.edu/projects/{self.projectID}/"

        # GETリクエストを送信してデータを取得
        response = requests.get(url)
        data = response.json()
        return data.get("stats").get("favorites")

    def get_remixes(self):
        # APIのURL
        url = f"https://api.scratch.mit.edu/projects/{self.projectID}/"

        # GETリクエストを送信してデータを取得
        response = requests.get(url)
        data = response.json()
        return data.get("stats").get("remixes")

    def get_images(self,height:int = 360,width:int = 480):
        return f"https://uploads.scratch.mit.edu/get_image/project/{self.projectID}_{width}x{height}.png"
    
    def get_created(self):
        # APIのURL
        url = f"https://api.scratch.mit.edu/projects/{self.projectID}/"
        # GETリクエストを送信してデータを取得
        response = requests.get(url)
        data = response.json()
        return data.get("history").get("created")
    
    def get_modified(self):
        # APIのURL
        url = f"https://api.scratch.mit.edu/projects/{self.projectID}/"
        # GETリクエストを送信してデータを取得
        response = requests.get(url)
        data = response.json()
        return data.get("history").get("modified")
    
    def get_shared(self):
        # APIのURL
        url = f"https://api.scratch.mit.edu/projects/{self.projectID}/"
        # GETリクエストを送信してデータを取得
        response = requests.get(url)
        data = response.json()
        return data.get("history").get("shared")