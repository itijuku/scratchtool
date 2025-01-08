import requests
from bs4 import BeautifulSoup
import asyncio
import websockets
import json

class project:
    def __init__(self,projectID:any):
        self.projectID = str(projectID)
        
        
    def _get_data(self,get_data1:str,get_data2:str=""):
        # APIのURL
        url = f"https://api.scratch.mit.edu/projects/{self.projectID}/"

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
        
        
    def get_title(self):
        return self._get_data("title")

    
    def get_explanation1(self):
        return self._get_data("instructions")
    
    
    def get_explanation2(self):
        return self._get_data("description")

    
    def get_views(self):
        return self._get_data("stats","views")


    def get_loves(self):
        return self._get_data("stats","loves")

    
    def get_favorites(self):
        return self._get_data("stats","favorites")


    def get_remixes(self):
        return self._get_data("stats","remixes")

    
    def get_created(self):
        return self._get_data("history","created")


    def get_modified(self):
        return self._get_data("history","modified")

    
    def get_shared(self):
        return self._get_data("history","shared")
    
    
    def get_images(self,height:int = 360,width:int = 480):
        return f"https://uploads.scratch.mit.edu/get_image/project/{self.projectID}_{width}x{height}.png"