from docstring_parser import verify_docstring
from word_wrap import word_wrap


def test_word_wrap():
    """
    This is a longer text that we want to wrap.
    ---
    This is a
    longer text
    that we want
    to wrap.
    """

    verify_docstring(
        processor_fn=lambda x: word_wrap(x, 12),
        vertical=True,
        input_separator="---",
        case_separator="===",
    )
