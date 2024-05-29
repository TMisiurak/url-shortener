import math
import uuid
import random

def toBase62(num):
    base = 62
    encoded = ""
    base62CharacterSet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

    while num > 0:
        r = num % base
        num = math.floor(num / base)
        encoded = base62CharacterSet[r] + encoded
    
    return encoded


def hashUrl():
    encoded = ""

    # uuidVal = uuid.uuid4()
    uuidVal = int(str(uuid.uuid4().fields[-1])[:11])

    salt = math.ceil(random.randint(0, 9) * 10) * 5
    
    # id = int(uuidVal) * salt
    id = int(uuidVal)
    # id = math.floor(id / 123124142142)

    encoded = toBase62(id)

    print(encoded)

def padLeft(s, pad, length):
    while len(s) < length:
        s = pad + s

    return s

hashUrl()