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
