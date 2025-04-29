from approvaltests import verify


def fizzbuzz(n):
    result = []
    for i in range(1, n + 1):
        output = ""
        if i % 3 == 0:
            output += "Fizz"
        if i % 5 == 0:
            output += "Buzz"
        if i % 7 == 0:
            output += "Whizz"
        if i % 11 == 0:
            output += "Bang"
        
        if output == "":
            output = str(i)
            
        result.append(output)
    return result


def test_fizzbuzz():
    verify("\n".join(fizzbuzz(33)))
