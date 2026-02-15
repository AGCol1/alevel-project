import keyboard
import time
import mouse

iterations = int(input("How many times do you want this to repeat? "))
time.sleep(3)

for i in range(iterations):
    mouse.press('left')

    keyboard.press('d')
    time.sleep(5)
    keyboard.release('d')
    
    keyboard.press('a')
    time.sleep(5)
    keyboard.release('a')

mouse.release('left')
print("Done")