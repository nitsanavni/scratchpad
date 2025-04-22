from approvaltests import verify, Options
from approvaltests.reporters.python_native_reporter import PythonNativeReporter


def fizzbuzz():
    for i in range(1, 101):
        if i % 15 == 0:
            print("FizzBuzz")
        elif i % 3 == 0:
            print("Fizz")
        elif i % 5 == 0:
            print("Buzz")
        else:
            print(i)


def test_fizzbuzz(capsys):
    """
    FizzBuzz
    31
    32
    Fizz
    34
    Buzz
    Fizz
    37
    38
    Fizz
    """
    fizzbuzz()
    captured = capsys.readouterr()
    # Extract lines 30-39 which correspond to the middle portion of the output
    output_lines = captured.out.strip().split("\n")
    mid_section = "\n".join(output_lines[29:39])
    verify(
        mid_section, options=Options().with_reporter(PythonNativeReporter()).inline()
    )
