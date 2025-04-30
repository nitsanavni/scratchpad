from docstring_parser import verify_docstring


def calculate(expression):
    """
    A simple string calculator that evaluates arithmetic expressions.
    Handles addition and multiplication of two numbers.
    """
    if not expression.strip():
        return 0

    # Handle multiplication
    if "*" in expression:
        parts = expression.split("*")
        if len(parts) == 2:
            return int(parts[0].strip()) * int(parts[1].strip())

    # Handle addition
    if "+" in expression:
        parts = expression.split("+")
        if len(parts) == 2:
            return int(parts[0].strip()) + int(parts[1].strip())

    # If it's just a single number
    try:
        return int(expression.strip())
    except ValueError:
        return 0


def test_calculator():
    """
     = 0
    42 = 42
    1 + 2 = 3
    3 * 4 = 12
    5 * 0 = 0
    """
    verify_docstring(test_calculator.__doc__, calculate, "=")
