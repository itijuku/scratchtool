import asyncio
import websockets
import json

class login():
    def __init__(self,username:str,password:any = ""):
        global usernamea
        usernamea = username
        self.username = username
        self.password = str(password)
        
        
    class connect_cloud_tw():
        def __init__(self,projectID:any):
            self.projectID = str(projectID)
        
        def set_var(self,variable:any,value:any):
            self.variable = variable
            self.value = value
            asyncio.run(self.set_cloud_variable())
            
            
        async def set_cloud_variable(self):
            cloud_var_name = f"☁ {self.variable}"  # クラウド変数名（先頭に "☁ " を追加）
            new_value = self.value  # 設定する値
            name = usernamea  # ここに Scratch のユーザー名を入力

            uri = f"wss://clouddata.turbowarp.org/"

            async with websockets.connect(uri) as websocket:
                # ハンドシェイクメッセージを送信
                handshake_message = {
                    "method": "handshake",
                    "user": name,
                    "project_id": self.projectID
                }
                await websocket.send(json.dumps(handshake_message))

                # クラウド変数の設定メッセージを送信
                set_variable_message = {
                    "method": "set",
                    "name": cloud_var_name,
                    "value": str(new_value)
                }
                await websocket.send(json.dumps(set_variable_message))

                # サーバーからの応答を待機（応答がない場合もあるため例外処理を追加）
                try:
                    response = await websocket.recv()
                    # print(f"Response: {response}")
                except websockets.exceptions.ConnectionClosedOK:
                    print("Connection closed normally without response.")
