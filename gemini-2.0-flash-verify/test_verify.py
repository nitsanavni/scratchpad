from verify import verify
import json


# Example usage (in a pytest or other test function):
def test_example():
    my_output = """This is some
multi-line
output.
With some changes"""
    verify(my_output, "test_example")


def test_example2():
    my_output = """This is some
multi-line
output.
With some more changes"""
    verify(my_output, "test_example2")


def test_json_output():
    data = {"a": 1, "b": [1, 2, 3]}
    verify(json.dumps(data, indent=4), "test_json_output", ".json")
