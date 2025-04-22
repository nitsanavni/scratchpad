import subprocess
from approvaltests import verify, Options
from approvaltests.reporters.python_native_reporter import PythonNativeReporter


def test_fizzbuzz():
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
    # Run the fizzbuzz script as a subprocess
    result = subprocess.run(
        ["uv", "run", "fizzbuzz.py"], capture_output=True, text=True, check=True
    )

    # Extract lines 30-39 which correspond to the middle portion of the output
    output_lines = result.stdout.strip().split("\n")
    mid_section = "\n".join(output_lines[29:39])

    verify(
        mid_section, options=Options().with_reporter(PythonNativeReporter()).inline()
    )
