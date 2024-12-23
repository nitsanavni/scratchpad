def fizz_or_empty(divisor, word):
    return lambda num: word if num % divisor == 0 else ""

def number_if_not_divisible(num):
    return str(num)

def add_functions(f1, f2):
    return lambda num: f1(num) + f2(num)

def or_functions(f1, f2):
    return lambda num: f1(num) or f2(num)

fizzbuzz = or_functions(
    add_functions(fizz_or_empty(3, "Fizz"), fizz_or_empty(5, "Buzz")),
    number_if_not_divisible
)

for num in range(1, 21):
    print(fizzbuzz(num))
