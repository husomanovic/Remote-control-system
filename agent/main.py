import argparse
from device import verifyDevice, verifySession, getDeviceName, getDeviceid
from conestion import start_connection

API_URL = "http://localhost:5000"
# API_URL = "http://172.22.3.196:5000"

def main():
    parser = argparse.ArgumentParser(description="Remote Agent")

    parser.add_argument("--session", required=False, help="Session to connect with")

    args = parser.parse_args()

    session = args.session
    if not session :
        session = input("Input session: ")
    
    print(f"[+] Running agenta with session : {session}")


    print(f"[+] Device name: {getDeviceName()}")
    print(f"[+] Device id: {getDeviceid()}")

    if not verifyDevice(API_URL) :
        print(f"[!] Error while verifying device")
        exit(1)

    print("[+] Device verified successfully")

    token = verifySession(session, API_URL)
    if not token  :
        print(f"[!] Session is not valid")
        exit(1)
    
    start_connection(token, session,  API_URL)
        
    

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("[+] Agent stopped")
        