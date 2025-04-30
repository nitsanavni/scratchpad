from docstring_parser import verify_docstring


def calculate(expression):
    """
    A simple string calculator that evaluates arithmetic expressions.
    For now, only handles addition of two numbers.
    """
    if not expression.strip():
        return 0

    # For now, only handle simple addition
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
    """
    verify_docstring(test_calculator.__doc__, calculate, "=")
