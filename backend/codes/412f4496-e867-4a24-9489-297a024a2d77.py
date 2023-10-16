import time
 
# initializing string
strn = "Ge"
 
# printing geeksforgeeks after delay
# of each character
for i in range(0, len(strn)):
    print(strn[i], end="")
    time.sleep(2)