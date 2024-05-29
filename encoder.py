import sys
import binascii
import math
import uuid
import random

# url = str(sys.argv[1])

# def urlToBase62(url):
#     base = 62
#     hashedDigits = []
#     base62Url = ""

#     # str to bytes
#     url_bytes = bytearray(url, 'utf-8')

#     # convert into hex
#     url_hex = binascii.hexlify(url_bytes).decode('utf-8')
#     print(url_hex)

#     # convert hex into integer
#     url_int = int(url_hex, 16)
#     print(url_int)

#     base62CharacterSet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

#     while url_int > 0:
#         hashedDigits.append(url_int % base)
#         url_int = math.floor(url_int / base)

#     hashDigitCount = len(hashedDigits)

#     i = 0
#     while hashDigitCount > i:
#         base62Url += base62CharacterSet[hashedDigits.pop()]
#         i += 1

#     print(base62Url)

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
    # base62Url = toBase62(url)
    encoded = ""

    # encodingChunkSize = 3
    # decodingChunkSize = 4

    # urlBytes = bytearray(url, 'utf-8')
    # byteLenght = len(urlBytes)

    # i = 0
    # while i < byteLenght:
    #     chunk = urlBytes[i:i + encodingChunkSize if i + encodingChunkSize < byteLenght else byteLenght]
    #     # s = hex(str(chunk))
    #     s = binascii.hexlify(chunk).decode('utf-8')
    #     val = int(s, 16)
    #     print(toBase62(val))
    #     w = padLeft(toBase62(val), "0", decodingChunkSize)
    #     encoded += w
    #     i += encodingChunkSize

    # uuidVal = uuid.uuid4()
    uuidVal = int(str(uuid.uuid4().fields[-1])[:11])

    salt = math.ceil(random.randint(0, 9) * 10) * 5
    
    # id = int(uuidVal) * salt
    id = int(uuidVal)
    # id = math.floor(id / 123124142142)

    encoded = toBase62(id)

    print(encoded)

#     # convert into hex
#     url_hex = binascii.hexlify(url_bytes).decode('utf-8')
#     print(url_hex)

#     # convert hex into integer
#     url_int = int(url_hex, 16)
#     print(url_int)

    # inBytes := []byte(str)
	# byteLength := len(inBytes)

	# for i := 0; i < byteLength; i += encodingChunkSize {
	# 	chunk := inBytes[i:minOf(i+encodingChunkSize, byteLength)]
	# 	s := hex.EncodeToString(chunk)
	# 	val, _ := strconv.ParseUint(s, 16, 64)
	# 	w := padLeft(toBase62(val), "0", decodingChunkSize)
	# 	encoded.WriteString(w)
	# }

def padLeft(s, pad, length):
    while len(s) < length:
        s = pad + s

    return s

hashUrl()