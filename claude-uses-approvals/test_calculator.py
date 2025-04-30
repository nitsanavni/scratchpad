import subprocess
import os
import sys

from docstring_parser import verify_docstring

from calculate import calculate


def test_calculator():
    """
     = 0
    42 = 42
    1 + 2 = 3
    3 * 4 = 12
    5 * 0 = 0
    2 ** 3 = 8
    5 ** 2 = 25
    0 ** 0 = 1
    10 - 5 = 5
    -5 = -5
    0 - 3 = -3
    2 ** -2 = 0.25
    5 ** -1 = 0.2
    (2 + 3) = 5
    (2 + 3) * 4 = 20
    2 * (3 + 4) = 14
    (2 ** 3) + 1 = 9
    2 ** (1 + 2) = 8
    ((1 + 2) * 3) = 9
    (2 ** (1 + 1)) ** 2 = 16
    ((2 + 3) * (4 - 2)) = 10
    (((1 + 2) * 3) + 2) ** 2 = 121
    (2 * (3 + (4 * 5))) = 46
    """
    verify_docstring(processor_fn=calculate, separator="=")


def run_calculator_cli(expression):
    """Run the calculator CLI with the given expression and return the output"""
    calculator_path = os.path.abspath(
        os.path.join(os.path.dirname(__file__), "calculate.py")
    )

    result = subprocess.run(
        [sys.executable, calculator_path, expression],
        capture_output=True,
        text=True,
        check=True,
    )

    return result.stdout.strip()


def test_calculator_cli():
    """
    2 + 2 = 4
    3 * 4 = 12
    2 ** 3 = 8
    10 - 5 = 5
    2 ** -2 = 0.25
    (2 + 3) * 4 = 20
    ((1 + 2) * 3) + 2 = 11
    (((1 + 2) * 3) + 2) ** 2 = 121
    """
    verify_docstring(processor_fn=run_calculator_cli, separator="=")
