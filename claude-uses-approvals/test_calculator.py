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
    verify_docstring(test_calculator.__doc__, calculate, "=")


def test_calculator_cli():
    """
    End-to-end test for the calculator CLI.
    Runs the calculator as a subprocess and verifies the output.
    """
    # Get the absolute path to calculate.py
    calculator_path = os.path.abspath(
        os.path.join(os.path.dirname(__file__), "calculate.py")
    )

    # Test cases: expression, expected result
    test_cases = [
        ("2 + 2", "4"),
        ("3 * 4", "12"),
        ("2 ** 3", "8"),
        ("10 - 5", "5"),
        ("2 ** -2", "0.25"),
        ("(2 + 3) * 4", "20"),
        ("((1 + 2) * 3) + 2", "11"),
    ]

    for expression, expected in test_cases:
        # Run the calculator with the expression
        result = subprocess.run(
            [sys.executable, calculator_path, expression],
            capture_output=True,
            text=True,
            check=True,
        )

        # Check the output
        output = result.stdout.strip()
        assert (
            output == expected
        ), f"Expected {expected}, got {output} for expression: {expression}"
