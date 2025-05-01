from docstring_parser import verify_docstring


def to_roman(number):
    """
    Convert an integer to a Roman numeral.

    Args:
        number: An integer to convert (1-3999)

    Returns:
        The Roman numeral representation as a string
    """
    # Convert string input to integer
    try:
        num = int(number)
    except (ValueError, TypeError):
        return "Invalid input"

    if num < 1 or num > 3999:
        return "Invalid input"

    roman_numerals = [
        (1000, "M"),
        (900, "CM"),
        (500, "D"),
        (400, "CD"),
        (100, "C"),
        (90, "XC"),
        (50, "L"),
        (40, "XL"),
        (10, "X"),
        (9, "IX"),
        (5, "V"),
        (4, "IV"),
        (1, "I"),
    ]

    result = ""
    for value, numeral in roman_numerals:
        while num >= value:
            result += numeral
            num -= value

    return result


def from_roman(roman):
    """
    Convert a Roman numeral to an integer.

    Args:
        roman: A string representing a Roman numeral

    Returns:
        The integer value of the Roman numeral
    """
    if not roman or not isinstance(roman, str):
        return 0

    roman_values = {"I": 1, "V": 5, "X": 10, "L": 50, "C": 100, "D": 500, "M": 1000}

    result = 0
    prev_value = 0

    for char in reversed(roman.upper()):
        if char not in roman_values:
            return 0

        current_value = roman_values[char]

        if current_value >= prev_value:
            result += current_value
        else:
            result -= current_value

        prev_value = current_value

    return result


def test_to_roman():
    """
    1 -> I
    4 -> IV
    5 -> V
    9 -> IX
    10 -> X
    14 -> XIV
    40 -> XL
    50 -> L
    90 -> XC
    100 -> C
    400 -> CD
    500 -> D
    900 -> CM
    1000 -> M
    1984 -> MCMLXXXIV
    2023 -> MMXXIII
    3999 -> MMMCMXCIX
    0 -> Invalid input
    4000 -> Invalid input
    """
    verify_docstring()


def test_from_roman():
    """
    I -> 1
    IV -> 4
    V -> 5
    IX -> 9
    X -> 10
    XIV -> 14
    XL -> 40
    L -> 50
    XC -> 90
    C -> 100
    CD -> 400
    D -> 500
    CM -> 900
    M -> 1000
    MCMLXXXIV -> 1984
    MMXXIII -> 2023
    MMMCMXCIX -> 3999
    "" -> 0
    ABC -> 0
    """
    verify_docstring()


def test_multiline():
    """
    I
    ---
    1
    ===
    IV
    ---
    4
    """
    verify_docstring(
        processor_fn=from_roman,
        vertical=True,
        input_separator="---",
        case_separator="===",
    )
