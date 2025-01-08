from _cloud_class import _cloud

class login():
    def __init__(self,username:str,password:str):
        self.username = username
        self.password = password
        
    def connect_cloud_tw(self,projectID):
        return _cloud(projectID,self.username,self.password)