import asyncio
import websockets
import json

class _cloud():
    def __init__(self,projectID:str,username:str,password:str):
        self.projectID = str(projectID)
        self.username = str(username)
        self.password = str(password)

    def set_var(self,variable,value):
        self.variable = variable
        self.value = value
        asyncio.run(self._set_cloud_variable())
        
    async def _set_cloud_variable(self):
        cloud_var_name = f"☁ {self.variable}"
        new_value = self.value

        uri = f"wss://clouddata.turbowarp.org/"

        async with websockets.connect(uri) as websocket:
            # ハンドシェイクメッセージを送信
            handshake_message = {
                "method": "handshake",
                "user": self.username,
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
                
    def get_var(self, variable: str):
        self.variable = variable  # クラウド変数名を設定
        return asyncio.run(self._get_cloud_variables())
    
    
    async def _get_cloud_variables(self):
        cloud_var_name = f"☁ {self.variable}"
        url = f"wss://clouddata.turbowarp.org/"
        
        async with websockets.connect(url) as ws:
            # TurboWarpのクラウド変数のサーバーへ接続要求
            await ws.send(json.dumps({
                "method": "handshake",
                "user": self.username,  
                "project_id": self.projectID
            }))
        
            while ws.open:  # 接続が開いている間だけ待機
                message = await ws.recv()
                # print(f"受信メッセージ（生データ）: {message}")  # 受信データの生出力
                # 複数のJSONメッセージが連結されている場合を分割して処理
                messages = message.strip().splitlines()
                # print(messages)
                for i in messages:
                    data = json.loads(i)
                    if data.get("name") == cloud_var_name:
                        return data.get("value")
                return None