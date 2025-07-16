import os
import hashlib
import platform
import uuid
import requests


def generate_device_uid():
    fingerprint = f"{platform.node()}|{platform.system()}|{platform.release()}|{uuid.getnode()}"
    return hashlib.sha256(fingerprint.encode()).hexdigest()

def getDeviceName():
    return platform.node()

def getDeviceid():
    folder = os.path.join(os.path.expanduser("~"), ".my_agent")
    os.makedirs(folder, exist_ok=True)

    file_path = os.path.join(folder, "device_id.txt")

    if os.path.exists(file_path):
        with open(file_path, "r") as f:
            return f.read().strip()

    uid = generate_device_uid()

    with open(file_path, "w") as f:
        f.write(uid)

    return uid


def verifyDevice(API_URL):
    device_id = getDeviceid()
    device_name = getDeviceName()
    try:
        res = requests.post(f"{API_URL}/device/verifyDevice", json={"id": device_id, "name": device_name})
        return res.status_code == 200
    except Exception as e:
        return False


def verifySession(session, API_URL):
    device_id = getDeviceid()
    try:
        res = requests.post(f"{API_URL}/device/verifySession", json={"session": session, "deviceId": device_id})

        
        data = res.json() 
        message = data.get("message", "")
        token = data.get("token", "")
        if(token):
            print("[+]", message)
        else:
            print("[!]", message)
        return token
    except Exception as e:
        print(f"[!] Error with verifying session")
        return False










